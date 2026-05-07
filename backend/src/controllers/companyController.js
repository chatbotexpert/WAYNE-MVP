const prisma = require('../prisma');

const getCompanyCaps = (size) => {
  switch(size) {
    case 'Small': return { tm: 0, sup: 0, dep: 0 };
    case 'Medium': return { tm: 3, sup: 3, dep: 3 };
    case 'Large': return { tm: 5, sup: 5, dep: 5 };
    case 'Enterprise': return { tm: 10, sup: 10, dep: 10 };
    default: return { tm: 0, sup: 0, dep: 0 };
  }
};

const createCompany = async (req, res) => {
  const { 
    name, registered_address, company_reg_number, 
    vat_no, tel_no, email, accounts_contact_name, accounts_address, 
    accounts_contact_number, accounts_email, notes_prices_agreed, 
    size, main_contact 
  } = req.body;
  
  try {
    const caps = getCompanyCaps(size);
    
    // Auto-generate company_number
    const lastCompany = await prisma.company.findFirst({
      where: { company_number: { startsWith: 'PAVE-W' } },
      orderBy: { created_at: 'desc' }
    });
    
    let nextNum = 1;
    if (lastCompany && lastCompany.company_number) {
      const match = lastCompany.company_number.match(/PAVE-W(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const company_number = `PAVE-W${String(nextNum).padStart(3, '0')}`;
    
    const company = await prisma.company.create({
      data: { 
        company_number, name, registered_address, company_reg_number, 
        vat_no, tel_no, email, accounts_contact_name, accounts_address, 
        accounts_contact_number, accounts_email, notes_prices_agreed, 
        size, main_contact,
        max_tm: caps.tm,
        max_sup: caps.sup,
        max_departments: caps.dep
      },
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.company.delete({ where: { id } });
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCompany, getCompanies, deleteCompany };
