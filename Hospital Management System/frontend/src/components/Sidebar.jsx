import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getRoleBasedMenuItems } from '../utils/roleUtils';

function Sidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get menu items based on user role
  const menuItems = getRoleBasedMenuItems();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="d-md-none position-fixed top-0 start-0 m-3 btn btn-light"
        style={{ zIndex: 1001, borderRadius: '8px' }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        <span>☰</span>
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="d-md-none position-fixed"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}
        style={{
          width: '260px',
          minHeight: '100vh',
          position: 'fixed',
          left: isMobileOpen ? 0 : '-260px',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="p-4">
          <h4
            className="mb-4"
            style={{
              fontWeight: 600,
              fontSize: '20px',
              letterSpacing: '0.5px',
              color: '#ffffff',
            }}
          >
            Hospital Management
          </h4>
          <nav className="nav flex-column">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="nav-link mb-2"
                  style={{
                    borderRadius: '10px',
                    padding: '14px 18px',
                    textDecoration: 'none',
                    backgroundColor: active
                      ? 'linear-gradient(135deg, rgba(26, 95, 122, 0.25) 0%, rgba(26, 95, 122, 0.15) 100%)'
                      : 'transparent',
                    background: active
                      ? 'linear-gradient(135deg, rgba(26, 95, 122, 0.25) 0%, rgba(26, 95, 122, 0.15) 100%)'
                      : 'transparent',
                    borderLeft: active ? '3px solid #1a5f7a' : '3px solid transparent',
                    borderRight: active ? '1px solid rgba(26, 95, 122, 0.2)' : '1px solid transparent',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                    boxShadow: active ? '0 2px 8px rgba(26, 95, 122, 0.15)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    } else {
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(26, 95, 122, 0.25)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    } else {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(26, 95, 122, 0.15)';
                    }
                  }}
                >
                  {active && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px',
                        height: '60%',
                        backgroundColor: '#1a5f7a',
                        borderRadius: '0 3px 3px 0',
                        boxShadow: '0 0 8px rgba(26, 95, 122, 0.5)',
                      }}
                    />
                  )}
                  <span
                    className="me-3"
                    style={{
                      fontSize: '18px',
                      opacity: active ? 1 : 0.9,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '14px',
                      letterSpacing: active ? '0.3px' : '0.2px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#1a5f7a',
                        boxShadow: '0 0 6px rgba(26, 95, 122, 0.6)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sidebar {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}

export default Sidebar;
