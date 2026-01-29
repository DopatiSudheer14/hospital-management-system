import api from './api';

const labTestService = {
  getAllLabTests: async () => {
    try {
      const response = await api.get('/lab-tests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addLabTest: async (labTest) => {
    try {
      const response = await api.post('/lab-tests', labTest);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLabTestById: async (id) => {
    try {
      const response = await api.get(`/lab-tests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateLabTest: async (id, labTest) => {
    try {
      const response = await api.put(`/lab-tests/${id}`, labTest);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteLabTest: async (id) => {
    try {
      const response = await api.delete(`/lab-tests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default labTestService;

