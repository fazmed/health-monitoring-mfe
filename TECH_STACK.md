# Technology Stack - PatientCare App

## Overview

This project uses the **MERN Stack** with **GraphQL**, **Microservices**, and **Micro-frontends** architecture.

## Backend Technologies

### Core Framework
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v4.18.3) - Web application framework

### GraphQL
- **Apollo Server Express** (v3.13.0) - GraphQL server
- **GraphQL** (v16.8.1) - Query language for APIs

### Database
- **MongoDB** - NoSQL database
- **Mongoose** (v8.2.1) - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** (v9.0.2) - Token-based authentication
- **bcryptjs** (v3.0.2) - Password hashing
- **cookie-parser** (v1.4.6) - Cookie parsing middleware
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing

### AI Integration
- **@google/generative-ai** (v0.24.1) - Google Gemini API for AI symptom analysis

### Inter-Service Communication
- **Axios** (v1.8.4) - HTTP client for microservice communication

## Frontend Technologies

### Core Framework
- **React** (v18.2.0) - UI library
- **React DOM** (v18.2.0) - React rendering

### Build Tool
- **Vite** (v5.1.4) - Fast build tool and dev server
- **@vitejs/plugin-react** (v4.2.1) - React plugin for Vite

### Micro-frontend Architecture
- **@originjs/vite-plugin-federation** (v1.3.5) - Module Federation for Vite
  - Enables runtime sharing between micro-frontends
  - Allows independent deployment of apps

### GraphQL Client
- **@apollo/client** (v3.9.5) - GraphQL client for React
- **graphql** (v16.8.1) - GraphQL query language

### UI Framework
- **React Bootstrap** (v2.10.1) - React components for Bootstrap
- **Bootstrap** (v5.3.3) - CSS framework for responsive design

## Architecture Patterns

### 1. Microservices Architecture

**Auth Microservice (Port 4001):**
- Independent service for authentication
- Own MongoDB database: `patientcare-auth-db`
- Responsibilities:
  - User registration
  - User login
  - JWT token generation
  - User management queries

**Patient Monitoring Microservice (Port 4002):**
- Independent service for patient data
- Own MongoDB database: `patientcare-monitoring-db`
- Responsibilities:
  - Vital signs management
  - Daily activities tracking
  - Emergency alerts
  - COVID-19 checklists
  - AI symptom analysis

**Benefits:**
- Independent scaling
- Technology flexibility
- Fault isolation
- Independent deployment
- Team autonomy

### 2. Micro-frontends Architecture

**Shell App (Port 3000):**
- Container application
- Loads remote apps dynamically
- Manages global state (authentication)
- Provides navigation

**Auth App (Port 3001):**
- Authentication UI
- Registration form
- Login form
- Exposed via Module Federation

**Patient App (Port 3002):**
- Patient monitoring UI
- Role-based views (nurse/patient)
- Feature-rich interface
- Exposed via Module Federation

**Benefits:**
- Independent development
- Technology agnostic
- Independent deployment
- Team autonomy
- Reduced coupling

### 3. Module Federation

**How it works:**
- Shell App acts as host
- Auth App and Patient App act as remotes
- Shared dependencies loaded once (React, Apollo Client)
- Runtime composition of applications

**Configuration:**
```javascript
// Shell App (Host)
remotes: {
  'auth-app': 'http://localhost:3001/assets/remoteEntry.js',
  'patient-app': 'http://localhost:3002/assets/remoteEntry.js'
}

// Remote Apps
exposes: {
  './App': './src/App'
}

// Shared libraries
shared: ['react', 'react-dom', '@apollo/client', 'graphql']
```

### 4. GraphQL Architecture

**Type Definitions (Schema):**
- Define data structure
- Query types
- Mutation types
- Object types

**Resolvers:**
- Business logic implementation
- Data fetching
- Authentication checks
- Error handling

**Context:**
- Request-scoped data
- User authentication
- Token verification

