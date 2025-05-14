// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // File System module to create directory if it doesn't exist

const UPLOAD_DIR = './uploads/audition_videos/'; // Define upload directory path

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)){
    fs.mkdirSync(UPLOAD_DIR, { recursive: true }); // Create directory recursively if it doesn't exist
}

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOAD_DIR); // Tell Multer to save files in this directory
    },
    filename: function(req, file, cb) {
        // Generate a unique filename to prevent overwrites and conflicts
        // Using form's rollNumber (if available) + timestamp + original extension
        const rollNumber = req.body.rollNumber ? req.body.rollNumber.replace(/\s+/g, '_') : 'video'; // Sanitize roll number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname).toLowerCase();
        cb(null, rollNumber + '-' + uniqueSuffix + fileExtension);
    }
});

// Function to check allowed file types
function checkFileType(file, cb) {
    // Allowed video extensions
    const filetypes = /mp4|mov|avi|mkv|webm|mpeg|mpg|wmv/; 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Allowed video MIME types (more robust check)
    const mimetype = /video\/mp4|video\/quicktime|video\/x-msvideo|video\/x-matroska|video\/webm|video\/mpeg|video\/x-ms-wmv/.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        // You can pass an error message to cb for Multer to handle
        cb(new Error('Error: Videos Only! Please upload a valid video file. (mp4, mov, avi, etc.)'));
    }
}

// Initialize upload variable for a single file upload
const uploadAuditionVideo = multer({
    storage: storage,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB limit (adjust as needed)
    }, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
    // '.single(fieldName)' means we are expecting one file from the form field named 'danceVideo'
}).single('danceVideo'); // 'danceVideo' MUST match the 'name' attribute of your file input in the frontend form

module.exports = uploadAuditionVideo;