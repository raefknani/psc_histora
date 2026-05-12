/* eslint-disable unicode-bom */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import roomsData from "./roomsData";
import logo from "./images/logo_psc-removebg-preview.png";
import "./psc.css";

import { setWithExpiry, getWithExpiry } from "./authUtils";
import { getRoomTitle, getOptimizedImageUrl } from "./utils";
import Loader from "./components/Loader";

const videoBg =
"https://res.cloudinary.com/def04uybd/video/upload/q_auto/f_auto/v1778280929/videoplayback_2_xqncr2.webm"
function Psc() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  // Read localStorage synchronously before first render — most reliable approach
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return getWithExpiry("histora_unlocked") === true;
    } catch (e) {
      return false;
    }
  });
  
  useEffect(() => {
    // Safety fallback: if video hasn't loaded in 3 seconds, hide loader anyway
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Detect expiration from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setShowExpiredModal(true);
      // Clean up URL without refreshing
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Periodic check to re-lock UI if session expires while on page
  useEffect(() => {
    const checkAuth = () => {
      const currentlyUnlocked = getWithExpiry("histora_unlocked") === true;
      if (isUnlocked && !currentlyUnlocked) {
        // Just expired
        setIsUnlocked(false);
        setShowExpiredModal(true);
      } else if (isUnlocked !== currentlyUnlocked) {
        setIsUnlocked(currentlyUnlocked);
      }
    };

    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, [isUnlocked]);

  const closeModal = () => {
    setShowLockedModal(false);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handleUnlock = () => {
    const correct = process.env.REACT_APP_UNLOCK_PASSWORD || 'histora2025';
    if (passwordInput.trim() === correct.trim()) {
      // Get timeout from .env (in minutes) or default to 1 minute
      const timeoutMinutes = parseFloat(process.env.REACT_APP_SESSION_TIMEOUT_MINUTES) || 1;
      const timeoutMs = timeoutMinutes * 60 * 1000;
      
      // Write directly to localStorage — do NOT use a reactive effect for this
      setWithExpiry("histora_unlocked", true, timeoutMs);
      setIsUnlocked(true);
      closeModal();
    } else {
      setPasswordError(true);
      setPasswordInput('');
      setTimeout(() => setPasswordError(false), 800);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

// getRoomTitle moved to utils.js

  return (
    <div className="app-root">
      <header className="top-nav">
        <div className="brand">
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
          <Link to="/" className="menu-link active">Home</Link>
          <Link to="/find" className="menu-link">Find</Link>
          <Link to="/learn-more" className="menu-link">
            Learn More
          </Link>
          <Link to="/contact" className="menu-link">
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <button className="cta-btn" onClick={closeMobileMenu}>
          <Link to="/learn-more">Learn More</Link>
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.nav
          className="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
            <Link to="/" className="mobile-nav-link active" onClick={closeMobileMenu}>Home</Link>
            <Link to="/find" className="mobile-nav-link" onClick={closeMobileMenu}>Find</Link>
          <Link
            to="/learn-more"
            className="mobile-nav-link"
            onClick={closeMobileMenu}
          >
            Learn More
          </Link>
          <Link
            to="/contact"
            className="mobile-nav-link"
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
        </motion.nav>
      )}

      <section className="hero">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          poster="https://res.cloudinary.com/def04uybd/video/upload/so_0/v1778280929/videoplayback_2_xqncr2.jpg"
          className="video-bg loaded"
          onCanPlay={() => setIsVideoLoaded(true)}
        >
          <source src="https://res.cloudinary.com/def04uybd/video/upload/q_auto:low,f_auto,vc_auto/v1778280929/videoplayback_2_xqncr2.mp4" type="video/mp4" />
          <source src={videoBg.replace('q_auto', 'q_auto:low')} type="video/webm" />
        </video>
        {!isVideoLoaded && <Loader />}
        <div className="overlay" />

        {/* <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-title"
          >
            Histora
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="hero-text"
          >
            A Living Archive of Traditional Heritage
          </motion.p>
        </div> */}

        {/* Modern Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>Discover the story</span>
        </motion.div>
      </section>

      <section className="features" id="about">
        <div className="intro-card">
          <h2>Preserving the Soul of Traditional Living</h2>
          {/* <p>
            Eco-friendly residences with calm modern design. Find your ideal
            home near forests, lakes and sustainable communities.
          </p> */}
          {/* <div className="intro-buttons">
            <button className="btn-secondary">Explore Now</button>
            <Link to="/learn-more" className="btn-outline">
              Learn More
            </Link>
          </div> */}
        </div>

        <motion.div 
          className="card-grid"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {roomsData.map((card, index) => (
            <motion.article
              key={index}
              className={`info-card${(card.locked && !isUnlocked) ? ' info-card--locked' : ''}`}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }
                }
              }}
              whileHover={(card.locked && !isUnlocked) ? {} : { y: -8 }}
              onClick={(card.locked && !isUnlocked) ? () => setShowLockedModal(true) : undefined}
            >
              <div className="card-image-wrapper">
                <img
                  src={getOptimizedImageUrl(card.gallery?.find(img => img.includes("001")) || card.img, 'w_600,c_scale,q_auto,f_auto')}
                  alt={card.title}
                  className={card.locked && !isUnlocked ? 'card-img-blurred' : ''}
                  loading="lazy"
                />
                {card.locked && !isUnlocked && (
                  <div className="card-lock-overlay">
                    <div className="lock-icon-wrapper">
                      <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <span className="lock-label">Coming Soon</span>
                  </div>
                )}
              </div>
              <div className="card-text">
                <h3 dir="rtl">{getRoomTitle(card)}</h3>
                {(card.locked && !isUnlocked) ? (
                  <button className="btn-tertiary btn-tertiary--locked" onClick={(e) => { e.stopPropagation(); setShowLockedModal(true); }}>
                    🔒 Locked
                  </button>
                ) : (
                  <Link to={`/property/${index + 1}`} className="btn-tertiary">
                    {card.button} Details
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Locked Room Modal */}
        {showLockedModal && (
          <motion.div
            className="lock-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="lock-modal"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={passwordError ? { x: [0, -10, 10, -10, 10, 0] } : { opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lock-modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="lock-modal-title">Room Locked</h2>
              <p className="lock-modal-text">
                Enter the password you received at the museum to unlock this room.
              </p>
              <p className="lock-modal-cta">
                🏛️ Visit the museum to get your password
              </p>
              <div className="lock-modal-input-wrapper">
                <input
                  id="unlock-password-input"
                  type="password"
                  className={`lock-modal-input${passwordError ? ' lock-modal-input--error' : ''}`}
                  placeholder="Enter password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  autoFocus
                />
                {passwordError && (
                  <p className="lock-modal-error">Incorrect password. Try again.</p>
                )}
              </div>
              <div className="lock-modal-actions">
                <button className="lock-modal-close lock-modal-close--secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="lock-modal-close" onClick={handleUnlock}>
                  Unlock 🔓
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Session Expired Modal */}
        {showExpiredModal && (
          <motion.div
            className="lock-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExpiredModal(false)}
          >
            <motion.div
              className="lock-modal lock-modal--expired"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lock-modal-icon lock-modal-icon--expired">
                <svg viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="lock-modal-title">Session Expired</h2>
              <p className="lock-modal-text">
                Your 1-minute museum session has ended. To continue exploring locked rooms, please enter the password again.
              </p>
              <div className="lock-modal-actions">
                <button className="lock-modal-close" onClick={() => setShowExpiredModal(false)}>
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-item">
            <h4>HISTORA</h4>
            {/* <p>
              Premium eco-home marketplace focused on sustainability and
              comfort.
            </p> */}
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
    </div>
  );
}

export default Psc;
