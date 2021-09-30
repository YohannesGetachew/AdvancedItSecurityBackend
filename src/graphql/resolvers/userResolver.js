const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  MEMBER_PERMISSIONS,
  ADMIN_PERMISSIONS,
} = require("../authorization/permissions");

exports.users = async (parent, args, { user }) => {
  const { role } = args;
  const filters = { role: "MEMBER" };
  // if (role !== undefined) {
  //   filters.role = role;
  // }
  const users = await User.find(filters);
  return users;
};

exports.whoami = async (parent, args, { user }) => {
  const loggedInUser = await User.findById(user.sub);
  return loggedInUser;
};

exports.createUser = async (parent, args, context, info) => {
  const { firstName, lastName, email, password, role } = args.userInput;
  const isValidName = firstName.length <= 20 && lastName.length <= 20;
  if (!isValidName) throw new Error("Please provide a valid input");
  const emailExpression =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValidEmail = emailExpression.test(String(email).toLowerCase());
  if (!isValidEmail) throw new Error("email in proper format");
  const doesUserWithEmailExist = await User.findOne({ email });
  if (doesUserWithEmailExist) throw new Error("Email already registered");
  const passwordExpression =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;
  const isValidPassword = passwordExpression.test(String(password));
  if (!isValidPassword) throw new Error("Password is weak");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });
  await user.save();
  return user;
};

exports.login = async (parent, { email, password }, context, info) => {
  const userToLogin = await User.findOne({ email });
  if (userToLogin === null) {
    throw new Error("Failed to authenticate");
  }
  const alreadyLoggedUserId = context.sub;
  if (alreadyLoggedUserId === userToLogin._id.toHexString()) {
    throw new Error("Already logged in");
  }
  const validPassword = await bcrypt.compare(password, userToLogin.password);
  if (!validPassword) {
    throw new Error("Failed to authenticate");
  }
  const userId = userToLogin._id.toHexString();
  const userRole = userToLogin.role;
  const graphqlUrl = process.env.GRAPHQL_URL;
  const accessTokenPayload = {};
  accessTokenPayload[graphqlUrl] = {
    role: userRole,
    permissions: getUserPermissions(userRole),
  };
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenUniqueData = {
    algorithm: "HS256",
    subject: userId,
    expiresIn: "1d",
  };
  const accessToken = jwt.sign(
    accessTokenPayload,
    accessTokenSecret,
    accessTokenUniqueData
  );
  return accessToken;
};

exports.disableUser = async (parent, args, context) => {
  const { userId } = args;
  const userToDisable = await User.findById(userId);
  if (userToDisable === null) {
    throw new Error("User found");
  }
  if (userToDisable.role !== "MEMBER") {
    throw new Error("You can disable this user");
  }
  const disabledUser = await User.findByIdAndUpdate(
    userId,
    {
      isActive: false,
    },
    { new: true }
  );
  return disabledUser;
};

const getUserPermissions = (userRole) => {
  if (userRole === "MEMBER") {
    return MEMBER_PERMISSIONS;
  } else if (userRole === "ADMIN") {
    return ADMIN_PERMISSIONS;
  }
  return [];
};
