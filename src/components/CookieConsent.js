import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CookieConsent.css";

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      // Small delay for better UX before showing the banner
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
    window.dispatchEvent(new Event("consentGiven"));
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="cookie-consent-overlay"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="cookie-consent-container">
            <div className="cookie-content">
              <h4>We Value Your Privacy</h4>
              <p>
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
              </p>
            </div>
            <div className="cookie-actions">
              <button className="btn-decline" onClick={handleDecline}>Decline</button>
              <button className="btn-accept" onClick={handleAccept}>Accept</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CookieConsent;
