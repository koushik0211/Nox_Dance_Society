// frontend/src/admin/pages/ManageAchievementsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import achievementService from '../services/achievementService';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import './ManagePages.css';

const ManageAchievementsPage = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { getIdToken } = useAuth();

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const response = await achievementService.getAll();
            setAchievements(response.data);
        } catch (err) {
            setError("Failed to fetch achievements.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this achievement?")) {
            try {
                await achievementService.remove(id, getIdToken);
                alert("Achievement deleted successfully.");
                fetchAchievements(); // Refetch to update the list
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to delete achievement.";
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        }
    };

    if (loading) {
        return <div className="loading-spinner-container"><FaSpinner className="loading-spinner" /> Loading Achievements...</div>;
    }

    return (
        <div className="manage-page">
            <div className="manage-page-header">
                <h1>Manage Achievements</h1>
                <Link to="/admin/achievements/new" className="add-new-button">
                    <FaPlus /> Add New Achievement
                </Link>
            </div>
            
            {error && <p className="admin-error-message">{error}</p>}
            
            <div className="manage-table-container">
                <table className="manage-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Year</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {achievements.length > 0 ? achievements.map(item => (
                            <tr key={item._id}>
                                <td data-label="Image"><img src={item.imageUrl || "/assets/achievements/placeholder_achievement.jpg"} alt={item.title} className="table-image-preview" /></td>
                                <td data-label="Title">{item.title}</td>
                                <td data-label="Year">{item.year}</td>
                                <td data-label="Category">{item.category}</td>
                                <td data-label="Actions">
                                    <div className="action-buttons">
                                        <Link to={`/admin/achievements/edit/${item._id}`} className="action-button edit"><FaEdit /></Link>
                                        <button onClick={() => handleDelete(item._id)} className="action-button delete"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="no-data-cell">No achievements found. Add one to get started!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAchievementsPage;