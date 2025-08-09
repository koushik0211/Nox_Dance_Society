import React from 'react';
import './FamSection.css'; // Ensure CSS is imported
import { motion } from 'framer-motion';

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // Import Navigation

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; // Optional: if you want dots
// --- End Swiper Imports ---

const FamSection = () => {

    // --- Define Your Image Sources Here ---
    // Option A: Import local images (if in src folder, recommended)
    // import famPhoto1 from '../../assets/fam-photo1.jpg'; // Adjust path
    // import famPhoto2 from '../../assets/fam-photo2.png';
    // const famImages = [famPhoto1, famPhoto2, /* ... more imports */];

    // Option B: Use paths from the 'public' folder
    const famImages = [
        '/assets/fam2.jpg',
        '/assets/fam1.jpg', // Your original image path
         // Example: Add more paths relative to /public
        '/assets/fam3.jpg',
        '/assets/fam5.jpg',
        // Add paths to all the images you want in the slider
    ];

    // Option C: Use full URLs for externally hosted images
    // const famImages = [
    //  'https://example.com/image1.jpg',
    //  'https://another.com/image2.png',
    // ];
    // --- End Image Definition ---


    const sectionVariants = { /* ... keep your variants ... */ };
    const textVariants = { /* ... keep your variants ... */ };
    const imageVariants = { /* ... keep your variants ... */ }; // Will apply to the Swiper container
    const buttonVariants = { /* ... keep your variants ... */ };

    return (
        <motion.section
            className="fam-section" // Add padding in CSS
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }} // Adjusted amount slightly
        >
            {/* Add padding-inline (left/right) to this container in CSS */}
            <div className="fam-container container">
                <motion.div className="fam-content" variants={textVariants}>
                    <h2 className="fam-heading">WE A <span class="highlight">FAM</span></h2>
                    <p className="fam-description">
                        At the heart of everything, we believe in building lasting friendships, breaking barriers through movement, and spreading joy one step at a time. Together, we don't just perform; we tell stories, create moments, and leave a lasting impact. If you hear music in your heart and feel the beat in your soul, join us—because life is better when you dance! "We believe in lifting each other as we rise, because in this family, every member shines."
                    </p>
                   <a href="/team"> <motion.button
                         className="fam-button"
                         variants={buttonVariants}
                         whileHover={{ scale: 1.05, backgroundColor: "#a855f7", borderColor: "#a855f7" }}
                         whileTap={{ scale: 0.95 }}
                    >
                        View Team
                    </motion.button></a>
                </motion.div>

                {/* --- Swiper Replaces Image Container --- */}
                {/* Apply imageVariants to this motion.div */}
                <motion.div className="fam-swiper-wrapper" variants={imageVariants}>
                     <Swiper
                        modules={[Navigation, Pagination]} // Add Navigation module
                        spaceBetween={20} // Space between slides if showing multiple
                        slidesPerView={1} // Show one slide at a time
                        loop={true}
                        navigation={{ // Configure custom navigation buttons
                            nextEl: '.fam-swiper-button-next',
                            prevEl: '.fam-swiper-button-prev',
                        }}
                         pagination={{ // Optional: Add clickable dots
                            clickable: true,
                         }}
                        className="fam-swiper" // Specific class for the swiper instance
                    >
                        {famImages.map((imgSrc, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={imgSrc}
                                    alt={`NOX Dance Society Family ${index + 1}`}
                                    className="fam-slide-image" // Style this image
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                     {/* Custom Navigation Buttons */}
                     <div className="fam-swiper-button-prev"></div>
                     <div className="fam-swiper-button-next"></div>
                </motion.div>
                 {/* --- End Swiper --- */}
            </div>
        </motion.section>
    );
};

export default FamSection;