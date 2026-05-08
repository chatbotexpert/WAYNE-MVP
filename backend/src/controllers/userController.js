const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const { generatePassword } = require('../utils/passwordGenerator');
const { sendEmail } = require('../utils/emailService');

const getCompanyCaps = (size) => {
  switch(size) {
    case 'Small': return { tm: 0, sup: 0 };
    case 'Medium': return { tm: 3, sup: 3 };
    case 'Large': return { tm: 5, sup: 5 };
    case 'Enterprise': return { tm: 10, sup: 10 };
    default: return { tm: 0, sup: 0 };
  }
};

const addEmployee = async (req, res) => {
  const { name, email, role, company_id } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (company_id && (role === 'Supervisor' || role === 'Training_Manager')) {
      const company = await prisma.company.findUnique({ where: { id: company_id } });
      if (!company) return res.status(404).json({ message: 'Company not found' });
      
      const caps = getCompanyCaps(company.size);
      const capLimit = role === 'Supervisor' ? caps.sup : caps.tm;
      
      const currentCount = await prisma.user.count({
        where: { company_id, role }
      });
      
      if (currentCount >= capLimit) {
        return res.status(400).json({ message: `Cannot add more ${role}s. The cap limit of ${capLimit} for ${company.size} companies has been reached.` });
      }
    }

    const plaintextPassword = generatePassword(12);
    const password_hash = await bcrypt.hash(plaintextPassword, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role,
        company_id: company_id || null,
      },
    });

    const message = `
      Hello ${name},

      Your account for Pave Training has been created.
      Your login email is: ${email}
      Your password is: ${plaintextPassword}

      Please login and change your password as soon as possible.
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Pave Training',
        message,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // We don't fail the request if email fails, but we should probably log it.
    }

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company_id: user.company_id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmployeesByCompany = async (req, res) => {
  const { companyId } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: {
        company_id: companyId,
        role: {
          in: ['Supervisor', 'Training_Manager']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: {
          select: { name: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePermissions = async (req, res) => {
  const { id } = req.params;
  const { can_manage_users, can_manage_billing, can_export_data, can_delete_records, can_manage_permissions } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        permission_flags: {
          upsert: {
            create: { can_manage_users, can_manage_billing, can_export_data, can_delete_records, can_manage_permissions },
            update: { can_manage_users, can_manage_billing, can_export_data, can_delete_records, can_manage_permissions }
          }
        }
      },
      include: { permission_flags: true }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addEmployee, getEmployeesByCompany, getAllEmployees, updatePermissions };
