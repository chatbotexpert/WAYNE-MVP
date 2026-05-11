const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const companyRoutes = require('./routes/companyRoutes');
const workforceRoutes = require('./routes/workforceRoutes');
const metricRoutes = require('./routes/metricRoutes');
const nporsRoutes = require('./routes/nporsRoutes');
const nrswaRoutes = require('./routes/nrswaRoutes');
const eusrRoutes = require('./routes/eusrRoutes');
const inhouseRoutes = require('./routes/inhouseRoutes');
const nvqRoutes = require('./routes/nvqRoutes');
const intakeRoutes = require('./routes/intakeRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/workforce', workforceRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/npors', nporsRoutes);
app.use('/api/nrswa', nrswaRoutes);
app.use('/api/eusr', eusrRoutes);
app.use('/api/inhouse', inhouseRoutes);
app.use('/api/nvq', nvqRoutes);

const { initCronJobs } = require('./jobs/expiryAlerts');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pave Training API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initCronJobs();
});
