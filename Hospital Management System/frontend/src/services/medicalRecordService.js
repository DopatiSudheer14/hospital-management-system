import api from './api';

const medicalRecordService = {
  getMedicalRecordsByPatientId: async (patientId) => {
    try {
      const response = await api.get(`/records/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addMedicalRecord: async (medicalRecord) => {
    try {
      const response = await api.post('/records', medicalRecord);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default medicalRecordService;

