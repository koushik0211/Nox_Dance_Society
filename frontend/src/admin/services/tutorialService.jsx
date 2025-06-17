// frontend/src/admin/services/tutorialService.js
import axios from 'axios';
import authService from './authService'; // Assuming authService is in the same folder

const API_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001') + '/api/tutorials';

// Helper to create an authenticated config object
const createAuthHeader = async () => {
    const token = await authService.getIdToken();
    if (!token) throw new Error("User not authenticated");
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getAll = () => {
    // Backend returns tutorials grouped by style
    return axios.get(API_URL); 
};

const getById = (id) => {
    return axios.get(`${API_URL}/${id}`); 
};

const create = async (tutorialData) => {
    const config = await createAuthHeader();
    // Your backend controller for tutorials expects JSON data
    return axios.post(API_URL, tutorialData, config);
};

const update = async (id, tutorialData) => {
    const config = await createAuthHeader();
    return axios.put(`${API_URL}/${id}`, tutorialData, config);
};

const remove = async (id) => {
    const config = await createAuthHeader();
    return axios.delete(`${API_URL}/${id}`, config);
};

const tutorialService = {
    getAll,
    getById,
    create,
    update,
    remove
};

export default tutorialService;