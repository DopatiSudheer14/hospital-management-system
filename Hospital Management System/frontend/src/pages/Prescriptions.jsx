import React, { useState, useEffect } from 'react';
import prescriptionService from '../services/prescriptionService';
import patientService from '../services/patientService';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    prescriptionDate: '',
    diagnosis: '',
    medicines: '',
    notes: '',
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await prescriptionService.getAllPrescriptions();
      if (response.success) {
        setPrescriptions(response.data || []);
      } else {
        showAlert(response.message || 'Failed to fetch prescriptions', 'danger');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch prescriptions. Please check if the backend is running.';
      showAlert(errorMessage, 'danger');
      console.error('Prescriptions fetch error:', error);
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

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAllAppointments();
      if (response.success) {
        setAppointments(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleOpenModal = (prescription = null) => {
    if (prescription) {
      setEditingPrescription(prescription);
      setFormData({
        patientId: prescription.patient?.id || '',
        doctorId: prescription.doctor?.id || '',
        appointmentId: prescription.appointment?.id || '',
        prescriptionDate: prescription.prescriptionDate || '',
        diagnosis: prescription.diagnosis || '',
        medicines: prescription.medicines || '',
        notes: prescription.notes || '',
      });
    } else {
      setEditingPrescription(null);
      setFormData({
        patientId: '',
        doctorId: '',
        appointmentId: '',
        prescriptionDate: new Date().toISOString().split('T')[0],
        diagnosis: '',
        medicines: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPrescription(null);
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentId: '',
      prescriptionDate: '',
      diagnosis: '',
      medicines: '',
      notes: '',
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
      !formData.prescriptionDate ||
      !formData.diagnosis.trim() ||
      !formData.medicines.trim()
    ) {
      showAlert('Please fill all required fields', 'danger');
      return;
    }

    try {
      const prescriptionData = {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        appointmentId: formData.appointmentId ? parseInt(formData.appointmentId) : null,
        prescriptionDate: formData.prescriptionDate,
        diagnosis: formData.diagnosis.trim(),
        medicines: formData.medicines.trim(),
        notes: formData.notes.trim() || null,
      };

      if (editingPrescription) {
        const response = await prescriptionService.updatePrescription(
          editingPrescription.id,
          prescriptionData
        );
        if (response.success) {
          showAlert('Prescription updated successfully', 'success');
          handleCloseModal();
          fetchPrescriptions();
        } else {
          showAlert(response.message || 'Failed to update prescription', 'danger');
        }
      } else {
        const response = await prescriptionService.addPrescription(prescriptionData);
        if (response.success) {
          showAlert('Prescription created successfully', 'success');
          handleCloseModal();
          fetchPrescriptions();
        } else {
          showAlert(response.message || 'Failed to create prescription', 'danger');
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) {
      return;
    }

    try {
      const response = await prescriptionService.deletePrescription(id);
      if (response.success) {
        showAlert('Prescription deleted successfully', 'success');
        fetchPrescriptions();
      } else {
        showAlert(response.message || 'Failed to delete prescription', 'danger');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  // Filter appointments based on selected patient
  const filteredAppointments = formData.patientId
    ? appointments.filter((apt) => apt.patient?.id === parseInt(formData.patientId))
    : appointments;

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
          Prescription Management
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
          Add Prescription
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
              <p className="text-muted">Loading prescriptions...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No prescriptions found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Diagnosis</th>
                    <th>Medicines</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td>{prescription.prescriptionDate || 'N/A'}</td>
                      <td>{prescription.patient?.patientName || 'N/A'}</td>
                      <td>{prescription.doctor?.doctorName || 'N/A'}</td>
                      <td>
                        <div
                          style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={prescription.diagnosis}
                        >
                          {prescription.diagnosis || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            maxWidth: '250px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={prescription.medicines}
                        >
                          {prescription.medicines || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenModal(prescription)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(prescription.id)}
                        >
                          Delete
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
                  {editingPrescription ? 'Edit Prescription' : 'Add New Prescription'}
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
                            {doctor.doctorName} - {doctor.specialization || 'N/A'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="appointmentId" className="form-label">
                        Appointment (Optional)
                      </label>
                      <select
                        className="form-select"
                        id="appointmentId"
                        name="appointmentId"
                        value={formData.appointmentId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Appointment</option>
                        {filteredAppointments.map((appointment) => (
                          <option key={appointment.id} value={appointment.id}>
                            {appointment.appointmentDate} - {appointment.appointmentTime} (
                            {appointment.doctor?.doctorName || 'N/A'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="prescriptionDate" className="form-label">
                        Prescription Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="prescriptionDate"
                        name="prescriptionDate"
                        value={formData.prescriptionDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="diagnosis" className="form-label">
                      Diagnosis *
                    </label>
                    <textarea
                      className="form-control"
                      id="diagnosis"
                      name="diagnosis"
                      rows="3"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      placeholder="Enter diagnosis..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="medicines" className="form-label">
                      Medicines *
                    </label>
                    <textarea
                      className="form-control"
                      id="medicines"
                      name="medicines"
                      rows="4"
                      value={formData.medicines}
                      onChange={handleInputChange}
                      placeholder="Enter medicines and dosage instructions..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes..."
                    ></textarea>
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
                    {editingPrescription ? 'Update' : 'Create'} Prescription
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

export default Prescriptions;

