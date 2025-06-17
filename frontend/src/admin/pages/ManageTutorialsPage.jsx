// frontend/src/admin/pages/ManageTutorialsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tutorialService from '../services/tutorialService';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import './ManagePages.css';

const ManageTutorialsPage = () => {
    const [tutorialsByStyle, setTutorialsByStyle] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { getIdToken } = useAuth();

    const fetchTutorials = async () => {
        try {
            setLoading(true);
            const response = await tutorialService.getAll();
            setTutorialsByStyle(response.data);
        } catch (err) {
            setError("Failed to fetch tutorials.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutorials();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tutorial?")) {
            try {
                await tutorialService.remove(id, getIdToken);
                alert("Tutorial deleted successfully.");
                // Refetch all tutorials to update the list
                fetchTutorials();
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to delete tutorial.";
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        }
    };

    if (loading) {
        return <div className="loading-spinner-container"><FaSpinner className="loading-spinner" /> Loading Tutorials...</div>;
    }

    return (
        <div className="manage-page">
            <div className="manage-page-header">
                <h1>Manage Learn Page Tutorials</h1>
                <Link to="/admin/tutorials/new" className="add-new-button">
                    <FaPlus /> Add New Tutorial
                </Link>
            </div>
            
            {error && <p className="admin-error-message">{error}</p>}
            
            {Object.keys(tutorialsByStyle).length > 0 ? (
                Object.keys(tutorialsByStyle).map(style => (
                    <div key={style} className="manage-section">
                        <h3 className="manage-section-title">{style}</h3>
                        <div className="manage-table-container">
                            <table className="manage-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Instructor</th>
                                        <th>Difficulty</th>
                                        <th>Published</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tutorialsByStyle[style].map(tutorial => (
                                        <tr key={tutorial._id}>
                                            <td data-label="Title">{tutorial.title}</td>
                                            <td data-label="Instructor">{tutorial.instructor}</td>
                                            <td data-label="Difficulty">{tutorial.difficulty}</td>
                                            <td data-label="Published">
                                                <span className={`status-badge ${tutorial.isPublished ? 'active' : 'inactive'}`}>
                                                    {tutorial.isPublished ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td data-label="Actions">
                                                <div className="action-buttons">
                                                    <Link to={`/admin/tutorials/edit/${tutorial._id}`} className="action-button edit"><FaEdit /></Link>
                                                    <button onClick={() => handleDelete(tutorial._id)} className="action-button delete"><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-data-cell">No tutorials found. Add one to get started!</p>
            )}
        </div>
    );
};

export default ManageTutorialsPage;