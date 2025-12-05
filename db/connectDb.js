import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect( process.env.MONGODB_URI, { dbName: 'Vault-project' });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit process during build, just log the error
    if (process.env.NODE_ENV === 'production') {
      console.error('MongoDB connection failed in production');
    }
  }
};

export default connectDB;