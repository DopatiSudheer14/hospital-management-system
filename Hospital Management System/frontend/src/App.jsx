import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Prescriptions from './pages/Prescriptions';
import Medicines from './pages/Medicines';
import LabTests from './pages/LabTests';
import Reports from './pages/Reports';
import NotificationsPage from './pages/NotificationsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
          <Route path="medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
          <Route path="lab-tests" element={<ProtectedRoute><LabTests /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
