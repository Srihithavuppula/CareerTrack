import { useEffect, useState } from 'react';
import {
  Plus, Pencil, Trash2, BookOpen,
  X, Check, AlertCircle, Shield,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import API from '../api/axios';

const emptyForm = {
  title: '',
  description: '',
  topics: '',
  durationOptions: [30, 45, 60],
  resources: [],
};

const emptyResource = { title: '', link: '', type: 'article' };

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [resources, setResources] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get('/courses');
      const list = Array.isArray(res.data) ? res.data : res.data.courses || [];
      setCourses(list);
    } catch {
      setError('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const flash = (msg, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3500);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setResources([]);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (course) => {
    setForm({
      title: course.title,
      description: course.description || '',
      topics: course.topics && Array.isArray(course.topics) ? course.topics.join(', ') : '',
      durationOptions: course.durationOptions || [30, 45, 60],
      resources: [],
    });
    setResources(course.resources || []);
    setEditingId(course._id);
    setShowForm(true);
    if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setResources([]);
  };

  const handleDurationToggle = (val) => {
    setForm((prev) => ({
      ...prev,
      durationOptions: prev.durationOptions.includes(val)
        ? prev.durationOptions.filter((d) => d !== val)
        : [...prev.durationOptions, val],
    }));
  };

  const handleResourceChange = (index, field, value) => {
    setResources((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const addResource = () => setResources((prev) => [...prev, { ...emptyResource }]);

  const removeResource = (index) =>
    setResources((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.title.trim()) return flash('Title is required.', true);
    if (!form.durationOptions || form.durationOptions.length === 0)
      return flash('Select at least one duration.', true);

    const payload = {
      title: form.title.trim(),
      description: form.description ? form.description.trim() : '',
      topics: form.topics
        ? form.topics.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      durationOptions: Array.isArray(form.durationOptions)
        ? [...form.durationOptions].sort((a, b) => a - b)
        : [],
      resources: Array.isArray(resources)
        ? resources.filter((r) => r.title && r.title.trim() && r.link && r.link.trim())
        : [],
    };

    try {
      setSubmitting(true);
      if (editingId) {
        await API.put(`/courses/${editingId}`, payload);
        flash('Course updated successfully.');
      } else {
        await API.post('/courses', payload);
        flash('Course created successfully.');
      }
      await fetchCourses();
      closeForm();
    } catch (err) {
      flash(
        (err && err.response && (err.response.data?.message || err.response.data?.error)) ||
        'Failed to save course.',
        true
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await API.delete(`/courses/${deleteId}`);
      flash('Course deleted.');
      await fetchCourses();
      setDeleteId(null);
    } catch {
      flash('Failed to delete course.', true);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 py-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-blue-600" />
            <p className="section-label">Admin Panel</p>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Courses</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, edit, and delete courses on the platform.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} />
          New Course
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-medium text-green-700 bg-green-50 border border-green-200">
          <Check size={16} />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-medium text-red-700 bg-red-50 border border-red-200">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* ── Course Form ───────────────────────────── */}
      {showForm && (
        <div className="card p-8">
          {/* Form top bar */}
          <div
            className="h-1 w-full rounded-full mb-6"
            style={{ background: "linear-gradient(90deg,#2563eb,#7c3aed)" }}
          />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? 'Edit Course' : 'Create New Course'}
            </h2>
            <button
              onClick={closeForm}
              className="btn-secondary p-2"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="field-label">Course Title *</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. React.js - Modern Frontend Development"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="field-label">Description</label>
              <div
                className="input-wrapper"
                style={{ alignItems: 'flex-start', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
              >
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of what students will learn..."
                  className="input-field resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Topics */}
            <div>
              <label className="field-label">Topics (comma-separated)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={form.topics}
                  onChange={(e) => setForm((p) => ({ ...p, topics: e.target.value }))}
                  placeholder="HTML Basics, CSS Grid, JavaScript, React Hooks..."
                  className="input-field"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Each topic becomes a day's learning focus in the roadmap.
              </p>
            </div>

            {/* Duration Options */}
            <div>
              <label className="field-label">Duration Options</label>
              <div className="flex gap-3">
                {[30, 45, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDurationToggle(d)}
                    className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all"
                    style={
                      form.durationOptions.includes(d)
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
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="field-label mb-0">Resources</label>
                <button
                  type="button"
                  onClick={addResource}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  <Plus size={13} />
                  Add Resource
                </button>
              </div>

              {resources.length === 0 ? (
                <div
                  className="rounded-2xl border-2 border-dashed border-slate-200 py-8 text-center text-sm text-slate-400"
                >
                  No resources yet. Click "Add Resource" to add one.
                </div>
              ) : (
                <div className="space-y-3">
                  {resources.map((resource, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            value={resource.title}
                            onChange={(e) =>
                              handleResourceChange(index, 'title', e.target.value)
                            }
                            placeholder="Resource title"
                            className="input-field py-2.5"
                          />
                        </div>
                        <div className="input-wrapper">
                          <input
                            type="url"
                            value={resource.link}
                            onChange={(e) =>
                              handleResourceChange(index, 'link', e.target.value)
                            }
                            placeholder="https://..."
                            className="input-field py-2.5"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="input-wrapper flex-1">
                            <select
                              value={resource.type}
                              onChange={(e) =>
                                handleResourceChange(index, 'type', e.target.value)
                              }
                              className="input-field py-2.5 cursor-pointer"
                            >
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="documentation">Documentation</option>
                              <option value="practice">Practice</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeResource(index)}
                            className="btn-danger p-2.5"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeForm} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1"
              >
                {submitting
                  ? editingId ? 'Saving...' : 'Creating...'
                  : editingId ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Courses List ──────────────────────────── */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        </div>
      ) : courses.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="font-medium text-slate-500">No courses yet.</p>
          <button onClick={openCreate} className="btn-primary mt-5">
            Create your first course
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course._id} className="card overflow-hidden">
              {/* Course row */}
              <div className="flex items-center gap-4 p-5">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
                >
                  <BookOpen size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {course.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {course.topics && Array.isArray(course.topics) ? course.topics.length : 0} topics
                    </span>
                    <span className="text-slate-300">·</span>
                    {(course.durationOptions || []).map((d) => (
                      <span
                        key={d}
                        className="rounded-full px-2 py-0.5 text-xs font-medium text-blue-700"
                        style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
                      >
                        {d}d
                      </span>
                    ))}
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">
                      {course.resources && Array.isArray(course.resources) ? course.resources.length : 0} resources
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === course._id ? null : course._id)
                    }
                    className="btn-secondary p-2"
                    title="Preview"
                  >
                    {expandedId === course._id
                      ? <ChevronUp size={15} />
                      : <ChevronDown size={15} />}
                  </button>
                  <button
                    onClick={() => openEdit(course)}
                    className="btn-secondary p-2"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(course._id)}
                    className="btn-danger p-2"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expanded preview */}
              {expandedId === course._id && (
                <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-4">
                  {course.description && (
                    <p className="text-sm text-slate-600">{course.description}</p>
                  )}

                  {course.topics && Array.isArray(course.topics) && course.topics.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Topics
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {course.topics.map((t, i) => (
                          <span
                            key={i}
                            className="rounded-lg px-2.5 py-0.5 text-xs font-medium text-blue-700"
                            style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.resources && Array.isArray(course.resources) && course.resources.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Resources ({course.resources.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {course.resources.slice(0, 8).map((r, i) => (
                          <a
                            key={i}
                            href={r.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:opacity-75"
                            style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
                          >
                            {r.title}
                          </a>
                        ))}
                        {course.resources.length > 8 && (
                          <span className="text-xs text-slate-400 px-2 py-1">
                            +{course.resources.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Delete Confirm Modal ──────────────────── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
        >
          <div className="card mx-4 w-full max-w-md p-8">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
              style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delete this course?</h2>
            <p className="text-sm text-slate-500">
              This will permanently delete the course. Any roadmaps created from
              this course may be affected.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition"
                style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourses;