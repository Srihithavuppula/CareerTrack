const Roadmap = require('../models/Roadmap');
const Course = require('../models/Course');

const calculateProgress = (days) => {
  if (!days || days.length === 0) return 0;
  const completedCount = days.filter((day) => day.completed).length;
  return Math.round((completedCount / days.length) * 100);
};

const buildRoadmapDays = (topics, duration, resources = []) => {
  const cleanTopics = Array.isArray(topics)
    ? topics.map((t) => String(t).trim()).filter(Boolean)
    : [];

  const mockTests = resources.filter((r) => r.type === 'practice');
  const videos = resources.filter((r) => r.type === 'video');
  const docs = resources.filter(
    (r) => r.type !== 'practice' && r.type !== 'video'
  );

  // ── Distribute topics across duration ──────────────────
  const dayPlan = [];

  if (cleanTopics.length === 0) {
    for (let i = 1; i <= duration; i++) {
      dayPlan.push({ day: i, topic: `Day ${i} — Practice & Revision` });
    }
  } else {
    const baseDays = Math.floor(duration / cleanTopics.length);
    const extraDays = duration % cleanTopics.length;
    let dayNum = 1;
    cleanTopics.forEach((topic, index) => {
      const daysForThisTopic = baseDays + (index < extraDays ? 1 : 0);
      for (let d = 0; d < daysForThisTopic; d++) {
        dayPlan.push({ day: dayNum, topic });
        dayNum++;
      }
    });
  }

  // ── Keyword scorer ──────────────────────────────────────
  const scoreResources = (pool, topic) => {
    const stopWords = new Set([
      '&', 'and', 'the', 'of', 'to', 'in', 'a', 'an',
      'with', 'for', 'vs', '-', 'using',
    ]);
    const keywords = topic
      .toLowerCase()
      .split(/[\s,&\-\/\(\)]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !stopWords.has(w));

    return pool
      .map((r) => {
        const haystack = r.title.toLowerCase();
        const score = keywords.filter((kw) => haystack.includes(kw)).length;
        return { resource: r, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  // ── Build final days ────────────────────────────────────
  return dayPlan.map((item, planIndex) => {
    const topic = item.topic;
    const dayResources = [];

    // 1. Get best matched doc/article resources (up to 2)
    const scoredDocs = scoreResources(docs, topic);
    if (scoredDocs.length >= 2) {
      dayResources.push(scoredDocs[0].resource);
      dayResources.push(scoredDocs[1].resource);
    } else if (scoredDocs.length === 1) {
      dayResources.push(scoredDocs[0].resource);
      const fallback = docs.find(
        (r) => r.title !== scoredDocs[0].resource.title
      );
      if (fallback) dayResources.push(fallback);
    } else {
      // No keyword match — take first 2 docs as fallback
      docs.slice(0, 2).forEach((r) => dayResources.push(r));
    }

    // 2. Get best matched YouTube videos (up to 2)
    const scoredVideos = scoreResources(videos, topic);
    if (scoredVideos.length >= 2) {
      dayResources.push(scoredVideos[0].resource);
      dayResources.push(scoredVideos[1].resource);
    } else if (scoredVideos.length === 1) {
      dayResources.push(scoredVideos[0].resource);
      // Add second video by cycling
      const fallbackVideo = videos.find(
        (r) => r.title !== scoredVideos[0].resource.title
      );
      if (fallbackVideo) dayResources.push(fallbackVideo);
    } else if (videos.length > 0) {
      // No keyword match — cycle videos
      const idx = planIndex % videos.length;
      dayResources.push(videos[idx]);
      const idx2 = (planIndex + 1) % videos.length;
      if (videos[idx2]?.title !== videos[idx]?.title) {
        dayResources.push(videos[idx2]);
      }
    }

    // 3. Get best matched mock test (1 per day)
    const scoredMocks = scoreResources(mockTests, topic);
    if (scoredMocks.length > 0) {
      dayResources.push(scoredMocks[0].resource);
    } else if (mockTests.length > 0) {
      const idx = planIndex % mockTests.length;
      dayResources.push(mockTests[idx]);
    }

    return {
      day: item.day,
      topic,
      resources: dayResources,
      completed: false,
    };
  });
};

const createRoadmap = async (req, res, next) => {
  try {
    const { courseId, duration } = req.body;
    if (!courseId || !duration) {
      return res.status(400).json({
        message: 'courseId and duration are required',
      });
    }

    const numericDuration = Number(duration);

    if (![30, 45, 60].includes(numericDuration)) {
      return res.status(400).json({
        message: 'Duration must be 30, 45, or 60',
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    if (
      Array.isArray(course.durationOptions) &&
      course.durationOptions.length > 0 &&
      !course.durationOptions.includes(numericDuration)
    ) {
      return res.status(400).json({
        message: 'Selected duration is not available for this course',
      });
    }

    const existingRoadmap = await Roadmap.findOne({
      user: req.user.id,
      course: courseId,
      duration: numericDuration,
    });

    if (existingRoadmap) {
      return res.status(400).json({
        message: `A ${numericDuration}-day roadmap already exists for this course`,
      });
    }

    const days = buildRoadmapDays(
      course.topics,
      numericDuration,
      course.resources
    );

    const roadmap = await Roadmap.create({
      user: req.user.id,
      course: course._id,
      duration: numericDuration,
      days,
      progress: 0,
    });

    const populatedRoadmap = await Roadmap.findById(roadmap._id).populate(
      'course',
      'title description topics durationOptions resources'
    );

    res.status(201).json({
      message: 'Roadmap created successfully',
      roadmap: populatedRoadmap,
    });
  } catch (error) {
    next(error);
  }
};

const getUserRoadmap = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const roadmap = await Roadmap.findOne({
      user: req.user.id,
      course: courseId,
    }).populate(
      'course',
      'title description topics durationOptions resources'
    );

    if (!roadmap) {
      return res.status(404).json({
        message: 'Roadmap not found for this course',
      });
    }

    res.status(200).json(roadmap);
  } catch (error) {
    next(error);
  }
};

const markDayComplete = async (req, res, next) => {
  try {
    const { roadmapId, dayNumber, completed } = req.body;

    if (!roadmapId || typeof dayNumber !== 'number') {
      return res.status(400).json({
        message: 'roadmapId and dayNumber are required',
      });
    }

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({
        message: 'Roadmap not found',
      });
    }

    if (roadmap.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to update this roadmap',
      });
    }

    const targetDay = roadmap.days.find((day) => day.day === dayNumber);

    if (!targetDay) {
      return res.status(404).json({
        message: 'Day not found in roadmap',
      });
    }

    if (typeof completed === 'boolean') {
      targetDay.completed = completed;
    } else {
      targetDay.completed = !targetDay.completed;
    }

    roadmap.progress = calculateProgress(roadmap.days);

    await roadmap.save();

    const updatedRoadmap = await Roadmap.findById(roadmap._id).populate(
      'course',
      'title description topics durationOptions resources'
    );

    res.status(200).json({
      message: 'Day status updated successfully',
      roadmap: updatedRoadmap,
    });
  } catch (error) {
    next(error);
  }
};

const getUserDashboard = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.id })
      .populate('course', 'title description')
      .sort({ createdAt: -1 });

    const totalRoadmaps = roadmaps.length;
    const completedRoadmaps = roadmaps.filter(
      (r) => r.progress === 100
    ).length;
    const inProgressRoadmaps = roadmaps.filter(
      (r) => r.progress > 0 && r.progress < 100
    ).length;
    const notStartedRoadmaps = roadmaps.filter(
      (r) => r.progress === 0
    ).length;

    res.status(200).json({
      totalRoadmaps,
      completedRoadmaps,
      inProgressRoadmaps,
      notStartedRoadmaps,
      roadmaps,
    });
  } catch (error) {
    next(error);
  }
};

const resetRoadmap = async (req, res, next) => {
  try {
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (roadmap.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to reset this roadmap',
      });
    }

    roadmap.days = roadmap.days.map((day) => ({
      ...day.toObject(),
      completed: false,
    }));

    roadmap.progress = 0;
    await roadmap.save();

    const updatedRoadmap = await Roadmap.findById(roadmap._id).populate(
      'course',
      'title description topics durationOptions resources'
    );

    res.status(200).json({
      message: 'Roadmap reset successfully',
      roadmap: updatedRoadmap,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoadmap = async (req, res, next) => {
  try {
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (roadmap.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to delete this roadmap',
      });
    }

    await roadmap.deleteOne();

    res.status(200).json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getSingleRoadmap = async (req, res, next) => {
  try {
    const { roadmapId } = req.params;

    const roadmap = await Roadmap.findById(roadmapId).populate(
      'course',
      'title description topics durationOptions resources'
    );

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (roadmap.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Not authorized to access this roadmap',
      });
    }

    res.status(200).json(roadmap);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoadmap,
  getUserRoadmap,
  markDayComplete,
  getUserDashboard,
  deleteRoadmap,
  resetRoadmap,
  getSingleRoadmap,
};