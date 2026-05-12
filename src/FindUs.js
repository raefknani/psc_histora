import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "./images/logo_psc-removebg-preview.png";
import "./psc.css";

function FindUs() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="find-us-container"
    >
      <header className="top-nav">
        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src={logo} alt="Histora Logo" />
          HISTORA
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}
          ></span>
        </button>

        {/* Desktop Navigation */}
        <nav className="menu">
          <Link to="/" className="menu-link">Home</Link>
          <Link to="/find" className="menu-link active">Find</Link>
          <Link to="/learn-more" className="menu-link">Learn More</Link>
          <Link to="/contact" className="menu-link">Contact</Link>
        </nav>

        {/* CTA Button */}
        <button className="cta-btn">
          <Link to="/learn-more">Learn More</Link>
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>Home</Link>
            <Link to="/find" className="mobile-nav-link active" onClick={closeMobileMenu}>Find</Link>
            <Link to="/learn-more" className="mobile-nav-link" onClick={closeMobileMenu}>Learn More</Link>
            <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="find-main">
        <section className="find-hero">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Visit the Living Archive
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Musée de la Kobba, Sousse, Tunisia
          </motion.p>
        </section>

        {/* Prominent Map Section at Top */}
        <motion.section 
          className="top-map-section"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="map-wrapper map-wrapper--hero">
            <img 
              src="https://res.cloudinary.com/def04uybd/image/upload/q_auto/f_auto/v1778613073/muse_map_nffg7g.png" 
              alt="Museum Location Map" 
              className="map-image"
            />
            <div className="map-overlay">
              <span>Museum Location Map</span>
            </div>
          </div>
        </motion.section>

        <div className="find-grid">
          <motion.section 
            className="guide-section"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="guide-card">
              <span className="guide-label">The Guide</span>
              <h2>How to Find Us</h2>
              <p>Nestled in the historic heart of the Sousse Medina, the Musée de la Kobba is a landmark of Ottoman and 11th-century architecture.</p>
              
              <div className="route-steps">
                <div className="route-step">
                  <div className="step-number">01</div>
                  <div className="step-text">
                    <h3>The Medina Gate</h3>
                    <p>Enter through the "Bab El Bhar" (Sea Gate) and head towards the Ribat.</p>
                  </div>
                </div>
                <div className="route-step">
                  <div className="step-number">02</div>
                  <div className="step-text">
                    <h3>Follow the Dome</h3>
                    <p>Look for the unique zigzag-ribbed dome rising above the traditional houses.</p>
                  </div>
                </div>
                <div className="route-step">
                  <div className="step-number">03</div>
                  <div className="step-text">
                    <h3>Welcome to Histora</h3>
                    <p>You'll find our entrance marked with traditional heritage signage.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section 
            className="video-section"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="video-frame">
              <div className="video-placeholder">
                <video 
                  className="museum-guide-video"
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  controls
                >
                  <source src="https://res.cloudinary.com/def04uybd/video/upload/q_auto,f_auto/v1778280929/videoplayback_2_xqncr2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="video-caption">
                  <p>Visual Journey to the Museum</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="find-footer">
        <Link to="/" className="back-btn">
          <span className="arrow">←</span> Return to Archive
        </Link>
      </footer>
    </motion.div>
  );
}

export default FindUs;
