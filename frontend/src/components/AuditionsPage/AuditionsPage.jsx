// frontend/src/components/AuditionsPage/AuditionsPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RulesModal from './RulesModal';
import './AuditionsPage.css'; 
import axios from 'axios'; 
import { FaSpinner} from 'react-icons/fa';
import { Link } from 'react-router-dom';


// import { storage } from '../../firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Helper Components
const InputField = ({ id, name, label, type = "text", placeholder, value, onChange, disabled = false }) => (
    <div className="audition-form__group">
        <label htmlFor={id} className="audition-form__label">{label}</label>
        <input type={type} id={id} name={name} placeholder={placeholder} value={value} onChange={onChange} className="audition-form__input" disabled={disabled}/>
    </div>
);
const TextAreaField = ({ id, name, label, placeholder, value, onChange, rows = 4, disabled = false }) => (
    <div className="audition-form__group">
        <label htmlFor={id} className="audition-form__label">{label}</label>
        <textarea id={id} name={name} rows={rows} placeholder={placeholder} value={value} onChange={onChange} className="audition-form__textarea" disabled={disabled}/>
    </div>
);
// const FileUploadField = ({ id, name, label, onChange, disabled = false }) => (
//     <div className="audition-form__group audition-form__group--full-span">
//         <label htmlFor={id} className="audition-form__label">{label}</label>
//         <input type="file" id={id} name={name} onChange={onChange} className="audition-form__file-input" disabled={disabled} accept="video/*"/>
//     </div>
// );

