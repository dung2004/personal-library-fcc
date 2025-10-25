const mongoose = require('mongoose');

const uri = process.env.DB || process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'personal_library';

(async () => {
  try {
    if (!uri) {
      console.warn('MongoDB connection string is not set (DB or MONGO_URI).');
      return;
    }
    await mongoose.connect(uri, { dbName });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
})();

module.exports = mongoose.connection;