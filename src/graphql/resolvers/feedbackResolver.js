const Feedback = require("../../models/feedback");

exports.feedbacks = async (parent, args) => {
  const { userId } = args;
  const filters = {};
  if (userId !== undefined) {
    filters.user = userId;
  }
  const feedbacks = await Feedback.find({ ...filters });
  return feedbacks;
};

exports.myFeedbacks = async (parent, args, { user }) => {
  if (args.feedbackId) {
    const feedbacks = await Feedback.find({
      user: user.sub,
      _id: args.feedbackId,
    });
    return feedbacks;
  }
  const feedbacks = await Feedback.find({ user: user.sub });
  return feedbacks;
};

exports.createFeedback = async (parent, args, { user }) => {
  const { file, comment } = args.feedbackInput;
  const updates = { user: user.sub };
  if (file !== undefined) {
    updates.file = file;
  }
  if (comment !== undefined) {
    updates.comment = comment;
  }
  const feedback = new Feedback({ ...updates });
  await feedback.save();
  return feedback;
};

exports.editFeedback = async (parent, args, { user }) => {
  const { file, comment } = args.feedbackInput;
  const feedbackId = args.feedbackId;
  const updates = { user: user.sub };
  if (file !== undefined) {
    updates.file = file;
  }
  if (comment !== undefined) {
    updates.comment = comment;
  }
  try {
    console.log("a");
    const editedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      {
        ...updates,
      },
      { new: true }
    );
    return editedFeedback;
  } catch (err) {
    console.log(err);
  }
};
