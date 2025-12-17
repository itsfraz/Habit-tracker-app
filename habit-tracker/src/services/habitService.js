import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/habits/';

const getAuthHeader = () => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    // Correctly format the Authorization header
    return { 'Authorization': `Bearer ${user.token}` };
  }
  return {};
};

// Add error interceptor to handle 401 errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      authService.logout();
      window.location = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

const getHabits = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const addHabit = (habit) => {
  return axios.post(API_URL, habit, { headers: getAuthHeader() });
};

const updateHabit = (id, habit) => {
  return axios.put(API_URL + id, habit, { headers: getAuthHeader() });
};

const deleteHabit = (id) => {
  return axios.delete(API_URL + id, { headers: getAuthHeader() });
};

const completeHabit = (id) => {
  return axios.post(API_URL + id + '/complete', {}, { headers: getAuthHeader() });
};

const habitService = {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  completeHabit
};

export default habitService;