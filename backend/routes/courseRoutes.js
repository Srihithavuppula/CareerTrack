const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ── Create course (admin only) ────────────────────────────
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, topics, durationOptions, resources } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const course = await Course.create({
      title,
      description,
      topics,
      durationOptions,
      resources,
    });

    res.status(201).json(course);
  } catch (err) {
    console.error('Create course error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Update course (admin only) ────────────────────────────
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, topics, durationOptions, resources } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, topics, durationOptions, resources },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete course (admin only) ────────────────────────────
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get all courses (public) ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get course by ID (public) ─────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;