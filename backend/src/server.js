const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log(`
🚀 =======================================================
📡 Users, Projects & Tasks API is running!
🌍 Environment : ${config.nodeEnv}
🔗 Local URL   : http://localhost:${config.port}
🩺 Health Check: http://localhost:${config.port}/health
📚 API Base    : http://localhost:${config.port}/api/v1
=======================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down gracefully...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down immediately...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle graceful shutdown signals
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('💤 Closed out remaining connections. Process exited.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