const AuditionsPage = () => {
    const initialFormData = {
        fullName: '', rollNumber: '', phoneNumber: '', emailAddress: '',
        branch: '', rateYourself: '', whyNox: '',
        otherSkills: '', danceStyle: '', danceVideoUrl: '', 
    };
    const [formData, setFormData] = useState(initialFormData);
    // const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isUploading, setIsUploading] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false); 

    // const [uploadProgress, setUploadProgress] = useState(0);
     const [statusData, setStatusData] = useState({ isOpen: false, message: '' });
    const [statusLoading, setStatusLoading] = useState(true);

    // --- STATE FOR RULES DATA ---
    const [rulesData, setRulesData] = useState(null);
    const [rulesLoading, setRulesLoading] = useState(true);
    const [rulesError, setRulesError] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
                const res = await axios.get(`${BACKEND_URL}/api/audition-status`);
                setStatusData({ 
                    isOpen: res.data.areAuditionsOpen, 
                    message: res.data.messageWhenClosed 
                });
            } catch (error) {
                console.error("Could not fetch audition status", error);
                setStatusData({ isOpen: false, message: 'Could not verify audition status. Please try again later.' });
            } finally {
                setStatusLoading(false);
            }
        };
        fetchStatus();
    }, []);

    // --- useEffect TO FETCH AUDITION RULES ---
    useEffect(() => {
        const fetchActiveRules = async () => {
            const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
            try {
                const response = await axios.get(`${BACKEND_URL}/api/audition-rules/active`);
                setRulesData(response.data);
                setRulesError(null);
            } catch (err) {
                console.error("Failed to fetch audition rules:", err);
                setRulesError("Could not load audition rules at this time.");
                setRulesData({
                    sectionTitle: "Rules Not Available",
                    rules: [{ text: "Please check back later or contact us for details." }],
                    eventDetails: { date: "TBA", day: "TBA", venue: "TBA", time: "TBA" }
                });
            } finally {
                setRulesLoading(false);
            }
        };
        fetchActiveRules();
    }, []);

     const handleChange = (e) => {
        const { name, value } = e.target;
        // Simplified handler, no need to check for file type
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (selectedFile && (!formData.fullName || !formData.rollNumber)) {
    //         alert("Full Name and Roll Number are required if uploading a video.");
    //         return;
    //     }
    //     setIsSubmitting(true);
    //     setUploadProgress(0);
    //     let uploadedFileUrl = ''; 
    //     if (selectedFile) {
    //         const sanitizedFullName = formData.fullName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, '_') || "UnknownName";
    //         const sanitizedRollNumber = formData.rollNumber.replace(/[^a-zA-Z0-9]/g, "_") || "UnknownRoll";
    //         const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    //         const timestamp = Date.now();
    //         const uniqueFilename = `${sanitizedFullName}_${sanitizedRollNumber}_${timestamp}.${fileExtension}`;
    //         const storageRef = ref(storage, `audition_videos/${uniqueFilename}`);
    //         const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    //         try {
    //             await new Promise((resolve, reject) => {
    //                 uploadTask.on('state_changed',
    //                     (snapshot) => setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
    //                     reject,
    //                     async () => {
    //                         uploadedFileUrl = await getDownloadURL(uploadTask.snapshot.ref);
    //                         resolve();
    //                     }
    //                 );
    //             });
    //         } catch (uploadError) {
    //             setIsUploading(false);
    //             setUploadProgress(0);
    //             alert(`Video upload failed: ${uploadError.message}.`);
    //             return; 
    //         }
    //     }
    //     const dataToSubmitToBackend = { ...formData, danceVideoUrl: uploadedFileUrl };
    //     const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
    //     try {
    //         const response = await axios.post(`${BACKEND_URL}/api/auditions/register`, dataToSubmitToBackend, {
    //             headers: { 'Content-Type': 'application/json' }
    //         });
    //         alert(response.data.message || 'Registration Submitted Successfully!');
    //         setFormData(initialFormData); 
    //         setSelectedFile(null); 
    //         const fileInput = document.getElementById('danceVideo');
    //         if (fileInput) fileInput.value = "";
    //     } catch (error) {
    //         let errorMessage = error.response?.data?.message || error.message || 'Submission failed. Please try again.';
    //         alert(errorMessage);
    //     } finally {
    //         setIsUploading(false);
    //         setUploadProgress(0);
    //     }
    // };

     const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Changed from isUploading to isSubmitting

        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
        
        try {
            // The formData now contains the danceVideoUrl directly from the input field
            const response = await axios.post(`${BACKEND_URL}/api/auditions/register`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Backend submission successful:', response.data);
            alert(response.data.message || 'Registration Submitted Successfully!');
            setFormData(initialFormData); // Reset form
            
        } catch (error) {
            let errorMessage = 'Submission failed. Please try again.';
            if (error.response) {
                console.error('Backend submission error - Server responded:', error.response.data);
                errorMessage = `Submission failed: ${error.response.data.message || 'Server responded with an error.'}`;
            } else if (error.request) {
                console.error('Backend submission error - No response received:', error.request);
                errorMessage = 'Submission failed: No response from server.';
            } else {
                console.error('Backend submission error - Request setup error:', error.message);
                errorMessage = `Submission failed: ${error.message}`;
            }
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (statusLoading) {
        return <div className="loading-fullscreen"><FaSpinner className="loading-spinner" /> Verifying Audition Status...</div>;
    }

    if (!statusData.isOpen) {
        return (
            <div className="auditions-closed-container">
                <h1>Auditions Are Closed</h1>
                <p>{statusData.message}</p>
                <Link to="/" className="audition-form__button--submit">Back to Home</Link>
            </div>
        );
    }


    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeInOut" } }
    };
    const formContainerVariants = {
        initial: {},
        animate: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } 
    };
    const itemVariants = { 
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
    };

    return (
        <motion.div
            className="auditions-page"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="auditions-page__vertical-text-right">NOX DANCE SOCIETY</div>
            <div className="auditions-page__container">
                <div className="auditions-page__form-background-text">NOX</div>
                <motion.h1 className="auditions-page__title" variants={itemVariants}>
                    REGISTER FOR <span className="auditions-page__title--highlight">AUDITIONS</span> HERE !
                </motion.h1>
                <motion.div className="auditions-page__title-divider"
                    variants={itemVariants} initial={{scaleX:0}}
                    animate={{scaleX:1, transition: {delay: 0.1, duration:0.5, ease:"circOut"}}}
                ></motion.div>
                <motion.form onSubmit={handleSubmit} className="audition-form" variants={formContainerVariants} initial="initial" animate="animate">
                    <motion.div variants={itemVariants}><InputField id="fullName" name="fullName" label="Enter Full Name*" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} disabled={isSubmitting} /></motion.div>
                    <motion.div variants={itemVariants}><InputField id="branch" name="branch" label="Your Branch*" placeholder="e.g., COPC, ENC" value={formData.branch} onChange={handleChange} disabled={isSubmitting} /></motion.div>
                    <motion.div variants={itemVariants}><InputField id="rollNumber" name="rollNumber" label="Roll Number*" placeholder="Enter your roll number" value={formData.rollNumber} onChange={handleChange} disabled={isSubmitting} /></motion.div>
                    <motion.div variants={itemVariants}><InputField id="rateYourself" name="rateYourself" label="Rate yourself in dance out of 10*" type="number" placeholder="Enter Rating" value={formData.rateYourself} onChange={handleChange} disabled={isSubmitting} /></motion.div>
                    <motion.div variants={itemVariants}><InputField id="phoneNumber" name="phoneNumber" label="Whatsapp Phone Number*" type="tel" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} disabled={isSubmitting} /></motion.div>
                    <motion.div variants={itemVariants}><InputField id="emailAddress" name="emailAddress" label="Thapar Mail-id*" type="email" placeholder="Enter your email address" value={formData.emailAddress} onChange={handleChange} disabled={isSubmitting} /></motion.div>
                    <motion.div variants={itemVariants}><TextAreaField id="whyNox" name="whyNox" label="Why do you want to join Nox?*" placeholder="Share your thoughts..." value={formData.whyNox} onChange={handleChange} disabled={isSubmitting} /></motion.div>
                    <motion.div variants={itemVariants}><TextAreaField id="otherSkills" name="otherSkills" label="Any Other skills beside dance?*" placeholder="Eg:- Photo editing,video editing etc." value={formData.otherSkills} onChange={handleChange} disabled={isSubmitting} /></motion.div>
 <motion.div variants={itemVariants} className="audition-form__group--full-span">
                        <InputField 
                            id="danceVideoUrl" 
                            name="danceVideoUrl" 
                            label="Dance Video Link (Optional)" 
                            placeholder="e.g., Google Drive, Instagram Reel, or YouTube link" 
                            value={formData.danceVideoUrl} 
                            onChange={handleChange} 
                            disabled={isSubmitting}
                            type="url"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants} className="audition-form__group--full-span"><InputField id="danceStyle" name="danceStyle" label="Any particular style of dance you do?*" placeholder="e.g:- Locking,Breaking,Hip-hop" value={formData.danceStyle} onChange={handleChange} disabled={isSubmitting}/></motion.div>
                    {/* {isUploading && (
                        <div className="upload-progress-container audition-form__group--full-span">
                            <p>Uploading video: {uploadProgress}%</p>
                            <div className="progress-bar-background"><div className="progress-bar-foreground" style={{ width: `${uploadProgress}%` }}></div></div>
                        </div>
                    )} */}
                    <motion.div className="audition-form__actions audition-form__actions--full-span" variants={itemVariants}>
                        <motion.button type="submit" className="audition-form__button audition-form__button--submit" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                        </motion.button>
                        <motion.button type="button" onClick={() => setIsModalOpen(true)} className="audition-form__button audition-form__button--rules" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} disabled={rulesLoading || rulesError}>
                            {rulesLoading ? 'Loading Rules...' : 'Rules and Regulations'}
                        </motion.button>
                    </motion.div>
                </motion.form>
            </div>
            <RulesModal 
                isOpen={isModalOpen} 
                setIsOpen={setIsModalOpen} 
                rulesData={rulesData} 
            />
        </motion.div>
    );
};
export default AuditionsPage;