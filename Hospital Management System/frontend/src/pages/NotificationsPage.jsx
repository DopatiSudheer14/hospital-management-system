import React from 'react';

function NotificationsPage() {
  // Hardcoded notifications
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Booked',
      message: 'New appointment scheduled for John Doe on 2024-01-15 at 10:00 AM',
      time: '2 hours ago',
      date: '2024-01-15',
      icon: '📅',
      color: 'primary',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Pending',
      message: 'Payment of ₹2,500 is pending for appointment #123',
      time: '5 hours ago',
      date: '2024-01-15',
      icon: '💰',
      color: 'warning',
    },
    {
      id: 3,
      type: 'lab',
      title: 'Lab Result Ready',
      message: 'Blood test results for Sarah Smith are now available',
      time: '1 day ago',
      date: '2024-01-14',
      icon: '🔬',
      color: 'success',
    },
    {
      id: 4,
      type: 'appointment',
      title: 'Appointment Booked',
      message: 'New appointment scheduled for Mike Johnson on 2024-01-16 at 2:00 PM',
      time: '3 hours ago',
      date: '2024-01-15',
      icon: '📅',
      color: 'primary',
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment Pending',
      message: 'Payment of ₹1,800 is pending for appointment #124',
      time: '6 hours ago',
      date: '2024-01-15',
      icon: '💰',
      color: 'warning',
    },
    {
      id: 6,
      type: 'lab',
      title: 'Lab Result Ready',
      message: 'Complete Blood Count results for Emily Davis are now available',
      time: '2 days ago',
      date: '2024-01-13',
      icon: '🔬',
      color: 'success',
    },
    {
      id: 7,
      type: 'appointment',
      title: 'Appointment Booked',
      message: 'New appointment scheduled for Robert Wilson on 2024-01-17 at 11:00 AM',
      time: '1 hour ago',
      date: '2024-01-15',
      icon: '📅',
      color: 'primary',
    },
    {
      id: 8,
      type: 'payment',
      title: 'Payment Pending',
      message: 'Payment of ₹3,200 is pending for appointment #125',
      time: '4 hours ago',
      date: '2024-01-15',
      icon: '💰',
      color: 'warning',
    },
  ];

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

  const getBorderClass = (color) => {
    switch (color) {
      case 'primary':
        return 'border-primary';
      case 'warning':
        return 'border-warning';
      case 'success':
        return 'border-success';
      default:
        return 'border-secondary';
    }
  };

  return (
    <div>
      <h2
        style={{
          fontSize: '32px',
          fontWeight: 600,
          color: 'var(--text-primary, #2c2c2c)',
          marginBottom: '32px',
          letterSpacing: '0.3px',
        }}
      >
        Notifications
      </h2>

      <div className="row">
        {notifications.map((notification) => (
          <div key={notification.id} className="col-12 mb-3">
            <div
              className={`card border-start ${getBorderClass(notification.color)}`}
              style={{
                borderLeftWidth: '4px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div
                    className={`badge ${getBadgeClass(notification.color)} me-3`}
                    style={{
                      fontSize: '24px',
                      padding: '12px',
                      borderRadius: '8px',
                    }}
                  >
                    {notification.icon}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5
                        className="mb-0"
                        style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: 'var(--text-primary, #2c2c2c)',
                        }}
                      >
                        {notification.title}
                      </h5>
                      <div className="text-end">
                        <small className="text-muted d-block">
                          {notification.date}
                        </small>
                        <small className="text-muted">{notification.time}</small>
                      </div>
                    </div>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary, #6c757d)',
                        lineHeight: '1.5',
                      }}
                    >
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No notifications available</p>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;

