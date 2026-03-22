const MockTest = require('../models/MockTest');
const MockTestAttempt = require('../models/MockTestAttempt');

const getAllMockTests = async (req, res, next) => {
  try {
    const tests = await MockTest.find()
      .select('courseTitle course createdAt questions')
      .sort({ courseTitle: 1 });

    const result = tests.map((t) => ({
      _id: t._id,
      course: t.course,
      courseTitle: t.courseTitle,
      questionCount: t.questions.length,
      createdAt: t.createdAt,
    }));

    res.status(200).json({ tests: result });
  } catch (error) {
    next(error);
  }
};

const getMockTest = async (req, res, next) => {
  try {
    const test = await MockTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    const questions = test.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      type: q.type,
      options: q.options,
    }));

    res.status(200).json({
      _id: test._id,
      courseTitle: test.courseTitle,
      course: test.course,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

const submitMockTest = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }

    let correct = 0;
    const results = test.questions.map((q) => {
      const submitted = answers.find((a) => a.questionId === q._id.toString());
      const userAnswer = submitted?.answer || '';
      const isCorrect =
        userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
      if (isCorrect) correct++;
      return {
        _id: q._id,
        question: q.question,
        type: q.type,
        options: q.options,
        userAnswer,
        correctAnswer: q.answer,
        explanation: q.explanation,
        isCorrect,
      };
    });

    const score = Math.round((correct / test.questions.length) * 100);

    // ── Save attempt ──────────────────────────────────
    await MockTestAttempt.create({
      user: req.user.id,
      mockTest: test._id,
      courseTitle: test.courseTitle,
      score,
      correctAnswers: correct,
      totalQuestions: test.questions.length,
    });

    res.status(200).json({
      courseTitle: test.courseTitle,
      totalQuestions: test.questions.length,
      correctAnswers: correct,
      score,
      results,
    });
  } catch (error) {
    next(error);
  }
};

const getUserAttempts = async (req, res, next) => {
  try {
    const attempts = await MockTestAttempt.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ attempts });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMockTests,
  getMockTest,
  submitMockTest,
  getUserAttempts,
};