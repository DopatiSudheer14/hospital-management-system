import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import reportsService from '../services/reportsService';

function Reports() {
  const [appointmentData, setAppointmentData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointmentsResponse, revenueResponse] = await Promise.all([
        reportsService.getMonthlyAppointmentCounts(),
        reportsService.getMonthlyRevenue(),
      ]);

      if (appointmentsResponse.success) {
        setAppointmentData(appointmentsResponse.data || []);
      } else {
        console.error('Appointments response error:', appointmentsResponse.message);
      }

      if (revenueResponse.success) {
        setRevenueData(revenueResponse.data || []);
      } else {
        console.error('Revenue response error:', revenueResponse.message);
      }

      // Show error if both failed
      if (!appointmentsResponse.success && !revenueResponse.success) {
        setError('Failed to fetch reports data. Please check if the backend is running.');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch reports data. Please check if the backend is running on http://localhost:8080';
      setError(errorMessage);
      console.error('Reports error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month) => {
    if (!month) return '';
    const [year, monthNum] = month.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
  };

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  if (loading) {
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
          Reports
        </h2>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
          Reports
        </h2>
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={fetchReports}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const chartAppointmentData = appointmentData.map((item) => ({
    month: formatMonth(item.month),
    count: item.count || 0,
  }));

  const chartRevenueData = revenueData.map((item) => ({
    month: formatMonth(item.month),
    revenue: item.totalRevenue || 0,
  }));

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
        Reports
      </h2>

      <div className="row">
        {/* Appointments Chart */}
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Appointments per Month</h5>
            </div>
            <div className="card-body">
              {chartAppointmentData.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No appointment data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartAppointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1a5f7a" name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="col-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Revenue per Month</h5>
            </div>
            <div className="card-body">
              {chartRevenueData.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No revenue data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4a7c59"
                      strokeWidth={3}
                      name="Revenue"
                      dot={{ fill: '#4a7c59', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;

