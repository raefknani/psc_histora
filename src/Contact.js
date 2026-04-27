import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
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
      <header className="contact-header">
        <div className="container">
          <Link to="/" className="back-btn">
            ← Back to Properties
          </Link>
          <h1>Contact Us</h1>
        </div>
      </header>

      <div className="container">
        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Get In Touch</h2>
            <p>
              Ready to find your perfect eco-friendly home? Our team of experts
              is here to help you discover sustainable living solutions that fit
              your lifestyle and values.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <h3>📍 Office Location</h3>
                <p>
                  123 Green Valley Drive
                  <br />
                  Eco City, EC 12345
                </p>
              </div>

              <div className="contact-item">
                <h3>📞 Phone</h3>
                <p>
                  (555) 123-ECO-1
                  <br />
                  Mon-Fri: 9AM-6PM
                </p>
              </div>

              <div className="contact-item">
                <h3>✉️ Email</h3>
                <p>
                  info@ecohomes.com
                  <br />
                  support@ecohomes.com
                </p>
              </div>

              <div className="contact-item">
                <h3>🕒 Business Hours</h3>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <button
                  className="social-link"
                  onClick={() => window.open("https://facebook.com", "_blank")}
                >
                  📘 Facebook
                </button>
                <button
                  className="social-link"
                  onClick={() => window.open("https://twitter.com", "_blank")}
                >
                  🐦 Twitter
                </button>
                <button
                  className="social-link"
                  onClick={() => window.open("https://instagram.com", "_blank")}
                >
                  📷 Instagram
                </button>
                <button
                  className="social-link"
                  onClick={() => window.open("https://linkedin.com", "_blank")}
                >
                  💼 LinkedIn
                </button>
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
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="property-inquiry">Property Inquiry</option>
                  <option value="viewing-request">Schedule Viewing</option>
                  <option value="general-info">General Information</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Tell us about your requirements..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          className="faq-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I schedule a property viewing?</h3>
              <p>
                Contact us through the form above or call our office directly.
                We'll arrange a convenient time for you to visit.
              </p>
            </div>

            <div className="faq-item">
              <h3>What eco-friendly features do your homes include?</h3>
              <p>
                Our properties feature solar panels, energy-efficient
                appliances, sustainable materials, rainwater harvesting, and
                smart home technology.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do you offer financing assistance?</h3>
              <p>
                Yes, we work with several green financing partners who offer
                special rates for eco-friendly home purchases.
              </p>
            </div>

            <div className="faq-item">
              <h3>How long does the buying process take?</h3>
              <p>
                The process typically takes 30-60 days from initial inquiry to
                closing, depending on financing and property availability.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
