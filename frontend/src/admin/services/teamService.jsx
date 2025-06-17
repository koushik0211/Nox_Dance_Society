// frontend/src/admin/services/teamService.js
import axios from 'axios';

// Helper to create an authenticated config object
const createAuthHeader = async (getIdToken) => {
    const token = await getIdToken();
    if (!token) {
        throw new Error("No authentication token found. Please log in again.");
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const API_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001') + '/api/team';

// --- Public Functions ---
const getAll = () => {
    return axios.get(API_URL);
};

const getById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// --- Admin Protected Functions ---
const create = async (memberData, getIdToken) => {
    const config = await createAuthHeader(getIdToken);
    // Important: When sending FormData, axios sets the Content-Type header automatically with the boundary.
    // So we don't set it manually here.
    return axios.post(API_URL, memberData, config);
};

const update = async (id, memberData, getIdToken) => {
    const config = await createAuthHeader(getIdToken);
    return axios.put(`${API_URL}/${id}`, memberData, config);
};

const remove = async (id, getIdToken) => {
    const config = await createAuthHeader(getIdToken);
    return axios.delete(`${API_URL}/${id}`, config);
};

const teamService = {
    getAll,
    getById,
    create,
    update,
    remove
};

export default teamService;