import api from './api';

const reportsService = {
  getMonthlyAppointmentCounts: async () => {
    try {
      const response = await api.get('/reports/monthly-appointments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMonthlyRevenue: async () => {
    try {
      const response = await api.get('/reports/monthly-revenue');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reportsService;

