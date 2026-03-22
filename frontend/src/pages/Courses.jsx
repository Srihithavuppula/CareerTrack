import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Clock, ChevronRight,
  Layers, Sparkles, AlertCircle,
} from 'lucide-react';
import api from '../api/axios';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState({});
  const [loading, setLoading] = useState(true);
  const [creatingFor, setCreatingFor] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/courses');
        const courseList = Array.isArray(response.data)
          ? response.data
          : response.data.courses || [];
        setCourses(courseList);
        const defaultDurations = {};
        courseList.forEach((c) => {
          defaultDurations[c._id] = c.durationOptions?.[0] || 30;
        });
        setSelectedDurations(defaultDurations);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleGenerateRoadmap = async (courseId) => {
    try {
      setCreatingFor(courseId);
      setError('');
      const response = await api.post('/roadmaps/create', {
        courseId,
        duration: selectedDurations[courseId],
      });
      navigate(`/roadmap/${response.data.roadmap._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to generate roadmap.'
      );
    } finally {
      setCreatingFor('');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl px-10 py-16 text-center"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)",
        }}
      >
        {/* Soft glow blobs */}
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
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-5"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            <Sparkles size={12} />
            {courses.length} Courses Available
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Build Your Learning
            <br />
            Roadmap Today
          </h1>
          <p className="mt-4 text-blue-100 max-w-lg mx-auto text-base">
            Pick a course, choose your timeline, and get a personalized
            day-by-day plan built around your goals.
          </p>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm text-red-700 bg-red-50 border border-red-200">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* ── Course Grid ──────────────────────────── */}
      {courses.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="font-medium text-slate-500">No courses available yet.</p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="card-hover p-6 flex flex-col">

              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
                >
                  <BookOpen size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-slate-900 leading-snug">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Layers size={12} />
                  {course.topics?.length || 0} topics
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={12} />
                  {course.durationOptions?.join(' / ')} days
                </span>
              </div>

              {/* Topic pills */}
              {course.topics?.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {course.topics.slice(0, 4).map((topic, i) => (
                    <span
                      key={i}
                      className="rounded-lg px-2.5 py-0.5 text-xs font-medium text-blue-700"
                      style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
                    >
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 4 && (
                    <span className="rounded-lg px-2.5 py-0.5 text-xs text-slate-400"
                      style={{ background: "#f8fafc" }}>
                      +{course.topics.length - 4} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex-1" />

              {/* Duration selector */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-slate-500">
                  Select Duration
                </label>
                <div className="flex gap-2">
                  {(course.durationOptions || []).map((duration) => {
                    const isSelected = selectedDurations[course._id] === duration;
                    return (
                      <button
                        key={duration}
                        onClick={() =>
                          setSelectedDurations((prev) => ({
                            ...prev,
                            [course._id]: duration,
                          }))
                        }
                        className="flex-1 rounded-xl py-2 text-xs font-semibold transition-all"
                        style={
                          isSelected
                            ? {
                                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                              }
                            : {
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                color: "#64748b",
                              }
                        }
                      >
                        {duration} days
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleGenerateRoadmap(course._id)}
                disabled={creatingFor === course._id}
                className="btn-primary w-full justify-between"
              >
                <span>
                  {creatingFor === course._id ? 'Generating...' : 'Generate Roadmap'}
                </span>
                {creatingFor !== course._id && <ChevronRight size={15} />}
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default Courses;