import api from './api';

const dashboardService = {
  getDashboardSummary: async () => {
    try {
      const response = await api.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;

