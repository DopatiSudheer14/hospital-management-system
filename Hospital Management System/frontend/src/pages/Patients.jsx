import React, { useState, useEffect } from 'react';
import patientService from '../services/patientService';
import medicalRecordService from '../services/medicalRecordService';
import { isAdmin, isDoctor, isPatient, hasAnyRole } from '../utils/roleUtils';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    patientName: '',
    gender: '',
    age: '',
    bloodGroup: '',
    contactNumber: '',
    address: '',
  });

  const [recordFormData, setRecordFormData] = useState({
    visitDate: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientService.getAllPatients();
      if (response.success) {
        setPatients(response.data || []);
      } else {
        showAlert(response.message || 'Failed to fetch patients', 'danger');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch patients. Please check if the backend is running.';
      showAlert(errorMessage, 'danger');
      console.error('Patients fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        patientName: patient.patientName || '',
        gender: patient.gender || '',
        age: patient.age || '',
        bloodGroup: patient.bloodGroup || '',
        contactNumber: patient.contactNumber || '',
        address: patient.address || '',
      });
    } else {
      setEditingPatient(null);
      setFormData({
        patientName: '',
        gender: '',
        age: '',
        bloodGroup: '',
        contactNumber: '',
        address: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPatient(null);
    setFormData({
      patientName: '',
      gender: '',
      age: '',
      bloodGroup: '',
      contactNumber: '',
      address: '',
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
      !formData.patientName.trim() ||
      !formData.gender ||
      !formData.age ||
      !formData.bloodGroup.trim() ||
      !formData.contactNumber.trim() ||
      !formData.address.trim()
    ) {
      showAlert('Please fill all fields', 'danger');
      return;
    }

    if (isNaN(formData.age) || formData.age < 1 || formData.age > 150) {
      showAlert('Please enter a valid age', 'danger');
      return;
    }

    try {
      const patientData = {
        patientName: formData.patientName.trim(),
        gender: formData.gender,
        age: parseInt(formData.age),
        bloodGroup: formData.bloodGroup.trim(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
      };

      if (editingPatient) {
        const response = await patientService.updatePatient(editingPatient.id, patientData);
        if (response.success) {
          showAlert('Patient updated successfully', 'success');
          handleCloseModal();
          fetchPatients();
        } else {
          showAlert(response.message || 'Failed to update patient', 'danger');
        }
      } else {
        const response = await patientService.addPatient(patientData);
        if (response.success) {
          showAlert('Patient added successfully', 'success');
          handleCloseModal();
          fetchPatients();
        } else {
          showAlert(response.message || 'Failed to add patient', 'danger');
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      const response = await patientService.deletePatient(id);
      if (response.success) {
        showAlert('Patient deleted successfully', 'success');
        fetchPatients();
      } else {
        showAlert(response.message || 'Failed to delete patient', 'danger');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleViewDetails = async (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
    setLoadingRecords(true);
    try {
      const response = await medicalRecordService.getMedicalRecordsByPatientId(patient.id);
      if (response.success) {
        setMedicalRecords(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch medical records:', error);
      setMedicalRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPatient(null);
    setMedicalRecords([]);
    setShowRecordModal(false);
    setRecordFormData({
      visitDate: '',
      symptoms: '',
      diagnosis: '',
      treatment: '',
    });
  };

  const handleOpenRecordModal = () => {
    setRecordFormData({
      visitDate: new Date().toISOString().split('T')[0],
      symptoms: '',
      diagnosis: '',
      treatment: '',
    });
    setShowRecordModal(true);
  };

  const handleCloseRecordModal = () => {
    setShowRecordModal(false);
    setRecordFormData({
      visitDate: '',
      symptoms: '',
      diagnosis: '',
      treatment: '',
    });
  };

  const handleRecordInputChange = (e) => {
    const { name, value } = e.target;
    setRecordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !recordFormData.visitDate ||
      !recordFormData.symptoms.trim() ||
      !recordFormData.diagnosis.trim() ||
      !recordFormData.treatment.trim()
    ) {
      showAlert('Please fill all fields', 'danger');
      return;
    }

    if (!selectedPatient) {
      showAlert('Patient not selected', 'danger');
      return;
    }

    try {
      const recordData = {
        visitDate: recordFormData.visitDate,
        symptoms: recordFormData.symptoms.trim(),
        diagnosis: recordFormData.diagnosis.trim(),
        treatment: recordFormData.treatment.trim(),
        patientId: selectedPatient.id,
      };

      const response = await medicalRecordService.addMedicalRecord(recordData);
      if (response.success) {
        showAlert('Medical record added successfully', 'success');
        handleCloseRecordModal();
        // Refresh medical records
        const recordsResponse = await medicalRecordService.getMedicalRecordsByPatientId(selectedPatient.id);
        if (recordsResponse.success) {
          setMedicalRecords(recordsResponse.data || []);
        }
      } else {
        showAlert(response.message || 'Failed to add medical record', 'danger');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
      console.error('Medical record save error:', error);
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
          Patient Management
        </h2>
        {hasAnyRole(['ADMIN', 'DOCTOR']) && (
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
            Add Patient
          </button>
        )}
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
              <p className="text-muted">Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No patients found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Blood Group</th>
                    <th>Contact</th>
                    {(hasAnyRole(['ADMIN', 'DOCTOR']) || isPatient()) && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.patientName}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.age}</td>
                      <td>{patient.bloodGroup}</td>
                      <td>{patient.contactNumber}</td>
                      {hasAnyRole(['ADMIN', 'DOCTOR']) && (
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() => handleViewDetails(patient)}
                            title="View Details"
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleOpenModal(patient)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(patient.id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                      {isPatient() && (
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleViewDetails(patient)}
                            title="View Details"
                          >
                            View
                          </button>
                        </td>
                      )}
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="patientName" className="form-label">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="gender" className="form-label">
                      Gender *
                    </label>
                    <select
                      className="form-select"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="age" className="form-label">
                      Age *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="1"
                      max="150"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="bloodGroup" className="form-label">
                      Blood Group *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      placeholder="e.g., O+, A-, B+"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address *
                    </label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
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
                    {editingPatient ? 'Update' : 'Add'} Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Patient Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetailsModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Patient Information */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="mb-0">Patient Information</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <strong>Name:</strong> {selectedPatient.patientName}
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Gender:</strong> {selectedPatient.gender}
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Age:</strong> {selectedPatient.age}
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Blood Group:</strong> {selectedPatient.bloodGroup}
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Contact:</strong> {selectedPatient.contactNumber}
                      </div>
                      <div className="col-md-6 mb-3">
                        <strong>Address:</strong> {selectedPatient.address}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Medical History</h6>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={handleOpenRecordModal}
                      style={{
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      Add Medical Record
                    </button>
                  </div>
                  <div className="card-body">
                    {loadingRecords ? (
                      <div className="text-center py-4">
                        <p className="text-muted">Loading medical records...</p>
                      </div>
                    ) : medicalRecords.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted">No medical records found</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Visit Date</th>
                              <th>Symptoms</th>
                              <th>Diagnosis</th>
                              <th>Treatment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {medicalRecords.map((record) => (
                              <tr key={record.id}>
                                <td>{record.visitDate || 'N/A'}</td>
                                <td>
                                  <div
                                    style={{
                                      maxWidth: '200px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title={record.symptoms}
                                  >
                                    {record.symptoms || 'N/A'}
                                  </div>
                                </td>
                                <td>
                                  <div
                                    style={{
                                      maxWidth: '200px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title={record.diagnosis}
                                  >
                                    {record.diagnosis || 'N/A'}
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
                                    title={record.treatment}
                                  >
                                    {record.treatment || 'N/A'}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Record Form Modal */}
      {showRecordModal && selectedPatient && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Medical Record</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseRecordModal}
                ></button>
              </div>
              <form onSubmit={handleRecordSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="patientNameRecord" className="form-label">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="patientNameRecord"
                      value={selectedPatient.patientName}
                      disabled
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="visitDate" className="form-label">
                      Visit Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="visitDate"
                      name="visitDate"
                      value={recordFormData.visitDate}
                      onChange={handleRecordInputChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="symptoms" className="form-label">
                      Symptoms *
                    </label>
                    <textarea
                      className="form-control"
                      id="symptoms"
                      name="symptoms"
                      rows="3"
                      value={recordFormData.symptoms}
                      onChange={handleRecordInputChange}
                      placeholder="e.g., Chest pain, shortness of breath, occasional dizziness"
                      required
                    ></textarea>
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
                      value={recordFormData.diagnosis}
                      onChange={handleRecordInputChange}
                      placeholder="e.g., Hypertension with mild cardiac symptoms. Blood pressure: 150/95 mmHg."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="treatment" className="form-label">
                      Treatment *
                    </label>
                    <textarea
                      className="form-control"
                      id="treatment"
                      name="treatment"
                      rows="4"
                      value={recordFormData.treatment}
                      onChange={handleRecordInputChange}
                      placeholder="e.g., Prescribed antihypertensive medication. Advised lifestyle modifications including low salt diet and regular exercise."
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseRecordModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Medical Record
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

export default Patients;
