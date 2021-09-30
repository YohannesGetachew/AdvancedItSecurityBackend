const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    role: String
    isActive: Boolean
  }

  type Feedback {
    _id: ID
    comment: String
    file: String
    user: User
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
    password: String
    role: String
  }

  input FeedbackInput {
    file: String
    comment: String
  }

  type Query {
    users(role: String): [User]
    whoami: User
    feedbacks(userId: String): [Feedback]
    myFeedbacks(feedbackId: String): [Feedback]
  }

  type Mutation {
    createUser(userInput: UserInput!): User
    login(email: String!, password: String!): String
    disableUser(userId: String!): User
    createFeedback(feedbackInput: FeedbackInput!): Feedback
    editFeedback(feedbackInput: FeedbackInput!, feedbackId: String!): Feedback
  }
`;

module.exports = typeDefs;
