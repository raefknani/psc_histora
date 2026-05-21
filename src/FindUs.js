import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logo from "./images/logo_psc-removebg-preview.png";
import "./psc.css";
import "./FindUs.css";

function FindUs() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

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
        <div className="brand" style={{ cursor: "pointer" }}>
          <img 
            src={logo} 
            alt="Histora Logo" 
            onClick={(e) => {
              e.stopPropagation();
              setExpandedImage(logo);
            }}
            className="brand-logo-img"
          />
          <span onClick={() => navigate("/")}>HISTORA</span>
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
        {/* <button className="cta-btn">
          <Link to="/learn-more">Learn More</Link>
        </button> */}
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
        <div className="top-left-actions">
          <Link to="/" className="back-btn-header">
            <span className="arrow">←</span> Return to Archive
          </Link>
        </div>
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
          <div 
            className="map-wrapper map-wrapper--hero"
            onClick={() => setExpandedImage("https://res.cloudinary.com/def04uybd/image/upload/q_auto/f_auto/v1778613073/muse_map_nffg7g.png")}
            style={{ cursor: "zoom-in" }}
          >
            <img 
              src="https://res.cloudinary.com/def04uybd/image/upload/q_auto/f_auto/v1778613073/muse_map_nffg7g.png" 
              alt="Museum Location Map" 
              className="map-image"
            />
            <div className="expand-hint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
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
            className="media-column"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Video Frame */}
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
                  <p>Visual Journey</p>
                </div>
              </div>
            </div>

            {/* Map Frame at the Bottom of the video */}
            <div className="video-frame map-frame-bottom">
              <div className="video-placeholder">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3234.341505342378!2d10.63604087573615!3d35.8250000725514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x130275210c41b8a5%3A0x6b84501a5202613d!2sMus%C3%A9e%20El%20Kobba!5e0!3m2!1sen!2stn!4v1715860000000!5m2!1sen!2stn"
                  className="museum-guide-video"
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Musée de la Kobba Live Map"
                  style={{ border: 0 }}
                ></iframe>
                <div className="video-caption">
                  <p>Live Navigation</p>
                </div>
              </div>
            </div>
            
            <div className="map-actions-compact">
              <a 
                href="https://share.google/Gct9cBnAXnwNKY4cW" 
                target="_blank" 
                rel="noopener noreferrer"
                className="directions-btn-small"
              >
                Get Directions
              </a>
            </div>
          </motion.section>
        </div>
      </main>



      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-item">
            <div className="footer-brand">
              <img src={logo} alt="Histora Logo" />
              <h4>HISTORA</h4>
            </div>
          </div>
          <div className="footer-item">
            <h4>Navigate</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/learn-more">Learn More</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/find">Find Us</Link>
              </li>
            </ul>
          </div>
          <div className="footer-item">
            <h4>Contact</h4>
            <p>Email: histora.psc@gmail.com</p>
            <p>Phone: +216 ........</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HISTORA. All rights reserved.</p>
        </div>
      </footer>

      {/* Expanded Image Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            className="expanded-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <motion.div 
              className="expanded-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={expandedImage} alt="Expanded View" />
              <button 
                className="close-expanded"
                onClick={() => setExpandedImage(null)}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FindUs;
