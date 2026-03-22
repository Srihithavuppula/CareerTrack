const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["video", "article", "documentation", "practice", "other"],
      default: "other",
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    topics: {
      type: [String],
      default: [],
    },
    durationOptions: {
      type: [Number],
      default: [30, 45, 60],
      validate: {
        validator: function (arr) {
          return arr.every((val) => [30, 45, 60].includes(val));
        },
        message: "Duration options can only be 30, 45, or 60",
      },
    },
    resources: {
      type: [resourceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);