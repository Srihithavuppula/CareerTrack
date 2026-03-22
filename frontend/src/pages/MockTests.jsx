import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, ChevronRight, ClipboardList,
  CheckCircle2, AlertCircle,
} from 'lucide-react';
import API from '../api/axios';

function MockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const res = await API.get('/mocktests');
        setTests(res.data.tests || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load mock tests.');
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">Loading mock tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6">

      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl px-10 py-16 text-center"
        style={{
          background: "linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#7c3aed 100%)",
        }}
      >
        <div style={{
          position: 'absolute', top: '-40px', left: '-40px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', right: '-40px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', filter: 'blur(60px)',
        }} />

        <div className="relative">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <ClipboardList size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Mock Test Center
          </h1>
          <p className="mt-4 text-blue-100 max-w-lg mx-auto text-base">
            Test your knowledge with real evaluation questions — basic,
            intermediate, and advanced — for each course.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              30 questions per course
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              MCQ + True/False
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              Instant results
            </span>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm text-red-700 bg-red-50 border border-red-200">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Tests Grid */}
      {tests.length === 0 ? (
        <div className="card p-16 text-center">
          <ClipboardList size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="font-medium text-slate-500">No mock tests available yet.</p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test, index) => (
            <div
              key={test._id}
              className="card-hover p-6 flex flex-col"
            >
              {/* Icon + Title */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white text-lg font-bold"
                  style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-slate-900 leading-snug">
                    {test.courseTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {test.questionCount} questions · MCQ & True/False
                  </p>
                </div>
              </div>

              {/* Difficulty badges */}
              <div className="mb-5 flex flex-wrap gap-2">
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-medium"
                  style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}
                >
                  Basic
                </span>
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-medium"
                  style={{ background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}
                >
                  Intermediate
                </span>
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-medium"
                  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                >
                  Advanced
                </span>
              </div>

              <div className="flex-1" />

              {/* Stats row */}
              <div
                className="mb-4 flex items-center gap-4 rounded-xl p-3"
                style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-blue-500" />
                  <span className="text-xs text-slate-600">
                    {Math.round(test.questionCount / 3)} per level
                  </span>
                </div>
                <div className="h-3 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <ClipboardList size={14} className="text-purple-500" />
                  <span className="text-xs text-slate-600">
                    Score shown after submit
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate(`/mocktests/${test._id}`)}
                className="btn-primary w-full justify-between"
              >
                <span>Start Test</span>
                <ChevronRight size={15} />
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default MockTests;