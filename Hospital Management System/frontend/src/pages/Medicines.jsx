import React, { useState, useEffect } from 'react';
import medicineService from '../services/medicineService';
import { isAdmin } from '../utils/roleUtils';

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    medicineName: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await medicineService.getAllMedicines();
      if (response.success) {
        setMedicines(response.data || []);
      } else {
        showAlert(response.message || 'Failed to fetch medicines', 'danger');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch medicines. Please check if the backend is running.';
      showAlert(errorMessage, 'danger');
      console.error('Medicines fetch error:', error);
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

  const handleOpenModal = (medicine = null) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData({
        medicineName: medicine.medicineName || '',
        price: medicine.price || '',
        stock: medicine.stock || '',
      });
    } else {
      setEditingMedicine(null);
      setFormData({
        medicineName: '',
        price: '',
        stock: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
    setFormData({
      medicineName: '',
      price: '',
      stock: '',
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
    if (!formData.medicineName.trim()) {
      showAlert('Please enter medicine name', 'danger');
      return;
    }

    if (formData.price === '' || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      showAlert('Please enter a valid price (non-negative number)', 'danger');
      return;
    }

    if (formData.stock === '' || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      showAlert('Please enter a valid stock (non-negative number)', 'danger');
      return;
    }

    try {
      const medicineData = {
        medicineName: formData.medicineName.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingMedicine) {
        const response = await medicineService.updateMedicine(editingMedicine.id, medicineData);
        if (response.success) {
          showAlert('Medicine updated successfully', 'success');
          handleCloseModal();
          fetchMedicines();
        } else {
          showAlert(response.message || 'Failed to update medicine', 'danger');
        }
      } else {
        const response = await medicineService.addMedicine(medicineData);
        if (response.success) {
          showAlert('Medicine added successfully', 'success');
          handleCloseModal();
          fetchMedicines();
        } else {
          showAlert(response.message || 'Failed to add medicine', 'danger');
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) {
      return;
    }

    try {
      const response = await medicineService.deleteMedicine(id);
      if (response.success) {
        showAlert('Medicine deleted successfully', 'success');
        fetchMedicines();
      } else {
        showAlert(response.message || 'Failed to delete medicine', 'danger');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred. Please try again.';
      showAlert(errorMessage, 'danger');
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
          Pharmacy Management
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
              border: 'none',
            }}
          >
            Add Medicine
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
              <p className="text-muted">Loading medicines...</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No medicines found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    {isAdmin() && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine) => (
                    <tr key={medicine.id}>
                      <td>
                        <strong>{medicine.medicineName}</strong>
                      </td>
                      <td>
                        <span style={{ color: '#1a5f7a', fontWeight: 600 }}>
                          ₹{medicine.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            medicine.stock > 50
                              ? 'bg-success'
                              : medicine.stock > 20
                              ? 'bg-warning'
                              : 'bg-danger'
                          }`}
                        >
                          {medicine.stock || 0}
                        </span>
                      </td>
                      {isAdmin() && (
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleOpenModal(medicine)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(medicine.id)}
                          >
                            Delete
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
                  {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
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
                    <label htmlFor="medicineName" className="form-label">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="medicineName"
                      name="medicineName"
                      value={formData.medicineName}
                      onChange={handleInputChange}
                      placeholder="e.g., Paracetamol 500mg"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="stock" className="form-label">
                      Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
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
                    {editingMedicine ? 'Update' : 'Add'} Medicine
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

export default Medicines;

