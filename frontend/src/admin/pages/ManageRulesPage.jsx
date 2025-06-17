// frontend/src/admin/pages/ManageRulesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ruleService from '../services/ruleService';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import './ManagePages.css';

const ManageRulesPage = () => {
    const [ruleSets, setRuleSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { getIdToken } = useAuth(); // Assuming getIdToken is stable and won't cause re-renders

    // The fetch logic is now part of the useEffect hook
    useEffect(() => {
        // Define the async function INSIDE the effect
        const fetchRuleSets = async () => {
            try {
                setLoading(true);
                // We can use getIdToken here, but since it's from a context, it's generally stable.
                // If it were a prop or state, we'd add it to the dependency array.
                const response = await ruleService.getAll(getIdToken); 
                setRuleSets(response.data);
            } catch (err) {
                setError("Failed to fetch rule sets.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRuleSets();
    }, [getIdToken]); // Add getIdToken as a dependency. Context values should be stable.

    // The handleDelete function is defined outside because it's an event handler,
    // but it needs a way to re-trigger the fetch. We can create a state for that.
    const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger refetch
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This cannot be undone.")) {
            try {
                await ruleService.remove(id, getIdToken);
                alert("Rule set deleted.");
                // Instead of calling fetchRuleSets directly, we trigger the effect to run again
                setRefreshTrigger(prev => prev + 1); 
            } catch (err) {
                const errorMessage = err.response?.data?.message || "Failed to delete.";
                setError(errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        }
    };
    
    // We update the useEffect to also listen to changes in refreshTrigger
    useEffect(() => {
        const fetchRuleSets = async () => {
            try {
                setLoading(true);
                const response = await ruleService.getAll(getIdToken);
                setRuleSets(response.data);
            } catch (err) {
                setError("Failed to fetch rule sets.");
            } finally {
                setLoading(false);
            }
        };
        fetchRuleSets();
    }, [getIdToken, refreshTrigger]); // Effect will now re-run when refreshTrigger changes


    if (loading) {
        return <div className="loading-spinner-container"><FaSpinner className="loading-spinner" /> Loading Rule Sets...</div>;
    }

    // ... The rest of your JSX remains the same ...
    return (
        <div className="manage-page">
            <div className="manage-page-header">
                <h1>Manage Audition Rules</h1>
                <Link to="/admin/rules/new" className="add-new-button"><FaPlus /> Add New Rule Set</Link>
            </div>
            {error && <p className="admin-error-message">{error}</p>}
            <div className="manage-table-container">
                <table className="manage-table">
                    <thead><tr><th>Section Title</th><th>Active</th><th>Last Updated</th><th>Actions</th></tr></thead>
                    <tbody>
                        {ruleSets.length > 0 ? ruleSets.map(set => (
                            <tr key={set._id}>
                                <td data-label="Title">{set.sectionTitle}</td>
                                <td data-label="Active">{set.isActive && <FaCheckCircle className="active-icon" title="Currently Active" />}</td>
                                <td data-label="Last Updated">{new Date(set.lastUpdated).toLocaleString()}</td>
                                <td data-label="Actions">
                                    <div className="action-buttons">
                                        <Link to={`/admin/rules/edit/${set._id}`} className="action-button edit"><FaEdit /></Link>
                                        <button onClick={() => handleDelete(set._id)} className="action-button delete"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : ( <tr><td colSpan="4" className="no-data-cell">No rule sets found.</td></tr> )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRulesPage;