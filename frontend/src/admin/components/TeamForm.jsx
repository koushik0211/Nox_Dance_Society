// frontend/src/admin/components/TeamForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import teamService from '../services/teamService';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import './AdminForms.css'; // A shared CSS file for admin forms

const TeamForm = () => {
    const [formData, setFormData] = useState({
        name: '', year: '', position: '', category: 'Members', 
        instaUrl: '', linkedInUrl: '', intro: '', specialization: '', 
        imageUrl: '', isActive: true, displayOrder: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode
    const isEditMode = !!id; // Simple boolean check
    const { getIdToken } = useAuth();

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            teamService.getById(id)
                .then(res => {
                    const memberData = res.data;
                    setFormData({
                        name: memberData.name || '',
                        year: memberData.year || '',
                        position: memberData.position || '',
                        category: memberData.category || 'Members',
                        instaUrl: memberData.instaUrl || '',
                        linkedInUrl: memberData.linkedInUrl || '',
                        intro: memberData.intro || '',
                        specialization: memberData.specialization || '',
                        imageUrl: memberData.imageUrl || '',
                        isActive: memberData.isActive !== undefined ? memberData.isActive : true,
                        displayOrder: memberData.displayOrder || 0,
                    });
                    if (res.data.imageUrl) {
                        setImagePreview(res.data.imageUrl);
                    }
                })
                .catch(err => setError("Failed to load member data."))
                .finally(() => setLoading(false));
        }
    }, [isEditMode, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            // Basic file type check
            if (!file.type.startsWith('image/')) {
                alert("Please upload a valid image file (jpg, png, gif).");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        let finalImageUrl = formData.imageUrl;

        if (imageFile) {
            const imageName = `${formData.name.replace(/\s+/g, '_') || 'team-member'}-${uuidv4()}`;
            const storageRef = ref(storage, `team_images/${imageName}`);
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
        
        const memberData = { ...formData, imageUrl: finalImageUrl };

        try {
            if (isEditMode) {
                await teamService.update(id, memberData, getIdToken);
                alert("Team member updated successfully!");
            } else {
                await teamService.create(memberData, getIdToken);
                alert("Team member added successfully!");
            }
            navigate('/admin/team');
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed. Please check the console.");
            console.error(err.response?.data || err);
        } finally {
            setLoading(false); setUploadProgress(0);
        }
    };

    return (
        <div className="admin-form-container">
            <h1 className="admin-form-title">{isEditMode ? 'Edit' : 'Add New'} Team Member</h1>
            {loading && !isEditMode && <p>Loading...</p>}
            <form onSubmit={handleSubmit} className="admin-form">
                {error && <p className="admin-error-message">{error}</p>}
                
                <div className="form-grid">
                    <div className="admin-form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="position">Position</label>
                        <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="category">Category</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange}>
                            <option value="Executive Board">Executive Board</option>
                            <option value="Core Team">Core Team</option>
                            <option value="Members">Members</option>
                        </select>
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="year">Year</label>
                        <input type="text" name="year" id="year" value={formData.year} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="instaUrl">Instagram URL</label>
                        <input type="url" name="instaUrl" id="instaUrl" value={formData.instaUrl} onChange={handleChange} placeholder="https://instagram.com/username" />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="linkedInUrl">LinkedIn URL</label>
                        <input type="url" name="linkedInUrl" id="linkedInUrl" value={formData.linkedInUrl} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
                    </div>
                    <div className="admin-form-group full-span">
                        <label htmlFor="intro">Introduction</label>
                        <textarea name="intro" id="intro" rows="4" value={formData.intro} onChange={handleChange}></textarea>
                    </div>
                    <div className="admin-form-group full-span">
                        <label htmlFor="specialization">Specialization</label>
                        <input type="text" name="specialization" id="specialization" value={formData.specialization} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group full-span">
                        <label>Member Image</label>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                        <input type="file" name="imageUrl" id="imageUrl" onChange={handleImageChange} accept="image/*" />
                        {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
                    </div>
                    <div className="admin-form-group checkbox-group">
                        <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} />
                        <label htmlFor="isActive">Is Active Member</label>
                    </div>
                     <div className="admin-form-group">
                        <label htmlFor="displayOrder">Display Order (0 is highest)</label>
                        <input type="number" name="displayOrder" id="displayOrder" value={formData.displayOrder} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/team')} className="cancel-button">Cancel</button>
                    <button type="submit" className="admin-submit-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Member'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeamForm;