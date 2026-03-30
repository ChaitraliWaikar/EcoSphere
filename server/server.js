const express = require('express');
const cors    = require('cors');
require('dotenv').config();
const path = require('path');
const { ensureTables } = require('./config/postgres');

const app = express();

ensureTables()
  .then(() => console.log('Postgres tables ready.'))
  .catch((error) => {
    console.error('Postgres setup failed:', error);
    process.exit(1);
  });

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const extraOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(u => u.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin) return callback(null, true);
      // Allow any localhost port (Vite can pick 5173-5179, etc.)
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, origin);
      // Allow any explicitly configured origins
      if (extraOrigins.includes(origin)) return callback(null, origin);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users',       require('./routes/users'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/events',      require('./routes/events'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}\n`);
});
