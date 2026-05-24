import { useState, useEffect, useRef } from "react";
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

  const galleryRef = useRef(null);
  const modalGalleryRef = useRef(null);


  const [containerWidth, setContainerWidth] = useState(0);
  const [modalWidth, setModalWidth] = useState(0);

  useEffect(() => {
  const update = () => {
    if (galleryRef.current) {
      setContainerWidth(galleryRef.current.offsetWidth);
    }
  };

  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, []);
  useEffect(() => {
    const updateWidth = () => {
      if (galleryRef.current) {
        setContainerWidth(galleryRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [expandedImage]);

  // États pour les textes chargés
  const [loadedLongTexts, setLoadedLongTexts] = useState({ AR: "", FR: "", ENG: "" });
  const [loadedShortTexts, setLoadedShortTexts] = useState({ AR: "", FR: "", ENG: "" });
  const [pageLoading, setPageLoading] = useState(false);
  useEffect(() => {
  const updateModalWidth = () => {
    if (modalGalleryRef.current) {
      setModalWidth(modalGalleryRef.current.clientWidth);
    }
  };

  updateModalWidth();

  window.addEventListener("resize", updateModalWidth);
  return () => window.removeEventListener("resize", updateModalWidth);
}, [expandedImage]);
  // Lock body scroll when modals are open
  useEffect(() => {
    if (expandedImage !== null || expandedVideo || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [expandedImage, expandedVideo, mobileMenuOpen]);

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

    // Load text data
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

    // Preload ONLY the first image (main view) to show the UI faster
    const imagesToPreload = property.gallery.slice(0, 1).map(img => 
      getOptimizedImageUrl(img, 'w_1200,q_auto,f_auto')
    );
    const imagePromise = preloadImages(imagesToPreload);

    // Show text as soon as it arrives, don't wait for all images
    textPromise.then((textData) => {
      processRawText(textData);
      setPageLoading(false);
      clearTimeout(safetyTimer);
    }).catch(err => {
      console.error("Text load error:", err);
      setPageLoading(false);
    });

    // Images load in background
    imagePromise.then(() => {
      // Preload the rest of the gallery silently after the first one is ready
      const restOfGallery = property.gallery.slice(1, 4).map(img => 
        getOptimizedImageUrl(img, 'w_1200,q_auto,f_auto')
      );
      preloadImages(restOfGallery);
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
            <Link to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="container" style={{ paddingTop: "100px" }}>
        <div className="property-content">
          <div className="property-gallery" style={{ position: 'relative' }} ref={galleryRef}>
            <div className="main-image-container" style={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
              <motion.div
  className="main-image-strip"
  drag={
    property.gallery.length <= 1
      ? false
      : "x"
  }
  dragElastic={0}
  dragMomentum={false}
  dragConstraints={{
    left:
      selectedImageIndex === property.gallery.length - 1
        ? -selectedImageIndex * containerWidth
        : -999999,

    right:
      selectedImageIndex === 0
        ? -selectedImageIndex * containerWidth
        : 999999,
  }}
  onDragStart={() => {
    setIsDragging(true);
  }}
  onDragEnd={(_, info) => {
    const swipeThreshold = containerWidth * 0.18;

    // NEXT
    if (
      info.offset.x < -swipeThreshold &&
      selectedImageIndex < property.gallery.length - 1
    ) {
      setSelectedImageIndex((prev) => prev + 1);
    }

    // PREV
    if (
      info.offset.x > swipeThreshold &&
      selectedImageIndex > 0
    ) {
      setSelectedImageIndex((prev) => prev - 1);
    }

    setTimeout(() => {
      setIsDragging(false);
    }, 120);
  }}
  animate={{
    x: -selectedImageIndex * containerWidth,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 30,
  }}
  style={{
    display: "flex",
    width: `${property.gallery.length * 100}%`,
    touchAction: "pan-y",
    cursor: isDragging ? "grabbing" : "grab",
  }}
>
  {property.gallery.map((img, index) => (
    <img
      key={index}
      src={getOptimizedImageUrl(img, "w_1200,q_auto,f_auto")}
      alt={`${property.title} ${index + 1}`}
      className="main-image"
      style={{
        width: `${containerWidth}px`,
        flexShrink: 0,
        objectFit: "cover",
        height: "400px",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserDrag: "none",
      }}
      draggable={false}
      onClick={() => {
        if (!isDragging) {
          setExpandedImage(index);
        }
      }}
    />
  ))}
</motion.div>
            </div>
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
          <h3>Description (the story behind this scene)</h3>
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
            <motion.article 
              className={`experience-card ${property.videos?.length ? 'experience-video-wrapper' : ''}`} 
              whileHover={{ y: -6 }}
              onClick={() => property.videos?.length && setExpandedVideo(true)}
            >
              <div className="experience-preview">
                {property.videos?.length ? (
                  <video 
                    className="experience-video" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                  >
                    <source src={property.videos[0]} type="video/mp4" />
                  </video>
                ) : (
                  <img src={property.img} alt="Virtual Scene preview" />
                )}
              </div>
              <h3>Virtual Scene</h3>
              <p>Explore the original authentic items from that room in its real environment.</p>
            </motion.article>

            <motion.article 
              className={`experience-card experience-card--featured ${!property.model3d ? 'experience-card--compact' : ''}`} 
              whileHover={{ y: -6 }}
            >
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

      {expandedImage !== null && (
  <motion.div
    className="image-modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setExpandedImage(null)}
  >
    <button
      className="modal-close-btn"
      onClick={() => setExpandedImage(null)}
    >
      ✕
    </button>

    <div
      className="image-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
  className="floating-nav-btn prev-btn"
  onClick={(e) => {
    e.stopPropagation();

    if (expandedImage > 0) {
      const prevIndex = expandedImage - 1;

      setExpandedImage(prevIndex);
      setSelectedImageIndex(prevIndex);
    }
  }}
>
  ‹
</button>

      {/* SAME STRUCTURE AS MAIN SLIDER */}
      <div ref={modalGalleryRef} className="modal-image-container">
        <motion.div
  className="modal-image-strip"
  drag="x"
  dragElastic={0}
  dragMomentum={false}
  dragConstraints={{
    left: -((property.gallery.length - 1) * modalWidth),
    right: 0,
  }}
  animate={{
    x: -expandedImage * modalWidth,
  }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 30,
  }}
  onDragStart={() => setIsDragging(true)}
  onDragEnd={(_, info) => {
    const threshold = modalWidth * 0.18;

    if (
      info.offset.x < -threshold &&
      expandedImage < property.gallery.length - 1
    ) {
      const next = expandedImage + 1;
      setExpandedImage(next);
      setSelectedImageIndex(next);
    }

    if (info.offset.x > threshold && expandedImage > 0) {
      const prev = expandedImage - 1;
      setExpandedImage(prev);
      setSelectedImageIndex(prev);
    }

    setTimeout(() => setIsDragging(false), 100);
  }}
  style={{
    display: "flex",
    width: `${property.gallery.length * modalWidth}px`,
    height: "100%",
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "pan-y",
  }}
>
          {property.gallery.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${property.title} ${index + 1}`}
              className="expanded-image-slide"
              draggable={false}
              onClick={() => {
                if (!isDragging) {
                  setExpandedImage(null);
                }
              }}
              style={{
                width: `${modalWidth}px`,
                height: "100vh",
                flexShrink: 0,
                objectFit: "contain",
                userSelect: "none",
                WebkitUserDrag: "none",
                padding: "40px",
                boxSizing: "border-box",
                cursor: "zoom-out",
              }}
            />
          ))}
        </motion.div>
      </div>

     <button
  className="floating-nav-btn next-btn"
  onClick={(e) => {
    e.stopPropagation();

    if (expandedImage < property.gallery.length - 1) {
      const nextIndex = expandedImage + 1;

      setExpandedImage(nextIndex);
      setSelectedImageIndex(nextIndex);
    }
  }}
>
  ›
</button>
    </div>

    <div className="modal-footer">
      <span className="image-counter">
        {expandedImage + 1} / {property.gallery.length}
      </span>
    </div>
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
