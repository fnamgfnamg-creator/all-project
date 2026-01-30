import axios from './axios';

export const authService = {
  login: async (username, password) => {
    const response = await axios.post('/api/auth/admin/login', {
      username,
      password,
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getAdmin: () => {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  },
};
