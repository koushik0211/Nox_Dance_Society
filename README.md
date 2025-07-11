# NOX Dance Society - Official Website


Welcome to the official repository for the NOX Dance Society website. This full-stack application serves as the digital home for our dance crew, showcasing our talent, achievements, and providing a platform for auditions and learning.


## Live Demo

- **Public Website:** (https://noxdancesociety.com) 
- **Admin Panel:** (https://noxdancesociety.com/admin/login) 

## Features

### Public-Facing Website
- **Homepage:** An engaging landing page with a hero section, introduction to the society, and key highlights.
- **Team Page:** Displays all current members, categorized into Executive Board, Core Team, and Members. Features a mobile-friendly horizontal card slider.
- **Learn Page:** A section with video tutorials categorized by dance style, featuring self-hosted videos and member instructor details.
- **Achievements Page:** A single-column timeline showcasing the society's victories and accomplishments with images and details.
- **Auditions Page:** A dynamic form for aspiring dancers to register for auditions. The form can be enabled or disabled by an admin.

### Admin Dashboard (at `/admin`)
- **Secure Admin Login:** Authentication handled by Firebase for a specific admin user.
- **CRUD Operations:** Admins can Create, Read, Update, and Delete content for:
  - **Team Members:** Manage the official roster, including photos, positions, and bios.
  - **Learn Page Tutorials:** Upload new video tutorials, thumbnails, and descriptions.
  - **Achievements:** Add new achievements and showcase photos.
  - **Audition Rules:** Update the rules and event details for the auditions page.
- **Audition Management:**
  - View all audition entries in a structured table with search and filter capabilities.
  - A detailed modal view for each applicant.
  - A multi-judge review system where different judges can add their notes and ratings for each candidate.
- **Audition Status Toggle:** A simple switch to open or close public audition registrations globally.

## Tech Stack

### Frontend
- **Framework:** React.js (Create React App)
- **Routing:** React Router v6
- **Styling:** Plain CSS with CSS Modules principles (Component-specific CSS)
- **Animation:** Framer Motion
- **API Calls:** Axios
- **Client-Side Auth/Storage:** Firebase SDK (Authentication & Cloud Storage)

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Firebase Admin SDK (for verifying admin tokens)

### Deployment & Services
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Vercel
- **Database Hosting:** MongoDB Atlas
- **File Storage:** Firebase Cloud Storage
- **Domain Management:** Hostinger

