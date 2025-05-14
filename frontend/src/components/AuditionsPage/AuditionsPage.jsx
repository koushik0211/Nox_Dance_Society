import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RulesModal from './RulesModal';
import './AuditionsPage.css'; // Import the CSS file
import axios from 'axios'; // npm install axios (if not already)

// Helper Components
const InputField = ({ id, name, label, type = "text", placeholder, value, onChange }) => (
    // The wrapper div for each field will be the grid item
    <div className="audition-form__group">
        <label htmlFor={id} className="audition-form__label">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="audition-form__input"
        />
    </div>
);

const TextAreaField = ({ id, name, label, placeholder, value, onChange, rows = 4 }) => (
    <div className="audition-form__group">
        <label htmlFor={id} className="audition-form__label">
            {label}
        </label>
        <textarea
            id={id}
            name={name}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="audition-form__textarea"
        />
    </div>
);

const FileUploadField = ({ id, name, label, onChange }) => (
    // This div acts as the grid item
    <div className="audition-form__group audition-form__group--full-span">
        <label htmlFor={id} className="audition-form__label">
            {label}
        </label>
        <input
            type="file"
            id={id}
            name={name}
            onChange={onChange}
            className="audition-form__file-input"
        />
    </div>
);


const AuditionsPage = () => {
    const initialFormData = {
        fullName: '',
        rollNumber: '',
        phoneNumber: '',
        emailAddress: '',
        danceVideo: null,
        preferredStyle: '',
        experienceYears: '',
        inspiration: '',
        favoriteMemory: '',
        songChoice: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData(prevState => ({
                ...prevState,
                [name]: files && files.length > 0 ? files[0] : null
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

   // frontend/src/components/AuditionsPage/AuditionsPage.js
// ... (imports, useState, handleChange remain the same) ...
 // npm install axios (if not already)

// ...

const handleSubmit = async (e) => { // Make it async
    e.preventDefault();

    // Create FormData object to send data including the file
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        // Append null values as empty strings or handle them as per backend needs
        // For files, formData[key] will be the File object or null
        if (formData[key] !== null) {
            submissionData.append(key, formData[key]);
        }
    });

    // For debugging FormData:
    // for (let [key, value] of submissionData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
        // Replace with your actual backend URL
        const response = await axios.post('http://localhost:5001/api/auditions/register', submissionData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Important for file uploads
            }
        });

        console.log('Submission successful:', response.data);
        alert(response.data.message || 'Registration Submitted Successfully!');
        setFormData(initialFormData); // Reset form
        const fileInput = document.getElementById('danceVideo');
        if (fileInput) fileInput.value = "";

    } catch (error) {
        console.error('Submission error:', error.response ? error.response.data : error.message);
        alert(`Submission failed: ${error.response ? error.response.data.message : error.message}`);
    }
};

// ... (rest of the component) ...
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeInOut" } }
    };
    const formContainerVariants = {
        initial: {},
        animate: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } // Stagger form items
    };
    const itemVariants = { // For individual form groups or title elements
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
                <motion.h1
                    className="auditions-page__title"
                    variants={itemVariants}
                >
                    REGISTER FOR <span className="auditions-page__title--highlight">AUDITIONS</span> HERE !
                </motion.h1>
                <motion.div
                    className="auditions-page__title-divider"
                    variants={itemVariants}
                    initial={{scaleX:0}}
                    animate={{scaleX:1, transition: {delay: 0.1, duration:0.5, ease:"circOut"}}}
                ></motion.div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="audition-form"
                    variants={formContainerVariants}
                    initial="initial"
                    animate="animate"
                >
                    {/* Each InputField/TextAreaField is a grid item */}
                    <motion.div variants={itemVariants}><InputField id="fullName" name="fullName" label="Full Name" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} /></motion.div>
                    <motion.div variants={itemVariants}><InputField id="preferredStyle" name="preferredStyle" label="Preferred Dance Style" placeholder="e.g., Hip-hop, Contemporary" value={formData.preferredStyle} onChange={handleChange} /></motion.div>
                    
                    <motion.div variants={itemVariants}><InputField id="rollNumber" name="rollNumber" label="Roll Number" placeholder="Enter your roll number" value={formData.rollNumber} onChange={handleChange} /></motion.div>
                    <motion.div variants={itemVariants}><InputField id="experienceYears" name="experienceYears" label="Years of Dance Experience" type="number" placeholder="Enter number of years" value={formData.experienceYears} onChange={handleChange} /></motion.div>

                    <motion.div variants={itemVariants}><InputField id="phoneNumber" name="phoneNumber" label="Phone Number" type="tel" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} /></motion.div>
                    <motion.div variants={itemVariants}><InputField id="emailAddress" name="emailAddress" label="Email Address" type="email" placeholder="Enter your email address" value={formData.emailAddress} onChange={handleChange} /></motion.div>

                    <motion.div variants={itemVariants}><TextAreaField id="inspiration" name="inspiration" label="What inspires you to dance?" placeholder="Share your thoughts..." value={formData.inspiration} onChange={handleChange} /></motion.div>
                    <motion.div variants={itemVariants}><TextAreaField id="favoriteMemory" name="favoriteMemory" label="Favorite performance or dance memory?" placeholder="Share your favorite memory..." value={formData.favoriteMemory} onChange={handleChange} /></motion.div>
                    
                    {/* FileUploadField already has the full-span class logic in its wrapper */}
                    <motion.div variants={itemVariants} className="audition-form__group--full-span"><FileUploadField id="danceVideo" name="danceVideo" label="Upload Dance Video (Optional, Max 50MB)" onChange={handleChange} /></motion.div>
                    <motion.div variants={itemVariants} className="audition-form__group--full-span"><InputField id="songChoice" name="songChoice" label="If you could choreograph one routine, what song would you pick?" placeholder="Enter your song choice" value={formData.songChoice} onChange={handleChange} /></motion.div>
                    
                    <motion.div className="audition-form__actions audition-form__actions--full-span" variants={itemVariants}>
                        <motion.button
                            type="submit"
                            className="audition-form__button audition-form__button--submit"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            SUBMIT
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="audition-form__button audition-form__button--rules"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Rules and Regulations
                        </motion.button>
                    </motion.div>
                </motion.form>
            </div>

            <RulesModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </motion.div>
    );
};

export default AuditionsPage;