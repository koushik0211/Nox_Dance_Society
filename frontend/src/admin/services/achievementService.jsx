// frontend/src/admin/services/achievementService.js
import axios from 'axios';
import authService from './authService';

const API_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001') + '/api/achievements';

const createAuthHeader = async () => {
    const token = await authService.getIdToken();
    if (!token) throw new Error("Admin not authenticated.");
    return { headers: { Authorization: `Bearer ${token}` } };
};

// Public
const getAll = () => axios.get(API_URL);
const getById = (id) => axios.get(`${API_URL}/${id}`);

// Admin
const create = async (data) => {
    const config = await createAuthHeader();
    return axios.post(API_URL, data, config);
};
const update = async (id, data) => {
    const config = await createAuthHeader();
    return axios.put(`${API_URL}/${id}`, data, config);
};
const remove = async (id) => {
    const config = await createAuthHeader();
    return axios.delete(`${API_URL}/${id}`, config);
};

const achievementService = { getAll, getById, create, update, remove };
export default achievementService;