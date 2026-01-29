import React, { useState, useEffect } from 'react';
import doctorService from '../services/doctorService';
import { isAdmin } from '../utils/roleUtils';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    doctorName: '',
    specialization: '',
    qualification: '',
    experience: '',
    contactNumber: '',
    email: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorService.getAllDoctors();
      if (response.success) {
        setDoctors(response.data || []);
      } else {
        showAlert(response.message || 'Failed to fetch doctors', 'danger');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch doctors. Please check if the backend is running.';
      showAlert(errorMessage, 'danger');
      console.error('Doctors fetch error:', error);
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

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        doctorName: doctor.doctorName || '',
        specialization: doctor.specialization || '',
        qualification: doctor.qualification || '',
        experience: doctor.experience || '',
        contactNumber: doctor.contactNumber || '',
        email: doctor.email || '',
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        doctorName: '',
        specialization: '',
        qualification: '',
        experience: '',
        contactNumber: '',
        email: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setFormData({
      doctorName: '',
      specialization: '',
      qualification: '',
      experience: '',
      contactNumber: '',
      email: '',
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
      !formData.doctorName.trim() ||
      !formData.specialization.trim() ||
      !formData.qualification.trim() ||
      !formData.experience ||
      !formData.contactNumber.trim() ||
      !formData.email.trim()
    ) {
      showAlert('Please fill all fields', 'danger');
      return;
    }

    if (isNaN(formData.experience) || formData.experience < 0) {
      showAlert('Please enter a valid experience (years)', 'danger');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('Please enter a valid email address', 'danger');
      return;
    }

    // Phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      showAlert('Please enter a valid 10-digit phone number', 'danger');
      return;
    }

    try {
      const doctorData = {
        doctorName: formData.doctorName.trim(),
        specialization: formData.specialization.trim(),
        qualification: formData.qualification.trim(),
        experience: parseInt(formData.experience),
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim(),
      };

      if (editingDoctor) {
        const response = await doctorService.updateDoctor(editingDoctor.id, doctorData);
        if (response.success) {
          showAlert('Doctor updated successfully', 'success');
          handleCloseModal();
          fetchDoctors();
        } else {
          showAlert(response.message || 'Failed to update doctor', 'danger');
        }
      } else {
        const response = await doctorService.addDoctor(doctorData);
        if (response.success) {
          showAlert('Doctor added successfully', 'success');
          handleCloseModal();
          fetchDoctors();
        } else {
          showAlert(response.message || 'Failed to add doctor', 'danger');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      showAlert(errorMessage, 'danger');
      console.error('Doctor save error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        const response = await doctorService.deleteDoctor(id);
        if (response.success) {
          showAlert('Doctor deleted successfully', 'success');
          fetchDoctors();
        } else {
          showAlert(response.message || 'Failed to delete doctor', 'danger');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        showAlert(errorMessage, 'danger');
        console.error('Doctor delete error:', error);
      }
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
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
          Doctors
        </h2>
        {isAdmin() && (
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal()}
            style={{
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 95, 122, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
          >
            Add New Doctor
          </button>
        )}
      </div>

      {alert.show && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show`}
          role="alert"
          style={{
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert({ show: false, message: '', type: '' })}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div
          className="card"
          style={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <p className="text-muted mb-0" style={{ fontSize: '16px' }}>
            No doctors found
          </p>
        </div>
      ) : (
        <div
          className="card"
          style={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          }}
        >
          <div className="card-body p-0">
            <div className="table-responsive">
              <table
                className="table table-hover mb-0"
                style={{
                  margin: 0,
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <th
                      style={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: 'var(--text-primary, #2c2c2c)',
                        padding: '16px',
                        borderBottom: '2px solid var(--border-light, #e5e7eb)',
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: 'var(--text-primary, #2c2c2c)',
                        padding: '16px',
                        borderBottom: '2px solid var(--border-light, #e5e7eb)',
                      }}
                    >
                      Doctor Name
                    </th>
                    <th
                      style={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: 'var(--text-primary, #2c2c2c)',
                        padding: '16px',
                        borderBottom: '2px solid var(--border-light, #e5e7eb)',
                      }}
                    >
                      Specialization
                    </th>
                    <th
                      style={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: 'var(--text-primary, #2c2c2c)',
                        padding: '16px',
                        borderBottom: '2px solid var(--border-light, #e5e7eb)',
                      }}
                    >
                      Qualification
                    </th>
                    <th
                      style={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: 'var(--text-primary, #2c2c2c)',
                        padding: '16px',
                        borderBottom: '2px solid var(--border-light, #e5e7eb)',
                      }}
                    >
                      Experience
                    </th>
                    <th
                      style={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: 'var(--text-primary, #2c2c2c)',
                        padding: '16px',
                        borderBottom: '2px solid var(--border-light, #e5e7eb)',
                      }}
                    >
                      Contact
                    </th>
                    <th
                      style={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                        color: 'var(--text-primary, #2c2c2c)',
                        padding: '16px',
                        borderBottom: '2px solid var(--border-light, #e5e7eb)',
                      }}
                    >
                      Email
                    </th>
                    {isAdmin() && (
                      <th
                        style={{
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          color: 'var(--text-primary, #2c2c2c)',
                          padding: '16px',
                          borderBottom: '2px solid var(--border-light, #e5e7eb)',
                        }}
                      >
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      style={{
                        transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(26, 95, 122, 0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ padding: '16px' }}>{doctor.id}</td>
                      <td style={{ padding: '16px', fontWeight: 500 }}>{doctor.doctorName}</td>
                      <td style={{ padding: '16px' }}>{doctor.specialization}</td>
                      <td style={{ padding: '16px' }}>{doctor.qualification}</td>
                      <td style={{ padding: '16px' }}>{doctor.experience} years</td>
                      <td style={{ padding: '16px' }}>{doctor.contactNumber}</td>
                      <td style={{ padding: '16px' }}>{doctor.email}</td>
                      {isAdmin() && (
                        <td style={{ padding: '16px' }}>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleOpenModal(doctor)}
                              style={{
                                borderRadius: '6px',
                                padding: '4px 12px',
                                fontSize: '12px',
                                border: '1px solid var(--primary-color, #1a5f7a)',
                                color: 'var(--primary-color, #1a5f7a)',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(doctor.id)}
                              style={{
                                borderRadius: '6px',
                                padding: '4px 12px',
                                fontSize: '12px',
                                border: '1px solid #dc3545',
                                color: '#dc3545',
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
                  {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
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
                    <label htmlFor="doctorName" className="form-label">
                      Doctor Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="doctorName"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      placeholder="e.g., Dr. Anjali Verma"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="specialization" className="form-label">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g., Cardiology"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="qualification" className="form-label">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="e.g., MBBS, MD (Cardiology)"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="experience" className="form-label">
                      Experience (Years) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 12"
                      min="0"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 9876543220"
                      pattern="[6-9][0-9]{9}"
                      maxLength="10"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g., anjali.verma@hospital.com"
                      required
                    />
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
                    {editingDoctor ? 'Update' : 'Save'}
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

export default Doctors;
