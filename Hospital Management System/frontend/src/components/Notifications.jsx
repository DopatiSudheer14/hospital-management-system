import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Notifications() {
  const [showDropdown, setShowDropdown] = useState(false);

  // Hardcoded notifications
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Booked',
      message: 'New appointment scheduled for John Doe on 2024-01-15 at 10:00 AM',
      time: '2 hours ago',
      icon: '📅',
      color: 'primary',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Pending',
      message: 'Payment of ₹2,500 is pending for appointment #123',
      time: '5 hours ago',
      icon: '💰',
      color: 'warning',
    },
    {
      id: 3,
      type: 'lab',
      title: 'Lab Result Ready',
      message: 'Blood test results for Sarah Smith are now available',
      time: '1 day ago',
      icon: '🔬',
      color: 'success',
    },
    {
      id: 4,
      type: 'appointment',
      title: 'Appointment Booked',
      message: 'New appointment scheduled for Mike Johnson on 2024-01-16 at 2:00 PM',
      time: '3 hours ago',
      icon: '📅',
      color: 'primary',
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment Pending',
      message: 'Payment of ₹1,800 is pending for appointment #124',
      time: '6 hours ago',
      icon: '💰',
      color: 'warning',
    },
  ];

  const unreadCount = notifications.length;

  const getBadgeClass = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary';
      case 'warning':
        return 'bg-warning';
      case 'success':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="position-relative">
      <button
        className="btn btn-link position-relative"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          color: 'var(--text-primary, #2c2c2c)',
          textDecoration: 'none',
          padding: '8px',
          border: 'none',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--primary-color, #1a5f7a)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-primary, #2c2c2c)';
        }}
      >
        <span style={{ fontSize: '20px' }}>🔔</span>
        {unreadCount > 0 && (
          <span
            className="badge bg-danger position-absolute top-0 start-100 translate-middle"
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="position-fixed"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setShowDropdown(false)}
          />
          <div
            className="dropdown-menu show position-absolute"
            style={{
              right: 0,
              top: '100%',
              marginTop: '8px',
              minWidth: '350px',
              maxHeight: '500px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center p-3"
              style={{
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f8f9fa',
              }}
            >
              <h6 className="mb-0" style={{ fontWeight: 600 }}>
                Notifications
              </h6>
              <span className="badge bg-primary">{unreadCount}</span>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div className="p-3 text-center text-muted">
                  <p className="mb-0">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3"
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="d-flex align-items-start">
                      <div
                        className={`badge ${getBadgeClass(notification.color)} me-2`}
                        style={{
                          fontSize: '16px',
                          padding: '8px',
                          borderRadius: '8px',
                        }}
                      >
                        {notification.icon}
                      </div>
                      <div className="flex-grow-1">
                        <div
                          className="d-flex justify-content-between align-items-start mb-1"
                        >
                          <strong
                            style={{
                              fontSize: '14px',
                              color: 'var(--text-primary, #2c2c2c)',
                            }}
                          >
                            {notification.title}
                          </strong>
                          <small className="text-muted">
                            {notification.time}
                          </small>
                        </div>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary, #6c757d)',
                            lineHeight: '1.4',
                          }}
                        >
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div
              className="p-2 text-center"
              style={{
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f8f9fa',
              }}
            >
              <Link
                to="/notifications"
                className="text-decoration-none"
                style={{
                  fontSize: '13px',
                  color: 'var(--primary-color, #1a5f7a)',
                  fontWeight: 500,
                }}
                onClick={() => setShowDropdown(false)}
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Notifications;

