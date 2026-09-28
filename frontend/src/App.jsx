import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Student from './pages/Student';
import Faculty from './pages/Faculty';
import Admin from './pages/Admin';
import './index.css';

function App() {
  const [page, setPage] = useState('student');

  return (
    <Router>
      <div className="app">
        <Sidebar activePage={page} onNavigate={setPage} />
        <div className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/student" replace />} />
            <Route path="/student" element={<Student onNavigate={setPage} />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/admin"   element={<Admin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
