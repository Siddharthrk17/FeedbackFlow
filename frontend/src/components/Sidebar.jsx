import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/student', icon: '🎓', label: 'Submit Feedback',   desc: 'Student view' },
  { to: '/faculty', icon: '📊', label: 'Faculty Dashboard', desc: 'View summaries' },
  { to: '/admin',   icon: '⚙️', label: 'Admin Panel',       desc: 'Manage forms' },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">📋</div>
        <div className="logo-text">
          FeedbackFlow
          <span>Course Evaluation System</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onNavigate(item.to.slice(1))}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>
              <span style={{ display: 'block', fontSize: 14 }}>{item.label}</span>
              <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{item.desc}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Status dot */}
      <div className="sidebar-footer">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--success)',
            boxShadow: '0 0 6px var(--success)',
            display: 'inline-block'
          }} />
          Backend: localhost:8080
        </span>
      </div>
    </aside>
  );
}
