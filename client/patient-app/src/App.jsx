import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const authClient = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache(),
  credentials: 'include'
});

const monitoringClient = new ApolloClient({
  uri: 'http://localhost:4002/graphql',
  cache: new InMemoryCache(),
  credentials: 'include'
});

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      username
      email
      role
      firstName
      lastName
    }
  }
`;

const GET_ALL_PATIENTS = gql`
  query GetAllPatients {
    getAllPatients {
      id
      username
      firstName
      lastName
      email
    }
  }
`;

const CREATE_VITAL_SIGNS = gql`
  mutation CreateVitalSigns($patientId: ID!, $bodyTemperature: Float!, $heartRate: Int!, $bloodPressure: String!, $respiratoryRate: Int!) {
    createVitalSigns(patientId: $patientId, bodyTemperature: $bodyTemperature, heartRate: $heartRate, bloodPressure: $bloodPressure, respiratoryRate: $respiratoryRate) {
      id
      bodyTemperature
      heartRate
      bloodPressure
      respiratoryRate
      createdAt
    }
  }
`;

const GET_VITAL_SIGNS = gql`
  query GetVitalSignsByPatient($patientId: ID!) {
    getVitalSignsByPatient(patientId: $patientId) {
      id
      bodyTemperature
      heartRate
      bloodPressure
      respiratoryRate
      createdAt
    }
  }
`;

const CREATE_DAILY_ACTIVITY = gql`
  mutation CreateDailyActivity($pulseRate: Int!, $bloodPressure: String!, $weight: Float!, $temperature: Float!, $respiratoryRate: Int!) {
    createDailyActivity(pulseRate: $pulseRate, bloodPressure: $bloodPressure, weight: $weight, temperature: $temperature, respiratoryRate: $respiratoryRate) {
      id
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdAt
    }
  }
`;

const GET_DAILY_ACTIVITIES = gql`
  query GetDailyActivitiesByPatient($patientId: ID!) {
    getDailyActivitiesByPatient(patientId: $patientId) {
      id
      pulseRate
      bloodPressure
      weight
      temperature
      respiratoryRate
      createdAt
    }
  }
`;

const CREATE_EMERGENCY_ALERT = gql`
  mutation CreateEmergencyAlert($message: String!) {
    createEmergencyAlert(message: $message) {
      id
      message
      status
      createdAt
    }
  }
`;

const GET_EMERGENCY_ALERTS = gql`
  query GetEmergencyAlerts {
    getEmergencyAlerts {
      id
      patientId
      message
      status
      responseNotes
      createdAt
    }
  }
`;

const UPDATE_EMERGENCY_ALERT = gql`
  mutation UpdateEmergencyAlert($id: ID!, $status: String!, $responseNotes: String) {
    updateEmergencyAlert(id: $id, status: $status, responseNotes: $responseNotes) {
      id
      status
      responseNotes
    }
  }
`;

const CREATE_COVID19_CHECKLIST = gql`
  mutation CreateCovid19Checklist(
    $fever: Boolean!
    $cough: Boolean!
    $shortnessOfBreath: Boolean!
    $fatigue: Boolean!
    $bodyAches: Boolean!
    $lossOfTasteOrSmell: Boolean!
    $soreThroat: Boolean!
    $headache: Boolean!
    $additionalNotes: String
  ) {
    createCovid19Checklist(
      fever: $fever
      cough: $cough
      shortnessOfBreath: $shortnessOfBreath
      fatigue: $fatigue
      bodyAches: $bodyAches
      lossOfTasteOrSmell: $lossOfTasteOrSmell
      soreThroat: $soreThroat
      headache: $headache
      additionalNotes: $additionalNotes
    ) {
      id
      fever
      cough
      createdAt
    }
  }
`;

const GET_COVID19_CHECKLIST = gql`
  query GetCovid19ChecklistByPatient($patientId: ID!) {
    getCovid19ChecklistByPatient(patientId: $patientId) {
      id
      fever
      cough
      shortnessOfBreath
      fatigue
      bodyAches
      lossOfTasteOrSmell
      soreThroat
      headache
      additionalNotes
      createdAt
    }
  }
`;

const ANALYZE_SYMPTOMS = gql`
  query AnalyzeSymptomsWithAI($symptoms: String!) {
    analyzeSymptomsWithAI(symptoms: $symptoms) {
      condition
      severity
      recommendation
    }
  }
