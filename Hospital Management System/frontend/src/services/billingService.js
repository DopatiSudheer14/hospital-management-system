import api from './api';

const billingService = {
  getAllBillings: async () => {
    try {
      const response = await api.get('/billings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addBilling: async (billing) => {
    try {
      const response = await api.post('/billings', billing);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBillingById: async (id) => {
    try {
      const response = await api.get(`/billings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBilling: async (id, billing) => {
    try {
      const response = await api.put(`/billings/${id}`, billing);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBilling: async (id) => {
    try {
      const response = await api.delete(`/billings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default billingService;

