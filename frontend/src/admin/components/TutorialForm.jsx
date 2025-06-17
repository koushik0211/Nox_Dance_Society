// frontend/src/admin/components/TutorialForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import tutorialService from '../services/tutorialService';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import './AdminForms.css';

const TutorialForm = () => {
    const [formData, setFormData] = useState({
        title: '', danceStyle: '', videoUrl: '', thumbnailUrl: '', description: '',
        instructor: '', instructorInstaUrl: '', difficulty: 'All Levels',
        tags: '', isPublished: true, displayOrder: 0
    });
    const [videoFile, setVideoFile] = useState(null);
    const [thumbFile, setThumbFile] = useState(null);
    const [thumbPreview, setThumbPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState({ video: 0, thumb: 0 });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const { getIdToken } = useAuth();

    useEffect(() => {
        if (isEditMode && id) {
            setLoading(true);
            tutorialService.getById(id)
                .then(res => {
                    const data = res.data;
                    setFormData({ ...data, tags: data.tags.join(', ') }); // Convert tags array to comma-separated string for input field
                    if (data.thumbnailUrl) setThumbPreview(data.thumbnailUrl);
                })
                .catch(err => setError("Failed to load tutorial data."))
                .finally(() => setLoading(false));
        }
    }, [isEditMode, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            if (name === 'videoFile') setVideoFile(files[0]);
            if (name === 'thumbFile') {
                setThumbFile(files[0]);
                setThumbPreview(URL.createObjectURL(files[0]));
            }
        }
    };

    const uploadFile = async (file, pathPrefix, progressKey) => {
        if (!file) return null;
        const fileName = `${file.name.split('.')[0]}-${uuidv4()}.${file.name.split('.').pop()}`;
        const storageRef = ref(storage, `${pathPrefix}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => setUploadProgress(prev => ({...prev, [progressKey]: (snapshot.bytesTransferred / snapshot.totalBytes) * 100})),
                reject,
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        
        try {
            const videoUrl = await uploadFile(videoFile, 'tutorial_videos', 'video');
            const thumbnailUrl = await uploadFile(thumbFile, 'tutorial_thumbnails', 'thumb');
            
            const tutorialData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Convert string to array
                videoUrl: videoUrl || formData.videoUrl, // Use new URL if uploaded, else keep old
                thumbnailUrl: thumbnailUrl || formData.thumbnailUrl,
            };

            if (isEditMode) {
                await tutorialService.update(id, tutorialData, getIdToken);
                alert("Tutorial updated successfully!");
            } else {
                await tutorialService.create(tutorialData, getIdToken);
                alert("Tutorial added successfully!");
            }
            navigate('/admin/tutorials');
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Operation failed.");
        } finally {
            setLoading(false); setUploadProgress({ video: 0, thumb: 0 });
        }
    };

    return (
        <div className="admin-form-container">
            <h1 className="admin-form-title">{isEditMode ? 'Edit' : 'Add New'} Tutorial</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                {error && <p className="admin-error-message">{error}</p>}
                
                <div className="form-grid">
                    <div className="admin-form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Dance Style</label>
                        <input type="text" name="danceStyle" value={formData.danceStyle} onChange={handleChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Instructor Name</label>
                        <input type="text" name="instructor" value={formData.instructor} onChange={handleChange} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Instructor Instagram URL</label>
                        <input type="url" name="instructorInstaUrl" value={formData.instructorInstaUrl} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group">
                        <label>Difficulty</label>
                        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="All Levels">All Levels</option>
                        </select>
                    </div>
                    <div className="admin-form-group">
                        <label>Tags (comma-separated)</label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
                    </div>
                    <div className="admin-form-group full-span">
                        <label>Description</label>
                        <textarea name="description" rows="4" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="admin-form-group">
                        <label>Thumbnail Image</label>
                        {thumbPreview && <img src={thumbPreview} alt="Preview" className="image-preview" />}
                        <input type="file" name="thumbFile" onChange={handleFileChange} accept="image/*" />
                        {uploadProgress.thumb > 0 && <progress value={uploadProgress.thumb} max="100" />}
                    </div>
                    <div className="admin-form-group">
                        <label>Tutorial Video</label>
                        {formData.videoUrl && !videoFile && <p className="current-file-info">Current video set.</p>}
                        <input type="file" name="videoFile" onChange={handleFileChange} accept="video/*" />
                        {uploadProgress.video > 0 && <progress value={uploadProgress.video} max="100" />}
                    </div>
                    <div className="admin-form-group checkbox-group">
                        <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} />
                        <label htmlFor="isPublished">Is Published</label>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/tutorials')} className="cancel-button">Cancel</button>
                    <button type="submit" className="admin-submit-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Tutorial'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TutorialForm;