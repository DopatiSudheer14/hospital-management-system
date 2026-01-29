import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import dashboardService from '../services/dashboardService';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Reset state and fetch data when component mounts
    setLoading(true);
    setError(null);
    fetchDashboardSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Also fetch when navigating back to dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard' && !loading && !summary && !error) {
      fetchDashboardSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const fetchDashboardSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboardSummary();
      if (response.success) {
        setSummary(response.data);
      } else {
        setError(response.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch dashboard data. Please check if the backend is running on http://localhost:8080';
      setError(errorMessage);
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value, isCurrency = false) => {
    if (value === null || value === undefined) {
      return '0';
    }
    if (isCurrency) {
      return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return value.toLocaleString('en-IN');
  };

  const cardData = summary
    ? [
        {
          title: 'Total Patients',
          value: summary.totalPatients || 0,
          icon: '👥',
          bgGradient: 'linear-gradient(135deg, #e8f4f8 0%, #d1e7ed 100%)',
          borderColor: '#1a5f7a',
          iconBg: 'rgba(26, 95, 122, 0.1)',
          textColor: '#1a5f7a',
        },
        {
          title: 'Total Doctors',
          value: summary.totalDoctors || 0,
          icon: '👨‍⚕️',
          bgGradient: 'linear-gradient(135deg, #f0f7f2 0%, #e1ede5 100%)',
          borderColor: '#4a7c59',
          iconBg: 'rgba(74, 124, 89, 0.1)',
          textColor: '#4a7c59',
        },
        {
          title: 'Total Appointments',
          value: summary.totalAppointments || 0,
          icon: '📅',
          bgGradient: 'linear-gradient(135deg, #f0f5f7 0%, #e1eaf0 100%)',
          borderColor: '#5a8a9f',
          iconBg: 'rgba(90, 138, 159, 0.1)',
          textColor: '#5a8a9f',
        },
        {
          title: 'Total Bills',
          value: summary.totalBills || 0,
          icon: '📋',
          bgGradient: 'linear-gradient(135deg, #f5f3f9 0%, #ebe7f3 100%)',
          borderColor: '#6c5ce7',
          iconBg: 'rgba(108, 92, 231, 0.1)',
          textColor: '#6c5ce7',
        },
        {
          title: 'Total Revenue',
          value: summary.totalRevenue || 0,
          icon: '💰',
          bgGradient: 'linear-gradient(135deg, #fef5f2 0%, #fce8e0 100%)',
          borderColor: '#d97757',
          iconBg: 'rgba(217, 119, 87, 0.1)',
          textColor: '#d97757',
          isCurrency: true,
        },
        {
          title: 'Pending Payments',
          value: summary.pendingPayments || 0,
          icon: '⏳',
          bgGradient: 'linear-gradient(135deg, #fff8e8 0%, #fff1d1 100%)',
          borderColor: '#f39c12',
          iconBg: 'rgba(243, 156, 18, 0.1)',
          textColor: '#f39c12',
        },
      ]
    : [];

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#1a1a1a',
            marginBottom: '8px',
            letterSpacing: '-0.3px',
          }}
        >
          Dashboard Overview
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Monitor key metrics and system performance at a glance
        </p>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3" style={{ fontSize: '14px' }}>Loading dashboard data...</p>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
          style={{
            borderRadius: '10px',
            border: 'none',
            padding: '16px 20px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            fontSize: '14px',
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <span>{error}</span>
            <button
              className="btn btn-sm"
              onClick={fetchDashboardSummary}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                marginLeft: '12px',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && summary && (
        <div className="row g-4">
          {cardData.map((card, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="card border-0"
                style={{
                  borderRadius: '16px',
                  background: card.bgGradient,
                  borderTop: `3px solid ${card.borderColor}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)';
                }}
              >
                {/* Decorative corner element */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: card.iconBg,
                    opacity: 0.4,
                  }}
                />
                
                <div className="card-body" style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div style={{ flex: 1 }}>
                      <h6
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                          color: card.textColor,
                          margin: 0,
                          opacity: 0.85,
                        }}
                      >
                        {card.title}
                      </h6>
                    </div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: card.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    >
                      {card.icon}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '8px' }}>
                    <h3
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.1,
                        color: card.textColor,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {formatValue(card.value, card.isCurrency)}
                    </h3>
                  </div>

                  {/* Subtle bottom accent */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: card.borderColor,
                      opacity: 0.3,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional info section */}
      {!loading && !error && summary && (
        <div
          style={{
            marginTop: '3rem',
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                Last Updated
              </div>
              <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: 500 }}>
                {new Date().toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                System Status
              </div>
              <div style={{ fontSize: '14px', color: '#059669', fontWeight: 500 }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginRight: '6px' }} />
                Operational
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
