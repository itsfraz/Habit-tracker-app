import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/habits/';

const getAuthHeader = () => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  }
  return {};
};

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

// Assign to variable before exporting
const habitService = {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit
};

export default habitService;