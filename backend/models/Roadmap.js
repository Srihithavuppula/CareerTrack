const mongoose = require('mongoose');

const roadmapDaySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      default: 'Self-study / revision / practice',
    },
    resources: [
      {
        title: {
          type: String,
          default: '',
          trim: true,
        },
        link: {
          type: String,
          default: '',
          trim: true,
        },
        type: {
          type: String,
          enum: ['video', 'article', 'documentation', 'practice', 'other'],
          default: 'other',
        },
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      enum: [30, 45, 60],
    },
    days: {
      type: [roadmapDaySchema],
      default: [],
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
roadmapSchema.index({ user: 1, course: 1, duration: 1 }, { unique: true });
module.exports = mongoose.model('Roadmap', roadmapSchema);