const mongoose = require('mongoose');
const config = require('./env');

/**
 * Connect to MongoDB instance using Mongoose
 */
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    if (!config.isTest) {
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Disconnect from MongoDB (useful for test tear-downs and graceful server shutdown)
 */
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('💤 MongoDB Disconnected cleanly.');
    }
  } catch (error) {
    console.error('❌ Error while disconnecting MongoDB:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
