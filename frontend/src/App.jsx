// Nox2/frontend/src/App.js
import React, { useEffect } from 'react'; // Import useEffect
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import FamSection from './components/FamSection/FamSection';
import AboutSection from './components/AboutSection/AboutSection';
import Footer from './components/Footer/Footer';
import AuditionsPage from './components/AuditionsPage/AuditionsPage';
import LearnPage from './components/LearnPage/LearnPage'; // <-- IMPORT LearnPage
import './App.css';

import TeamPage from './components/TeamPage/TeamPage';
import AchievementsPage from './components/AchievementsPage/AchievementsPage';

const HomePage = () => {
  return (
    <>
      <Hero />
      {/* Ensure elements with id="team", id="achievements" exist within these components 
          if your Navbar hash links point to them. */}
      <FamSection />
      <AboutSection />
    </>
  );
};

// Scroll to top on route change utility component
const ScrollToTop = () => {
  const { pathname } = useLocation(); // useLocation is needed here

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Rerun effect when pathname changes

  return null; // This component doesn't render anything visible
};

function App() {
  // const location = useLocation(); // This line is no longer needed here directly if using ScrollToTop

  return (
    <div className="App"> {/* Ensure global font/bg from index.css apply */}
      <Navbar />
      <ScrollToTop /> {/* ADDED: ScrollToTop component instance */}
      <main className="main-content-area"> {/* Ensure this class is defined in your CSS for navbar offset */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auditions" element={<AuditionsPage />} />
          <Route path="/learn" element={<LearnPage />} /> {/* ADDED: Route for LearnPage */}
          {/* Define other routes here as needed in the future */}
          <Route path="/team" element={<TeamPage />} />
          <Route path="/achievements" element={<AchievementsPage />} /> 
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;