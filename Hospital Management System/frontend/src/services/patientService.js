import api from './api';

const patientService = {
  getAllPatients: async () => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addPatient: async (patient) => {
    try {
      const response = await api.post('/patients', patient);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPatientById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePatient: async (id, patient) => {
    try {
      const response = await api.put(`/patients/${id}`, patient);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePatient: async (id) => {
    try {
      const response = await api.delete(`/patients/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default patientService;

