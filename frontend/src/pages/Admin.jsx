import { useState, useEffect } from 'react';

const API = 'http://localhost:8080/api';

export default function Admin() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [semester, setSemester] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [questions, setQuestions] = useState(['Rate the teaching quality', 'Rate the course content', 'Rate assignments and assessments']);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetch(`${API}/courses`).then(r => r.json()).then(d => setCourses(Array.isArray(d) ? d : [])).catch(() => {});
    fetch(`${API}/forms`).then(r => r.json()).then(d => setForms(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const addQuestion = () => setQuestions(prev => [...prev, '']);
  const removeQuestion = (i) => setQuestions(prev => prev.filter((_, idx) => idx !== i));
  const updateQuestion = (i, val) => setQuestions(prev => prev.map((q, idx) => idx === i ? val : q));

  const submit = async (e) => {
    e.preventDefault();
    setAlert(null);
    const validQ = questions.filter(q => q.trim());
    if (!courseId || !semester || !closingDate || validQ.length === 0) {
      setAlert({ type: 'error', msg: 'Please fill all fields and add at least one question.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/feedback/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: parseInt(courseId), semester, closingDate, questions: validQ })
      });
      if (res.ok) {
        const newForm = await res.json();
        setAlert({ type: 'success', msg: 'Feedback form published successfully!' });
        setForms(prev => [...prev, newForm]);
        setCourseId(''); setSemester(''); setClosingDate('');
        setQuestions(['Rate the teaching quality', 'Rate the course content', 'Rate assignments and assessments']);
      } else {
        const err = await res.json();
        setAlert({ type: 'error', msg: err.error || JSON.stringify(err) });
      }
    } catch { setAlert({ type: 'error', msg: 'Cannot reach backend. Is it running?' }); }
    finally { setLoading(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="topbar">
        <span style={{ fontSize: 20 }}>⚙️</span>
        <h1>Admin Panel</h1>
        <span className="topbar-subtitle">— Manage Feedback Forms</span>
      </div>

      <div className="content fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

          {/* Left: Create form */}
          <div>
            <div className="card">
              <div className="card-header">
                <h2>📝 Create Feedback Form</h2>
                <p>Publish a feedback form for a course this semester</p>
              </div>

              {alert && (
                <div className={`alert alert-${alert.type}`}>
                  {alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}
                </div>
              )}

              <form onSubmit={submit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Course</label>
                    <select className="form-control" value={courseId} onChange={e => setCourseId(e.target.value)} required>
                      <option value="">Select course…</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.courseCode} — {c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <input className="form-control" placeholder="e.g. Fall 2026" value={semester} onChange={e => setSemester(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Closing Date</label>
                  <input className="form-control" type="date" min={today} value={closingDate} onChange={e => setClosingDate(e.target.value)} required style={{ maxWidth: 240 }} />
                </div>

                <div className="divider" />

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span className="form-label" style={{ marginBottom: 0 }}>Questions ({questions.length})</span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={addQuestion}>+ Add Question</button>
                  </div>

                  {questions.map((q, i) => (
                    <div key={i} className="q-input-row">
                      <div className="q-number" style={{ width: 28, height: 28, minWidth: 28, flexShrink: 0 }}>{i + 1}</div>
                      <input
                        className="form-control"
                        placeholder={`Question ${i + 1}`}
                        value={q}
                        onChange={e => updateQuestion(i, e.target.value)}
                        style={{ marginBottom: 0 }}
                      />
                      {questions.length > 1 && (
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(i)} style={{ padding: '6px 10px' }}>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? '⏳ Publishing…' : '🚀 Publish Form'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Published forms list */}
          <div>
            <div className="card">
              <div className="card-header">
                <h2>📋 Published Forms</h2>
                <p>{forms.length} form{forms.length !== 1 ? 's' : ''} total</p>
              </div>

              {forms.length === 0 ? (
                <div className="empty" style={{ padding: '30px 20px' }}>
                  <div className="empty-icon" style={{ fontSize: 36 }}>📭</div>
                  <h3 style={{ fontSize: 15 }}>No forms yet</h3>
                  <p style={{ fontSize: 13 }}>Publish your first form using the form on the left.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {forms.slice().reverse().map(form => {
                    const isClosed = form.closingDate < today;
                    return (
                      <div key={form.id} style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: '14px 16px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {form.course?.courseCode || `Form #${form.id}`}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                              {form.course?.title}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                              {form.semester} &nbsp;·&nbsp; {form.questions?.length || 0} questions
                            </div>
                          </div>
                          <span className={`badge ${isClosed ? 'badge-red' : 'badge-green'}`}>
                            {isClosed ? '🔒 Closed' : '🟢 Open'}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                          Closes: {form.closingDate}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
