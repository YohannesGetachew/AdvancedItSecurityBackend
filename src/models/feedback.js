const mongoose = require("mongoose");
const User = require("./user");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  file: {
    type: String,
  },
  comment: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});

const Feedback = mongoose.model("feedback", FeedbackSchema);

module.exports = Feedback;
