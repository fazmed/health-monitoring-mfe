# Demo Preparation Checklist

## Before Demo Day

### Prerequisites Setup
- [ ] MongoDB installed and tested
- [ ] Node.js v18+ installed
- [ ] All dependencies installed (`./install.sh`)
- [ ] Gemini API key obtained and configured
- [ ] All 5 services tested and working

### Test Run
- [ ] Can start all 5 services without errors
- [ ] Can register a nurse account
- [ ] Can register a patient account
- [ ] Can login and logout
- [ ] Nurse can enter vital signs
- [ ] Patient can log daily activities
- [ ] AI symptom analysis works
- [ ] Emergency alerts work
- [ ] COVID-19 checklist works

### Presentation Prep
- [ ] README.md reviewed and understood
- [ ] TECH_STACK.md reviewed for technical questions
- [ ] PROJECT_SUMMARY.md reviewed for overview
- [ ] Can explain microservices architecture
- [ ] Can explain micro-frontends architecture
- [ ] Can explain Module Federation
- [ ] Can explain GraphQL vs REST
- [ ] Can explain authentication flow

## On Demo Day

### Startup (15-20 minutes before demo)

#### Step 1: Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Verify it's running
mongosh --eval "db.version()"
```
- [ ] MongoDB started successfully

#### Step 2: Terminal 1 - Auth Microservice
```bash
cd server/microservice/auth-microservice
npm start
```
**Wait for:** `✅ Auth Service - MongoDB Connected`
**Wait for:** `🚀 Auth Microservice ready at http://localhost:4001/graphql`
- [ ] Auth service running

#### Step 3: Terminal 2 - Patient Monitoring Microservice
```bash
cd server/microservice/patient-monitoring-microservice
npm start
```
**Wait for:** `✅ Patient Monitoring Service - MongoDB Connected`
**Wait for:** `🚀 Patient Monitoring Microservice ready at http://localhost:4002/graphql`
- [ ] Monitoring service running

#### Step 4: Terminal 3 - Shell App
```bash
cd client/shell-app
npm run dev
```
**Wait for:** `Local: http://localhost:3000/`
- [ ] Shell app running

#### Step 5: Terminal 4 - Auth App
```bash
cd client/auth-app
npm run dev
```
**Wait for:** `Local: http://localhost:3001/`
- [ ] Auth app running

#### Step 6: Terminal 5 - Patient App
```bash
cd client/patient-app
npm run dev
```
**Wait for:** `Local: http://localhost:3002/`
- [ ] Patient app running

#### Step 7: Browser Test
- [ ] Open http://localhost:3000
- [ ] Page loads correctly
- [ ] No console errors

## Demo Flow (10-15 minutes)

### Part 1: Introduction (2 minutes)
- [ ] Introduce project: "PatientCare App for monitoring patients after hospital release"
- [ ] Mention technologies: "MERN stack, GraphQL, Microservices, Micro-frontends, AI"
- [ ] Show project structure in VS Code

### Part 2: Architecture Explanation (3 minutes)
- [ ] Show microservices architecture diagram (PROJECT_SUMMARY.md)
- [ ] Explain 2 backend microservices (auth, monitoring)
- [ ] Explain 3 frontend micro-frontends (shell, auth, patient)
- [ ] Show Module Federation configuration (vite.config.js)
- [ ] Show GraphQL schemas (typeDefs files)

### Part 3: Live Demo (7 minutes)

#### Register Nurse Account (1 minute)
- [ ] Click "Don't have an account? Register"
- [ ] Fill form:
  - Username: `nurse_demo`
  - First Name: `Sarah`
  - Last Name: `Johnson`
  - Role: **Nurse**
  - Email: `nurse@demo.com`
  - Password: `password123`
- [ ] Click Register
- [ ] Show welcome message with name and role

#### Logout and Register Patient (1 minute)
- [ ] Click Logout
- [ ] Register patient:
  - Username: `patient_demo`
  - First Name: `John`
  - Last Name: `Doe`
  - Role: **Patient**
  - Email: `patient@demo.com`
  - Password: `password123`
- [ ] Click Register

