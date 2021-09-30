const mongoose = require("mongoose");

const initMongoose = async () => {
  await mongoose.connect("mongodb://localhost/complaintApp", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("Mongoose connected");
};

module.exports = initMongoose;
