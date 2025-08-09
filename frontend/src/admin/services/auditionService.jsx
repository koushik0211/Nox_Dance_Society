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
const scheduleSlots = async (scheduleData) => {
    const config = await createAuthHeader();
    // This is a POST request as it's an action that modifies data
    return axios.post(`${API_URL}/schedule-slots`, scheduleData, config);
};

const removeNotSelected = async () => {
    const config = await createAuthHeader();
    return axios.delete(`${API_URL}/not-selected`, config);
};

const exportToCsv = async () => {
    const config = await createAuthHeader();
    // We need to tell axios that the response will be a blob (a file-like object)
    config.responseType = 'blob'; 

    try {
        const response = await axios.get(`${API_URL}/export`, config);
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Extract filename from response headers if possible, otherwise use a default
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'audition_schedule.csv';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length === 2)
                fileName = fileNameMatch[1];
        }
        
        link.setAttribute('download', fileName);
        
        // Append to the document, click, and then remove
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Clean up the blob URL

    } catch (error) {
        console.error("Error downloading CSV:", error);
        // Since the response might be a blob, we need to handle error messages differently
        // If the server sent a JSON error, we need to parse it from the blob
        if (error.response && error.response.data.type === 'application/json') {
            const errorJson = await new Response(error.response.data).json();
            throw new Error(errorJson.message || 'Failed to export CSV.');
        }
        throw new Error('Failed to export CSV. No slotted auditions may be available.');
    }
};

const auditionService = { getAll, getById, addReview, updateStatus, removeEntry, removeReview, scheduleSlots,removeNotSelected,exportToCsv  };
export default auditionService;
