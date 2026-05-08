/* eslint-disable unicode-bom */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import roomsData from "./roomsData";
import logo from "./images/logo_psc-removebg-preview.png";
import "./psc.css";

const videoBg =
  "https://res.cloudinary.com/def04uybd/video/upload/q_auto/f_auto/v1778280929/videoplayback_2_xqncr2.webm";

function Psc() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(
    () => localStorage.getItem('histora_unlocked') === 'true'
  );

  const closeModal = () => {
    setShowLockedModal(false);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handleUnlock = () => {
    const correct = process.env.REACT_APP_UNLOCK_PASSWORD;
    if (passwordInput === correct) {
      localStorage.setItem('histora_unlocked', 'true');
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

  const getRoomTitle = (card) => {
    if (!card.description) return card.title;
    const text = card.description;
    
    // Search for Arabic section first
    const arIndex = text.search(/(?:^|\n)(ar)(?:\r?\n|$)/i);
    if (arIndex !== -1) {
      const arText = text.substring(arIndex);
      const lines = arText.split(/\r?\n/).slice(1);
      for (const line of lines) {
        const trimmed = line.trim();
        // Return first non-empty line
        if (trimmed && !trimmed.toLowerCase().startsWith('overview') && !trimmed.toLowerCase().startsWith('description')) {
          return trimmed.replace(/:$/, '').trim();
        }
      }
    }
    
    return card.title;
  };

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
          <button
            className="nav-link"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </button>
          <button
            className="nav-link"
            onClick={() => (window.location.href = "/")}
          >
            Find
          </button>
          <button
            className="nav-link"
            onClick={() => (window.location.href = "/")}
          >
            Real Estate
          </button>
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
          <button
            className="mobile-nav-link"
            onClick={() => {
              window.location.href = "/";
              closeMobileMenu();
            }}
          >
            Home
          </button>
          <button
            className="mobile-nav-link"
            onClick={() => {
              window.location.href = "/";
              closeMobileMenu();
            }}
          >
            Find
          </button>
          <button
            className="mobile-nav-link"
            onClick={() => {
              window.location.href = "/";
              closeMobileMenu();
            }}
          >
            Real Estate
          </button>
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
          className={`video-bg ${isVideoLoaded ? 'loaded' : 'loading'}`}
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src={videoBg} type="video/webm" />
        </video>
        {!isVideoLoaded && (
          <motion.div 
            className="video-loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="spinner"></div>
          </motion.div>
        )}
        <div className="overlay" />

        <div className="hero-content">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="subheading"
          >
            Explore homes rooted in heritage and tradition.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-title"
          >
            Discover Histora
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="hero-text"
          >
            Browse authentic households, cultural spaces, and preserved
            interiors from everyday life in traditional homes.
          </motion.p>

          {/* <div className="hero-actions">
            <input
              type="text"
              placeholder="Search location, type, budget..."
              className="search-input"
            />
            <button className="btn-primary">Browse Properties</button>
          </div> */}
        </div>
      </section>

      <section className="features" id="about">
        <div className="intro-card">
          <h2>Welcome</h2>
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

        <div className="card-grid">
          {roomsData.map((card, index) => (
            <motion.article
              key={index}
              className={`info-card${(card.locked && !isUnlocked) ? ' info-card--locked' : ''}`}
              whileHover={(card.locked && !isUnlocked) ? {} : { y: -8 }}
              transition={{ type: "spring", stiffness: 250 }}
              onClick={(card.locked && !isUnlocked) ? () => setShowLockedModal(true) : undefined}
            >
              <div className="card-image-wrapper">
                <img
                  src={card.gallery?.find(img => img.includes("001")) || card.img}
                  alt={card.title}
                  className={card.locked && !isUnlocked ? 'card-img-blurred' : ''}
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
        </div>

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
