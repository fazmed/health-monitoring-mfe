import mongoose from 'mongoose';

const vitalSignsSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  bodyTemperature: {
    type: Number,
    required: true
  },
  heartRate: {
    type: Number,
    required: true
  },
  bloodPressure: {
    type: String,
    required: true
  },
  respiratoryRate: {
    type: Number,
    required: true
  },
  nurseId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const VitalSigns = mongoose.model('VitalSigns', vitalSignsSchema);

export default VitalSigns;
