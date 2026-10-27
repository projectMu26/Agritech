import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritech');
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    // Instead of exiting immediately, let the server run so demo/mock routes or frontend can still be served
    console.warn('⚠️ Server will operate, but database-dependent operations will fail until MongoDB is connected.');
  }
};

export default connectDB;
