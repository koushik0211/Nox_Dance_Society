// frontend/src/admin/services/auditionService.js
import axios from 'axios';
import authService from './authService';

const API_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001') + '/api/auditions';

const createAuthHeader = async () => {
    const token = await authService.getIdToken();
    if (!token) throw new Error("Admin not authenticated.");
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getAll = async () => {
    const config = await createAuthHeader();
    return axios.get(API_URL, config);
};
const getById = async (id) => {
    const config = await createAuthHeader();
    return axios.get(`${API_URL}/${id}`, config);
};
const addReview = async (id, reviewData) => {
    const config = await createAuthHeader();
    return axios.post(`${API_URL}/${id}/reviews`, reviewData, config);
};
const updateStatus = async (id, statusData) => {
    const config = await createAuthHeader();
    return axios.put(`${API_URL}/${id}/status`, statusData, config);
};

const removeEntry = async (id) => {
    const config = await createAuthHeader();
    return axios.delete(`${API_URL}/${id}`, config);
};

const removeReview = async (auditionId, reviewId) => {
    const config = await createAuthHeader();
    return axios.delete(`${API_URL}/${auditionId}/reviews/${reviewId}`, config);
};

const auditionService = { getAll, getById, addReview, updateStatus, removeEntry, removeReview };
export default auditionService;
