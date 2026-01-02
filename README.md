# PatientCare App - COMP308 Final Project

A modern web application for nurse practitioners to monitor patients during their first week after hospital release, with features for tracking vital signs, daily activities, emergency alerts, and COVID-19 symptom monitoring.

## Project Overview

This application implements a **Microservices Architecture** with **Micro-frontends** using:

- **Backend**: Node.js, Express, GraphQL (Apollo Server), MongoDB
- **Frontend**: React 18, Vite, Module Federation, Bootstrap 5
- **AI**: Google Gemini API for intelligent symptom analysis
- **Authentication**: JWT with HTTP-only cookies

## Features Implemented

### For Nurses:

1. ✅ **User Registration/Login** - Secure authentication with role-based access
2. ✅ **Enter Vital Signs** - Record patient vital signs (body temperature, heart rate, blood pressure, respiratory rate)
3. ✅ **AI Symptom Analysis** - Intelligent analysis of patient symptoms using Google Gemini API
4. ✅ **View Emergency Alerts** - Monitor and respond to patient emergency alerts
5. ✅ **View Patient History** - Access previous vital signs and daily activities

### For Patients:

1. ✅ **User Registration/Login** - Secure authentication
2. ✅ **Log Daily Activities** - Track daily health information (pulse rate, blood pressure, weight, temperature, respiratory rate)
3. ✅ **Send Emergency Alerts** - Create emergency alerts for first responders
4. ✅ **COVID-19 Checklist** - Submit and track COVID-19 symptoms
5. ✅ **View Personal History** - Access previous daily activities and submissions

## Project Structure

```
PatientCare-App/
├── server/                                 # Backend Microservices
│   └── microservice/
│       ├── auth-microservice/              # Authentication Service (Port 4001)
│       │   ├── models/User.js
│       │   ├── typeDefs/authTypeDefs.js
│       │   ├── resolvers/authResolvers.js
│       │   ├── config/mongoose.js
│       │   ├── auth-microservice.js
│       │   └── package.json
│       └── patient-monitoring-microservice/ # Monitoring Service (Port 4002)
│           ├── models/
│           │   ├── VitalSigns.js
│           │   ├── DailyActivity.js
│           │   ├── EmergencyAlert.js
│           │   └── Covid19Checklist.js
│           ├── typeDefs/monitoringTypeDefs.js
│           ├── resolvers/monitoringResolvers.js
│           ├── config/mongoose.js
│           ├── aiAgent.js
│           ├── patient-monitoring-microservice.js
│           └── package.json
├── client/                                 # Frontend Micro-frontends
│   ├── shell-app/                          # Container App (Port 3000)
│   │   ├── src/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── vite.config.js
│   │   ├── package.json
│   │   └── index.html
│   ├── auth-app/                           # Authentication App (Port 3001)
│   │   ├── src/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── vite.config.js
│   │   ├── package.json
│   │   └── index.html
│   └── patient-app/                        # Patient Monitoring App (Port 3002)
│       ├── src/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── vite.config.js
│       ├── package.json
│       └── index.html
└── README.md
```

## Technology Stack

### Backend

- **Express.js** - Web server framework
- **Apollo Server** - GraphQL server
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Google Generative AI** - Gemini API for symptom analysis

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Module Federation** - Micro-frontend architecture
- **Apollo Client** - GraphQL client
- **React Bootstrap** - UI components
- **Bootstrap 5** - CSS framework

## Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
3. **Google Gemini API Key** - [Get one here](https://makersuite.google.com/app/apikey)

## Installation & Setup

### Step 1: Install Dependencies

Run the installation script to install all dependencies for all services:

```bash
# From the PatientCare-App directory
chmod +x install.sh
./install.sh
```

Or manually install for each service:

```bash
# Backend - Auth Microservice
cd server/microservice/auth-microservice
npm install

# Backend - Patient Monitoring Microservice
cd ../patient-monitoring-microservice
npm install

# Frontend - Shell App
cd ../../../client/shell-app
npm install

# Frontend - Auth App
cd ../auth-app
npm install

# Frontend - Patient App
cd ../patient-app
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `patient-monitoring-microservice` directory:

```bash
cd server/microservice/patient-monitoring-microservice
```

Add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Step 3: Start MongoDB

Make sure MongoDB is running:

```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/your/data/directory
```

### Step 4: Start All Services

Open **5 separate terminal windows** and run each service:

**Terminal 1 - Auth Microservice:**

```bash
cd server/microservice/auth-microservice
npm start
```

Should see: `🚀 Auth Microservice ready at http://localhost:4001/graphql`

**Terminal 2 - Patient Monitoring Microservice:**

```bash
cd server/microservice/patient-monitoring-microservice
npm start
```

Should see: `🚀 Patient Monitoring Microservice ready at http://localhost:4002/graphql`

**Terminal 3 - Shell App:**

```bash
cd client/shell-app
npm run dev
```

Should see: `Local: http://localhost:3000/`

**Terminal 4 - Auth App:**

```bash
cd client/auth-app
npm run dev
```

Should see: `Local: http://localhost:3001/`

**Terminal 5 - Patient App:**

```bash
cd client/patient-app
npm run dev
```

Should see: `Local: http://localhost:3002/`

### Step 5: Access the Application

Open your browser and go to:

```
http://localhost:3000
```

## Demo Instructions

### Creating Test Accounts

1. **Register a Nurse Account:**

   - Click "Don't have an account? Register"
   - Fill in the form:
     - Username: `nurse1`
     - First Name: `Sarah`
     - Last Name: `Johnson`
     - Role: Select **Nurse**
     - Email: `nurse1@example.com`
     - Password: `password123`
   - Click "Register"

2. **Register a Patient Account:**
   - Logout (click Logout button in top-right)
   - Click "Don't have an account? Register"
   - Fill in the form:
     - Username: `patient1`
     - First Name: `John`
     - Last Name: `Doe`
     - Role: Select **Patient**
     - Email: `patient1@example.com`
     - Password: `password123`
   - Click "Register"

### Testing Patient Features

Login as the patient (`patient1@example.com` / `password123`):

1. **Log Daily Activities:**

   - Go to "Daily Activities" tab
   - Enter:
     - Pulse Rate: 72
     - Blood Pressure: 120/80
     - Weight: 70.5
     - Temperature: 36.6
     - Respiratory Rate: 16
   - Click "Log Daily Activity"
   - View your activity history in the table below

2. **Send Emergency Alert:**

   - Go to "Emergency Alert" tab
   - Type: "Experiencing chest pain and difficulty breathing"
   - Click "Send Alert to Nurse"

3. **Submit COVID-19 Checklist:**
   - Go to "COVID-19 Checklist" tab
   - Check symptoms you're experiencing (e.g., Fever, Cough, Fatigue)
   - Add additional notes if needed
   - Click "Submit Checklist"
   - View previous submissions in the table

### Testing Nurse Features

Login as the nurse (`nurse1@example.com` / `password123`):

1. **Enter Vital Signs:**

   - Go to "Enter Vital Signs" tab
   - Select patient: "John Doe (patient1@example.com)"
   - Enter:
     - Body Temperature: 37.2
     - Heart Rate: 75
     - Blood Pressure: 118/76
     - Respiratory Rate: 18
   - Click "Record Vital Signs"
   - View patient's vital signs history below

2. **AI Symptom Analysis:**

   - Go to "AI Symptom Analysis" tab
   - Enter symptoms: "fever, dry cough, shortness of breath, fatigue"
   - Click "Analyze with AI"
   - Review AI-generated analysis with:
     - Possible conditions
     - Severity levels
     - Recommendations

3. **Respond to Emergency Alerts:**
   - Go to "Emergency Alerts" tab
   - View all pending alerts from patients
   - In the response notes field, type: "Dispatching ambulance immediately. Stay calm."
   - Click "Respond"
   - Alert status changes to "responded"

## Explaining the Architecture

### Microservices Backend

1. **Auth Microservice (Port 4001):**

   - Handles user registration and login
   - Generates JWT tokens
   - Stores tokens in HTTP-only cookies for security
   - Uses bcryptjs for password hashing

2. **Patient Monitoring Microservice (Port 4002):**
   - Manages vital signs, daily activities, emergency alerts, COVID-19 checklists
   - Integrates Google Gemini AI for symptom analysis
   - Validates user authentication via JWT

### Micro-frontends Architecture

1. **Shell App (Port 3000):**

   - Container application
   - Manages authentication state
   - Dynamically loads Auth App and Patient App using Module Federation
   - Provides navigation bar and logout functionality

2. **Auth App (Port 3001):**

   - Handles registration and login UI
   - Communicates with Auth Microservice
   - Dispatches login events to Shell App

3. **Patient App (Port 3002):**
   - Role-based UI (different views for nurses and patients)
   - Communicates with both Auth and Monitoring microservices
   - Uses Bootstrap for responsive design

### Module Federation

Module Federation allows multiple React apps to share code at runtime:

- Shell App loads Auth App and Patient App remotely
- Shared dependencies (React, Apollo Client) loaded once
- Independent development and deployment of each app

## GraphQL API Endpoints

### Auth Service (http://localhost:4001/graphql)

**Queries:**

- `getCurrentUser` - Get authenticated user
- `getUserById(id)` - Get user by ID
- `getAllPatients` - Get all patients (for nurses)
- `getAllNurses` - Get all nurses

**Mutations:**

- `register(username, email, password, role, firstName, lastName)` - Register new user
- `login(email, password)` - Login user

### Patient Monitoring Service (http://localhost:4002/graphql)

**Queries:**

- `getVitalSignsByPatient(patientId)` - Get patient's vital signs
- `getDailyActivitiesByPatient(patientId)` - Get patient's daily activities
- `getEmergencyAlerts` - Get all emergency alerts (nurses only)
- `getCovid19ChecklistByPatient(patientId)` - Get COVID-19 checklists
- `analyzeSymptomsWithAI(symptoms)` - AI symptom analysis (nurses only)

**Mutations:**

- `createVitalSigns(...)` - Record vital signs (nurses only)
- `createDailyActivity(...)` - Log daily activity (patients only)
- `createEmergencyAlert(message)` - Send emergency alert (patients only)
- `updateEmergencyAlert(id, status, responseNotes)` - Respond to alert (nurses only)
- `createCovid19Checklist(...)` - Submit COVID-19 checklist (patients only)

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- Check MongoDB is on default port 27017

### Port Already in Use

- Kill processes on ports 3000-3002, 4001-4002:
  ```bash
  lsof -ti:3000 | xargs kill -9
  lsof -ti:3001 | xargs kill -9
  lsof -ti:3002 | xargs kill -9
  lsof -ti:4001 | xargs kill -9
  lsof -ti:4002 | xargs kill -9
  ```

### Module Federation Loading Error

- Ensure all 3 frontend apps are running
- Clear browser cache and reload
- Check browser console for specific errors

### AI Analysis Not Working

- Verify GEMINI_API_KEY is set in environment variables
- Check API key is valid at [Google AI Studio](https://makersuite.google.com/)
- Review patient-monitoring-microservice terminal for errors

### Authentication Issues

- Clear browser cookies
- Logout and login again
- Check both microservices are running

## Database Collections

The application creates two MongoDB databases:

**patientcare-auth-db:**

- `users` - User accounts (patients and nurses)

**patientcare-monitoring-db:**

- `vitalsigns` - Patient vital signs
- `dailyactivities` - Patient daily health logs
- `emergencyalerts` - Emergency alerts
- `covid19checklists` - COVID-19 symptom checklists

## Security Features

- ✅ JWT-based authentication
- ✅ HTTP-only cookies prevent XSS attacks
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (nurse vs patient)
- ✅ CORS configured for allowed origins
- ✅ GraphQL context-based authentication

## Future Enhancements

- Email notifications for emergency alerts
- Real-time updates using GraphQL subscriptions
- Data visualization charts for vital signs trends
- Export data to PDF/CSV
- Multi-language support
- Mobile app version
- Video consultation feature

## Credits

**Student Name:** [Your Name]
**Course:** COMP308 - Emerging Technologies
**Project:** Final Group Project
**Technologies:** MERN Stack, GraphQL, Micro-frontends, Module Federation, Google Gemini AI

## License

This project is created for educational purposes as part of COMP308 course requirements.
