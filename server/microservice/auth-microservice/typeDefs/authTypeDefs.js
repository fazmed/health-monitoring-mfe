import { gql } from 'apollo-server-express';

const authTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    firstName: String!
    lastName: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getCurrentUser: User
    getUserById(id: ID!): User
    getAllPatients: [User!]!
    getAllNurses: [User!]!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      role: String!
      firstName: String!
      lastName: String!
    ): AuthPayload!

    login(
      email: String!
      password: String!
    ): AuthPayload!

    logout: Boolean!
  }
`;

export default authTypeDefs;
