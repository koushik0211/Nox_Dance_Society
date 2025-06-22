// frontend/src/admin/services/statusService.js
import axios from 'axios';
import authService from './authService';

const API_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001') + '/api/audition-status';

const createAuthHeader = async () => {
    const token = await authService.getIdToken();
    if (!token) throw new Error("Admin not authenticated.");
    return { headers: { Authorization: `Bearer ${token}` } };
};

const getStatus = () => axios.get(API_URL);

const updateStatus = async (statusData) => {
    const config = await createAuthHeader();
    return axios.put(API_URL, statusData, config);
};

const statusService = { getStatus, updateStatus };
export default statusService;