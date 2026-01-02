import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import connectDB from './config/mongoose.js';
import authTypeDefs from './typeDefs/authTypeDefs.js';
import authResolvers from './resolvers/authResolvers.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PORT = 4001;

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'https://studio.apollographql.com'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

connectDB();

const server = new ApolloServer({
  typeDefs: authTypeDefs,
  resolvers: authResolvers,
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
  console.log(`Auth Microservice ready at http://localhost:${PORT}${server.graphqlPath}`);
});
