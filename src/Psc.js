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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
              className="info-card"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <img src={card.img} alt={card.title} />
              <div className="card-text">
                <h3>{card.title}</h3>
                {/* <p>{card.text}</p> */}
                <Link to={`/property/${index + 1}`} className="btn-tertiary">
                  {card.button} View Details
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
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
