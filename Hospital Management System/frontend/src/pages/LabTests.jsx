import React, { useState, useEffect } from 'react';
import labTestService from '../services/labTestService';
import patientService from '../services/patientService';

function LabTests() {
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingLabTest, setEditingLabTest] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    patientId: '',
    testName: '',
    testFee: '',
    result: '',
    status: 'PENDING',
  });

  useEffect(() => {
    fetchLabTests();
    fetchPatients();
  }, []);

  const fetchLabTests = async () => {
    setLoading(true);
    try {
      const response = await labTestService.getAllLabTests();
      if (response.success) {
        setLabTests(response.data || []);
      } else {
        showAlert(response.message || 'Failed to fetch lab tests', 'danger');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch lab tests. Please check if the backend is running.';
      showAlert(errorMessage, 'danger');
      console.error('Lab tests fetch error:', error);
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

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleOpenModal = (labTest = null) => {
    if (labTest) {
      setEditingLabTest(labTest);
      setFormData({
        patientId: labTest.patient?.id || '',
        testName: labTest.testName || '',
        testFee: labTest.testFee || '',
        result: labTest.result || '',
        status: labTest.status || 'PENDING',
      });
    } else {
      setEditingLabTest(null);
      setFormData({
        patientId: '',
        testName: '',
        testFee: '',
        result: '',
        status: 'PENDING',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLabTest(null);
    setFormData({
      patientId: '',
      testName: '',
      testFee: '',
      result: '',
      status: 'PENDING',
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
    if (!formData.patientId || !formData.testName.trim() || !formData.testFee) {
      showAlert('Please fill all required fields', 'danger');
      return;
    }

    if (isNaN(formData.testFee) || parseFloat(formData.testFee) < 0) {
      showAlert('Please enter a valid test fee (non-negative number)', 'danger');
      return;
    }

    try {
      const labTestData = {
        patientId: parseInt(formData.patientId),
        testName: formData.testName.trim(),
        testFee: parseFloat(formData.testFee),
        result: formData.result.trim() || null,
        status: formData.status,
      };

      if (editingLabTest) {
        const response = await labTestService.updateLabTest(editingLabTest.id, labTestData);
        if (response.success) {
          showAlert('Lab test updated successfully', 'success');
          handleCloseModal();
          fetchLabTests();
        } else {
          showAlert(response.message || 'Failed to update lab test', 'danger');
        }
      } else {
        const response = await labTestService.addLabTest(labTestData);
        if (response.success) {
          showAlert('Lab test assigned successfully', 'success');
          handleCloseModal();
          fetchLabTests();
        } else {
          showAlert(response.message || 'Failed to assign lab test', 'danger');
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lab test?')) {
      return;
    }

    try {
      const response = await labTestService.deleteLabTest(id);
      if (response.success) {
        showAlert('Lab test deleted successfully', 'success');
        fetchLabTests();
      } else {
        showAlert(response.message || 'Failed to delete lab test', 'danger');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'badge bg-success';
      case 'IN_PROGRESS':
        return 'badge bg-warning';
      case 'PENDING':
        return 'badge bg-info';
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
          Lab Test Management
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
          Assign Test
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
              <p className="text-muted">Loading lab tests...</p>
            </div>
          ) : labTests.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No lab tests found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Patient</th>
                    <th>Test Fee (₹)</th>
                    <th>Status</th>
                    <th>Result</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labTests.map((labTest) => (
                    <tr key={labTest.id}>
                      <td>
                        <strong>{labTest.testName || 'N/A'}</strong>
                      </td>
                      <td>{labTest.patient?.patientName || 'N/A'}</td>
                      <td>
                        <span style={{ color: '#1a5f7a', fontWeight: 600 }}>
                          ₹{labTest.testFee?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(labTest.status)}>
                          {labTest.status || 'N/A'}
                        </span>
                      </td>
                      <td>
                        {labTest.result ? (
                          <div
                            style={{
                              maxWidth: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={labTest.result}
                          >
                            {labTest.result}
                          </div>
                        ) : (
                          <span className="text-muted">Not available</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenModal(labTest)}
                        >
                          {labTest.status === 'COMPLETED' ? 'View' : 'Update'}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(labTest.id)}
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
                  {editingLabTest ? 'Update Lab Test' : 'Assign New Lab Test'}
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
                        disabled={!!editingLabTest}
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
                      <label htmlFor="testFee" className="form-label">
                        Test Fee (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        id="testFee"
                        name="testFee"
                        value={formData.testFee}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="testName" className="form-label">
                      Test Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="testName"
                      name="testName"
                      value={formData.testName}
                      onChange={handleInputChange}
                      placeholder="e.g., Blood Test - Complete Blood Count"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status *
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="result" className="form-label">
                      Result {formData.status === 'PENDING' ? '(Optional - Available after test starts)' : '(Optional)'}
                    </label>
                    <textarea
                      className="form-control"
                      id="result"
                      name="result"
                      rows="4"
                      value={formData.result}
                      onChange={handleInputChange}
                      placeholder="Enter test results..."
                    ></textarea>
                    {formData.status === 'PENDING' && (
                      <small className="text-muted">
                        Result can be added when status is IN_PROGRESS or COMPLETED
                      </small>
                    )}
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
                    {editingLabTest ? 'Update' : 'Assign'} Test
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

export default LabTests;

