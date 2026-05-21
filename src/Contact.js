import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./images/logo_psc-removebg-preview.png";
import { supabase } from "./utils/supabase";
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
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setErrorMessage("");

    if (!supabase) {
      setSubmitStatus("error");
      setErrorMessage("Service unavailable. Please try again later.");
      return;
    }

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      },
    ]);

    if (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("Something went wrong. Please try again or email us directly.");
    } else {
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
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
              <button
                type="submit"
                className="submit-btn"
                disabled={submitStatus === "loading"}
                style={{ opacity: submitStatus === "loading" ? 0.7 : 1, cursor: submitStatus === "loading" ? "not-allowed" : "pointer" }}
              >
                {submitStatus === "loading" ? "Sending…" : "Send Message"}
              </button>

              {submitStatus === "success" && (
                <motion.div
                  className="form-status success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ✅ Thank you! Your message has been sent. We'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  className="form-status error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ❌ {errorMessage}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

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
    </div>
  );
}

export default Contact;
