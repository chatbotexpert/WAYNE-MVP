const prisma = require('../prisma');

const recordMetric = async (req, res) => {
  const { metric_id, workforce_id, value } = req.body;
  
  try {
    const metricData = await prisma.metricData.create({
      data: {
        metric_id,
        workforce_id,
        value,
        recorded_by: req.user.id
      }
    });
    res.status(201).json(metricData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMetrics = async (req, res) => {
  try {
    const metrics = await prisma.metric.findMany();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMetricData = async (req, res) => {
  try {
    const data = await prisma.metricData.findMany({
      include: {
        metric: true,
        workforce: true,
        admin: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { recordMetric, getMetrics, getMetricData };
