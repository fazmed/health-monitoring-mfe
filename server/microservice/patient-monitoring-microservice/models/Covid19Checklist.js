import mongoose from 'mongoose';

const covid19ChecklistSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  fever: {
    type: Boolean,
    required: true
  },
  cough: {
    type: Boolean,
    required: true
  },
  shortnessOfBreath: {
    type: Boolean,
    required: true
  },
  fatigue: {
    type: Boolean,
    required: true
  },
  bodyAches: {
    type: Boolean,
    required: true
  },
  lossOfTasteOrSmell: {
    type: Boolean,
    required: true
  },
  soreThroat: {
    type: Boolean,
    required: true
  },
  headache: {
    type: Boolean,
    required: true
  },
  additionalNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Covid19Checklist = mongoose.model('Covid19Checklist', covid19ChecklistSchema);

export default Covid19Checklist;
