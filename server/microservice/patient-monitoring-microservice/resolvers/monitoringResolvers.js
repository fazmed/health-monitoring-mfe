import VitalSigns from '../models/VitalSigns.js';
import DailyActivity from '../models/DailyActivity.js';
import EmergencyAlert from '../models/EmergencyAlert.js';
import Covid19Checklist from '../models/Covid19Checklist.js';
import { analyzeSymptomsWithGemini } from '../aiAgent.js';
import { predictDisease } from '../ml/diseasePrediction.js';

const monitoringResolvers = {
  Query: {
    getVitalSignsByPatient: async (_, { patientId }) => {
      const vitalSigns = await VitalSigns.find({ patientId }).sort({ createdAt: -1 });
      return vitalSigns;
    },

    getDailyActivitiesByPatient: async (_, { patientId }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (user.role === 'patient' && user.id !== patientId) {
        throw new Error('You can only view your own daily activities');
      }

      const activities = await DailyActivity.find({ patientId }).sort({ createdAt: -1 });
      return activities;
    },

    getEmergencyAlerts: async (_, __, { user }) => {
      if (!user || user.role !== 'nurse') {
        throw new Error('Only nurses can view all emergency alerts');
      }

      const alerts = await EmergencyAlert.find().sort({ createdAt: -1 });
      return alerts;
    },

    getEmergencyAlertsByPatient: async (_, { patientId }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (user.role === 'patient' && user.id !== patientId) {
        throw new Error('You can only view your own alerts');
      }

      const alerts = await EmergencyAlert.find({ patientId }).sort({ createdAt: -1 });
      return alerts;
    },

    getCovid19ChecklistByPatient: async (_, { patientId }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (user.role === 'patient' && user.id !== patientId) {
        throw new Error('You can only view your own checklist');
      }

      const checklists = await Covid19Checklist.find({ patientId }).sort({ createdAt: -1 });
      return checklists;
    },

    analyzeSymptomsWithAI: async (_, { symptoms }, { user }) => {
      if (!user || user.role !== 'nurse') {
        throw new Error('Only nurses can use AI symptom analysis');
      }

      const conditions = await analyzeSymptomsWithGemini(symptoms);
      return conditions;
    },

    predictDiseaseWithTensorFlow: async (_, { symptoms }, { user }) => {
      if (!user || user.role !== 'nurse') {
        throw new Error('Only nurses can use TensorFlow disease prediction');
      }

      const predictions = await predictDisease(symptoms.selectedSymptoms);
      return predictions;
    },

    getAvailableSymptoms: async (_, __, { user }) => {
      if (!user || user.role !== 'nurse') {
        throw new Error('Only nurses can access symptom list');
      }

      // Import symptomNames from trainingData
      const { symptomNames } = await import('../ml/trainingData.js');
      return symptomNames;
    }
  },

  Mutation: {
    createVitalSigns: async (_, args, { user }) => {
      if (!user || user.role !== 'nurse') {
        throw new Error('Only nurses can enter vital signs');
      }

      const vitalSigns = new VitalSigns({
        ...args,
        nurseId: user.id
      });

      await vitalSigns.save();
      return vitalSigns;
    },

    createDailyActivity: async (_, args, { user }) => {
      if (!user || user.role !== 'patient') {
        throw new Error('Only patients can log daily activities');
      }

      const dailyActivity = new DailyActivity({
        ...args,
        patientId: user.id
      });

      await dailyActivity.save();
      return dailyActivity;
    },

    createEmergencyAlert: async (_, { message }, { user }) => {
      if (!user || user.role !== 'patient') {
        throw new Error('Only patients can create emergency alerts');
      }

      const alert = new EmergencyAlert({
        patientId: user.id,
        message,
        status: 'pending'
      });

      await alert.save();
      return alert;
    },

    updateEmergencyAlert: async (_, { id, status, responseNotes }, { user }) => {
      if (!user || user.role !== 'nurse') {
        throw new Error('Only nurses can update emergency alerts');
      }

      const alert = await EmergencyAlert.findByIdAndUpdate(
        id,
        { status, responseNotes },
        { new: true }
      );

      if (!alert) {
        throw new Error('Alert not found');
      }

      return alert;
    },

    createCovid19Checklist: async (_, args, { user }) => {
      if (!user || user.role !== 'patient') {
        throw new Error('Only patients can submit COVID-19 checklist');
      }

      const checklist = new Covid19Checklist({
        ...args,
        patientId: user.id
      });

      await checklist.save();
      return checklist;
    }
  }
};

export default monitoringResolvers;
