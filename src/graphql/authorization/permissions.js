const { rule, and, shield } = require("graphql-shield");

exports.ADMIN_PERMISSIONS = [
  "disable:any_members",
  "read:any_feedback",
  "read:any_user",
];
exports.MEMBER_PERMISSIONS = ["create:feedback", "read:own_feedback"];

const checkPermission = (user, permission) => {
  const graphqlUrl = process.env.GRAPHQL_URL;
  if (user && user[graphqlUrl]) {
    return user[graphqlUrl].permissions.includes(permission);
  }
  return false;
};

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const canDisableAnyMember = rule()((parent, args, { user }) => {
  return checkPermission(user, "disable:any_members");
});

const canCreateFeedback = rule()((parent, args, { user }) => {
  return checkPermission(user, "create:feedback");
});

const canReadAnyFeedback = rule()((parent, args, { user }) => {
  return checkPermission(user, "read:any_feedback");
});

const canReadOwnFeedback = rule()((parent, args, { user }) => {
  return checkPermission(user, "read:own_feedback");
});

const canReadAnyUser = rule()((parent, args, { user }) => {
  return checkPermission(user, "read:any_user");
});
// const canRegister = rule()((parent, args, { user }) => {
//   return checkPermission(user, "register:user");
// });

const isReadingOwnUser = rule()((parent, { id }, { user }) => {
  return user && user.sub === id;
});

exports.permissionShield = shield({
  Query: {
    users: and(canReadAnyUser, isAuthenticated),
    whoami: isAuthenticated,
    feedbacks: and(canReadAnyFeedback, isAuthenticated),
    myFeedbacks: and(canReadOwnFeedback, isAuthenticated),
  },

  Mutation: {
    disableUser: and(canDisableAnyMember, isAuthenticated),
    createFeedback: and(canCreateFeedback, isAuthenticated),
    editFeedback: and(canCreateFeedback, isAuthenticated),
  },
});
