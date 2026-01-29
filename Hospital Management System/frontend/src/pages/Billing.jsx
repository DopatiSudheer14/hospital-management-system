import React, { useState, useEffect } from 'react';
import billingService from '../services/billingService';
import patientService from '../services/patientService';
import appointmentService from '../services/appointmentService';

function Billing() {
  const [billings, setBillings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBilling, setEditingBilling] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    billDate: '',
    consultationFee: '',
    treatmentFee: '',
    medicineFee: '',
    totalAmount: 0,
    paymentMode: 'CASH',
    paymentStatus: 'PENDING',
  });

  useEffect(() => {
    fetchBillings();
    fetchPatients();
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Auto-calculate total amount when fees change
    const consultation = parseFloat(formData.consultationFee) || 0;
    const treatment = parseFloat(formData.treatmentFee) || 0;
    const medicine = parseFloat(formData.medicineFee) || 0;
    const total = consultation + treatment + medicine;
    setFormData((prev) => ({ ...prev, totalAmount: total }));
  }, [formData.consultationFee, formData.treatmentFee, formData.medicineFee]);

  const fetchBillings = async () => {
    setLoading(true);
    try {
      const response = await billingService.getAllBillings();
      if (response.success) {
        setBillings(response.data || []);
      } else {
        showAlert(response.message || 'Failed to fetch billings', 'danger');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch billings. Please check if the backend is running.';
      showAlert(errorMessage, 'danger');
      console.error('Billings fetch error:', error);
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

  const handleOpenModal = (billing = null) => {
    if (billing) {
      setEditingBilling(billing);
      const consultation = billing.consultationFee || 0;
      const treatment = billing.treatmentFee || 0;
      const medicine = billing.medicineFee || 0;
      const total = consultation + treatment + medicine;
      setFormData({
        patientId: billing.patient?.id || '',
        appointmentId: billing.appointment?.id || '',
        billDate: billing.billDate || '',
        consultationFee: consultation,
        treatmentFee: treatment,
        medicineFee: medicine,
        totalAmount: total,
        paymentMode: billing.paymentMode || 'CASH',
        paymentStatus: billing.paymentStatus || 'PENDING',
      });
    } else {
      setEditingBilling(null);
      setFormData({
        patientId: '',
        appointmentId: '',
        billDate: new Date().toISOString().split('T')[0],
        consultationFee: '',
        treatmentFee: '',
        medicineFee: '',
        totalAmount: 0,
        paymentMode: 'CASH',
        paymentStatus: 'PENDING',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBilling(null);
    setFormData({
      patientId: '',
      appointmentId: '',
      billDate: '',
      consultationFee: '',
      treatmentFee: '',
      medicineFee: '',
      totalAmount: 0,
      paymentMode: 'CASH',
      paymentStatus: 'PENDING',
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
      !formData.billDate ||
      formData.consultationFee === '' ||
      formData.treatmentFee === '' ||
      formData.medicineFee === '' ||
      !formData.paymentMode
    ) {
      showAlert('Please fill all required fields', 'danger');
      return;
    }

    // Validate fees are numbers
    const consultation = parseFloat(formData.consultationFee);
    const treatment = parseFloat(formData.treatmentFee);
    const medicine = parseFloat(formData.medicineFee);

    if (isNaN(consultation) || isNaN(treatment) || isNaN(medicine)) {
      showAlert('Please enter valid fee amounts', 'danger');
      return;
    }

    if (consultation < 0 || treatment < 0 || medicine < 0) {
      showAlert('Fee amounts cannot be negative', 'danger');
      return;
    }

    try {
      const billingData = {
        patientId: parseInt(formData.patientId),
        appointmentId: formData.appointmentId ? parseInt(formData.appointmentId) : null,
        billDate: formData.billDate,
        consultationFee: consultation,
        treatmentFee: treatment,
        medicineFee: medicine,
        paymentMode: formData.paymentMode,
        paymentStatus: formData.paymentStatus || 'PENDING',
      };

      if (editingBilling) {
        const response = await billingService.updateBilling(editingBilling.id, billingData);
        if (response.success) {
          showAlert('Billing updated successfully', 'success');
          handleCloseModal();
          fetchBillings();
        } else {
          showAlert(response.message || 'Failed to update billing', 'danger');
        }
      } else {
        const response = await billingService.addBilling(billingData);
        if (response.success) {
          showAlert('Bill created successfully', 'success');
          handleCloseModal();
          fetchBillings();
        } else {
          showAlert(response.message || 'Failed to create bill', 'danger');
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this billing record?')) {
      return;
    }

    try {
      const response = await billingService.deleteBilling(id);
      if (response.success) {
        showAlert('Billing record deleted successfully', 'success');
        fetchBillings();
      } else {
        showAlert(response.message || 'Failed to delete billing', 'danger');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'PAID':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  };

  const getPaymentModeBadgeClass = (mode) => {
    switch (mode) {
      case 'CASH':
        return 'badge bg-info';
      case 'CARD':
        return 'badge bg-primary';
      case 'UPI':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
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
          Billing Management
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
          Create Bill
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
              <p className="text-muted">Loading billings...</p>
            </div>
          ) : billings.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No billing records found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Appointment Date</th>
                    <th>Total Amount</th>
                    <th>Payment Mode</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billings.map((billing) => (
                    <tr key={billing.id}>
                      <td>{billing.patient?.patientName || 'N/A'}</td>
                      <td>
                        {billing.appointment?.appointmentDate
                          ? billing.appointment.appointmentDate
                          : 'N/A'}
                      </td>
                      <td>
                        <strong>₹{billing.totalAmount?.toLocaleString() || '0'}</strong>
                      </td>
                      <td>
                        <span className={getPaymentModeBadgeClass(billing.paymentMode)}>
                          {billing.paymentMode || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={getPaymentStatusBadgeClass(billing.paymentStatus)}>
                          {billing.paymentStatus || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenModal(billing)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(billing.id)}
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
                  {editingBilling ? 'Edit Billing' : 'Create New Bill'}
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
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="billDate" className="form-label">
                        Bill Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="billDate"
                        name="billDate"
                        value={formData.billDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="consultationFee" className="form-label">
                        Consultation Fee (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        id="consultationFee"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="treatmentFee" className="form-label">
                        Treatment Fee (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        id="treatmentFee"
                        name="treatmentFee"
                        value={formData.treatmentFee}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label htmlFor="medicineFee" className="form-label">
                        Medicine Fee (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        id="medicineFee"
                        name="medicineFee"
                        value={formData.medicineFee}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Total Amount</label>
                    <div
                      className="form-control"
                      style={{
                        backgroundColor: '#f8f9fa',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: 'var(--primary-color, #1a5f7a)',
                      }}
                    >
                      ₹{formData.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="paymentMode" className="form-label">
                        Payment Mode *
                      </label>
                      <select
                        className="form-select"
                        id="paymentMode"
                        name="paymentMode"
                        value={formData.paymentMode}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="CASH">CASH</option>
                        <option value="CARD">CARD</option>
                        <option value="UPI">UPI</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="paymentStatus" className="form-label">
                        Payment Status
                      </label>
                      <select
                        className="form-select"
                        id="paymentStatus"
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleInputChange}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                      </select>
                    </div>
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
                    {editingBilling ? 'Update' : 'Create'} Bill
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

export default Billing;
