# Quick Start Guide - PatientCare App

## Prerequisites Checklist

Before starting, make sure you have:

- ✅ Node.js installed (v18+)
- ✅ MongoDB installed and running
- ✅ All dependencies installed (`./install.sh` or manual install)
- ✅ Gemini API key configured (in `server/microservice/patient-monitoring-microservice/.env`)

## Starting the Application

You need to run **5 separate services**. Open 5 terminal windows:

### Terminal 1: Auth Microservice (Port 4001)
```bash
cd server/microservice/auth-microservice
npm start
```
**Wait for:** `🚀 Auth Microservice ready at http://localhost:4001/graphql`

### Terminal 2: Patient Monitoring Microservice (Port 4002)
```bash
cd server/microservice/patient-monitoring-microservice
npm start
```
**Wait for:** `🚀 Patient Monitoring Microservice ready at http://localhost:4002/graphql`

### Terminal 3: Shell App (Port 3000)
```bash
cd client/shell-app
npm run dev
```
**Wait for:** `Local: http://localhost:3000/`

### Terminal 4: Auth App (Port 3001)
```bash
cd client/auth-app
npm run dev
```
**Wait for:** `Local: http://localhost:3001/`

### Terminal 5: Patient App (Port 3002)
```bash
cd client/patient-app
npm run dev
```
**Wait for:** `Local: http://localhost:3002/`

## Access the Application

Once all 5 services are running, open your browser:

**Main Application:** http://localhost:3000

## Quick Demo Test

### 1. Register a Nurse
- Email: `nurse@test.com`
- Password: `password123`
- Role: **Nurse**
- First Name: Sarah
- Last Name: Johnson

### 2. Register a Patient
- Logout first
- Email: `patient@test.com`
- Password: `password123`
- Role: **Patient**
- First Name: John
- Last Name: Doe

### 3. Test Patient Features
Login as patient and:
- Log daily activities
- Send emergency alert
- Submit COVID-19 checklist

### 4. Test Nurse Features
Login as nurse and:
- Select the patient and enter vital signs
- Use AI to analyze symptoms
- Respond to emergency alerts

## Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod             # Linux
```

### "Port already in use"
```bash
# Kill all processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
lsof -ti:4001 | xargs kill -9
lsof -ti:4002 | xargs kill -9
```

### "Module Federation Error"
- Make sure ALL 3 frontend apps are running
- Clear browser cache
- Reload the page

### "AI Analysis Not Working"
- Check `.env` file has valid GEMINI_API_KEY
- Restart patient-monitoring-microservice

## Stopping the Application

Press `Ctrl+C` in each of the 5 terminal windows to stop all services.

## For Demo Presentation

1. Start all 5 services (allow 30 seconds for all to start)
2. Open browser to http://localhost:3000
3. Register accounts (nurse and patient)
4. Demonstrate features:
   - Patient: Log activities, send alert, COVID checklist
   - Nurse: Enter vitals, AI analysis, respond to alerts
5. Show the microservices architecture in the code
6. Show the module federation configuration
7. Explain the GraphQL queries and mutations
8. Show the MongoDB collections

## Tips for Smooth Demo

- Practice the demo flow beforehand
- Have test data ready to enter
- Keep all terminal windows visible to show running services
- Prepare to explain the architecture (microservices + micro-frontends)
- Have the README open for quick reference
- Test the AI feature before demo (ensure API key works)

Good luck with your demo! 🚀
