import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaPlay, FaPause, FaInstagram, FaTag, FaUserGraduate, 
    FaChevronDown, FaChevronUp, FaVolumeUp, FaVolumeMute, 
    FaExpand, FaPhotoVideo 
} from 'react-icons/fa';

const TutorialCard = ({ tutorial }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); 
    const videoRef = useRef(null);

    const cardVariants = {
        initial: { opacity: 0, y: 50, scale: 0.95 },
        animate: { 
            opacity: 1, y: 0, scale: 1,
            transition: { type: "spring", stiffness: 80, damping: 15 } 
        }
    };

    const handlePlayPause = () => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        // Directly manipulate the video element. The `onPlay` and `onPause`
        // event listeners below will handle updating the React state.
        if (videoElement.paused) {
            videoElement.play().catch(error => {
                console.warn("Video play was interrupted. This is common on rapid re-renders.", error);
            });
        } else {
            videoElement.pause();
        }
    };
    
    // This effect correctly syncs React state WITH the video's actual state.
    useEffect(() => { 
        const videoElement = videoRef.current;
        const handleVideoStateChange = () => {
            if (videoElement) {
                setIsPlaying(!videoElement.paused);
                setIsMuted(videoElement.muted);
            }
        };

        if (videoElement) {
            // Add all listeners
            videoElement.addEventListener('play', handleVideoStateChange);
            videoElement.addEventListener('pause', handleVideoStateChange);
            videoElement.addEventListener('volumechange', handleVideoStateChange);
            videoElement.addEventListener('ended', () => setIsPlaying(false)); // Reset play button on end
            
            // Cleanup function to remove listeners when component unmounts
            return () => {
                videoElement.removeEventListener('play', handleVideoStateChange);
                videoElement.removeEventListener('pause', handleVideoStateChange);
                videoElement.removeEventListener('volumechange', handleVideoStateChange);
                videoElement.removeEventListener('ended', () => setIsPlaying(false));
            };
        }
    }, []); // Dependency on videoRef.current ensures this runs if the video element changes
// videoRef.current

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

    const VideoPlayer = ({ videoUrl, thumbnailUrl, title }) => {
        if (!videoUrl) {
            // Render a static placeholder if there's no video URL
            return (
                <div className="video-player-wrapper no-video">
                    <img 
                        src={thumbnailUrl || "/assets/learn/thumbnails/default_video_thumb.png"} 
                        alt={`${title} placeholder`} 
                        className="tutorial-video-placeholder-image"
                    />
                    <div className="no-video-overlay">
                        <FaPhotoVideo className="no-video-icon" />
                        <span className="no-video-text">Video Not Available</span>
                    </div>
                </div>
            );
        }

        // Only render the <video> tag if a URL exists
        return (
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
    };

    return (
        <motion.div 
            className="tutorial-card"
            variants={cardVariants}
            whileHover={{ 
                y: -6,     
                scale: 1.02  
            }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }} 
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