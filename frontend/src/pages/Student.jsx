import { useState, useEffect } from 'react';

const API = 'http://localhost:8080/api';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={`star ${n <= (hover || value) ? 'lit' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >⭐</span>
      ))}
      <span className="star-label">
        {labels[hover || value] || 'Select a rating'}
      </span>
    </div>
  );
}

export default function Student() {
  const [step, setStep] = useState(1);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [ratings, setRatings] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForms, setLoadingForms] = useState(true);

  useEffect(() => {
    setLoadingForms(true);
    fetch(`${API}/forms`)
      .then(r => r.json())
      .then(data => { setForms(Array.isArray(data) ? data : []); setLoadingForms(false); })
      .catch(() => { setForms([]); setLoadingForms(false); });
  }, []);

  const selectForm = (form) => {
    setSelectedForm(form);
    setRatings({});
    setStep(2);
    setAlert(null);
  };

  const handleSubmit = async () => {
    if (!studentId.trim()) { setAlert({ type: 'error', msg: 'Please enter your Student ID.' }); return; }
    const allRated = selectedForm.questions.every(q => ratings[q.id]);
    if (!allRated) { setAlert({ type: 'error', msg: 'Please rate all questions before submitting.' }); return; }

    setLoading(true);
    setAlert(null);
    try {
      const res = await fetch(`${API}/feedback/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackFormId: selectedForm.id, studentId, answers: ratings })
      });
      if (res.ok) {
        setStep(3);
      } else {
        const err = await res.json();
        setAlert({ type: 'error', msg: err.error || 'Submission failed.' });
      }
    } catch {
      setAlert({ type: 'error', msg: 'Could not reach the server. Is the backend running?' });
    } finally { setLoading(false); }
  };

  const reset = () => { setStep(1); setSelectedForm(null); setStudentId(''); setRatings({}); setAlert(null); };

  const today = new Date().toISOString().split('T')[0];
  const openForms = forms.filter(f => f.closingDate >= today);

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <span style={{ fontSize: 20 }}>🎓</span>
        <h1>Submit Feedback</h1>
        <span className="topbar-subtitle">— Student View</span>
      </div>

      <div className="content fade-in">

        {/* Steps */}
        <div className="steps">
          {[
            { n: 1, label: 'Select Course' },
            { n: 2, label: 'Rate Questions' },
            { n: 3, label: 'Submitted!' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className={`step ${step > s.n ? 'done' : step === s.n ? 'active' : ''}`}>
                <div className="step-circle">{step > s.n ? '✓' : s.n}</div>
                <span className="step-label">{s.label}</span>
              </div>
              {i < 2 && <div className="step-line" />}
            </div>
          ))}
        </div>

        {/* Alert */}
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}
          </div>
        )}

        {/* STEP 1: Select form */}
        {step === 1 && (
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h2>Available Feedback Forms</h2>
                <p>Select a course to provide feedback for this semester</p>
              </div>
              {loadingForms ? (
                <div className="spinner" />
              ) : openForms.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📭</div>
                  <h3>No open forms</h3>
                  <p>There are no active feedback forms right now. Check back later or ask your admin.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {openForms.map(form => {
                    const daysLeft = Math.ceil((new Date(form.closingDate) - new Date()) / 86400000);
                    return (
                      <div
                        key={form.id}
                        onClick={() => selectForm(form)}
                        style={{
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          padding: '16px 20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        <div style={{
                          width: 48, height: 48, background: 'var(--primary-g)',
                          borderRadius: 10, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 20, flexShrink: 0
                        }}>📘</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>
                            {form.course?.courseCode} — {form.course?.title}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>
                            {form.course?.facultyName} &nbsp;·&nbsp; {form.semester}
                            &nbsp;·&nbsp; {form.questions?.length || 0} questions
                          </div>
                        </div>
                        <span className={`badge ${daysLeft <= 3 ? 'badge-red' : 'badge-green'}`}>
                          ⏰ {daysLeft}d left
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: 20 }}>›</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Rate questions */}
        {step === 2 && selectedForm && (
          <div>
            {/* Course info banner */}
            <div className="overall-box" style={{ marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>You are rating</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{selectedForm.course?.courseCode} — {selectedForm.course?.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  {selectedForm.course?.facultyName} &nbsp;·&nbsp; {selectedForm.semester}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>← Back</button>
            </div>

            {/* Student ID */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">🪪 Student ID</label>
                <input
                  className="form-control"
                  placeholder="e.g. S20240001"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  style={{ maxWidth: 320 }}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="card">
              <div className="card-header">
                <h2>Rate Each Question</h2>
                <p>Click the stars to rate from 1 (Poor) to 5 (Excellent)</p>
              </div>
              {selectedForm.questions?.map((q, i) => (
                <div key={q.id} className="question-card">
                  <div className="q-header">
                    <div className="q-number">{i + 1}</div>
                    <div className="q-text">{q.text}</div>
                  </div>
                  <StarRating
                    value={ratings[q.id] || 0}
                    onChange={val => setRatings(prev => ({ ...prev, [q.id]: val }))}
                  />
                </div>
              ))}

              <div className="divider" />

              {/* Progress summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {Object.keys(ratings).length} / {selectedForm.questions?.length} answered
                </span>
                <div style={{ width: 200 }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(Object.keys(ratings).length / (selectedForm.questions?.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-full"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? '⏳ Submitting...' : '✅ Submit Feedback'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
              Thank you, <span style={{ color: '#a5b4fc' }}>{studentId}</span>!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 420, margin: '0 auto 32px' }}>
              Your feedback for <strong>{selectedForm?.course?.courseCode}</strong> has been submitted successfully.
              Your responses are completely anonymous and help us improve the quality of education.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={reset}>Submit Another</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
