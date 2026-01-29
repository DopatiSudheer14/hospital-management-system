import React from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  // Get user data from localStorage to display name
  const getUserName = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.name || 'Admin';
      } catch (e) {
        return 'Admin';
      }
    }
    return 'Admin';
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        height: '72px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        padding: '0 24px',
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span
          className="navbar-brand mb-0"
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--primary-color, #1a5f7a)',
            letterSpacing: '0.3px',
          }}
        >
          Hospital Management System
        </span>
        <div className="d-flex align-items-center gap-3">
          <Notifications />
          <span
            style={{
              color: 'var(--text-secondary, #6c757d)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {getUserName()}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleLogout}
            style={{
              borderRadius: '8px',
              padding: '8px 16px',
              borderColor: 'var(--border-light, #e5e7eb)',
              color: 'var(--text-primary, #2c2c2c)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-color, #1a5f7a)';
              e.currentTarget.style.borderColor = 'var(--primary-color, #1a5f7a)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-light, #e5e7eb)';
              e.currentTarget.style.color = 'var(--text-primary, #2c2c2c)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
