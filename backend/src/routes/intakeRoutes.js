const express = require('express');
const prisma = require('../prisma');
const { encrypt } = require('../utils/encryption');
const logAudit = require('../utils/auditLogger');
const router = express.Router();

router.get('/:token/company', async (req, res) => {
  try {
    const { token } = req.params;
    const company = await prisma.company.findUnique({
      where: { intake_token: token },
      select: { id: true, name: true, company_number: true }
    });

    if (!company) {
      return res.status(404).json({ message: 'Invalid or expired intake link.' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { 
    name, department, candidate_address, email, contact_number, 
    date_of_birth, ni_number, cscs_expiry, swqr_expiry, eusr_expiry, 
    cscs_number, swqr_number, eusr_number, npors_number, in_house_cert_number, 
    consent_date, privacy_policy_version
  } = req.body;
  
  try {
    const company = await prisma.company.findUnique({
      where: { intake_token: token }
    });

    if (!company) {
      return res.status(404).json({ message: 'Invalid intake link. Cannot submit.' });
    }

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
    const encryptedNI = ni_number ? encrypt(ni_number) : null;

    const workforce = await prisma.workforce.create({
      data: {
        workforce_number, name, department, candidate_address, email, contact_number,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        ni_number: encryptedNI, 
        cscs_expiry: cscs_expiry ? new Date(cscs_expiry) : null,
        swqr_expiry: swqr_expiry ? new Date(swqr_expiry) : null,
        eusr_expiry: eusr_expiry ? new Date(eusr_expiry) : null,
        cscs_number, swqr_number, eusr_number, npors_number, in_house_cert_number,
        company_id: company.id, 
        consent_date: consent_date ? new Date(consent_date) : null,
        privacy_policy_version: privacy_policy_version || 'v1.0'
      }
    });

    // Create Audit Log with 'PUBLIC' user_id
    await logAudit('PUBLIC_INTAKE', 'CREATE', 'Workforce', workforce.id, req.ip, { workforce_number, company_id: company.id });

    res.status(201).json({ message: 'Intake submitted successfully.', workforce_number: workforce.workforce_number });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
