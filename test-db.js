const mongoose = require('mongoose');
require('dotenv').config();

// Hide password in logs
const connectionString = process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@');
console.log(`Attempting to connect to MongoDB Atlas with URI: ${connectionString}`);

// Connect to MongoDB with basic configuration
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('SUCCESS: Connected to MongoDB Atlas!');
  console.log('Database connection verified successfully.');
  
  // List databases
  return mongoose.connection.db.admin().listDatabases();
})
.then(result => {
  console.log('Available databases:');
  result.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
  
  mongoose.disconnect();
  console.log('Connection closed.');
})
.catch(err => {
  console.error('ERROR: Failed to connect to MongoDB Atlas!');
  console.error('Error details:', err.message);
  
  if (err.name === 'MongoServerError') {
    switch (err.code) {
      case 8000:
        console.error('Authentication failed. Please check your username and password.');
        break;
      case 13:
        console.error('Authentication mechanism failed. Check if the database user is properly set up.');
        break;
      case 40:
        console.error('Network error connecting to MongoDB. Check if your IP is whitelisted in Atlas.');
        break;
      default:
        console.error(`MongoDB error code: ${err.code}`);
    }
  } else if (err.name === 'MongoNetworkError') {
    console.error('Network error. Please check your internet connection and IP whitelist in Atlas.');
  }
  
  process.exit(1);
}); 