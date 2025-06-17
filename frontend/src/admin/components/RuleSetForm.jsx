// frontend/src/admin/components/RuleSetForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ruleService from '../services/ruleService';
import { useAuth } from '../contexts/AuthContext';
import './AdminForms.css';

const RuleSetForm = () => {
    const [formData, setFormData] = useState({
        sectionTitle: 'Audition Rules & Guidelines',
        rules: [{ text: '', order: 0 }],
        eventDetails: { date: '', day: '', venue: '', time: '' },
        isActive: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const { getIdToken } = useAuth();

    useEffect(() => {
        if (isEditMode && id) {
            setLoading(true);
            ruleService.getById(id, getIdToken)
                .then(res => setFormData(res.data))
                .catch(err => setError("Failed to load rule set."))
                .finally(() => setLoading(false));
        }
    }, [isEditMode, id, getIdToken]);

    const handleMainChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleEventDetailChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, eventDetails: { ...prev.eventDetails, [name]: value } }));
    };

    const handleRuleChange = (index, e) => {
        const newRules = [...formData.rules];
        newRules[index][e.target.name] = e.target.value;
        setFormData(prev => ({ ...prev, rules: newRules }));
    };

    const addRule = () => {
        setFormData(prev => ({ ...prev, rules: [...prev.rules, { text: '', order: prev.rules.length }] }));
    };

    const removeRule = (index) => {
        setFormData(prev => ({ ...prev, rules: formData.rules.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            if (isEditMode) {
                await ruleService.update(id, formData, getIdToken);
                alert("Rule set updated successfully!");
            } else {
                await ruleService.create(formData, getIdToken);
                alert("Rule set added successfully!");
            }
            navigate('/admin/rules');
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            <h1 className="admin-form-title">{isEditMode ? 'Edit' : 'Add New'} Audition Rule Set</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                {error && <p className="admin-error-message">{error}</p>}
                
                <div className="form-grid">
                    <div className="admin-form-group full-span">
                        <label>Section Title</label>
                        <input type="text" name="sectionTitle" value={formData.sectionTitle} onChange={handleMainChange} required />
                    </div>

                    <h3 className="form-subtitle full-span">Event Details</h3>
                    <div className="admin-form-group"><label>Date</label><input type="text" name="date" value={formData.eventDetails.date} onChange={handleEventDetailChange} /></div>
                    <div className="admin-form-group"><label>Day</label><input type="text" name="day" value={formData.eventDetails.day} onChange={handleEventDetailChange} /></div>
                    <div className="admin-form-group"><label>Venue</label><input type="text" name="venue" value={formData.eventDetails.venue} onChange={handleEventDetailChange} /></div>
                    <div className="admin-form-group"><label>Time</label><input type="text" name="time" value={formData.eventDetails.time} onChange={handleEventDetailChange} /></div>

                    <h3 className="form-subtitle full-span">Rules List</h3>
                    {formData.rules.map((rule, index) => (
                        <div key={index} className="form-rule-item full-span">
                            <input type="text" name="text" placeholder={`Rule #${index + 1}`} value={rule.text} onChange={(e) => handleRuleChange(index, e)} />
                            <button type="button" onClick={() => removeRule(index)} className="delete-rule-button">×</button>
                        </div>
                    ))}
                    <div className="full-span">
                        <button type="button" onClick={addRule} className="add-rule-button">Add Rule</button>
                    </div>

                    <div className="admin-form-group checkbox-group full-span">
                        <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleMainChange} />
                        <label htmlFor="isActive">Set this as the Active Rule Set (will deactivate others)</label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/rules')} className="cancel-button">Cancel</button>
                    <button type="submit" className="admin-submit-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Rule Set'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RuleSetForm;