import { gql } from 'apollo-server-express';

const monitoringTypeDefs = gql`
  type VitalSigns {
    id: ID!
    patientId: String!
    bodyTemperature: Float!
    heartRate: Int!
    bloodPressure: String!
    respiratoryRate: Int!
    nurseId: String!
    createdAt: String!
  }

  type DailyActivity {
    id: ID!
    patientId: String!
    pulseRate: Int!
    bloodPressure: String!
    weight: Float!
    temperature: Float!
    respiratoryRate: Int!
    createdAt: String!
  }

  type EmergencyAlert {
    id: ID!
    patientId: String!
    message: String!
    status: String!
    responseNotes: String
    createdAt: String!
  }

  type Covid19Checklist {
    id: ID!
    patientId: String!
    fever: Boolean!
    cough: Boolean!
    shortnessOfBreath: Boolean!
    fatigue: Boolean!
    bodyAches: Boolean!
    lossOfTasteOrSmell: Boolean!
    soreThroat: Boolean!
    headache: Boolean!
    additionalNotes: String
    createdAt: String!
  }

  type MedicalCondition {
    condition: String!
    severity: String!
    recommendation: String!
  }

  type DiseasePrediction {
    disease: String!
    confidence: Float!
  }

  input SymptomsInput {
    selectedSymptoms: [String!]!
  }

  type Query {
    getVitalSignsByPatient(patientId: ID!): [VitalSigns!]!
    getDailyActivitiesByPatient(patientId: ID!): [DailyActivity!]!
    getEmergencyAlerts: [EmergencyAlert!]!
    getEmergencyAlertsByPatient(patientId: ID!): [EmergencyAlert!]!
    getCovid19ChecklistByPatient(patientId: ID!): [Covid19Checklist!]!
    analyzeSymptomsWithAI(symptoms: String!): [MedicalCondition!]!
    predictDiseaseWithTensorFlow(symptoms: SymptomsInput!): [DiseasePrediction!]!
    getAvailableSymptoms: [String!]!
  }

  type Mutation {
    createVitalSigns(
      patientId: ID!
      bodyTemperature: Float!
      heartRate: Int!
      bloodPressure: String!
      respiratoryRate: Int!
    ): VitalSigns!

    createDailyActivity(
      pulseRate: Int!
      bloodPressure: String!
      weight: Float!
      temperature: Float!
      respiratoryRate: Int!
    ): DailyActivity!

    createEmergencyAlert(message: String!): EmergencyAlert!

    updateEmergencyAlert(
      id: ID!
      status: String!
      responseNotes: String
    ): EmergencyAlert!

    createCovid19Checklist(
      fever: Boolean!
      cough: Boolean!
      shortnessOfBreath: Boolean!
      fatigue: Boolean!
      bodyAches: Boolean!
      lossOfTasteOrSmell: Boolean!
      soreThroat: Boolean!
      headache: Boolean!
      additionalNotes: String
    ): Covid19Checklist!
  }
`;

export default monitoringTypeDefs;
