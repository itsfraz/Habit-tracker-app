import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create a separate Axios instance for auth requests
const authApi = axios.create({
  baseURL: API_URL,
});

const register = async (userData) => {
  // Use the dedicated authApi instance
  const response = await authApi.post('/register', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  // Use the dedicated authApi instance
  const response = await authApi.post('/login', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
