import React from 'react';
import './AboutSection.css'; // Make sure CSS is imported
import { motion } from 'framer-motion';

// 1. Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// 2. Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; // Needed for Navigation module functionality & base styles
import 'swiper/css/effect-fade';

// 3. Import required modules
import { Pagination, Navigation, EffectFade } from 'swiper/modules';

const AboutSection = () => {
    // Define your image sources (using public folder paths as example)
    const trophyImages = [
         // Replace with your actual image path
        '/assets/about1.jpg',       // Example placeholder
        '/assets/about2.jpg',       // Example placeholder
        '/assets/ooo.png',       // Example placeholder
    ];

    // Framer Motion Variants
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.3 }
        }
    };

    const textVariants = {
        hidden: { x: 50, opacity: 0 }, // Slide from right
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 50 } }
    };

    const swiperVariants = {
        hidden: { x: -50, opacity: 0, scale: 0.8 }, // Slide from left
        visible: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 50 } }
    };

    return (
        <motion.section
            className="about-section"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {/* Container with horizontal padding added in CSS */}
            <div className="about-container container">

                {/* Swiper Container (Left Side on Desktop) */}
                {/* Needs position: relative in CSS */}
                <motion.div className="about-swiper-container" variants={swiperVariants}>
                    <Swiper
                        // Install Swiper modules
                        modules={[Pagination, Navigation, EffectFade]} // Include Navigation
                        spaceBetween={30}
                        slidesPerView={1} // Show one slide at a time
                        loop={true}
                        pagination={{ // Configure pagination dots
                             clickable: true,
                             dynamicBullets: true, // Optional: makes dots dynamic size
                         }}
                        navigation={{ // Configure navigation for custom buttons
                            nextEl: '.about-swiper-button-next', // Specific class for this section
                            prevEl: '.about-swiper-button-prev', // Specific class for this section
                        }}
                        effect="fade" // Optional: Use fade effect
                        fadeEffect={{ crossFade: true }} // Smoother fade
                        className="myAboutSwiper" // Unique class for this swiper instance if needed
                    >
                        {trophyImages.map((imgSrc, index) => (
                            <SwiperSlide key={index}>
                                {/* Ensure class name here matches CSS */}
                                <img src={imgSrc} alt={`NOX Trophy ${index + 1}`} className="about-slide-image" />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons (Circular Style) */}
                    {/* Use the specific class names defined in the navigation prop */}
                    <div className="about-swiper-button-prev"></div> {/* Left Arrow */}
                    <div className="about-swiper-button-next"></div> {/* Right Arrow */}

                </motion.div>

                {/* Content (Right Side on Desktop) */}
                <motion.div className="about-content" variants={textVariants}>
                    <h2 className="about-heading">ABOUT <span className="highlight">NOX</span></h2>
                    <p className="about-description">
                        NOX is more than just a dance group; it's a dynamic community of passionate individuals who believe in the power of movement and rhythm. From Basic party moves to urban grooves, we embrace all forms of, hip-hop, and freestyle offering a platform for creativity, collaboration, and self-expression. Dance is life for everyone in this society and we hope to continue this enthusiasm all the way.
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default AboutSection;