// frontend/src/hooks/useIsMobile.js
import { useState, useEffect } from 'react';

// A simple custom hook to detect mobile screen sizes
export const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener('resize', handleResize);
        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]); // Re-run effect if breakpoint changes

    return isMobile;
};