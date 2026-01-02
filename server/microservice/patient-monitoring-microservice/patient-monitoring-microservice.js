import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import connectDB from './config/mongoose.js';
import monitoringTypeDefs from './typeDefs/monitoringTypeDefs.js';
import monitoringResolvers from './resolvers/monitoringResolvers.js';

const JWT_SECRET = 'your-secret-key-change-in-production';
const PORT = 4002;

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'https://studio.apollographql.com'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

connectDB();

const server = new ApolloServer({
  typeDefs: monitoringTypeDefs,
  resolvers: monitoringResolvers,
  context: ({ req, res }) => {
    let token = req.cookies['token'];

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }

    let user = null;
    if (token) {
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        console.log('Invalid token');
      }
    }

    return { req, res, user };
  }
});

await server.start();
server.applyMiddleware({ app, cors: false });

app.listen(PORT, () => {
  console.log(`🚀 Patient Monitoring Microservice ready at http://localhost:${PORT}${server.graphqlPath}`);
});
