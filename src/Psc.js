/* eslint-disable unicode-bom */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import videoBg from "./videoplayback (2).webm";
import img1 from "./images/1000043064.jpg";
import img2 from "./images/1000043066.jpg";
import img3 from "./images/1000043068.jpg";
import img4 from "./images/1000043065.jpg";
import img5 from "./images/1000043067.jpg";
import img6 from "./images/1000043071.jpg";
import img7 from "./images/1000043072.jpg";
import img8 from "./images/1000043073.jpg";
import img9 from "./images/1000043074.jpg";
import imageLogo from "./images/logo_psc-removebg-preview.png";
import "./psc.css";

const cardData = [
  {
    title: "Well Eco-Friendly Homes",
    text: "Energy-efficient architecture and comfort with nature-friendly spaces.",
    button: "More details",
    img: img1,
  },
  {
    title: "Sustainability Living Homes",
    text: "Smart passive design, renewable systems and modern green lifestyle.",
    button: "More details",
    img: img2,
  },
  {
    title: "Comfortable Living",
    text: "Cozy eco-living spaces in a sustainable, serene community.",
    button: "More details",
    img: img3,
  },
  {
    title: "Green Oasis Residences",
    text: "Luxurious homes surrounded by lush greenery and sustainable gardens.",
    button: "More details",
    img: img4,
  },
  {
    title: "Solar-Powered Villas",
    text: "Modern villas with integrated solar panels and energy storage systems.",
    button: "More details",
    img: img5,
  },
  {
    title: "Nature-Integrated Living",
    text: "Homes designed to blend seamlessly with natural landscapes and ecosystems.",
    button: "More details",
    img: img6,
  },
  {
    title: "Eco-Modern Apartments",
    text: "Contemporary apartments with smart energy management and green features.",
    button: "More details",
    img: img7,
  },
  {
    title: "Sustainable Townhouses",
    text: "Community-focused townhouses with shared green spaces and renewable energy.",
    button: "More details",
    img: img8,
  },
  {
    title: "Forest Retreat Homes",
    text: "Peaceful homes nestled in forest settings with minimal environmental impact.",
    button: "More details",
    img: img9,
  },
];

function Psc() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <img src={imageLogo} alt="Logo" />
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
        <video autoPlay loop muted playsInline className="video-bg">
          <source src={videoBg} type="video/mp4" />
        </video>
        <div className="overlay" />

        <div className="hero-content">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="subheading"
          >
            Find Eco-Friendly Homes Easily
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-title"
          >
            Discover Your Green Sanctuary
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="hero-text"
          >
            Curated eco homes, sustainable estates and serene nature retreats.
            Join the next wave of green living.
          </motion.p>

          <div className="hero-actions">
            <input
              type="text"
              placeholder="Search location, type, budget..."
              className="search-input"
            />
            <button className="btn-primary">Browse Properties</button>
          </div>
        </div>
      </section>

      <section className="features" id="about">
        <div className="intro-card">
          <h2>Welcome on Treopps</h2>
          <p>
            Eco-friendly residences with calm modern design. Find your ideal
            home near forests, lakes and sustainable communities.
          </p>
          {/* <div className="intro-buttons">
            <button className="btn-secondary">Explore Now</button>
            <Link to="/learn-more" className="btn-outline">
              Learn More
            </Link>
          </div> */}
        </div>

        <div className="card-grid">
          {cardData.map((card, index) => (
            <motion.article
              key={index}
              className="info-card"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <img src={card.img} alt={card.title} />
              <div className="card-text">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <Link to={`/property/${index + 1}`} className="btn-tertiary">
                  {card.button}
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
            <p>
              Premium eco-home marketplace focused on sustainability and
              comfort.
            </p>
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
            <p>Email: info@histora.com</p>
            <p>Phone: +1 800 123 4567</p>
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
