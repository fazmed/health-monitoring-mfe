import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authResolvers = {
  Query: {
    getCurrentUser: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      const currentUser = await User.findById(user.id);
      return currentUser;
    },

    getUserById: async (_, { id }) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },

    getAllPatients: async (_, __, { user }) => {
      if (!user) {
        throw new Error('You must be logged in');
      }
  
      // Only nurses should see all patients
      if (user.role !== 'nurse') {
        throw new Error('Only nurses can view all patients');
      }
      const patients = await User.find({ role: 'patient' }).sort({ createdAt: -1 });
      return patients;
    },

    getAllNurses: async () => {

      if (!user) {
        throw new Error('You must be logged in');
      }
      //commented off since (e.g., patients might need to contact a nurse)
      //if (user.role !== 'nurse') {
      //  throw new Error('Only nurses can view nurse list');
      //}
      const nurses = await User.find({ role: 'nurse' }).sort({ createdAt: -1 });
      return nurses;
    }
  },

  Mutation: {
    register: async (_, { username, email, password, role, firstName, lastName }, { res }) => {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName
      });

      await user.save();

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
      });

      return {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        }
      };
    },

    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User does not exist');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
      });

      return {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        }
      };
    },

    logout: async (_, __, { res }) => {
      res.clearCookie('token', { path: '/' });
      return true;
    }
  }
};

export default authResolvers;
