import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'resolved'],
    default: 'pending'
  },
  responseNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);

export default EmergencyAlert;
