import { useState } from 'react';

const API = 'http://localhost:8080/api';

function RatingBar({ label, value }) {
  const pct = (value / 5) * 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc' }}>{value.toFixed(1)}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: pct >= 80
              ? 'linear-gradient(90deg,#10b981,#34d399)'
              : pct >= 60
                ? 'linear-gradient(90deg,#6366f1,#8b5cf6)'
                : 'linear-gradient(90deg,#f59e0b,#fbbf24)'
          }}
        />
      </div>
    </div>
  );
}

function ScoreBadge({ score }) {
  const s = parseFloat(score);
  if (s >= 4.5) return <span className="badge badge-green">★ Excellent</span>;
  if (s >= 3.5) return <span className="badge badge-purple">★ Good</span>;
  if (s >= 2.5) return <span className="badge badge-yellow">★ Average</span>;
  return <span className="badge badge-red">★ Needs Work</span>;
}

export default function Faculty() {
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(''); setSummary(null);
    try {
      const res = await fetch(`${API}/feedback/summary/${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setSummary(data);
    } catch { setError('Could not fetch summary. Check the faculty name or server status.'); }
    finally { setLoading(false); }
  };

  const totalResponses = summary?.courses?.reduce((a, c) => a + (c.totalResponses || 0), 0) || 0;
  const avgScore = summary?.courses?.length
    ? (summary.courses.reduce((a, c) => a + c.overallAverage, 0) / summary.courses.length)
    : 0;

  return (
    <>
      <div className="topbar">
        <span style={{ fontSize: 20 }}>📊</span>
        <h1>Faculty Dashboard</h1>
        <span className="topbar-subtitle">— Feedback Summaries</span>
      </div>

      <div className="content fade-in">

        {/* Search bar */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-header">
            <h2>Search Faculty Feedback</h2>
            <p>Enter a faculty name to view aggregated feedback across all their courses</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="form-control"
              placeholder="e.g. Dr. Alan Turing"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={search} disabled={loading}>
              {loading ? '⏳' : '🔍'} Search
            </button>
          </div>

          {/* Quick names */}
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Quick search:</span>
            {['Dr. Alan Turing', 'Dr. Grace Hopper', 'Dr. John von Neumann'].map(name => (
              <button
                key={name}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 12, padding: '4px 12px' }}
                onClick={() => { setQuery(name); }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {loading && <div className="spinner" />}

        {summary && (
          <div className="fade-in">
            {/* Header stats */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                {summary.facultyName}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                {summary.courses?.length || 0} course(s) with feedback
              </p>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 28 }}>
              <div className="stat-card">
                <div className="stat-icon purple">📚</div>
                <div className="stat-info">
                  <div className="stat-num">{summary.courses?.length || 0}</div>
                  <div className="stat-label">Courses Evaluated</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon cyan">👥</div>
                <div className="stat-info">
                  <div className="stat-num">{totalResponses}</div>
                  <div className="stat-label">Total Responses</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">⭐</div>
                <div className="stat-info">
                  <div className="stat-num">{avgScore.toFixed(1)}</div>
                  <div className="stat-label">Overall Average / 5</div>
                </div>
              </div>
            </div>

            {/* Course cards */}
            {summary.courses?.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <h3>No feedback yet</h3>
                <p>No feedback has been submitted for this faculty member.</p>
              </div>
            ) : (
              summary.courses.map((course, i) => (
                <div key={i} className="card" style={{ marginBottom: 20 }}>
                  {/* Course header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{
                          background: 'var(--primary-g)', padding: '4px 12px',
                          borderRadius: 20, fontSize: 12, fontWeight: 700
                        }}>{course.courseCode}</span>
                        <ScoreBadge score={course.overallAverage} />
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{course.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                        Semester: {course.semester} &nbsp;·&nbsp;
                        {course.totalResponses} response{course.totalResponses !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 42, fontWeight: 800,
                        background: 'var(--primary-g)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text', lineHeight: 1
                      }}>
                        {course.overallAverage.toFixed(1)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>out of 5.0</div>
                    </div>
                  </div>

                  <div className="divider" style={{ marginTop: 0 }} />

                  {/* Per-question bars */}
                  {course.questionSummaries?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>
                        Question Breakdown
                      </div>
                      {course.questionSummaries.map((q, qi) => (
                        <RatingBar key={qi} label={q.text} value={q.averageRating} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
