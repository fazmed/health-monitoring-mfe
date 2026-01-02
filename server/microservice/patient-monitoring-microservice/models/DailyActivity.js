import mongoose from 'mongoose';

const dailyActivitySchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  pulseRate: {
    type: Number,
    required: true
  },
  bloodPressure: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  respiratoryRate: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const DailyActivity = mongoose.model('DailyActivity', dailyActivitySchema);

export default DailyActivity;