#### Patient Features (2 minutes)
- [ ] **Daily Activities Tab:**
  - Pulse Rate: `72`
  - Blood Pressure: `120/80`
  - Weight: `70.5`
  - Temperature: `36.6`
  - Respiratory Rate: `16`
  - Click "Log Daily Activity"
  - Show history table appears

- [ ] **Emergency Alert Tab:**
  - Type: `Experiencing chest pain and dizziness`
  - Click "Send Alert to Nurse"
  - Show success message

- [ ] **COVID-19 Checklist Tab:**
  - Check: Fever, Cough, Fatigue
  - Additional Notes: `Symptoms started 2 days ago`
  - Click "Submit Checklist"
  - Show submission confirmation

#### Nurse Features (3 minutes)
- [ ] Logout and login as nurse (`nurse@demo.com` / `password123`)

- [ ] **Enter Vital Signs Tab:**
  - Select patient: "John Doe (patient@demo.com)"
  - Body Temperature: `37.8`
  - Heart Rate: `88`
  - Blood Pressure: `125/82`
  - Respiratory Rate: `20`
  - Click "Record Vital Signs"
  - Show vital signs history table

- [ ] **AI Symptom Analysis Tab:**
  - Enter: `fever, dry cough, shortness of breath, body aches, fatigue`
  - Click "Analyze with AI"
  - Show AI results with conditions, severity, recommendations
  - Highlight: "This uses Google Gemini AI API"

- [ ] **Emergency Alerts Tab:**
  - Show the alert from patient
  - Add response notes: `Ambulance dispatched. ETA 10 minutes. Stay calm and remain seated.`
  - Click "Respond"
  - Show status changes to "responded"

### Part 4: Code Walkthrough (2 minutes)
- [ ] Show backend structure:
  - MongoDB models
  - GraphQL typeDefs
  - Resolvers with authentication
  - AI integration (aiAgent.js)

- [ ] Show frontend structure:
  - Module Federation config
  - Apollo Client setup
  - React components with Bootstrap

### Part 5: Q&A (remaining time)
- [ ] Be ready to explain any technical choices
- [ ] Be ready to discuss scalability
- [ ] Be ready to discuss security features

## Common Questions & Answers

**Q: Why microservices?**
A: Independent scaling, fault isolation, technology flexibility, team autonomy

**Q: Why micro-frontends?**
A: Independent development, separate deployments, reduced coupling, modular updates

**Q: Why GraphQL over REST?**
A: Single endpoint, efficient data fetching, strong typing, self-documenting

**Q: How does authentication work?**
A: JWT tokens stored in HTTP-only cookies, verified in GraphQL context, role-based access

**Q: What's Module Federation?**
A: Allows React apps to share code at runtime, enabling true micro-frontends architecture

**Q: How does AI analysis work?**
A: Gemini API processes symptom text with medical prompt, returns structured JSON with conditions

**Q: Can you scale this?**
A: Yes - each microservice and micro-frontend can be scaled independently

## Troubleshooting During Demo

### If service won't start:
```bash
# Kill process on port
lsof -ti:PORT | xargs kill -9
# Restart service
```

### If MongoDB not connected:
```bash
brew services restart mongodb-community
```

### If AI not working:
- Check .env file has GEMINI_API_KEY
- Use fallback: "AI service demonstrates integration pattern"

### If Module Federation fails:
- Ensure all 3 frontend apps are running
- Refresh browser
- Show architecture diagram instead

## After Demo Checklist

- [ ] Answer all questions
- [ ] Provide GitHub link (if applicable)
- [ ] Thank the audience
- [ ] Stop all services (Ctrl+C in each terminal)
- [ ] Stop MongoDB if desired

## Emergency Backup Plan

If live demo fails:
- [ ] Have screenshots ready
- [ ] Walk through code instead
- [ ] Explain architecture with diagrams
- [ ] Show GraphQL playground (ports 4001, 4002)

## Confidence Boosters

✅ All 13 project requirements implemented
✅ Modern, production-ready architecture
✅ Complete documentation
✅ AI integration works
✅ Professional UI design
✅ Security implemented
✅ Well-structured code
✅ Scalable design

**You've got this! The project is complete and impressive!** 🚀
