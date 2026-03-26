import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, Send,
  Trophy, RotateCcw, BookOpen,
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

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/mocktests/${testId}`);
        setTest(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load test.');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  // Attempt to fetch last attempted result from localStorage
  useEffect(() => {
    const storedResult = localStorage.getItem(`mocktest_result_${testId}`);
    if (storedResult) {
      try {
        setLastResult(JSON.parse(storedResult));
      } catch {}
    }
  }, [testId]);

  // Store current result in localStorage whenever it changes and submitted is true
  useEffect(() => {
    if (submitted && results) {
      localStorage.setItem(
        `mocktest_result_${testId}`,
        JSON.stringify(results)
      );
      setLastResult(results);
    }
  }, [submitted, results, testId]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Utility for reusing the All Tests Exit modal component
  const ExitModal = ({
    open,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
    title,
    message
  }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
        <div className="bg-white card p-6 w-full max-w-sm shadow-xl rounded-xl text-center">
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <p className="text-slate-600 mb-4">
            {message}
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              onClick={onConfirm}
              className="btn-primary"
              style={{ minWidth: 80 }}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onCancel}
              className="btn-secondary"
              style={{ minWidth: 80 }}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // This utility handles submitting answers (for main submit & "exit and submit partial result")
  const submitAnswers = async ({ showResultAfterSubmit = false } = {}) => {
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
      if (showResultAfterSubmit) {
        setShowResultAfterExit(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit test.');
      if (showResultAfterSubmit) {
        setShowResultAfterExit(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!test) return;

    const unanswered = test.questions.filter((q) => !answers[q._id]);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirmSubmit) return;
    }
    await submitAnswers();
  };

  // Add retake test functionality
  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setResults(null);
    setShowReview(false);
    setShowResultAfterExit(false);
    setError('');
    // Optionally re-fetch the latest test data if desired, uncomment the next lines:
    // setLoading(true);
    // API.get(`/mocktests/${testId}`).then(res => {
    //   setTest(res.data);
    //   setLoading(false);
    // });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExit = () => {
    // If user hasn't answered any question, just navigate quietly
    if (Object.keys(answers).length === 0 && !submitted) {
      navigate('/mocktests');
    } else {
      setShowExitConfirm(true);
    }
  };

  const confirmExit = () => {
    // Don't save anything, just go back to tests
    setShowExitConfirm(false);
    navigate('/mocktests');
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  // New: Handler for "All Tests" button in header or result page
  const handleAllTestsClick = () => {
    // If user hasn't answered anything and hasn't submitted, just go
    if (Object.keys(answers).length === 0 && !submitted) {
      navigate('/mocktests');
    } else if (!submitted) {
      // Show exit modal - "Do you want to exit test?"
      setShowAllTestsExitConfirm(true);
    } else {
      // Already submitted, just go
      navigate('/mocktests');
    }
  };

  // When user confirms exit on "All Tests" modal, show the result card instead of discarding
  const confirmAllTestsExit = async () => {
    setShowAllTestsExitConfirm(false);

    // If already submitted, just show last result if it exists
    if (submitted && results) {
      setShowResultAfterExit(true);
      return;
    }

    // Try to submit the current answers as a result for partial test if any answers exist
    // Or show previous result if lastResult exists
    if (Object.keys(answers).length === 0) {
      // No answers, just show last result if any
      setShowResultAfterExit(true);
      return;
    }

    await submitAnswers({ showResultAfterSubmit: true });
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
  const progressPct = totalQuestions > 0
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  // ── Loading ──────────────────────────────────────────
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

  // Always show the previous result card if not yet attempted this session,
  // OR if result is forced after exit (showResultAfterExit)
  if (
    (lastResult && !submitted && Object.keys(answers).length === 0 && !showResultAfterExit) ||
    (submitted && results) ||
    showResultAfterExit
  ) {
    // Determine which result to use
    let usedResults = null;
    if (showResultAfterExit) {
      usedResults = results || lastResult || null;
    } else {
      usedResults = submitted && results ? results : lastResult;
    }
    if (!usedResults) {
      // If no result is available, show All Tests page
      navigate('/mocktests');
      return null;
    }
    const { score, correctAnswers, totalQuestions: total, results: qResults } = usedResults;
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
            <p className="mt-1 text-slate-500">{usedResults.courseTitle}</p>

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
              <button
                type="button"
                onClick={() => {
                  handleRetake();
                }}
                className="btn-secondary"
              >
                <RotateCcw size={15} />
                Retake Test
              </button>
              <button
                type="button"
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
                  key={q._id}
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
        <ExitModal
          open={showAllTestsExitConfirm}
          onConfirm={confirmAllTestsExit}
          onCancel={cancelAllTestsExit}
          title="Do you want to exit test?"
          message="If you exit now, your current answers will be submitted for result and you can view your score."
          confirmLabel="Yes, Exit & Show Result"
          cancelLabel="Cancel"
        />
      </div>
    );
  }

  // ── Test Page ────────────────────────────────────────
  const currentQuestion = test.questions[currentIndex];
  const isAnswered = !!answers[currentQuestion._id];
  const selectedAnswer = answers[currentQuestion._id];

  return (
    <div className="space-y-6 py-6">

      {/* Exit Modal */}
      <ExitModal
        open={showExitConfirm}
        onConfirm={confirmExit}
        onCancel={cancelExit}
        title="Want to exit the test?"
        message="If you exit, your answers will not be saved and you will lose your progress for this attempt."
        confirmLabel="Yes, Exit"
        cancelLabel="Cancel"
      />

      {/* All Tests Exit Modal for Header button */}
      <ExitModal
        open={showAllTestsExitConfirm}
        onConfirm={confirmAllTestsExit}
        onCancel={cancelAllTestsExit}
        title="Do you want to exit test?"
        message="If you exit now, your current answers will be submitted for result and you can view your score."
        confirmLabel="Yes, Exit & Show Result"
        cancelLabel="Cancel"
      />

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
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              return (
                <button
                  key={i}
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