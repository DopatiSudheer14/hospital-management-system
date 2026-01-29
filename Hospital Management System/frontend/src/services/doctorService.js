import api from './api';

const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addDoctor: async (doctor) => {
    try {
      const response = await api.post('/doctors', doctor);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDoctor: async (id, doctor) => {
    try {
      const response = await api.put(`/doctors/${id}`, doctor);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDoctor: async (id) => {
    try {
      const response = await api.delete(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default doctorService;

