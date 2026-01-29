import api from './api';

const prescriptionService = {
  getAllPrescriptions: async () => {
    try {
      const response = await api.get('/prescriptions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addPrescription: async (prescription) => {
    try {
      const response = await api.post('/prescriptions', prescription);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPrescriptionById: async (id) => {
    try {
      const response = await api.get(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePrescription: async (id, prescription) => {
    try {
      const response = await api.put(`/prescriptions/${id}`, prescription);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePrescription: async (id) => {
    try {
      const response = await api.delete(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default prescriptionService;

