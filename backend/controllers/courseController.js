const Course = require("../models/Course");

// Create course
const createCourse = async (req, res, next) => {
  try {
    const { title, description, topics, durationOptions, resources } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const normalizedTopics = Array.isArray(topics)
      ? topics.map((topic) => String(topic).trim()).filter(Boolean)
      : [];

    const normalizedResources = Array.isArray(resources)
      ? resources.map((resource) => ({
          title: resource.title?.trim(),
          link: resource.link?.trim(),
          type: resource.type || "other",
        })).filter((resource) => resource.title && resource.link)
      : [];

    const course = await Course.create({
      title: title.trim(),
      description: description?.trim() || "",
      topics: normalizedTopics,
      durationOptions:
        Array.isArray(durationOptions) && durationOptions.length > 0
          ? durationOptions
          : [30, 45, 60],
      resources: normalizedResources,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

// Get all courses
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// Get single course
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// Update course
const updateCourse = async (req, res, next) => {
  try {
    const { title, description, topics, durationOptions, resources } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (title !== undefined) {
      course.title = title.trim();
    }

    if (description !== undefined) {
      course.description = description.trim();
    }

    if (Array.isArray(topics)) {
      course.topics = topics.map((topic) => String(topic).trim()).filter(Boolean);
    }

    if (Array.isArray(durationOptions) && durationOptions.length > 0) {
      course.durationOptions = durationOptions;
    }

    if (Array.isArray(resources)) {
      course.resources = resources
        .map((resource) => ({
          title: resource.title?.trim(),
          link: resource.link?.trim(),
          type: resource.type || "other",
        }))
        .filter((resource) => resource.title && resource.link);
    }

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

// Delete course
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};