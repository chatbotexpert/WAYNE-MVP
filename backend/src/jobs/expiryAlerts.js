const cron = require('node-cron');
const prisma = require('../prisma');
const { sendEmail } = require('../utils/emailService');

const checkAndSendAlerts = async () => {
  console.log('Running daily expiry check...');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getTargetDate = (days) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };

  const targets = [
    { days: 30, label: 'in 30 days' },
    { days: 14, label: 'in 14 days' },
    { days: 0, label: 'today' },
  ];

  // Helper to check if a DB date matches our target date
  const isMatch = (dbDate, targetDate) => {
    if (!dbDate) return false;
    const d = new Date(dbDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === targetDate.getTime();
  };

  const allWorkforces = await prisma.workforce.findMany({
    include: {
      supervisor: true,
      training_manager: true,
      company: true,
      npors_metrics: true,
      nrswa_metrics: true,
      eusr_metrics: true,
      inhouse_metrics: true
    }
  });

  const alerts = [];

  for (const w of allWorkforces) {
    // Only alert if there is a Training Manager or Supervisor to notify
    const recipients = [];
    if (w.training_manager?.email) recipients.push(w.training_manager.email);
    if (w.supervisor?.email) recipients.push(w.supervisor.email);
    
    // De-duplicate emails
    const uniqueRecipients = [...new Set(recipients)];
    if (uniqueRecipients.length === 0) continue;

    for (const target of targets) {
      const targetDate = getTargetDate(target.days);
      const expiringCerts = [];

      // Check Core Certs
      if (isMatch(w.cscs_expiry, targetDate)) expiringCerts.push(`CSCS Card`);
      if (isMatch(w.swqr_expiry, targetDate)) expiringCerts.push(`SWQR Card`);
      if (isMatch(w.eusr_expiry, targetDate)) expiringCerts.push(`Core EUSR`);

      // Check Metrics
      w.npors_metrics.forEach(m => { if (isMatch(m.expiry, targetDate)) expiringCerts.push(`NPORS: ${m.category || 'Unknown'}`); });
      w.nrswa_metrics.forEach(m => { if (isMatch(m.expiry_date, targetDate)) expiringCerts.push(`NRSWA: ${m.category || 'Unknown'}`); });
      w.eusr_metrics.forEach(m => { if (isMatch(m.expiry, targetDate)) expiringCerts.push(`EUSR Metric: ${m.category || 'Unknown'}`); });
      w.inhouse_metrics.forEach(m => { if (isMatch(m.expiry_date, targetDate)) expiringCerts.push(`In-House: ${m.category || 'Unknown'}`); });

      if (expiringCerts.length > 0) {
        alerts.push({
          candidateName: w.name,
          companyName: w.company?.name || 'Unknown Company',
          expiringCerts,
          label: target.label,
          recipients: uniqueRecipients
        });
      }
    }
  }

  // Send Emails
  for (const alert of alerts) {
    const certListHtml = alert.expiringCerts.map(c => `<li>${c}</li>`).join('');
    
    const emailHtml = `
      <h2>Qualification Expiry Alert</h2>
      <p>The following qualifications for <strong>${alert.candidateName}</strong> (${alert.companyName}) are expiring <strong>${alert.label}</strong>:</p>
      <ul>${certListHtml}</ul>
      <p>Please take the necessary actions to renew these qualifications.</p>
      <br/>
      <p>Best regards,<br/>Pave Training System</p>
    `;

    for (const email of alert.recipients) {
      try {
        await sendEmail({
          email: email,
          subject: `Action Required: Qualifications Expiring ${alert.label} - ${alert.candidateName}`,
          html: emailHtml,
          message: `Qualifications for ${alert.candidateName} are expiring ${alert.label}.`
        });
        console.log(`Alert sent to ${email} for ${alert.candidateName}`);
      } catch (err) {
        console.error(`Failed to send alert to ${email}:`, err);
      }
    }
  }
};

const initCronJobs = () => {
  // Run daily at 08:00 AM
  cron.schedule('0 8 * * *', () => {
    checkAndSendAlerts().catch(console.error);
  });
  console.log('Cron jobs initialized: Expiry alerts scheduled for 08:00 AM daily.');
};

module.exports = { initCronJobs, checkAndSendAlerts };
