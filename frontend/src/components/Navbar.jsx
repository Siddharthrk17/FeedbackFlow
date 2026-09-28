import { NavLink } from 'react-router-dom';
import { BookOpen, UserCircle, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel" style={{ marginBottom: '2rem', padding: '1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
          <BookOpen size={24} color="white" />
        </div>
        <h2 style={{ margin: 0 }} className="text-gradient">FeedbackFlow</h2>
      </div>
      <div className="nav-links">
        <NavLink 
          to="/student" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserCircle size={18} />
          Student
        </NavLink>
        <NavLink 
          to="/faculty" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <BookOpen size={18} />
          Faculty
        </NavLink>
        <NavLink 
          to="/admin" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Settings size={18} />
          Admin
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
