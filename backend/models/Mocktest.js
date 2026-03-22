const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'truefalse'],
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: true }
);

const mockTestSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MockTest', mockTestSchema);