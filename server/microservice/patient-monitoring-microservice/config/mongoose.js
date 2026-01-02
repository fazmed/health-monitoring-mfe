import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/patientcare-monitoring-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Patient Monitoring Service - MongoDB Connected');
  } catch (error) {
    console.error('❌ Patient Monitoring Service - MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
