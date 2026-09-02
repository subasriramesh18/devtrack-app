const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const apiRoutes = require('./routes');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ==========================================
// GLOBAL MIDDLEWARES
// ==========================================

// Enable CORS
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request Logging (skip during automated tests)
if (!config.isTest) {
  app.use(morgan(config.isProduction ? 'combined' : 'dev'));
}

// ==========================================
// SYSTEM & HEALTH ENDPOINTS
// ==========================================

// Welcome / Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Users, Projects & Tasks API',
    version: '1.0.0',
    documentation: '/README.md',
    endpoints: {
      users: '/api/v1/users',
      projects: '/api/v1/projects',
      tasks: '/api/v1/tasks',
      health: '/health',
    },
  });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ==========================================
// API ROUTES
// ==========================================

// Support both /api/v1 and /api aliases
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);

// ==========================================
// 404 & ERROR HANDLING
// ==========================================

// Handle unhandled routes (404)
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
