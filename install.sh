#!/bin/bash

echo "======================================"
echo "PatientCare App - Installation Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install backend dependencies
echo "${YELLOW}Installing Auth Microservice dependencies...${NC}"
cd server/microservice/auth-microservice
npm install
echo "${GREEN}✅ Auth Microservice dependencies installed${NC}"
echo ""

echo "${YELLOW}Installing Patient Monitoring Microservice dependencies...${NC}"
cd ../patient-monitoring-microservice
npm install
echo "${GREEN}✅ Patient Monitoring Microservice dependencies installed${NC}"
echo ""

# Install frontend dependencies
echo "${YELLOW}Installing Shell App dependencies...${NC}"
cd ../../../client/shell-app
npm install
echo "${GREEN}✅ Shell App dependencies installed${NC}"
echo ""

echo "${YELLOW}Installing Auth App dependencies...${NC}"
cd ../auth-app
npm install
echo "${GREEN}✅ Auth App dependencies installed${NC}"
echo ""

echo "${YELLOW}Installing Patient App dependencies...${NC}"
cd ../patient-app
npm install
echo "${GREEN}✅ Patient App dependencies installed${NC}"
echo ""

# Return to root directory
cd ../..

echo "======================================"
echo "${GREEN}✅ All dependencies installed successfully!${NC}"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Set up your Gemini API key in server/microservice/patient-monitoring-microservice/.env"
echo "3. Open 5 terminal windows and start each service:"
echo ""
echo "   Terminal 1: cd server/microservice/auth-microservice && npm start"
echo "   Terminal 2: cd server/microservice/patient-monitoring-microservice && npm start"
echo "   Terminal 3: cd client/shell-app && npm run dev"
echo "   Terminal 4: cd client/auth-app && npm run dev"
echo "   Terminal 5: cd client/patient-app && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see README.md"
