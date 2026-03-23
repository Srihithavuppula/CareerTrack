import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Send,
  Trophy, RotateCcw, BookOpen, AlertTriangle,
} from 'lucide-react';
import API from '../api/axios';

function MockTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Test state
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [showReview, setShowReview] = useState(false);

  // Track if the exit modal is open
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Track if the user has ever submitted a test (for showing the last result)
  const [lastResult, setLastResult] = useState(null);

  // Exit modal for All Tests button when in test mode
  const [showAllTestsExitConfirm, setShowAllTestsExitConfirm] = useState(false);
  // When displaying the result after exit, allow showing the card
  const [showResultAfterExit, setShowResultAfterExit] = useState(false);

  // Blocker modal state (React Router useBlocker)
  const [showBlockerModal, setShowBlockerModal] = useState(false);

  // Block React Router navigation when test is in progress
  const isTestInProgress = !submitted && Object.keys(answers).length > 0;

  // Defensive: useBlocker hook might be undefined in old react-router
  const blocker = useBlocker
    ? useBlocker(
        useCallback(
          ({ currentLocation, nextLocation }) =>
            isTestInProgress && currentLocation.pathname !== nextLocation.pathname,
          [isTestInProgress]
        )
      )
    : { state: 'unblocked', reset: null, proceed: null };

  // Debug: Log blocker changes
  useEffect(() => {
    // Uncomment for debugging blocker
    // console.log(`Blocker State: ${blocker.state}`);
    if (blocker.state === 'blocked') {
      setShowBlockerModal(true);
    }
  }, [blocker.state]);

  // Warn on browser tab close / refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isTestInProgress) {
        e.preventDefault();
        e.returnValue = ''; // For Chrome
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isTestInProgress]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/mocktests/${testId}`);
        if (!res.data || !res.data.questions) {
          setError('Malformed test data.');
        } else {
          setTest(res.data);
        }
      } catch (err) {
        let msg;
        if (err?.response?.data?.message) {
          msg = err.response.data.message;
        } else if (err.message) {
          msg = err.message;
        } else {
          msg = 'Failed to load test.';
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    if (testId) {
      fetchTest();
    } else {
      setError('Missing test ID.');
      setLoading(false);
    }
  }, [testId]);

  // Defensive: lastResult parse
  useEffect(() => {
    const storedResult = localStorage.getItem(`mocktest_result_${testId}`);
    if (storedResult) {
      try {
        setLastResult(JSON.parse(storedResult));
      } catch (e) {
        // Corrupted or invalid data in localStorage -- remove it
        localStorage.removeItem(`mocktest_result_${testId}`);
      }
    }
  }, [testId]);

  useEffect(() => {
    if (submitted && results) {
      try {
        localStorage.setItem(
          `mocktest_result_${testId}`,
          JSON.stringify(results)
        );
        setLastResult(results);
      } catch (err) {
        // Storage can fail (quota, etc)
        // Optionally alert user
      }
    }
  }, [submitted, results, testId]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!test || !test.questions) return;

    const unanswered = test.questions.filter((q) => !answers[q._id]);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);
      const payload = test.questions.map((q) => ({
        questionId: q._id,
        answer: answers[q._id] || '',
      }));
      const res = await API.post(`/mocktests/${testId}/submit`, {
        answers: payload,
      });
      setResults(res.data);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      let msg;
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      } else {
        msg = 'Failed to submit test.';
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setResults(null);
    setShowReview(false);
    setShowResultAfterExit(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExit = () => {
    if (Object.keys(answers).length === 0 && !submitted) {
      navigate('/mocktests');
    } else {
      setShowExitConfirm(true);
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    navigate('/mocktests');
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  // Handler for "All Tests" button in header or result page
  const handleAllTestsClick = () => {
    if (Object.keys(answers).length === 0 && !submitted) {
      navigate('/mocktests');
    } else if (!submitted) {
      setShowAllTestsExitConfirm(true);
    } else {
      navigate('/mocktests');
    }
  };

  // When user confirms exit on "All Tests" modal
  const confirmAllTestsExit = async () => {
    setShowAllTestsExitConfirm(false);

    // Defensive: Only submit if test/questions exist
    if (submitted && results) {
      setShowResultAfterExit(true);
      return;
    }

    if (Object.keys(answers).length === 0) {
      setShowResultAfterExit(true);
      return;
    }

    if (!test || !test.questions) {
      setShowResultAfterExit(true);
      return;
    }

    try {
      setSubmitting(true);
      const payload = test.questions.map((q) => ({
        questionId: q._id,
        answer: answers[q._id] || '',
      }));
      const res = await API.post(`/mocktests/${testId}/submit`, {
        answers: payload,
      });
      setResults(res.data);
      setSubmitted(true);
      setShowResultAfterExit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setShowResultAfterExit(true);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelAllTestsExit = () => {
    setShowAllTestsExitConfirm(false);
  };

  // Back to dashboard handler
  const handleBackToDashboard = () => {
    navigate('/');
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = test?.questions?.length || 0;
  const progressPct =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0;

  // Defensive: Helper to check for valid currentQuestion
  const hasQuestion = test && test.questions && test.questions.length > 0 && currentIndex >= 0 && currentIndex < test.questions.length;
  const currentQuestion = hasQuestion ? test.questions[currentIndex] : null;
  const isAnswered = currentQuestion ? !!answers[currentQuestion._id] : false;
  const selectedAnswer = currentQuestion ? answers[currentQuestion._id] : null;

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">Loading test...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card px-8 py-6 text-center">
          <p className="font-medium text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/mocktests')} className="btn-primary">
            Back to Tests
          </button>
          <button
            onClick={handleBackToDashboard}
            className="btn-secondary ml-2"
            style={{ marginTop: "12px" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Defensive: If no questions
  if (!hasQuestion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card px-8 py-6 text-center">
          <p className="font-medium text-red-600 mb-4">No questions found for this test.</p>
          <button onClick={() => navigate('/mocktests')} className="btn-primary">
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  // Show previous result, or after submit, or after AllTests exit
  if (
    (lastResult && !submitted && Object.keys(answers).length === 0 && !showResultAfterExit) ||
    (submitted && results) ||
    showResultAfterExit
  ) {
    let usedResults = null;
    if (showResultAfterExit) {
      usedResults = results || lastResult || null;
    } else {
      usedResults = submitted && results ? results : lastResult;
    }
    // Defensive: Results structure check
    if (!usedResults || typeof usedResults !== 'object' || usedResults.score === undefined) {
      navigate('/mocktests');
      return null;
    }
    const {
      score,
      correctAnswers = 0,
      totalQuestions: total = 0,
      results: qResults = [],
      courseTitle = '',
    } = usedResults;
    const grade =
      score >= 90 ? { label: 'Excellent', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' } :
      score >= 75 ? { label: 'Good', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' } :
      score >= 50 ? { label: 'Average', color: '#d97706', bg: '#fffbeb', border: '#fde68a' } :
      { label: 'Needs Improvement', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };

    return (
      <div className="space-y-6 py-6">
        {/* Score Card */}
        <div className="card overflow-hidden">
          <div
            className="h-2 w-full"
            style={{ background: "linear-gradient(90deg,#2563eb,#7c3aed)" }}
          />
          <div className="p-8 text-center">
            <div
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: grade.bg, border: `2px solid ${grade.border}` }}
            >
              <Trophy size={36} style={{ color: grade.color }} />
            </div>
            <p className="section-label mb-2">Test Completed</p>
            <h1 className="text-4xl font-bold text-slate-900">{score}%</h1>
            <p className="mt-1 text-slate-500">{courseTitle}</p>
            <div
              className="inline-flex items-center gap-2 mt-3 rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{ background: grade.bg, color: grade.color, border: `1px solid ${grade.border}` }}
            >
              {grade.label}
            </div>
            {/* Score breakdown */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Total', value: total, color: '#64748b' },
                { label: 'Correct', value: correctAnswers, color: '#059669' },
                { label: 'Wrong', value: total - correctAnswers, color: '#dc2626' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4"
                  style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}
                >
                  <p className="text-2xl font-bold" style={{ color: s.color }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="mt-6 progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${score}%`,
                  background:
                    score >= 75
                      ? "linear-gradient(90deg,#10b981,#059669)"
                      : score >= 50
                      ? "linear-gradient(90deg,#f59e0b,#d97706)"
                      : "linear-gradient(90deg,#ef4444,#dc2626)",
                }}
              />
            </div>
            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              <button onClick={handleRetake} className="btn-secondary">
                <RotateCcw size={15} />
                Retake Test
              </button>
              <button
                onClick={() => setShowReview(true)}
                className="btn-primary"
              >
                <BookOpen size={15} />
                Review Answers
              </button>
              <button
                onClick={handleAllTestsClick}
                className="btn-secondary"
              >
                All Tests
              </button>
              <button
                onClick={handleBackToDashboard}
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
        {/* Review Section */}
        {showReview && qResults && (
          <div className="card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Answer Review
            </h2>
            <div className="space-y-4">
              {qResults.map((q, index) => (
                <div
                  key={q._id || index}
                  className="rounded-2xl p-5"
                  style={
                    q.isCorrect
                      ? { background: '#f0fdf4', border: '1px solid #bbf7d0' }
                      : { background: '#fef2f2', border: '1px solid #fecaca' }
                  }
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                      style={
                        q.isCorrect
                          ? { background: '#10b981', color: '#fff' }
                          : { background: '#dc2626', color: '#fff' }
                      }
                    >
                      {q.isCorrect
                        ? <CheckCircle2 size={16} />
                        : <XCircle size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-400 mb-1">
                        Question {index + 1}
                      </p>
                      <p className="font-semibold text-slate-900 mb-3">
                        {q.question}
                      </p>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 w-28 shrink-0">Your answer:</span>
                          <span
                            className="font-medium"
                            style={{ color: q.isCorrect ? '#059669' : '#dc2626' }}
                          >
                            {q.userAnswer || '(not answered)'}
                          </span>
                        </div>
                        {!q.isCorrect && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 w-28 shrink-0">Correct answer:</span>
                            <span className="font-medium text-green-700">
                              {q.correctAnswer}
                            </span>
                          </div>
                        )}
                        {q.explanation && (
                          <div
                            className="mt-2 rounded-xl p-3 text-xs text-slate-600"
                            style={{ background: 'rgba(255,255,255,0.7)' }}
                          >
                            💡 {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* All Tests Exit Modal Overlay (for after "All Tests" click): */}
        {showAllTestsExitConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white card p-6 w-full max-w-sm shadow-xl rounded-xl text-center">
              <h2 className="text-lg font-bold mb-2">Do you want to exit test?</h2>
              <p className="text-slate-600 mb-4">
                If you exit now, your current answers will be submitted for result and you can view your score.
              </p>
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={confirmAllTestsExit}
                  className="btn-primary"
                  style={{ minWidth: 80 }}
                >
                  Yes, Exit & Show Result
                </button>
                <button
                  onClick={cancelAllTestsExit}
                  className="btn-secondary"
                  style={{ minWidth: 80 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Test Page
  return (
    <div className="space-y-6 py-6">
      {/* Blocker Modal */}
      {showBlockerModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
          <div
            className="bg-white w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden"
            style={{ border: '1px solid #e2e8f0' }}
          >
            {/* Top accent bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: "linear-gradient(90deg,#f59e0b,#ef4444)" }}
            />
            <div className="p-6 text-center">
              {/* Warning icon */}
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: '#fffbeb', border: '2px solid #fde68a' }}
              >
                <AlertTriangle size={28} style={{ color: '#d97706' }} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Exit without submitting?
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                You have <span className="font-semibold text-slate-700">{answeredCount} answered</span> question(s).
                If you leave now, your progress will <span className="font-semibold text-red-600">not be saved</span> and this attempt will be lost.
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setShowBlockerModal(false);
                    blocker.reset && blocker.reset();
                  }}
                  className="btn-primary w-full"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    justifyContent: 'center',
                  }}
                  tabIndex={0}
                >
                  Continue Test
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                  style={{
                    background: "linear-gradient(135deg,#059669,#047857)",
                    color: '#fff',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                  tabIndex={0}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Send size={14} />
                    {submitting ? 'Submitting...' : 'Submit & Exit'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setShowBlockerModal(false);
                    blocker.proceed && blocker.proceed();
                  }}
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-700 hover:bg-slate-50"
                  style={{ border: '1.5px solid #e2e8f0' }}
                  tabIndex={0}
                >
                  Leave anyway (discard progress)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white card p-6 w-full max-w-sm shadow-xl rounded-xl text-center">
            <h2 className="text-lg font-bold mb-2">Want to exit the test?</h2>
            <p className="text-slate-600 mb-4">
              If you exit, your answers will not be saved and you will lose your progress for this attempt.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={confirmExit}
                className="btn-primary"
                style={{ minWidth: 80 }}
              >
                Yes, Exit
              </button>
              <button
                onClick={cancelExit}
                className="btn-secondary"
                style={{ minWidth: 80 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Tests Exit Modal for Header button */}
      {showAllTestsExitConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white card p-6 w-full max-w-sm shadow-xl rounded-xl text-center">
            <h2 className="text-lg font-bold mb-2">Do you want to exit test?</h2>
            <p className="text-slate-600 mb-4">
              If you exit now, your current answers will be submitted for result and you can view your score.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={confirmAllTestsExit}
                className="btn-primary"
                style={{ minWidth: 80 }}
              >
                Yes, Exit & Show Result
              </button>
              <button
                onClick={cancelAllTestsExit}
                className="btn-secondary"
                style={{ minWidth: 80 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleAllTestsClick}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={15} />
          All Tests
        </button>
        <span className="text-sm font-medium text-slate-500">
          {answeredCount}/{totalQuestions} answered
        </span>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700">
            {test.courseTitle}
          </p>
          <span className="text-sm font-bold text-blue-700">{progressPct}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg,#2563eb,#7c3aed)",
            }}
          />
        </div>
        {/* Question dots */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {test.questions.map((q, i) => (
            <button
              key={q._id}
              onClick={() => setCurrentIndex(i)}
              className="h-6 w-6 rounded-md text-xs font-semibold transition"
              style={
                i === currentIndex
                  ? { background: '#2563eb', color: '#fff' }
                  : answers[q._id]
                  ? { background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }
                  : { background: '#f1f5f9', color: '#94a3b8' }
              }
              aria-label={"Go to Question " + (i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="card overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg,#2563eb,#7c3aed)" }}
        />
        <div className="p-8">
          {/* Question number + type badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="section-label">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={
                currentQuestion.type === 'mcq'
                  ? { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }
                  : { background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }
              }
            >
              {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'True / False'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-relaxed mb-8">
            {currentQuestion.question}
          </h2>
          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const key = typeof option === 'string' ? option : i;
              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(currentQuestion._id, option)}
                  className="w-full text-left rounded-2xl p-4 transition-all"
                  style={
                    isSelected
                      ? {
                          background: '#eff6ff',
                          border: '2px solid #2563eb',
                          color: '#1d4ed8',
                        }
                      : {
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          color: '#374151',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#bfdbfe';
                      e.currentTarget.style.background = '#f0f9ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#f8fafc';
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                      style={
                        isSelected
                          ? { background: '#2563eb', color: '#fff' }
                          : { background: '#e2e8f0', color: '#64748b' }
                      }
                    >
                      {['A', 'B', 'C', 'D'][i] || i + 1}
                    </div>
                    <span className="font-medium">{option}</span>
                    {isSelected && (
                      <CheckCircle2
                        size={18}
                        className="ml-auto shrink-0"
                        style={{ color: '#2563eb' }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span className="text-sm text-slate-400">
          {currentIndex + 1} / {totalQuestions}
        </span>
        {currentIndex < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentIndex((p) => p + 1)}
            className="btn-primary"
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
            style={{
              background: "linear-gradient(135deg,#059669,#047857)",
              boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
            <Send size={15} />
          </button>
        )}
      </div>
      {/* Submit from anywhere */}
      {answeredCount > 0 && answeredCount < totalQuestions && (
        <div className="card p-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {totalQuestions - answeredCount} questions remaining
          </p>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-secondary text-sm"
          >
            <Send size={14} />
            Submit Now
          </button>
        </div>
      )}
    </div>
  );
}

export default MockTestPage;