import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getWithExpiry } from "./authUtils";
import { motion, AnimatePresence } from "framer-motion";
import roomsData from "./roomsData";
import { getRoomTitle, getOptimizedImageUrl, preloadImages } from "./utils";
import Loader from "./components/Loader";
import logo from "./images/logo_psc-removebg-preview.png";
import "./PropertyDetail.css";
import "./psc.css";
import STLViewer from "./components/STLViewer";

// Parse le fichier texte pour extraire Long Description et Short Description
const parseFullTextSections = (text) => {
  const lines = (text || "").split(/\r?\n/);
  const result = {
    long: { AR: "", FR: "", ENG: "" },
    short: { AR: "", FR: "", ENG: "" },
  };

  let currentLang = "AR"; // Par défaut, on suppose que ça commence par l'Arabe
  let currentType = "long"; // Par défaut, long description

  lines.forEach((line) => {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    // Détecter la langue [AR], [FR], [ENG], ou fr, en, ar
    const langMatch = trimmed.match(/^\[?(AR|FR|ENG)\]?$/i);
    if (langMatch) {
      currentLang = langMatch[1].toUpperCase();
      return;
    }
    
    if (lower === "français – version complète" || lower === "français - version complète" || lower === "fr" || lower === "français") {
      currentLang = "FR";
      return;
    }
    if (lower === "english – full version" || lower === "english - full version" || lower === "en" || lower === "english") {
      currentLang = "ENG";
      return;
    }
    if (lower === "العربية – النص الكامل" || lower === "العربية - النص الكامل" || lower === "ar" || lower === "العربية") {
      currentLang = "AR";
      return;
    }

    // Détecter Long Description
    if (lower.includes("[long description") || lower === "(description)" || lower === "description:" || lower === "description :") {
      currentType = "long";
      return;
    }

    // Détecter Short Description (Overview)
    if (lower.includes("[short description") || lower === "(overview)" || lower === "overview:" || lower === "overview :") {
      currentType = "short";
      return;
    }

    if (!currentLang || !currentType) return;

    result[currentType][currentLang] +=
      (result[currentType][currentLang] ? "\n" : "") + line;
  });

  // Nettoyer les résultats
  Object.keys(result.long).forEach((lang) => {
    result.long[lang] = result.long[lang].trim();
    result.short[lang] = result.short[lang].trim();
  });

  // Si rien n'a été parsé (fichier texte brut sans tags), on met tout dans le long AR par défaut
  const hasContent = Object.values(result.long).some(v => v) || Object.values(result.short).some(v => v);
  if (!hasContent && text.trim()) {
      result.long.AR = text.trim();
  }

  return result;
};

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = roomsData.find((p) => p.id === parseInt(id));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Security Gate: Redirect if room is locked and session is expired
  useEffect(() => {
    const checkAuth = () => {
      if (property && property.locked) {
        const isUnlocked = getWithExpiry("histora_unlocked") === true;
        if (!isUnlocked) {
          navigate("/?expired=true");
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, [property, navigate]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("ENG");
  const [isDragging, setIsDragging] = useState(false);
  const [show3D, setShow3D] = useState(false);

  // États pour les textes chargés
  const [loadedLongTexts, setLoadedLongTexts] = useState({ AR: "", FR: "", ENG: "" });
  const [loadedShortTexts, setLoadedShortTexts] = useState({ AR: "", FR: "", ENG: "" });
  const [pageLoading, setPageLoading] = useState(false);

  // Gestion de la touche Echap
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (expandedImage !== null) setExpandedImage(null);
        if (expandedVideo) setExpandedVideo(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedImage, expandedVideo]);

  // Scroll en haut
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [property]);

  // Chargement des fichiers texte
  useEffect(() => {
    if (!property) return;
    
    const processRawText = (rawTextList) => {
      const mergedLong = { AR: "", FR: "", ENG: "" };
      const mergedShort = { AR: "", FR: "", ENG: "" };

      rawTextList.forEach((rawText) => {
        const { long, short } = parseFullTextSections(rawText);
        Object.keys(long).forEach((lang) => {
          if (long[lang]?.trim()) mergedLong[lang] += (mergedLong[lang] ? "\n\n" : "") + long[lang];
        });
        Object.keys(short).forEach((lang) => {
          if (short[lang]?.trim()) mergedShort[lang] += (mergedShort[lang] ? "\n\n" : "") + short[lang];
        });
      });

      setLoadedLongTexts(mergedLong);
      setLoadedShortTexts(mergedShort);
      setPageLoading(false);
    };

    if (property.description && property.description !== "Description coming soon...") {
       setPageLoading(false);
       processRawText([property.description]);
       return;
    }

    const urls = property.textUrls || property.texts || [];
    if (!urls.length) {
      setLoadedLongTexts({ AR: "", FR: "", ENG: "" });
      setLoadedShortTexts({ AR: "", FR: "", ENG: "" });
      setPageLoading(false);
      return;
    }

    setPageLoading(true);
    const safetyTimer = setTimeout(() => setPageLoading(false), 5000);

    const textPromise = Promise.all(
      urls.map(async (url) => {
        try {
          const response = await fetch(url);
          return await response.text();
        } catch (e) {
          return "";
        }
      })
    );

    const imagesToPreload = property.gallery.slice(0, 4).map(img => 
      getOptimizedImageUrl(img, 'w_1200,q_auto,f_auto')
    );
    const imagePromise = preloadImages(imagesToPreload);

    Promise.all([textPromise, imagePromise])
      .then(([textData]) => {
        setPageLoading(false);
        clearTimeout(safetyTimer);
        processRawText(textData);
      })
      .catch((error) => {
        console.error("Error loading page data:", error);
        clearTimeout(safetyTimer);
        setPageLoading(false);
      });
  }, [property]);

  useEffect(() => {
    if (!property) return;
    const availableLanguages = Object.keys(loadedLongTexts).filter(
      (lang) => loadedLongTexts[lang]?.trim() || loadedShortTexts[lang]?.trim(),
    );
    if (availableLanguages.length && !availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0] || "ENG");
    }
  }, [loadedLongTexts, loadedShortTexts, property, selectedLanguage]);

  if (!property) {
    return (
      <div className="property-detail">
        <div className="container">
          <h1>Property Not Found</h1>
          <Link to="/" className="back-btn">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const availableLanguages = Object.keys(loadedLongTexts).filter((lang) =>
    loadedLongTexts[lang]?.trim() || loadedShortTexts[lang]?.trim()
  );

  return (
    <div className="property-detail">
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
          <Link to="/contact" className="menu-link">Contact</Link>
        </nav>

        <button className="cta-btn">
          <Link to="/learn-more">Learn More</Link>
        </button>
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
            <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="container" style={{ paddingTop: "100px" }}>
        <div className="property-content">
          <div className="property-gallery">
            <motion.div
              className="main-image-container"
              onClick={() => !isDragging && setExpandedImage(selectedImageIndex)}
              whileHover={{ cursor: "pointer" }}
            >
              <motion.img
                src={getOptimizedImageUrl(property.gallery[selectedImageIndex], 'w_1200,q_auto,f_auto')}
                alt={property.title}
                className="main-image"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.13}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setIsDragging(false);
                  if (info.offset.x < -90) {
                    setSelectedImageIndex((prevIndex) => prevIndex === property.gallery.length - 1 ? 0 : prevIndex + 1);
                  } else if (info.offset.x > 90) {
                    setSelectedImageIndex((prevIndex) => prevIndex === 0 ? property.gallery.length - 1 : prevIndex - 1);
                  }
                }}
                whileTap={{ cursor: "grabbing" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                key={selectedImageIndex}
              />
            </motion.div>
            <div className="gallery-thumbs">
              {property.gallery.map((img, index) => (
                <img
                  key={index}
                  src={getOptimizedImageUrl(img, 'w_150,h_150,c_fill,q_auto,f_auto')}
                  alt={`${property.title} ${index + 1}`}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`thumb-image ${selectedImageIndex === index ? "active" : ""}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <div className="property-info">
            <motion.div
              className="property-overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Overview</h2>
                <h1 dir="rtl" style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color)' }}>{getRoomTitle(property)}</h1>
              </div>
              
              {availableLanguages.length > 0 && (
                <div className="language-toggle">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={`lang-btn ${selectedLanguage === lang ? "active" : ""}`}
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
              
              <div 
                className="description"
                dir={selectedLanguage === "AR" ? "rtl" : "ltr"}
                style={{ textAlign: selectedLanguage === "AR" ? "right" : "left" }}
              >
                {pageLoading ? (
                  <Loader />
                ) : (
                  (() => {
                    const text = loadedShortTexts[selectedLanguage]?.trim();
                    if (!text) return <p>No overview available.</p>;
                    const lines = text.split(/\r?\n/);
                    let titleIndex = -1;
                    for (let i = 0; i < lines.length; i++) {
                      if (lines[i].trim()) { titleIndex = i; break; }
                    }
                    if (titleIndex === -1) return <p>{text}</p>;
                    const title = lines[titleIndex].trim();
                    const body = lines.slice(titleIndex + 1).join("\n").trim();
                    return (
                      <>
                        <h4 style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--primary-color)' }}>{title}</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{body}</p>
                      </>
                    );
                  })()
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="property-features property-description-fullwidth"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>Description</h3>
          <div 
            className="description description-long"
            dir={selectedLanguage === "AR" ? "rtl" : "ltr"}
            style={{ textAlign: selectedLanguage === "AR" ? "right" : "left" }}
          >
            {pageLoading ? (
              <Loader />
            ) : (
              (() => {
                const text = loadedLongTexts[selectedLanguage]?.trim();
                if (!text) return <p>No description available.</p>;
                const lines = text.split(/\r?\n/);
                let titleIndex = -1;
                for (let i = 0; i < lines.length; i++) {
                  if (lines[i].trim()) { titleIndex = i; break; }
                }
                if (titleIndex === -1) return <p>{text}</p>;
                const title = lines[titleIndex].trim();
                const body = lines.slice(titleIndex + 1).join("\n").trim();
                return (
                  <>
                    <h4 style={{ marginBottom: '15px', fontSize: '1.5rem', color: 'var(--primary-color)' }}>{title}</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{body}</p>
                  </>
                );
              })()
            )}
          </div>
        </motion.div>

        <section className="experience-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            3D Experience & Audio Details
          </motion.h2>
          <div className="experience-grid">
            <motion.article className="experience-card" whileHover={{ y: -6 }}>
              <div className="experience-preview">
                <img src={property.img} alt="3D model preview" />
              </div>
              <h3>3D Model Preview</h3>
              <p>Explore a realistic 3D visualization of the property layout and materials.</p>
            </motion.article>

            <motion.article className="experience-card experience-card--featured" whileHover={{ y: -6 }}>
              {show3D ? (
                <STLViewer url={property.model3d} />
              ) : (
                <div className="experience-3d-placeholder">
                  <div className="experience-icon">🧊</div>
                  {property.model3d ? (
                    <>
                      <button className="launch-3d-btn" onClick={() => setShow3D(true)}>
                        Launch 3D Experience
                      </button>
                      <p className="size-info">High-resolution STL Scan</p>
                    </>
                  ) : (
                    <p className="coming-soon-text">3D Model Coming Soon</p>
                  )}
                </div>
              )}
              <h3>Interactive 3D Model</h3>
              <p>Rotate, zoom, and explore every detail of this heritage space in full 3D.</p>
            </motion.article>

            <motion.article className="experience-card" whileHover={{ y: -6 }}>
              <div className="experience-icon">🔊</div>
              <h3>Audio Narrative</h3>
              <p>Listen to a short audio summary that highlights key features.</p>
            </motion.article>
          </div>
        </section>
      </div>

      {expandedImage !== null && (
        <motion.div className="image-modal-overlay" onClick={() => setExpandedImage(null)}>
          <motion.div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setExpandedImage(null)}>✕</button>
            <div className="modal-image-container">
              <motion.img src={property.gallery[expandedImage]} alt="Expanded view" className="expanded-image" key={expandedImage} />
            </div>
            <div className="modal-navigation">
              <button className="nav-btn prev-btn" onClick={() => setExpandedImage(expandedImage === 0 ? property.gallery.length - 1 : expandedImage - 1)}>← Previous</button>
              <span className="image-counter">{expandedImage + 1} / {property.gallery.length}</span>
              <button className="nav-btn next-btn" onClick={() => setExpandedImage(expandedImage === property.gallery.length - 1 ? 0 : expandedImage + 1)}>Next →</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {expandedVideo && property.videos?.length && (
        <motion.div className="video-modal-overlay" onClick={() => setExpandedVideo(false)}>
          <motion.div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setExpandedVideo(false)}>✕</button>
            <video className="expanded-video" autoPlay muted loop playsInline>
              <source src={property.videos[0]} type={property.videos[0].endsWith(".webm") ? "video/webm" : "video/mp4"} />
            </video>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default PropertyDetail;
