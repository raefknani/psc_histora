import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./images/logo_psc-removebg-preview.png";
import "./LearnMore.css";
import "./psc.css";

function LearnMore() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const overviewContent = [
    {
      title: "The Living Room",
      description: "In the mother-in-law's house (1930-1940). Gramophone next to traditional spinning tools. Mother-in-law keeps anklet and Arab dress; Khadija removed anklet, wears a dress, no headscarf. The living room mirrors a transitional period.",
    },
    {
      title: "The Saqifa (Vestibule)",
      description: "The old house entrance where daily life meets itinerant vendors. Khadija chooses lace, her expert grandmother, little sister eats sugar apple. Ḥouta for protection, mannequins in old clothes. The saqifa is a small theatre of tradition and beauty.",
    },
    {
      title: "The Coffeehouse",
      description: "Arabic coffeehouse bringing together Jew, Maltese, tourist, and imam. Coffee with orange blossom water, wood cooking, marsh and copper. The coffeehouse is a meeting space for diverse communities, alive with the old city's spirit.",
    },
    {
      title: "The Olive Press",
      description: "Traditional press in the Sahel. Mikyal (10 kg), tithe (ʿushr) for the poor. Work meets blessing, oil bears witness to generosity of hearts and toil of hands.",
    },
    {
      title: "The Weaver",
      description: "Weaving Tunisian wool with henna and indigo. Tea (teapot) always on the kanoun. The scene is not just a craft but a world of meticulous work and natural materials.",
    },
    {
      title: "The House of the Trousseau (Bayt al-Jihaz)",
      description: "From age six, a girl prepares her trousseau. Linens, Soussi soap, qabqabs, ouksa hairstyle. The trousseau is not just objects but the story and patience of a girl weaving her future with her own hands.",
    },
    {
      title: "The Market",
      description: "Fabric market, official goldsmith (state-appointed), ḥajjam (circumcision, cupping, herbs), public scribe (Zaytouni, reed pen and cuttlefish ink). A bird serves as radio. Diversity of trades, smells, and fragrances.",
    },
    {
      title: "The Kitchen in Her Mother-in-Law's House",
      description: "Wood-fired cooking (zaḥḥafa), raised sedda, marou shelf, large and small jars, food preservation (sharmoula, qaddid). Khadija rolls couscous and hums, her anklet chimes. The kitchen is a warm, pulsating world.",
    },
    {
      title: "Henna Preparations",
      description: "In parents' house, inherited henna garment, lijam (natural makeup), 'hen and chicks' pattern (fertility, husband's fidelity). The meshata attends to her. These preparations carry joy, prayer, and the memory of mothers.",
    },
    {
      title: "The Small Perfume Shop",
      description: "Small kiosk selling natural oils, extracts, incense, henna, siwak, and distilled waters (rose, atrashiya, nesri). Used in sweets, skincare, home. The shop is a small world blending fragrances, cleanliness, adornment, and cooking.",
    },
    {
      title: "The Henna Night – Wedding in the Heart of the House",
      description: "Central patio, women-only celebration. Khadija on a high table, eyes closed, hannana turns her. Her mother remembers her own henna, little sister with a candle, grandmother, hadra sing, al-qaʿada heats banader. Newlyweds sit in front. Baklava and tea. The patio is the beating heart of the house.",
    },
  ];

  return (
    <div className="learn-more">
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
          <Link to="/learn-more" className="menu-link active">Learn More</Link>
          <Link to="/contact" className="menu-link">Contact</Link>
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
            <Link to="/learn-more" className="mobile-nav-link active" onClick={closeMobileMenu}>Learn More</Link>
            <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="container" >
        <div className="learn-more-content">
          <motion.section
            className="intro-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ color: "#8c5a3c", fontSize: "2.5rem", marginBottom: "20px" }}>Explore Histora - Spaces & Stories</h1>
            <h2>Welcome to Histora</h2>
            <p>
              Discover authentic households, cultural spaces, and preserved
              interiors from everyday life in traditional homes. Each space
              tells a story of heritage, tradition, and the timeless beauty of
              cultural practices.
            </p>
          </motion.section>

          <motion.section
            className="features-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>The Spaces of Histora</h2>
            <div className="features-list">
              {overviewContent.map((item, index) => (
                <motion.div
                  key={index}
                  className="feature-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="cta-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2>Explore Each Space in Detail</h2>
            <p>
              Visit our collection to immerse yourself in these rich cultural
              narratives and discover the stories behind each traditional space.
            </p>
            <div className="cta-buttons">
              <Link to="/" className="btn-primary">
                View All Spaces
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </div>
          </motion.section>
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
            <p>Phone: +216 52 267 493</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HISTORA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LearnMore;
