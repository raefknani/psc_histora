import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./images/logo_psc-removebg-preview.png";
import "./Contact.css";
import "./psc.css";

function Contact() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact">
      <header className="top-nav">
        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img src={logo} alt="Histora Logo" />
          HISTORA
        </div>

        <button className="hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}></span>
          <span className={`hamburger-line ${mobileMenuOpen ? "active" : ""}`}></span>
        </button>

        <nav className="menu">
          <Link to="/" className="menu-link">Home</Link>
          <Link to="/find" className="menu-link">Find</Link>
          <Link to="/learn-more" className="menu-link">Learn More</Link>
          <Link to="/contact" className="menu-link active">Contact</Link>
        </nav>

        {/* <button className="cta-btn">
          <Link to="/learn-more">Learn More</Link>
        </button> */}
      </header>

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
            <Link to="/find" className="mobile-nav-link" onClick={closeMobileMenu}>Find</Link>
            <Link to="/learn-more" className="mobile-nav-link" onClick={closeMobileMenu}>Learn More</Link>
            <Link to="/contact" className="mobile-nav-link active" onClick={closeMobileMenu}>Contact</Link>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="container">
        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ color: "#8c5a3c", fontSize: "2.5rem", marginBottom: "20px" }}>Contact Histora</h1>
            <h2>Get In Touch</h2>
            <p>
              Interested in exploring Histora's cultural spaces and heritage
              traditions? Our team is here to help you discover these authentic
              narratives and connect with our collection of preserved interiors
              and traditional homes.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <h3>📍 Location</h3>
                <p>Musée de la Kobba, Sousse, Tunisia</p>
              </div>
              <div className="contact-item">
                <h3>📞 Phone</h3>
                <p>+216 ........</p>
              </div>
              <div className="contact-item">
                <h3>✉️ Email</h3>
                <p>histora.psc@gmail.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Select a subject</option>
                  <option value="space-inquiry">Space Inquiry</option>
                  <option value="tour-request">Request a Tour</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="6" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
