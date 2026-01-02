import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/patientcare-auth-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Auth Service - MongoDB Connected');
  } catch (error) {
    console.error('❌ Auth Service - MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
