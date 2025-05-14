import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaInstagram, FaTag, FaUserGraduate, FaChevronDown, FaChevronUp, FaVolumeUp, FaVolumeMute, FaExpand } from 'react-icons/fa';

const TutorialCard = ({ tutorial, animationDelay }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); 
    const videoRef = useRef(null);

    const cardVariants = {
        initial: { opacity: 0, y: 50, scale: 0.9 }, 
        animate: { 
            opacity: 1, y: 0, scale: 1,
            transition: { type: "spring", stiffness: 80, damping: 15, delay: animationDelay } 
        }
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
        }
    };
    
    const handleVideoStateChange = () => {
        if (videoRef.current) {
            setIsPlaying(!videoRef.current.paused);
            setIsMuted(videoRef.current.muted);
        }
    };

    useEffect(() => { 
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('play', handleVideoStateChange);
            videoElement.addEventListener('pause', handleVideoStateChange);
            videoElement.addEventListener('volumechange', handleVideoStateChange);
            videoElement.addEventListener('ended', () => setIsPlaying(false)); 
            return () => {
                videoElement.removeEventListener('play', handleVideoStateChange);
                videoElement.removeEventListener('pause', handleVideoStateChange);
                videoElement.removeEventListener('volumechange', handleVideoStateChange);
                videoElement.removeEventListener('ended', () => setIsPlaying(false));
            };
        }
    }, []);


    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
    };
    
    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
            else if (videoRef.current.mozRequestFullScreen) videoRef.current.mozRequestFullScreen();
            else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
            else if (videoRef.current.msRequestFullscreen) videoRef.current.msRequestFullscreen();
        }
    };

    const VideoPlayer = ({ videoUrl, thumbnailUrl, title }) => (
        <div className="video-player-wrapper">
            <video
                ref={videoRef}
                src={videoUrl}
                poster={thumbnailUrl || "/assets/learn/thumbnails/default_video_thumb.png"}
                className="tutorial-video-element"
                loop
                muted={isMuted}
                playsInline
                onClick={handlePlayPause}
            >
                Your browser does not support the video tag.
            </video>
            <div className="video-controls">
                <button onClick={handlePlayPause} className="control-button" aria-label={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={handleMuteToggle} className="control-button" aria-label={isMuted ? "Unmute" : "Mute"}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                 <button onClick={handleFullscreen} className="control-button" aria-label="Fullscreen">
                    <FaExpand />
                </button>
            </div>
        </div>
    );

    return (
        <motion.div 
            className="tutorial-card"
            variants={cardVariants}
            initial="initial"
            animate="animate" 
            whileHover={{ 
                y: -8,        // Slightly more lift
                scale: 1.03,  // Slightly more scale
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }} 
        >
            <div className="tutorial-card__video-area">
                <VideoPlayer videoUrl={tutorial.videoUrl} thumbnailUrl={tutorial.thumbnailUrl} title={tutorial.title} />
                <div className="video-overlay-gradient"></div>
            </div>
            <div className="tutorial-card__content">
                <h3 className="tutorial-card__title">{tutorial.title}</h3>
                <div className="tutorial-card__meta">
                    <a href={tutorial.instructorInstaUrl || '#!'} target="_blank" rel="noopener noreferrer" className={`tutorial-card__instructor-link ${!tutorial.instructorInstaUrl ? 'no-link' : ''}`} onClick={(e) => { if (!tutorial.instructorInstaUrl) e.preventDefault();}} aria-label={`View ${tutorial.instructor}'s Instagram`}>
                        <FaUserGraduate className="meta-icon" /> {tutorial.instructor} 
                        {tutorial.instructorInstaUrl && <FaInstagram className="insta-icon-instructor"/>}
                    </a>
                    <span className={`tutorial-card__difficulty tutorial-card__difficulty--${tutorial.difficulty.toLowerCase().replace(/\s+/g, '-')}`}>
                        <FaTag className="meta-icon" /> {tutorial.difficulty}
                    </span>
                </div>
                <p className={`tutorial-card__description ${isExpanded ? 'expanded' : ''}`}>{tutorial.description}</p>
                {tutorial.description && tutorial.description.length > 80 && (
                    <button onClick={() => setIsExpanded(!isExpanded)} className="tutorial-card__expand-toggle" aria-expanded={isExpanded}>
                        {isExpanded ? <FaChevronUp/> : <FaChevronDown/>} Read {isExpanded ? 'Less' : 'More'}
                    </button>
                )}
                {tutorial.tags && tutorial.tags.length > 0 && (
                    <div className="tutorial-card__tags">
                        {tutorial.tags.map(tag => <span key={tag} className="tag-chip">{tag}</span>)}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TutorialCard;