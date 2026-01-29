import React, { useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';
import patientService from '../services/patientService';
import doctorService from '../services/doctorService';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: 'SCHEDULED',
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAllAppointments();
      if (response.success) {
        setAppointments(response.data || []);
      } else {
        showAlert(response.message || 'Failed to fetch appointments', 'danger');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch appointments. Please check if the backend is running.';
      showAlert(errorMessage, 'danger');
      console.error('Appointments fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAllPatients();
      if (response.success) {
        setPatients(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      if (response.success) {
        setDoctors(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleOpenModal = (appointment = null) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        patientId: appointment.patient?.id || '',
        doctorId: appointment.doctor?.id || '',
        appointmentDate: appointment.appointmentDate || '',
        appointmentTime: appointment.appointmentTime || '',
        reason: appointment.reason || '',
        status: appointment.status || 'SCHEDULED',
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        status: 'SCHEDULED',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: '',
      status: 'SCHEDULED',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.patientId ||
      !formData.doctorId ||
      !formData.appointmentDate ||
      !formData.appointmentTime.trim() ||
      !formData.reason.trim()
    ) {
      showAlert('Please fill all required fields', 'danger');
      return;
    }

    try {
      const appointmentData = {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime.trim(),
        reason: formData.reason.trim(),
        status: formData.status || 'SCHEDULED',
      };

      if (editingAppointment) {
        const response = await appointmentService.updateAppointment(
          editingAppointment.id,
          appointmentData
        );
        if (response.success) {
          showAlert('Appointment updated successfully', 'success');
          handleCloseModal();
          fetchAppointments();
        } else {
          showAlert(response.message || 'Failed to update appointment', 'danger');
        }
      } else {
        const response = await appointmentService.addAppointment(appointmentData);
        if (response.success) {
          showAlert('Appointment booked successfully', 'success');
          handleCloseModal();
          fetchAppointments();
        } else {
          showAlert(response.message || 'Failed to book appointment', 'danger');
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await appointmentService.deleteAppointment(id);
      if (response.success) {
        showAlert('Appointment cancelled successfully', 'success');
        fetchAppointments();
      } else {
        showAlert(response.message || 'Failed to cancel appointment', 'danger');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'badge bg-primary';
      case 'COMPLETED':
        return 'badge bg-success';
      case 'CANCELLED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ flexWrap: 'wrap', gap: '16px' }}
      >
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: 'var(--text-primary, #2c2c2c)',
            margin: 0,
            letterSpacing: '0.3px',
          }}
        >
          Appointment Management
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
          style={{
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: 500,
            fontSize: '14px',
            border: 'none',
          }}
        >
          Book Appointment
        </button>
      </div>

      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert({ show: false, message: '', type: '' })}
          ></button>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No appointments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.patient?.patientName || 'N/A'}</td>
                      <td>{appointment.doctor?.doctorName || 'N/A'}</td>
                      <td>{appointment.appointmentDate || 'N/A'}</td>
                      <td>{appointment.appointmentTime || 'N/A'}</td>
                      <td>{appointment.reason || 'N/A'}</td>
                      <td>
                        <span className={getStatusBadgeClass(appointment.status)}>
                          {appointment.status || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenModal(appointment)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="patientId" className="form-label">
                        Patient *
                      </label>
                      <select
                        className="form-select"
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Patient</option>
                        {patients.map((patient) => (
                          <option key={patient.id} value={patient.id}>
                            {patient.patientName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="doctorId" className="form-label">
                        Doctor *
                      </label>
                      <select
                        className="form-select"
                        id="doctorId"
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.doctorName} - {doctor.specialization}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="appointmentDate" className="form-label">
                        Appointment Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="appointmentDate"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="appointmentTime" className="form-label">
                        Appointment Time *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="appointmentTime"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleInputChange}
                        placeholder="e.g., 10:00 AM"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="reason" className="form-label">
                      Reason *
                    </label>
                    <textarea
                      className="form-control"
                      id="reason"
                      name="reason"
                      rows="3"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Enter appointment reason"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAppointment ? 'Update' : 'Book'} Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
