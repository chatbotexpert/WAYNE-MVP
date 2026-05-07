const prisma = require('../prisma');

const createNrswaMetric = async (req, res) => {
  const {
    workforce_id,
    training_date,
    expiry_date,
    category,
    certs_applied,
    certs_sent_date,
    certs_sent_to,
    course
  } = req.body;

  try {
    const nrswa = await prisma.nrswaMetric.create({
      data: {
        workforce_id,
        training_date: training_date ? new Date(training_date) : null,
        expiry_date: expiry_date ? new Date(expiry_date) : null,
        category,
        certs_applied: Boolean(certs_applied),
        certs_sent_date: certs_sent_date ? new Date(certs_sent_date) : null,
        certs_sent_to,
        course
      },
      include: {
        workforce: {
          include: { company: true }
        }
      }
    });
    res.status(201).json(nrswa);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNrswaMetrics = async (req, res) => {
  try {
    const nrswa = await prisma.nrswaMetric.findMany({
      include: {
        workforce: {
          include: { company: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(nrswa);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteNrswaMetric = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.nrswaMetric.delete({ where: { id } });
    res.json({ message: 'NRSWA metric deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createNrswaMetric, getNrswaMetrics, deleteNrswaMetric };
