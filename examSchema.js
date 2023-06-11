const mongoose = require("mongoose");


const TestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeLimit: {
    type: Number, // time limit in minutes
    required: true,
  },
  createdBy: {
    type: String, //User name
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, //User ID who created
    ref: "UserInfo",
    required: true,
  },
  createdAt: {
    type: Date, //created At
    required: true,
  },

  testPassword:String,

  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tests: [TestSchema],
});

const ExamSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
});

const Test = mongoose.model("Test", TestSchema);
const Subject = mongoose.model("Subject", SubjectSchema);
const Exam = mongoose.model("Exam", ExamSchema);

module.exports = { Test, Subject, Exam };