`;

const GET_AVAILABLE_SYMPTOMS = gql`
  query GetAvailableSymptoms {
    getAvailableSymptoms
  }
`;

const PREDICT_DISEASE_TENSORFLOW = gql`
  query PredictDiseaseWithTensorFlow($symptoms: SymptomsInput!) {
    predictDiseaseWithTensorFlow(symptoms: $symptoms) {
      disease
      confidence
    }
  }
`;

function NurseView({ currentUser }) {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [vitalSignsForm, setVitalSignsForm] = useState({
    bodyTemperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: ''
  });
  const [symptomText, setSymptomText] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [alertResponse, setAlertResponse] = useState({ id: '', status: 'responded', notes: '' });

  // TensorFlow disease prediction states
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomSearch, setSymptomSearch] = useState('');
  const [tensorflowPredictions, setTensorflowPredictions] = useState(null);

  const { data: patientsData } = useQuery(GET_ALL_PATIENTS, { client: authClient });
  const { data: vitalSignsData, refetch: refetchVitals } = useQuery(GET_VITAL_SIGNS, {
    client: monitoringClient,
    variables: { patientId: selectedPatient },
    skip: !selectedPatient
  });
  const { data: alertsData, refetch: refetchAlerts } = useQuery(GET_EMERGENCY_ALERTS, {
    client: monitoringClient
  });

  const [createVitalSigns] = useMutation(CREATE_VITAL_SIGNS, {
    client: monitoringClient,
    onCompleted: () => {
      alert('Vital signs recorded successfully!');
      setVitalSignsForm({ bodyTemperature: '', heartRate: '', bloodPressure: '', respiratoryRate: '' });
      refetchVitals();
    },
    onError: (error) => alert(error.message)
  });

  const [updateAlert] = useMutation(UPDATE_EMERGENCY_ALERT, {
    client: monitoringClient,
    onCompleted: () => {
      alert('Alert updated successfully!');
      setAlertResponse({ id: '', status: 'responded', notes: '' });
      refetchAlerts();
    },
    onError: (error) => alert(error.message)
  });

  const [analyzeSymptoms, { loading: analyzingSymptoms }] = useLazyQuery(ANALYZE_SYMPTOMS, {
    client: monitoringClient,
    onCompleted: (data) => {
      setAiAnalysis(data.analyzeSymptomsWithAI);
    },
    onError: (error) => alert(error.message)
  });

  const { data: symptomsData, loading: loadingSymptoms, error: symptomsError } = useQuery(GET_AVAILABLE_SYMPTOMS, {
    client: monitoringClient
  });

  const [predictDisease, { loading: predicting }] = useLazyQuery(PREDICT_DISEASE_TENSORFLOW, {
    client: monitoringClient,
    onCompleted: (data) => {
      setTensorflowPredictions(data.predictDiseaseWithTensorFlow);
    },
    onError: (error) => alert(error.message)
  });

  const handleVitalSignsSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }

    createVitalSigns({
      variables: {
        patientId: selectedPatient,
        bodyTemperature: parseFloat(vitalSignsForm.bodyTemperature),
        heartRate: parseInt(vitalSignsForm.heartRate),
        bloodPressure: vitalSignsForm.bloodPressure,
        respiratoryRate: parseInt(vitalSignsForm.respiratoryRate)
      }
    });
  };

  const handleAnalyzeSymptoms = () => {
    if (!symptomText.trim()) {
      alert('Please enter symptoms to analyze');
      return;
    }
    analyzeSymptoms({ variables: { symptoms: symptomText } });
  };

  const handleUpdateAlert = (alertId) => {
    if (!alertResponse.notes.trim()) {
      alert('Please add response notes');
      return;
    }
    updateAlert({
      variables: {
        id: alertId,
        status: alertResponse.status,
        responseNotes: alertResponse.notes
      }
    });
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handlePredictDisease = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    predictDisease({
      variables: {
        symptoms: {
          selectedSymptoms: selectedSymptoms
        }
      }
    });
  };

  // Deduplicate symptoms and filter by search
  const allSymptoms = symptomsData?.getAvailableSymptoms || [];
  const uniqueSymptoms = [...new Set(allSymptoms)]; // Remove duplicates
  const filteredSymptoms = uniqueSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(symptomSearch.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h2>Nurse Dashboard - Welcome {currentUser.firstName}!</h2>

      <Tabs defaultActiveKey="vitals" className="mb-3 mt-4">
        <Tab eventKey="vitals" title="Enter Vital Signs">
          <Card className="mt-3">
            <Card.Header className="bg-primary text-white">Record Patient Vital Signs</Card.Header>
            <Card.Body>
              <Form onSubmit={handleVitalSignsSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Patient</Form.Label>
                  <Form.Select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
                    <option value="">Choose a patient...</option>
                    {patientsData?.getAllPatients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Body Temperature (°C)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        value={vitalSignsForm.bodyTemperature}
                        onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, bodyTemperature: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Heart Rate (bpm)</Form.Label>
                      <Form.Control
                        type="number"
                        value={vitalSignsForm.heartRate}
                        onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, heartRate: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Blood Pressure (e.g., 120/80)</Form.Label>
                      <Form.Control
                        type="text"
                        value={vitalSignsForm.bloodPressure}
                        onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, bloodPressure: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Respiratory Rate (breaths/min)</Form.Label>
                      <Form.Control
                        type="number"
                        value={vitalSignsForm.respiratoryRate}
                        onChange={(e) => setVitalSignsForm({ ...vitalSignsForm, respiratoryRate: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" variant="primary">Record Vital Signs</Button>
              </Form>

              {selectedPatient && vitalSignsData && (
                <div className="mt-4">
                  <h5>Previous Vital Signs</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Temperature</th>
                        <th>Heart Rate</th>
                        <th>Blood Pressure</th>
                        <th>Respiratory Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vitalSignsData.getVitalSignsByPatient.map(vital => (
                        <tr key={vital.id}>
                          <td>{new Date(parseInt(vital.createdAt)).toLocaleString()}</td>
                          <td>{vital.bodyTemperature}°C</td>
                          <td>{vital.heartRate} bpm</td>
                          <td>{vital.bloodPressure}</td>
                          <td>{vital.respiratoryRate}/min</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="ai" title="AI Symptom Analysis (Gemini)">
          <Card className="mt-3">
            <Card.Header className="bg-success text-white">Intelligent Symptom Analysis (Google Gemini)</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Enter Patient Symptoms</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="e.g., fever, dry cough, shortness of breath, fatigue"
                />
              </Form.Group>
              <Button variant="success" onClick={handleAnalyzeSymptoms} disabled={analyzingSymptoms}>
                {analyzingSymptoms ? 'Analyzing...' : 'Analyze with AI'}
              </Button>

              {aiAnalysis && (
                <div className="mt-4">
                  <h5>AI Analysis Results:</h5>
                  {aiAnalysis.map((condition, index) => (
                    <Alert key={index} variant={
                      condition.severity === 'high' ? 'danger' :
                      condition.severity === 'moderate' ? 'warning' : 'info'
                    }>
                      <strong>Condition:</strong> {condition.condition}<br />
                      <strong>Severity:</strong> {condition.severity.toUpperCase()}<br />
                      <strong>Recommendation:</strong> {condition.recommendation}
                    </Alert>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="tensorflow" title="Disease Prediction (TensorFlow)">
          <Card className="mt-3">
            <Card.Header className="bg-info text-white">TensorFlow Disease Prediction</Card.Header>
            <Card.Body>
              <Alert variant="info">
                Select symptoms from the list below to get AI-powered disease predictions using TensorFlow machine learning.
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>Search Symptoms</Form.Label>
                <Form.Control
                  type="text"
                  value={symptomSearch}
                  onChange={(e) => setSymptomSearch(e.target.value)}
                  placeholder="Type to search symptoms..."
                />
              </Form.Group>

              <div className="mb-3">
                <strong>Selected Symptoms ({selectedSymptoms.length}):</strong>
                {selectedSymptoms.length > 0 ? (
                  <div className="mt-2">
                    {selectedSymptoms.map(symptom => (
                      <Badge
                        key={symptom}
                        bg="primary"
                        className="me-2 mb-2"
                        style={{ cursor: 'pointer', fontSize: '0.9em', padding: '0.5em 0.8em' }}
                        onClick={() => handleSymptomToggle(symptom)}
                      >
                        {symptom.replace(/_/g, ' ')} ✕
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted mt-2">No symptoms selected yet</div>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px', padding: '10px' }}>
                <strong>Available Symptoms (click to select):</strong>
                <div className="mt-2">
                  {loadingSymptoms ? (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading symptoms...</span>
                      </div>
                      <div className="mt-2">Loading symptoms...</div>
                    </div>
                  ) : symptomsError ? (
                    <Alert variant="danger">
                      Error loading symptoms: {symptomsError.message}
                    </Alert>
                  ) : filteredSymptoms.length === 0 ? (
                    <div className="text-muted">No symptoms found matching "{symptomSearch}"</div>
                  ) : (
                    filteredSymptoms.map(symptom => (
                      <Badge
                        key={symptom}
                        bg={selectedSymptoms.includes(symptom) ? 'success' : 'secondary'}
                        className="me-2 mb-2"
                        style={{ cursor: 'pointer', fontSize: '0.85em', padding: '0.4em 0.7em' }}
                        onClick={() => handleSymptomToggle(symptom)}
                      >
                        {symptom.replace(/_/g, ' ')} {selectedSymptoms.includes(symptom) && '✓'}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <Button
                variant="primary"
                className="mt-3"
                onClick={handlePredictDisease}
                disabled={predicting || selectedSymptoms.length === 0}
              >
                {predicting ? 'Predicting...' : 'Predict Disease'}
              </Button>

              {tensorflowPredictions && (
                <div className="mt-4">
                  <h5>TensorFlow Prediction Results:</h5>
                  <Alert variant="success">
                    <strong>Top 3 Disease Predictions:</strong>
                  </Alert>
                  {tensorflowPredictions.map((prediction, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">
                              #{index + 1} {prediction.disease}
                            </h6>
                            <small className="text-muted">
                              Confidence: {(prediction.confidence * 100).toFixed(2)}%
                            </small>
                          </div>
                          <div style={{ width: '200px' }}>
                            <div className="progress" style={{ height: '25px' }}>
                              <div
                                className={`progress-bar ${
                                  prediction.confidence > 0.7 ? 'bg-success' :
                                  prediction.confidence > 0.4 ? 'bg-warning' : 'bg-info'
                                }`}
                                role="progressbar"
                                style={{ width: `${prediction.confidence * 100}%` }}
                                aria-valuenow={prediction.confidence * 100}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                                {(prediction.confidence * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="alerts" title="Emergency Alerts">
          <Card className="mt-3">
            <Card.Header className="bg-danger text-white">Emergency Alerts</Card.Header>
            <Card.Body>
              {alertsData?.getEmergencyAlerts.length === 0 ? (
                <Alert variant="info">No emergency alerts at this time</Alert>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Patient ID</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertsData?.getEmergencyAlerts.map(alert => (
                      <tr key={alert.id}>
                        <td>{new Date(parseInt(alert.createdAt)).toLocaleString()}</td>
                        <td>{alert.patientId}</td>
                        <td>{alert.message}</td>
                        <td>
                          <Badge bg={
                            alert.status === 'pending' ? 'danger' :
                            alert.status === 'responded' ? 'warning' : 'success'
                          }>
                            {alert.status}
                          </Badge>
                        </td>
                        <td>
                          {alert.status === 'pending' && (
                            <>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Response notes"
                                value={alertResponse.id === alert.id ? alertResponse.notes : ''}
                                onChange={(e) => setAlertResponse({ id: alert.id, status: 'responded', notes: e.target.value })}
                                className="mb-2"
                              />
                              <Button size="sm" variant="primary" onClick={() => handleUpdateAlert(alert.id)}>
                                Respond
                              </Button>
                            </>
                          )}
                          {alert.responseNotes && <div className="mt-2"><em>Notes: {alert.responseNotes}</em></div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}

function PatientView({ currentUser }) {
  const [dailyActivityForm, setDailyActivityForm] = useState({
    pulseRate: '',
    bloodPressure: '',
    weight: '',
    temperature: '',
    respiratoryRate: ''
  });
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [covidForm, setCovidForm] = useState({
    fever: false,
    cough: false,
    shortnessOfBreath: false,
    fatigue: false,
    bodyAches: false,
    lossOfTasteOrSmell: false,
    soreThroat: false,
    headache: false,
    additionalNotes: ''
  });

  const { data: dailyActivitiesData, refetch: refetchActivities } = useQuery(GET_DAILY_ACTIVITIES, {
    client: monitoringClient,
    variables: { patientId: currentUser.id }
  });

  const { data: covidData, refetch: refetchCovid } = useQuery(GET_COVID19_CHECKLIST, {
    client: monitoringClient,
    variables: { patientId: currentUser.id }
  });

  const [createDailyActivity] = useMutation(CREATE_DAILY_ACTIVITY, {
    client: monitoringClient,
    onCompleted: () => {
      alert('Daily activity recorded successfully!');
      setDailyActivityForm({ pulseRate: '', bloodPressure: '', weight: '', temperature: '', respiratoryRate: '' });
      refetchActivities();
    },
    onError: (error) => alert(error.message)
  });

  const [createEmergencyAlert] = useMutation(CREATE_EMERGENCY_ALERT, {
    client: monitoringClient,
    onCompleted: () => {
      alert('Emergency alert sent successfully! A nurse will respond soon.');
      setEmergencyMessage('');
    },
    onError: (error) => alert(error.message)
  });

  const [createCovidChecklist] = useMutation(CREATE_COVID19_CHECKLIST, {
    client: monitoringClient,
    onCompleted: () => {
      alert('COVID-19 checklist submitted successfully!');
      setCovidForm({
        fever: false,
        cough: false,
        shortnessOfBreath: false,
        fatigue: false,
        bodyAches: false,
        lossOfTasteOrSmell: false,
        soreThroat: false,
        headache: false,
        additionalNotes: ''
      });
      refetchCovid();
    },
    onError: (error) => alert(error.message)
  });

  const handleDailyActivitySubmit = (e) => {
    e.preventDefault();
    createDailyActivity({
      variables: {
        pulseRate: parseInt(dailyActivityForm.pulseRate),
        bloodPressure: dailyActivityForm.bloodPressure,
        weight: parseFloat(dailyActivityForm.weight),
        temperature: parseFloat(dailyActivityForm.temperature),
        respiratoryRate: parseInt(dailyActivityForm.respiratoryRate)
      }
    });
  };

  const handleEmergencyAlertSubmit = (e) => {
    e.preventDefault();
    if (!emergencyMessage.trim()) {
      alert('Please enter a message');
      return;
    }
    createEmergencyAlert({ variables: { message: emergencyMessage } });
  };

  const handleCovidChecklistSubmit = (e) => {
    e.preventDefault();
    createCovidChecklist({ variables: covidForm });
  };

  return (
    <Container className="mt-4">
      <h2>Patient Dashboard - Welcome {currentUser.firstName}!</h2>

      <Tabs defaultActiveKey="daily" className="mb-3 mt-4">
        <Tab eventKey="daily" title="Daily Activities">
          <Card className="mt-3">
            <Card.Header className="bg-info text-white">Log Your Daily Health Information</Card.Header>
            <Card.Body>
              <Form onSubmit={handleDailyActivitySubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pulse Rate (bpm)</Form.Label>
                      <Form.Control
                        type="number"
                        value={dailyActivityForm.pulseRate}
                        onChange={(e) => setDailyActivityForm({ ...dailyActivityForm, pulseRate: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Blood Pressure (e.g., 120/80)</Form.Label>
                      <Form.Control
                        type="text"
                        value={dailyActivityForm.bloodPressure}
                        onChange={(e) => setDailyActivityForm({ ...dailyActivityForm, bloodPressure: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Weight (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        value={dailyActivityForm.weight}
                        onChange={(e) => setDailyActivityForm({ ...dailyActivityForm, weight: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Temperature (°C)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.1"
                        value={dailyActivityForm.temperature}
                        onChange={(e) => setDailyActivityForm({ ...dailyActivityForm, temperature: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Respiratory Rate (/min)</Form.Label>
                      <Form.Control
                        type="number"
                        value={dailyActivityForm.respiratoryRate}
                        onChange={(e) => setDailyActivityForm({ ...dailyActivityForm, respiratoryRate: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" variant="info">Log Daily Activity</Button>
              </Form>

              {dailyActivitiesData && dailyActivitiesData.getDailyActivitiesByPatient.length > 0 && (
                <div className="mt-4">
                  <h5>Your Activity History</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Pulse</th>
                        <th>BP</th>
                        <th>Weight</th>
                        <th>Temp</th>
                        <th>Resp Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyActivitiesData.getDailyActivitiesByPatient.map(activity => (
                        <tr key={activity.id}>
                          <td>{new Date(parseInt(activity.createdAt)).toLocaleString()}</td>
                          <td>{activity.pulseRate} bpm</td>
                          <td>{activity.bloodPressure}</td>
                          <td>{activity.weight} kg</td>
                          <td>{activity.temperature}°C</td>
                          <td>{activity.respiratoryRate}/min</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="emergency" title="Emergency Alert">
          <Card className="mt-3">
            <Card.Header className="bg-danger text-white">Send Emergency Alert</Card.Header>
            <Card.Body>
              <Form onSubmit={handleEmergencyAlertSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Describe Your Emergency</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={emergencyMessage}
                    onChange={(e) => setEmergencyMessage(e.target.value)}
                    placeholder="Describe your symptoms or emergency situation..."
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="danger">Send Alert to Nurse</Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="covid" title="COVID-19 Checklist">
          <Card className="mt-3">
            <Card.Header className="bg-warning">COVID-19 Symptom Checklist</Card.Header>
            <Card.Body>
              <Form onSubmit={handleCovidChecklistSubmit}>
                <p className="mb-3">Please check the symptoms you are experiencing:</p>

                <Form.Check
                  type="checkbox"
                  label="Fever"
                  checked={covidForm.fever}
                  onChange={(e) => setCovidForm({ ...covidForm, fever: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Cough"
                  checked={covidForm.cough}
                  onChange={(e) => setCovidForm({ ...covidForm, cough: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Shortness of Breath"
                  checked={covidForm.shortnessOfBreath}
                  onChange={(e) => setCovidForm({ ...covidForm, shortnessOfBreath: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Fatigue"
                  checked={covidForm.fatigue}
                  onChange={(e) => setCovidForm({ ...covidForm, fatigue: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Body Aches"
                  checked={covidForm.bodyAches}
                  onChange={(e) => setCovidForm({ ...covidForm, bodyAches: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Loss of Taste or Smell"
                  checked={covidForm.lossOfTasteOrSmell}
                  onChange={(e) => setCovidForm({ ...covidForm, lossOfTasteOrSmell: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Sore Throat"
                  checked={covidForm.soreThroat}
                  onChange={(e) => setCovidForm({ ...covidForm, soreThroat: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Headache"
                  checked={covidForm.headache}
                  onChange={(e) => setCovidForm({ ...covidForm, headache: e.target.checked })}
                  className="mb-3"
                />

                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={covidForm.additionalNotes}
                    onChange={(e) => setCovidForm({ ...covidForm, additionalNotes: e.target.value })}
                    placeholder="Any additional information..."
                  />
                </Form.Group>

                <Button type="submit" variant="warning">Submit Checklist</Button>
              </Form>

              {covidData && covidData.getCovid19ChecklistByPatient.length > 0 && (
                <div className="mt-4">
                  <h5>Previous Submissions</h5>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Symptoms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {covidData.getCovid19ChecklistByPatient.map(checklist => {
                        const symptoms = [];
                        if (checklist.fever) symptoms.push('Fever');
                        if (checklist.cough) symptoms.push('Cough');
                        if (checklist.shortnessOfBreath) symptoms.push('Shortness of Breath');
                        if (checklist.fatigue) symptoms.push('Fatigue');
                        if (checklist.bodyAches) symptoms.push('Body Aches');
                        if (checklist.lossOfTasteOrSmell) symptoms.push('Loss of Taste/Smell');
                        if (checklist.soreThroat) symptoms.push('Sore Throat');
                        if (checklist.headache) symptoms.push('Headache');

                        return (
                          <tr key={checklist.id}>
                            <td>{new Date(parseInt(checklist.createdAt)).toLocaleString()}</td>
                            <td>{symptoms.join(', ') || 'No symptoms'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}

function PatientMonitoringApp() {
  const { data, loading, error } = useQuery(GET_CURRENT_USER, { client: authClient });

  if (loading) return <Container className="mt-5"><Alert variant="info">Loading...</Alert></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">Please login to continue</Alert></Container>;
  if (!data?.getCurrentUser) return <Container className="mt-5"><Alert variant="warning">Not authenticated</Alert></Container>;

  const currentUser = data.getCurrentUser;

  return currentUser.role === 'nurse' ? (
    <NurseView currentUser={currentUser} />
  ) : (
    <PatientView currentUser={currentUser} />
  );
}

function App() {
  return (
    <ApolloProvider client={authClient}>
      <PatientMonitoringApp />
    </ApolloProvider>
  );
}

export default App;
