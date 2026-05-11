const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Build the MongoDB connection URI from environment variables
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.fynspn6.mongodb.net/?retryWrites=true&w=majority`;

// Connect to the MongoDB Atlas cluster
const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // Log success once the connection is established
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas', error);
  }
};

module.exports = connectDb;
