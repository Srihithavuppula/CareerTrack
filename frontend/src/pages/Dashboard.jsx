import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, CheckCircle2, Clock,
  ChevronRight, Trophy, Flame,
  Circle, LayoutDashboard, Plus,
  ClipboardList, Target,
} from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [dashRes, attemptsRes] = await Promise.all([
          API.get('/roadmaps/dashboard/all'),
          API.get('/mocktests/attempts'),
        ]);
        setDashboardData(dashRes.data);
        setAttempts(attemptsRes.data.attempts || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card px-8 py-6 text-center">
          <p className="font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Roadmaps',
      value: dashboardData?.totalRoadmaps || 0,
      icon: <BookOpen size={20} />,
      iconBg: "linear-gradient(135deg,#2563eb,#1d4ed8)",
      iconShadow: "0 4px 12px rgba(37,99,235,0.3)",
      valueBg: "#eff6ff",
      valueColor: "#1d4ed8",
    },
    {
      label: 'Completed',
      value: dashboardData?.completedRoadmaps || 0,
      icon: <Trophy size={20} />,
      iconBg: "linear-gradient(135deg,#10b981,#059669)",
      iconShadow: "0 4px 12px rgba(16,185,129,0.3)",
      valueBg: "#f0fdf4",
      valueColor: "#059669",
    },
    {
      label: 'In Progress',
      value: dashboardData?.inProgressRoadmaps || 0,
      icon: <Flame size={20} />,
      iconBg: "linear-gradient(135deg,#f59e0b,#d97706)",
      iconShadow: "0 4px 12px rgba(245,158,11,0.3)",
      valueBg: "#fffbeb",
      valueColor: "#d97706",
    },
    {
      label: 'Tests Attempted',
      value: attempts.length,
      icon: <ClipboardList size={20} />,
      iconBg: "linear-gradient(135deg,#7c3aed,#6d28d9)",
      iconShadow: "0 4px 12px rgba(124,58,237,0.3)",
      valueBg: "#f5f3ff",
      valueColor: "#6d28d9",
    },
  ];

  const gradeStyle = (score) => {
    if (score >= 90) return { bg: '#f0fdf4', color: '#059669', border: '#bbf7d0', label: 'Excellent' };
    if (score >= 75) return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: 'Good' };
    if (score >= 50) return { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Average' };
    return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'Needs Work' };
  };

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

  return (
    <div className="space-y-8 py-6">

      {/* Header */}
      <div className="flex items-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.name || 'Student'}
        </h1>
      </div>

      {/* Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{ background: s.iconBg, boxShadow: s.iconShadow }}
              >
                {s.icon}
              </div>
              <div
                className="rounded-xl px-3 py-1 text-2xl font-bold"
                style={{ background: s.valueBg, color: s.valueColor }}
              >
                {s.value}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* ── Roadmaps ─────────────────────────────── */}
        <section className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My Roadmaps</h2>
            <button
              onClick={() => navigate('/courses')}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              <Plus size={13} /> New
            </button>
          </div>

          {!dashboardData?.roadmaps?.length ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "#eff6ff" }}>
                <BookOpen size={22} className="text-blue-400" />
              </div>
              <p className="font-semibold text-slate-600 text-sm">No roadmaps yet</p>
              <p className="mt-1 text-xs text-slate-400">Generate your first roadmap from Courses.</p>
              <button onClick={() => navigate('/courses')} className="btn-primary mt-4 text-xs px-4 py-2">
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData.roadmaps.slice(0, 5).map((roadmap) => (
                <div
                  key={roadmap._id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
                  >
                    <BookOpen size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate text-sm">
                      {roadmap.course?.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={10} />
                        {roadmap.duration}d
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color: roadmap.progress === 100 ? "#059669"
                            : roadmap.progress > 0 ? "#d97706"
                            : "#94a3b8",
                        }}
                      >
                        {roadmap.progress === 100 ? "✓ Done"
                          : roadmap.progress > 0 ? `${roadmap.progress}%`
                          : "Not started"}
                      </span>
                    </div>
                    <div className="progress-track mt-1.5">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${roadmap.progress}%`,
                          background: roadmap.progress === 100
                            ? "linear-gradient(90deg,#10b981,#059669)"
                            : "linear-gradient(90deg,#2563eb,#7c3aed)",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/roadmap/${roadmap._id}`)}
                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition hover:bg-blue-100"
                    style={{ color: "#2563eb" }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
              {dashboardData.roadmaps.length > 5 && (
                <p className="text-center text-xs text-slate-400 pt-1">
                  +{dashboardData.roadmaps.length - 5} more roadmaps
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── Mock Test Attempts ───────────────────── */}
        <section className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Mock Test Attempts</h2>
            <button
              onClick={() => navigate('/mocktests')}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              <ClipboardList size={13} /> Take Test
            </button>
          </div>

          {!attempts.length ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "#f5f3ff" }}>
                <ClipboardList size={22} className="text-purple-400" />
              </div>
              <p className="font-semibold text-slate-600 text-sm">No tests attempted yet</p>
              <p className="mt-1 text-xs text-slate-400">Test your knowledge on any course.</p>
              <button onClick={() => navigate('/mocktests')} className="btn-primary mt-4 text-xs px-4 py-2"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", boxShadow: "0 2px 8px rgba(124,58,237,0.3)" }}>
                Browse Tests
              </button>
            </div>
          ) : (
            <>
              {/* Average score banner */}
              <div
                className="mb-4 flex items-center gap-4 rounded-2xl p-4"
                style={{ background: "#f5f3ff", border: "1px solid #ddd6fe" }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}
                >
                  <Target size={20} />
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-medium">Average Score</p>
                  <p className="text-2xl font-bold text-purple-800">{avgScore}%</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-slate-500">{attempts.length} attempt{attempts.length !== 1 ? 's' : ''}</p>
                  <p className="text-xs font-medium" style={{
                    color: avgScore >= 75 ? '#059669' : avgScore >= 50 ? '#d97706' : '#dc2626'
                  }}>
                    {avgScore >= 75 ? '🎯 Great performance' : avgScore >= 50 ? '📈 Keep improving' : '💪 Keep practising'}
                  </p>
                </div>
              </div>

              {/* Attempts list */}
              <div className="space-y-2.5">
                {attempts.slice(0, 6).map((attempt) => {
                  const g = gradeStyle(attempt.score);
                  return (
                    <div
                      key={attempt._id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-purple-200 hover:bg-purple-50/20"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                        style={{ background: g.bg, color: g.color, border: `1px solid ${g.border}` }}
                      >
                        {attempt.score}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {attempt.courseTitle}
                        </p>
                        <p className="text-xs text-slate-400">
                          {attempt.correctAnswers}/{attempt.totalQuestions} correct
                          <span className="mx-1.5">·</span>
                          {new Date(attempt.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ background: g.bg, color: g.color, border: `1px solid ${g.border}` }}
                      >
                        {g.label}
                      </span>
                    </div>
                  );
                })}
                {attempts.length > 6 && (
                  <p className="text-center text-xs text-slate-400 pt-1">
                    +{attempts.length - 6} more attempts
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;