const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["MEMBER", "ADMIN"],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
