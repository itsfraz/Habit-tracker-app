import axios from 'axios';

const API_URL = 'https://habit-tracker-app-lwym.onrender.com:5000/api/auth';

const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
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
