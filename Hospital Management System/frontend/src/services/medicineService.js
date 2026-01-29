import api from './api';

const medicineService = {
  getAllMedicines: async () => {
    try {
      const response = await api.get('/medicines');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addMedicine: async (medicine) => {
    try {
      const response = await api.post('/medicines', medicine);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMedicineById: async (id) => {
    try {
      const response = await api.get(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMedicine: async (id, medicine) => {
    try {
      const response = await api.put(`/medicines/${id}`, medicine);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMedicine: async (id) => {
    try {
      const response = await api.delete(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default medicineService;

