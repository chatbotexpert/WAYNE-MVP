const prisma = require('../prisma');

const createInhouseMetric = async (req, res) => {
  const {
    workforce_id,
    course_date,
    expiry_date,
    customer,
    cert_sent_date,
    certs_sent_to,
    notes,
    category
  } = req.body;

  try {
    const inhouse = await prisma.inhouseMetric.create({
      data: {
        workforce_id,
        course_date: course_date ? new Date(course_date) : null,
        expiry_date: expiry_date ? new Date(expiry_date) : null,
        customer,
        cert_sent_date: cert_sent_date ? new Date(cert_sent_date) : null,
        certs_sent_to,
        notes,
        category
      },
      include: {
        workforce: {
          include: { company: true }
        }
      }
    });
    res.status(201).json(inhouse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getInhouseMetrics = async (req, res) => {
  try {
    const inhouse = await prisma.inhouseMetric.findMany({
      include: {
        workforce: {
          include: { company: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(inhouse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteInhouseMetric = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.inhouseMetric.delete({ where: { id } });
    res.json({ message: 'In-House metric deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createInhouseMetric, getInhouseMetrics, deleteInhouseMetric };
