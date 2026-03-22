import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';

const COLORS = [
  { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', dot: '#3b82f6' },
  { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9', dot: '#8b5cf6' },
  { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', dot: '#22c55e' },
  { bg: '#fffbeb', border: '#fde68a', text: '#92400e', dot: '#f59e0b' },
  { bg: '#fff1f2', border: '#fecdd3', text: '#9f1239', dot: '#f43f5e' },
];

const WEEK_SIZE = 7;

function WeekGroup({ weekIndex, days, isExpanded, onToggle }) {
  const color = COLORS[weekIndex % COLORS.length];
  const completedCount = days.filter((d) => d.completed).length;
  const allDone = completedCount === days.length;
  const weekLabel = `Week ${weekIndex + 1}`;
  const dayRange = `Day ${days[0].day} – ${days[days.length - 1].day}`;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{ borderColor: color.border }}
    >
      {/* Week header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 transition hover:opacity-80"
        style={{ background: color.bg }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full"
            style={{ background: color.dot }}
          />
          <span className="font-semibold text-sm" style={{ color: color.text }}>
            {weekLabel}
          </span>
          <span className="text-xs font-medium" style={{ color: color.text, opacity: 0.6 }}>
            {dayRange}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div
              className="h-1.5 w-24 rounded-full overflow-hidden"
              style={{ background: `${color.dot}22` }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(completedCount / days.length) * 100}%`,
                  background: color.dot,
                }}
              />
            </div>
            <span className="text-xs font-medium" style={{ color: color.text }}>
              {completedCount}/{days.length}
            </span>
          </div>

          {allDone && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' }}
            >
              ✓ Done
            </span>
          )}

          <span style={{ color: color.text }}>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </button>

      {/* Days grid */}
      {isExpanded && (
        <div className="p-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ background: '#ffffff' }}>
          {days.map((day) => (
            <div
              key={day.day}
              className="rounded-xl border p-3 transition-all"
              style={
                day.completed
                  ? { background: '#f0fdf4', borderColor: '#bbf7d0' }
                  : { background: '#f8fafc', borderColor: '#f1f5f9' }
              }
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={
                    day.completed
                      ? { background: '#10b981', color: '#fff' }
                      : { background: color.bg, color: color.text, border: `1px solid ${color.border}` }
                  }
                >
                  {day.completed ? <CheckCircle2 size={13} /> : day.day}
                </div>
                <span className="text-xs font-semibold text-slate-400">Day {day.day}</span>
              </div>
              <p className="text-xs font-medium text-slate-700 line-clamp-2 leading-relaxed">
                {day.topic}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const RoadmapFlowchart = ({ roadmap }) => {
  const weeks = useMemo(() => {
    if (!roadmap?.days?.length) return [];
    const result = [];
    for (let i = 0; i < roadmap.days.length; i += WEEK_SIZE) {
      result.push(roadmap.days.slice(i, i + WEEK_SIZE));
    }
    return result;
  }, [roadmap]);

  const [expandedWeeks, setExpandedWeeks] = useState(() => {
    if (!roadmap?.days?.length) return {};
    const firstIncomplete = Math.floor(
      (roadmap.days.findIndex((d) => !d.completed)) / WEEK_SIZE
    );
    return { [Math.max(firstIncomplete, 0)]: true };
  });

  const toggleWeek = (index) => {
    setExpandedWeeks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const expandAll = () => {
    const all = {};
    weeks.forEach((_, i) => (all[i] = true));
    setExpandedWeeks(all);
  };

  const collapseAll = () => setExpandedWeeks({});

  if (!roadmap?.days?.length) return null;

  const totalCompleted = roadmap.days.filter((d) => d.completed).length;
  const totalDays = roadmap.days.length;

  return (
    <div className="card p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Roadmap Overview</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {weeks.length} weeks · {totalCompleted}/{totalDays} days completed
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={expandAll} className="btn-secondary text-xs px-3 py-1.5">
            Expand All
          </button>
          <button onClick={collapseAll} className="btn-secondary text-xs px-3 py-1.5">
            Collapse
          </button>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-6">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${Math.round((totalCompleted / totalDays) * 100)}%`,
              background: "linear-gradient(90deg,#2563eb,#7c3aed)",
            }}
          />
        </div>
      </div>

      {/* Week groups */}
      <div className="space-y-3">
        {weeks.map((weekDays, index) => (
          <WeekGroup
            key={index}
            weekIndex={index}
            days={weekDays}
            isExpanded={!!expandedWeeks[index]}
            onToggle={() => toggleWeek(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoadmapFlowchart;