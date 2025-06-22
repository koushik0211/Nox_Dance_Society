// Nox2/frontend/src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';


// Auth Provider - This wraps the whole app
import { AuthProvider } from './admin/contexts/AuthContext';

// --- Public Components & Pages ---
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import FamSection from './components/FamSection/FamSection';
import AboutSection from './components/AboutSection/AboutSection';
import AuditionsPage from './components/AuditionsPage/AuditionsPage';
import LearnPage from './components/LearnPage/LearnPage';
import TeamPage from './components/TeamPage/TeamPage';
import AchievementsPage from './components/AchievementsPage/AchievementsPage';

// --- Admin Components & Pages ---
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminRoutes from './admin/AdminRoutes';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
// Management Pages
import ManageTeamPage from './admin/pages/ManageTeamPage';
import ManageTutorialsPage from './admin/pages/ManageTutorialsPage';
import ManageAchievementsPage from './admin/pages/ManageAchievementsPage';
import ManageRulesPage from './admin/pages/ManageRulesPage';
import ManageAuditionsPage from './admin/pages/ManageAuditionsPage';
import ManageStatusPage from './admin/pages/ManageStatusPage';
 // <-- IMPORT for new feature
// Form Components
import TeamForm from './admin/components/TeamForm'; 
import TutorialForm from './admin/components/TutorialForm';
import AchievementForm from './admin/components/AchievementForm';
import RuleSetForm from './admin/components/RuleSetForm';

import './App.css';

// --- Helper Components ---
// FIXED: HomePage is now defined directly inside App.js to resolve the import error.
const HomePage = () => {
  return (
    <>
      <Hero />
      <FamSection />
      <AboutSection />
    </>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


// The main App component now wraps everything in AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// AppContent contains the conditional logic for layout based on route
const AppContent = () => {
    const location = useLocation();
    // Check if the current URL path starts with '/admin'
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="App"> 
            
            {/* Conditionally render the public Navbar. */}
            {!isAdminRoute && <Navbar />} 
            
            <ScrollToTop />
            
            <main className={!isAdminRoute ? "main-content-area" : "admin-main-area"}>
                <Routes>
                    {/* ===== Public Routes ===== */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auditions" element={<AuditionsPage />} />
                    <Route path="/learn" element={<LearnPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} /> 

                    {/* ===== Admin Routes ===== */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    
                    {/* All routes nested inside AdminRoutes are protected */}
                    <Route path="/admin" element={<AdminRoutes />}>
                        <Route index element={<AdminDashboardPage />} /> 
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        
                        {/* Team CRUD Routes */}
                        <Route path="team" element={<ManageTeamPage />} />
                        <Route path="team/new" element={<TeamForm />} />
                        <Route path="team/edit/:id" element={<TeamForm />} />

                        {/* Tutorial CRUD Routes */}
                        <Route path="tutorials" element={<ManageTutorialsPage />} />
                        <Route path="tutorials/new" element={<TutorialForm />} />
                        <Route path="tutorials/edit/:id" element={<TutorialForm />} />

                        {/* Achievements CRUD Routes */}
                        <Route path="achievements" element={<ManageAchievementsPage />} />
                        <Route path="achievements/new" element={<AchievementForm />} />
                        <Route path="achievements/edit/:id" element={<AchievementForm />} />

                        {/* Audition Rules CRUD Routes */}
                        <Route path="rules" element={<ManageRulesPage />} />
                        <Route path="rules/new" element={<RuleSetForm />} />
                        <Route path="rules/edit/:id" element={<RuleSetForm />} />

                        {/* ADDED: Route for the new Audition Entries Management Page */}
                        <Route path="audition-entries" element={<ManageAuditionsPage />} />
                        <Route path="status" element={<ManageStatusPage />} />


                    </Route>
                    
                    {/* TODO: Add a public 404 "Not Found" page */}
                    {/* <Route path="*" element={<NotFoundPage />} /> */}
                </Routes>
            </main>

            {/* Conditionally render the public Footer. */}
            {!isAdminRoute && <Footer />}
        </div>
    );
}

export default App;