**Benefits:**
- Single endpoint
- Efficient data fetching
- Strong typing
- Self-documenting API

## Design Patterns Used

### 1. Repository Pattern
- Models abstract database operations
- Mongoose schemas define data structure

### 2. Middleware Pattern
- Express middleware for CORS
- Cookie parser middleware
- Apollo Server middleware

### 3. Context Pattern (React)
- Apollo Client Provider
- Authentication context

### 4. Role-Based Access Control (RBAC)
- Nurse role
- Patient role
- Authorization in resolvers

### 5. Event-Driven Pattern
- Custom events for login success
- Cross-app communication

## Security Implementation

### 1. Authentication
- JWT tokens for stateless authentication
- HTTP-only cookies prevent XSS
- Token expiration (24 hours)

### 2. Authorization
- Role-based access in resolvers
- Context-based user verification
- GraphQL field-level security

### 3. Password Security
- bcryptjs with salt rounds
- Passwords never stored in plain text

### 4. CORS Configuration
- Specific allowed origins
- Credentials enabled for cookies

### 5. Input Validation
- Required fields in GraphQL schema
- Type checking
- Mongoose schema validation

## Database Schema

### Users Collection
```javascript
{
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed, required)
  role: String (enum: ['nurse', 'patient'])
  firstName: String (required)
  lastName: String (required)
  timestamps: true
}
```

### VitalSigns Collection
```javascript
{
  patientId: String (required, indexed)
  bodyTemperature: Number (required)
  heartRate: Number (required)
  bloodPressure: String (required)
  respiratoryRate: Number (required)
  nurseId: String (required)
  timestamps: true
}
```

### DailyActivity Collection
```javascript
{
  patientId: String (required, indexed)
  pulseRate: Number (required)
  bloodPressure: String (required)
  weight: Number (required)
  temperature: Number (required)
  respiratoryRate: Number (required)
  timestamps: true
}
```

### EmergencyAlert Collection
```javascript
{
  patientId: String (required, indexed)
  message: String (required)
  status: String (enum: ['pending', 'responded', 'resolved'])
  responseNotes: String
  timestamps: true
}
```

### Covid19Checklist Collection
```javascript
{
  patientId: String (required, indexed)
  fever: Boolean (required)
  cough: Boolean (required)
  shortnessOfBreath: Boolean (required)
  fatigue: Boolean (required)
  bodyAches: Boolean (required)
  lossOfTasteOrSmell: Boolean (required)
  soreThroat: Boolean (required)
  headache: Boolean (required)
  additionalNotes: String
  timestamps: true
}
```

## Development Tools

### Package Management
- **npm** - Node package manager

### Code Quality
- **ESLint** - JavaScript linting

### Version Control
- **Git** - Source control (recommended)

## Deployment Considerations

### Backend
- Each microservice can be deployed independently
- MongoDB Atlas for cloud database
- Environment variables for configuration
- PM2 for process management

### Frontend
- Each app can be deployed separately
- CDN for static assets
- Environment-specific configs

### Module Federation
- Remotes must be accessible
- Version compatibility important
- Shared dependencies optimization

## Performance Optimizations

### Frontend
- Code splitting via Module Federation
- Lazy loading of remote apps
- React memo for components
- Apollo Client caching

### Backend
- MongoDB indexing on frequently queried fields
- Connection pooling
- GraphQL query optimization
- Stateless authentication (JWT)

## Future Technology Considerations

- **GraphQL Subscriptions** - Real-time updates
- **Redis** - Caching layer
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **TypeScript** - Type safety
- **Jest** - Testing framework
- **React Query** - Alternative to Apollo Client
- **Next.js** - Server-side rendering

## Conclusion

This technology stack provides:
- ✅ Scalability via microservices
- ✅ Modern development via React 18
- ✅ Efficient data fetching via GraphQL
- ✅ Independent deployments via micro-frontends
- ✅ AI capabilities via Gemini API
- ✅ Security via JWT and role-based access
- ✅ Responsive design via Bootstrap 5
