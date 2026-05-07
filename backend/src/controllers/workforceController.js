const prisma = require('../prisma');

const createWorkforce = async (req, res) => {
  const { 
    name, department, candidate_address, email, contact_number, 
    date_of_birth, ni_number, cscs_expiry, swqr_expiry, eusr_expiry, 
    cscs_number, swqr_number, eusr_number, npors_number, in_house_cert_number, 
    company_id, supervisor_id, training_manager_id 
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

    const workforce = await prisma.workforce.create({
      data: {
        workforce_number, name, department, candidate_address, email, contact_number,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        ni_number, 
        cscs_expiry: cscs_expiry ? new Date(cscs_expiry) : null,
        swqr_expiry: swqr_expiry ? new Date(swqr_expiry) : null,
        eusr_expiry: eusr_expiry ? new Date(eusr_expiry) : null,
        cscs_number, swqr_number, eusr_number, npors_number, in_house_cert_number,
        company_id, 
        supervisor_id: supervisor_id || null, 
        training_manager_id: training_manager_id || null
      },
      include: { company: true, supervisor: true, training_manager: true }
    });
    res.status(201).json(workforce);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWorkforces = async (req, res) => {
  try {
    const workforces = await prisma.workforce.findMany({
      include: {
        company: true,
        supervisor: true,
        training_manager: true
      }
    });
    res.json(workforces);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteWorkforce = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.workforce.delete({ where: { id } });
    res.json({ message: 'Workforce deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createWorkforce, getWorkforces, deleteWorkforce };
