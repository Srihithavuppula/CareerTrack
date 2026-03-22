import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import RoadmapFlowchart from '../components/RoadmapFlowchart';
import {
  RotateCcw, Trash2, CheckCircle2, Circle,
  ExternalLink, BookOpen, FlaskConical,
  FileText, Code2, Link2, ArrowLeft,
} from 'lucide-react';

const resourceStyle = (type) => {
  switch (type) {
    case 'video':
      return { background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed' };
    case 'article':
      return { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb' };
    case 'documentation':
      return { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#059669' };
    case 'practice':
      return { background: '#fffbeb', border: '1px solid #fde68a', color: '#d97706' };
    default:
      return { background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' };
  }
};

const resourceIcon = (type) => {
  const s = { size: 11 };
  switch (type) {
    case 'video': return <BookOpen {...s} />;
    case 'article': return <FileText {...s} />;
    case 'documentation': return <Code2 {...s} />;
    case 'practice': return <FlaskConical {...s} />;
    default: return <Link2 {...s} />;
  }
};

function ConfirmModal({ show, icon, iconBg, title, desc, onCancel, onConfirm, confirming, confirmLabel, confirmStyle }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
    >
      <div className="card mx-4 w-full max-w-md p-8">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
          style={iconBg}
        >
          {icon}
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-sm text-slate-500">{desc}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition"
            style={confirmStyle}
          >
            {confirming ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const Roadmap = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingDay, setUpdatingDay] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await API.get(`/roadmaps/single/${roadmapId}`);
        setRoadmap(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  const handleToggleDay = async (dayNumber, completed) => {
    try {
      setUpdatingDay(dayNumber);
      const response = await API.put('/roadmaps/complete', {
        roadmapId, dayNumber, completed: !completed,
      });
      setRoadmap(response.data.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update day');
    } finally {
      setUpdatingDay(null);
    }
  };

  const handleReset = async () => {
    try {
      setResetting(true);
      const response = await API.put(`/roadmaps/reset/${roadmapId}`);
      setRoadmap(response.data.roadmap);
      setShowResetConfirm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset roadmap');
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/roadmaps/${roadmapId}`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete roadmap');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (error && !roadmap) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="card px-8 py-6 text-center">
          <p className="font-medium text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  const completedDays = roadmap.days.filter((d) => d.completed).length;
  const totalDays = roadmap.days.length;

  return (
    <div className="space-y-6 py-6">

      {/* Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft size={15} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="card overflow-hidden">
        {/* Blue gradient top bar */}
        <div
          className="h-2 w-full"
          style={{ background: "linear-gradient(90deg,#2563eb,#7c3aed)" }}
        />

        <div className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <p className="section-label mb-2">Learning Roadmap</p>
              <h1 className="text-3xl font-bold text-slate-900">
                {roadmap.course?.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {roadmap.course?.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {roadmap.duration} days
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100">
                  {completedDays}/{totalDays} completed
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={
                    roadmap.progress === 100
                      ? { background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0" }
                      : roadmap.progress > 0
                      ? { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }
                      : { background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0" }
                  }
                >
                  {roadmap.progress === 100
                    ? '🎉 Completed'
                    : roadmap.progress > 0
                    ? 'In Progress'
                    : 'Not Started'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowResetConfirm(true)} className="btn-secondary">
                <RotateCcw size={14} /> Reset
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Overall Progress</span>
              <span className="text-sm font-bold text-blue-700">{roadmap.progress}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${roadmap.progress}%`,
                  background:
                    roadmap.progress === 100
                      ? "linear-gradient(90deg,#10b981,#059669)"
                      : "linear-gradient(90deg,#2563eb,#7c3aed)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Overview */}
      <RoadmapFlowchart roadmap={roadmap} />

      {/* Daily Plan */}
      <div className="card p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Daily Plan</h2>
        <p className="text-sm text-slate-400 mb-6">
          Complete each day to track your progress.
        </p>

        <div className="space-y-3">
          {roadmap.days.map((day) => (
            <div
              key={day.day}
              className={day.completed ? 'day-card day-card-done' : 'day-card'}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Day badge */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                    style={
                      day.completed
                        ? { background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff" }
                        : { background: "#eff6ff", color: "#2563eb" }
                    }
                  >
                    {day.completed ? <CheckCircle2 size={17} /> : day.day}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-400 mb-0.5">
                      Day {day.day}
                    </p>
                    <p className="font-semibold text-slate-900">{day.topic}</p>

                    {day.resources?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {day.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition hover:opacity-75"
                            style={resourceStyle(resource.type)}
                          >
                            {resourceIcon(resource.type)}
                            {resource.title}
                            <ExternalLink size={9} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleDay(day.day, day.completed)}
                  disabled={updatingDay === day.day}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-60"
                  style={
                    day.completed
                      ? { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#059669" }
                      : {
                          background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                          color: "#fff",
                          boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                        }
                  }
                >
                  {updatingDay === day.day
                    ? 'Updating...'
                    : day.completed
                    ? <><CheckCircle2 size={13} /> Completed</>
                    : <><Circle size={13} /> Mark Complete</>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        show={showResetConfirm}
        icon={<RotateCcw size={20} className="text-amber-600" />}
        iconBg={{ background: "#fffbeb", border: "1px solid #fde68a" }}
        title="Reset this roadmap?"
        desc="All daily progress will be cleared and reset to 0%. Your roadmap structure stays intact."
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        confirming={resetting}
        confirmLabel="Yes, Reset"
        confirmStyle={{ background: "linear-gradient(135deg,#d97706,#b45309)" }}
      />

      <ConfirmModal
        show={showDeleteConfirm}
        icon={<Trash2 size={20} className="text-red-600" />}
        iconBg={{ background: "#fef2f2", border: "1px solid #fecaca" }}
        title="Delete this roadmap?"
        desc="This is permanent and cannot be undone. All your progress will be lost forever."
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        confirming={deleting}
        confirmLabel="Yes, Delete"
        confirmStyle={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
      />
    </div>
  );
};

export default Roadmap;