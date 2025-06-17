// frontend/src/admin/components/AchievementForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import achievementService from '../services/achievementService';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import './AdminForms.css';

const AchievementForm = () => {
    const [formData, setFormData] = useState({
        title: '', year: new Date().getFullYear().toString(), event: '', category: '',
        imageUrl: '', description: '', teamMemberIdsInvolved: '', specialMentions: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const { getIdToken } = useAuth();

    useEffect(() => {
        if (isEditMode && id) {
            setLoading(true);
            achievementService.getById(id)
                .then(res => {
                    const data = res.data;
                    setFormData({
                        ...data,
                        teamMemberIdsInvolved: data.teamMemberIdsInvolved.join(', '),
                        specialMentions: data.specialMentions.join(', ')
                    });
                    if (data.imageUrl) setImagePreview(data.imageUrl);
                })
                .catch(err => setError("Failed to load achievement data."))
                .finally(() => setLoading(false));
        }
    }, [isEditMode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        
        let finalImageUrl = formData.imageUrl;

        if (imageFile) {
            const imageName = `${formData.title.replace(/\s+/g, '_') || 'achievement'}-${uuidv4()}`;
            const storageRef = ref(storage, `achievement_images/${imageName}`);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            try {
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
                        reject, 
                        async () => {
                            finalImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            } catch (err) {
                setError("Image upload failed: " + err.message); setLoading(false); return;
            }
        }
        
        const achievementData = {
            ...formData,
            imageUrl: finalImageUrl,
            teamMemberIdsInvolved: formData.teamMemberIdsInvolved.split(',').map(item => item.trim()).filter(Boolean),
            specialMentions: formData.specialMentions.split(',').map(item => item.trim()).filter(Boolean)
        };

        try {
            if (isEditMode) {
                await achievementService.update(id, achievementData, getIdToken);
                alert("Achievement updated successfully!");
            } else {
                await achievementService.create(achievementData, getIdToken);
                alert("Achievement added successfully!");
            }
            navigate('/admin/achievements');
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed.");
        } finally {
            setLoading(false); setUploadProgress(0);
        }
    };

    return (
        <div className="admin-form-container">
            <h1 className="admin-form-title">{isEditMode ? 'Edit' : 'Add New'} Achievement</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                {error && <p className="admin-error-message">{error}</p>}
                
                <div className="form-grid">
                    <div className="admin-form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Year</label>
                        <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Event</label>
                        <input type="text" name="event" value={formData.event} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group">
                        <label>Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group full-span">
                        <label>Description</label>
                        <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="admin-form-group full-span">
                        <label>Team Members (comma-separated IDs or names)</label>
                        <input type="text" name="teamMemberIdsInvolved" value={formData.teamMemberIdsInvolved} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group full-span">
                        <label>Special Mentions (comma-separated)</label>
                        <input type="text" name="specialMentions" value={formData.specialMentions} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group full-span">
                        <label>Achievement Image</label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                        <input type="file" name="imageUrl" onChange={handleImageChange} accept="image/*" />
                        {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/achievements')} className="cancel-button">Cancel</button>
                    <button type="submit" className="admin-submit-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Achievement'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AchievementForm;