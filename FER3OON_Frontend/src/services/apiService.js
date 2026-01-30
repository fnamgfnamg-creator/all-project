import axios from './axios';

export const apiService = {
  // Stats
  getStats: async () => {
    const response = await axios.get('/api/stats');
    return response.data;
  },

  // Users
  getUsers: async (status = null) => {
    const params = status ? { status } : {};
    const response = await axios.get('/api/users', { params });
    return response.data;
  },

  getUserByUID: async (uid) => {
    const response = await axios.get(`/api/users/${uid}`);
    return response.data;
  },

  updateUserStatus: async (uid, status) => {
    const response = await axios.patch(`/api/users/${uid}/status`, { status });
    return response.data;
  },

  deleteUser: async (uid) => {
    const response = await axios.delete(`/api/users/${uid}`);
    return response.data;
  },
};
