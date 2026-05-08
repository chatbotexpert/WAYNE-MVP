const prisma = require('../prisma');
const { encrypt, decrypt } = require('../utils/encryption');
const logAudit = require('../utils/auditLogger');

const createWorkforce = async (req, res) => {
  const { 
    name, department, candidate_address, email, contact_number, 
    date_of_birth, ni_number, cscs_expiry, swqr_expiry, eusr_expiry, 
    cscs_number, swqr_number, eusr_number, npors_number, in_house_cert_number, 
    company_id, supervisor_id, training_manager_id, consent_date, privacy_policy_version
  } = req.body;
  
  try {
    const lastCandidate = await prisma.workforce.findFirst({
      where: { workforce_number: { startsWith: 'PAVE-W' } },
      orderBy: { created_at: 'desc' }
    });
    
    let nextNum = 1;
    if (lastCandidate && lastCandidate.workforce_number) {
      const match = lastCandidate.workforce_number.match(/PAVE-W(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const workforce_number = `PAVE-W${String(nextNum).padStart(3, '0')}`;

    // Encrypt sensitive PII (Data at Rest)
    const encryptedNI = encrypt(ni_number);

    const workforce = await prisma.workforce.create({
      data: {
        workforce_number, name, department, candidate_address, email, contact_number,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        ni_number: encryptedNI, 
        cscs_expiry: cscs_expiry ? new Date(cscs_expiry) : null,
        swqr_expiry: swqr_expiry ? new Date(swqr_expiry) : null,
        eusr_expiry: eusr_expiry ? new Date(eusr_expiry) : null,
        cscs_number, swqr_number, eusr_number, npors_number, in_house_cert_number,
        company_id, 
        supervisor_id: supervisor_id || null, 
        training_manager_id: training_manager_id || null,
        consent_date: consent_date ? new Date(consent_date) : null,
        privacy_policy_version
      },
      include: { company: true, supervisor: true, training_manager: true }
    });

    // Create Audit Log
    await logAudit(req.user.id, 'CREATE', 'Workforce', workforce.id, req.ip, { workforce_number });

    res.status(201).json({ ...workforce, ni_number: decrypt(workforce.ni_number) }); // Decrypt for initial return
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWorkforces = async (req, res) => {
  try {
    let whereClause = { deleted_at: null };
    
    // Scoping for Client Portal: Customers can only see their own company's workforce
    if (['Supervisor', 'Training_Manager'].includes(req.user.role)) {
      whereClause.company_id = req.user.company_id;
    }

    const workforces = await prisma.workforce.findMany({
      where: whereClause,
      include: {
        company: true,
        supervisor: true,
        training_manager: true,
        npors_metrics: true,
        nrswa_metrics: true,
        eusr_metrics: true,
        inhouse_metrics: true,
        nvq_metrics: true
      }
    });

    // Decrypt sensitive PII for presentation
    const decryptedWorkforces = workforces.map(w => ({
      ...w,
      ni_number: decrypt(w.ni_number)
    }));

    res.json(decryptedWorkforces);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteWorkforce = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft Delete: Anonymize partially if required, but primarily set deleted_at
    await prisma.workforce.update({ 
      where: { id },
      data: { deleted_at: new Date() }
    });

    // Create Audit Log
    await logAudit(req.user.id, 'DELETE (SOFT)', 'Workforce', id, req.ip);

    res.json({ message: 'Workforce deleted successfully (soft delete applied)' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Subject Access Request (SAR) Data Export
const exportWorkforceData = async (req, res) => {
  try {
    const { id } = req.params;
    const workforce = await prisma.workforce.findUnique({
      where: { id },
      include: {
        company: true,
        nporsMetrics: true,
        nrswaMetrics: true,
        eusrMetrics: true,
        inhouseMetrics: true,
        nvqMetrics: true
      }
    });

    if (!workforce) return res.status(404).json({ message: 'Workforce not found' });

    workforce.ni_number = decrypt(workforce.ni_number); // Decrypt for export

    // Create Audit Log for Data Export
    await logAudit(req.user.id, 'EXPORT_SAR', 'Workforce', id, req.ip);

    res.json({ data: workforce });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createWorkforce, getWorkforces, deleteWorkforce, exportWorkforceData };
