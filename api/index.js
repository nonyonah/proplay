require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fixturesRouter = require('./routes/fixtures');
const liveScoresRouter = require('./routes/live-scores');
const predictionsRouter = require('./routes/predictions');
const followRouter = require('./routes/follow');
const preferencesRouter = require('./routes/preferences');
const walletRouter = require('./routes/wallet');
const castRouter = require('./routes/cast');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Routes
app.use('/api/fixtures', fixturesRouter);
app.use('/api/live-scores', liveScoresRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/follow', followRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/cast', castRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
