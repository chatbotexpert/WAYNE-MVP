const prisma = require('../prisma');

const createEusrMetric = async (req, res) => {
  const {
    workforce_id,
    training_date,
    batch_number,
    expiry,
    category,
    date_resulted,
    card_type,
    dates_card_posted,
    notes
  } = req.body;

  try {
    const eusr = await prisma.eusrMetric.create({
      data: {
        workforce_id,
        training_date: training_date ? new Date(training_date) : null,
        batch_number,
        expiry: expiry ? new Date(expiry) : null,
        category,
        date_resulted: date_resulted ? new Date(date_resulted) : null,
        card_type,
        dates_card_posted: dates_card_posted ? new Date(dates_card_posted) : null,
        notes
      },
      include: {
        workforce: {
          include: { company: true }
        }
      }
    });
    res.status(201).json(eusr);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEusrMetrics = async (req, res) => {
  try {
    const eusr = await prisma.eusrMetric.findMany({
      include: {
        workforce: {
          include: { company: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(eusr);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteEusrMetric = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.eusrMetric.delete({ where: { id } });
    res.json({ message: 'EUSR metric deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createEusrMetric, getEusrMetrics, deleteEusrMetric };
