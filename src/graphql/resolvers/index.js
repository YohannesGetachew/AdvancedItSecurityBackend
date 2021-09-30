const User = require("../../models/user");
const {
  users,
  whoami,
  createUser,
  login,
  disableUser,
} = require("./userResolver");
const {
  feedbacks,
  createFeedback,
  myFeedbacks,
  editFeedback,
} = require("./feedbackResolver");

const resolvers = {
  Query: {
    users: users,
    whoami: whoami,
    feedbacks: feedbacks,
    myFeedbacks: myFeedbacks,
  },

  Mutation: {
    createUser: createUser,
    login: login,
    disableUser: disableUser,
    createFeedback: createFeedback,
    editFeedback: editFeedback,
  },

  Feedback: {
    user: async (parent) => {
      const userOfFeedback = User.findById(parent.user);
      return userOfFeedback;
    },
  },
};

module.exports = resolvers;
