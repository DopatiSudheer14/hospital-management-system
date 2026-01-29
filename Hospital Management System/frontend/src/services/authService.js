import api from './api';

const authService = {
  registerUser: async (name, email, password, role) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  loginUser: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;

