import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Briefcase, Users, FileText,
  Calendar, LogOut
} from 'lucide-react';
import sidebarLogo from '../assets/Logo_sidebar_transparent.png';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/candidates', icon: Users, label: 'Candidates' },
    { to: '/applications', icon: FileText, label: 'Applications' },
    { to: '/interviews', icon: Calendar, label: 'Interviews' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={sidebarLogo} alt="TalentFlow" style={{ height: 56 }} />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Main Menu</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="user-name">{user?.fullName || 'User'}</div>
            <div className="user-role">HR Staff</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
