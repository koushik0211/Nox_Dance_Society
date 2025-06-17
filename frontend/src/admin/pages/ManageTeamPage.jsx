// frontend/src/admin/pages/ManageTeamPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import teamService from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import './ManagePages.css'; // A shared CSS file for management pages

const ManageTeamPage = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { getIdToken } = useAuth(); // Get token function from context

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await teamService.getAll();
                setMembers(response.data);
            } catch (err) {
                setError("Failed to fetch team members. Please try again later.");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this team member?")) {
            try {
                await teamService.remove(id, getIdToken);
                setMembers(members.filter(m => m._id !== id));
                alert("Member deleted successfully.");
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to delete member.";
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
                console.error("Delete error:", err);
            }
        }
    };
    
    if (loading) {
        return <div className="loading-spinner-container"><FaSpinner className="loading-spinner" /> Loading Team Members...</div>;
    }

    return (
        <div className="manage-page">
            <div className="manage-page-header">
                <h1>Manage Team Members</h1>
                <Link to="/admin/team/new" className="add-new-button">
                    <FaPlus /> Add New Member
                </Link>
            </div>
            
            {error && <p className="admin-error-message">{error}</p>}
            
            <div className="manage-table-container">
                <table className="manage-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Category</th>
                            <th>Year</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length > 0 ? members.map(member => (
                            <tr key={member._id}>
                                <td data-label="Image">
                                    <img 
                                        src={member.imageUrl || "/assets/team/member_placeholder.png"} 
                                        alt={member.name} 
                                        className="table-image-preview" 
                                    />
                                </td>
                                <td data-label="Name">{member.name}</td>
                                <td data-label="Position">{member.position}</td>
                                <td data-label="Category">{member.category}</td>
                                <td data-label="Year">{member.year}</td>
                                <td data-label="Active">
                                    <span className={`status-badge ${member.isActive ? 'active' : 'inactive'}`}>
                                        {member.isActive ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td data-label="Actions">
                                    <div className="action-buttons">
                                        <Link to={`/admin/team/edit/${member._id}`} className="action-button edit">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(member._id)} className="action-button delete">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="no-data-cell">No team members found. Add one to get started!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageTeamPage;