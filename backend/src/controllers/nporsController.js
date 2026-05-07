const prisma = require('../prisma');

const createNporsMetric = async (req, res) => {
  const {
    workforce_id,
    training_date,
    training_address,
    on_number,
    novice_or_ewt,
    expiry,
    tester,
    date_pw_uploaded,
    cards_posted_info,
    category
  } = req.body;

  try {
    const npors = await prisma.nporsMetric.create({
      data: {
        workforce_id,
        training_date: training_date ? new Date(training_date) : null,
        training_address,
        on_number,
        novice_or_ewt,
        expiry: expiry ? new Date(expiry) : null,
        tester,
        date_pw_uploaded: date_pw_uploaded ? new Date(date_pw_uploaded) : null,
        cards_posted_info,
        category
      },
      include: {
        workforce: {
          include: { company: true }
        }
      }
    });
    res.status(201).json(npors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNporsMetrics = async (req, res) => {
  try {
    const npors = await prisma.nporsMetric.findMany({
      include: {
        workforce: {
          include: { company: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(npors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteNporsMetric = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.nporsMetric.delete({ where: { id } });
    res.json({ message: 'NPORS metric deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createNporsMetric, getNporsMetrics, deleteNporsMetric };
