// frontend/src/admin/pages/ManageStatusPage.js
import React, { useState, useEffect } from 'react';
import statusService from '../services/statusService';
import { FaSpinner } from 'react-icons/fa';
import './ManagePages.css'; // Shared styles
import './ManageStatusPage.css'; // New specific styles

const ManageStatusPage = () => {
    const [status, setStatus] = useState({ areAuditionsOpen: false, messageWhenClosed: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        statusService.getStatus()
            .then(res => setStatus(res.data))
            .catch(() => setError("Failed to load current status."))
            .finally(() => setLoading(false));
    }, []);

    const handleToggle = async () => {
        setSaving(true);
        try {
            const newStatus = !status.areAuditionsOpen;
            const updatedStatus = await statusService.updateStatus({ ...status, areAuditionsOpen: newStatus });
            setStatus(updatedStatus.data);
            alert(`Auditions are now ${newStatus ? 'OPEN' : 'CLOSED'}.`);
        } catch (err) {
            alert("Failed to update status.");
        } finally {
            setSaving(false);
        }
    };
    
    const handleMessageChange = (e) => {
        setStatus(prev => ({...prev, messageWhenClosed: e.target.value}));
    };
    
    const handleSaveMessage = async () => {
        setSaving(true);
        try {
            const updatedStatus = await statusService.updateStatus(status);
            setStatus(updatedStatus.data);
            alert("Message updated successfully.");
        } catch (err) {
            alert("Failed to save message.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading-spinner-container"><FaSpinner className="loading-spinner" /> Loading Status...</div>;

    return (
        <div className="manage-page">
            <div className="manage-page-header">
                <h1>Manage Audition Status</h1>
            </div>
            {error && <p className="admin-error-message">{error}</p>}
            
            <div className="status-control-card">
                <h3>Current Audition Status: 
                    <span className={status.areAuditionsOpen ? 'status-open' : 'status-closed'}>
                        {status.areAuditionsOpen ? ' OPEN' : ' CLOSED'}
                    </span>
                </h3>
                <p>Use the toggle below to open or close public audition registrations.</p>
                <div className="toggle-switch-container">
                    <span>Closed</span>
                    <label className="toggle-switch">
                        <input type="checkbox" checked={status.areAuditionsOpen} onChange={handleToggle} disabled={saving} />
                        <span className="slider"></span>
                    </label>
                    <span>Open</span>
                </div>
            </div>

            <div className="status-control-card">
                <h3>Message When Closed</h3>
                <p>This message will be shown to users when they try to access the auditions page while it's closed.</p>
                <textarea 
                    value={status.messageWhenClosed} 
                    onChange={handleMessageChange}
                    className="message-textarea"
                    rows="3"
                />
                <button onClick={handleSaveMessage} disabled={saving} className="add-new-button">
                    {saving ? 'Saving...' : 'Save Message'}
                </button>
            </div>
        </div>
    );
};

export default ManageStatusPage;