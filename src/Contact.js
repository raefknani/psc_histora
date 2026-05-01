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
            ← Back to Spaces
          </Link>
          <h1>Contact Histora</h1>
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
              Interested in exploring Histora's cultural spaces and heritage
              traditions? Our team is here to help you discover these authentic
              narratives and connect with our collection of preserved interiors
              and traditional homes.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <h3>📍 Location</h3>
                <p>
                  Tunis, Tunisia
                  <br />
                  Middle Medina
                </p>
              </div>

              <div className="contact-item">
                <h3>📞 Phone</h3>
                <p>
                  +216 (XX) XXX-XXXX
                  <br />
                  Mon-Fri: 9AM-6PM
                </p>
              </div>

              <div className="contact-item">
                <h3>✉️ Email</h3>
                <p>
                  histora.psc@gmail.com
                  <br />
                  {/* tours@histora.com */}
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

            {/* <div className="social-links">
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
            </div> */}
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
                  <option value="space-inquiry">Space Inquiry</option>
                  <option value="tour-request">Request a Tour</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="cultural-exchange">Cultural Exchange</option>
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
                  placeholder="Tell us about your interest in Histora..."
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
              <h3>How can I visit the spaces?</h3>
              <p>
                Contact us through the form above or call our office directly.
                We arrange guided tours at scheduled times to preserve the
                authenticity of each space.
              </p>
            </div>

            <div className="faq-item">
              <h3>What spaces are featured in Histora?</h3>
              <p>
                We showcase 11 authentic spaces including traditional homes, the
                coffeehouse, olive press, weaver's studio, marketplace, kitchen,
                and henna preparation rooms from historical periods.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is photography allowed during tours?</h3>
              <p>
                Yes, photography is permitted in most spaces. We ask that
                visitors respect the cultural significance of each exhibit and
                maintain the integrity of traditional items.
              </p>
            </div>

            <div className="faq-item">
              <h3>Are there group tour options?</h3>
              <p>
                Yes, we offer group tours for schools, organizations, and
                cultural institutions. Contact us to arrange a customized
                experience for your group.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
