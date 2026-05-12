import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getWithExpiry } from "./authUtils";
import { motion } from "framer-motion";
import roomsData from "./roomsData";
import { getRoomTitle, getOptimizedImageUrl } from "./utils";
import "./PropertyDetail.css";

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

    // Check immediately on mount
    checkAuth();

    // Periodic check every 2 seconds to handle expiration while on page
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, [property, navigate]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("ENG");
  const [isDragging, setIsDragging] = useState(false);

  // États pour les textes chargés
  const [loadedLongTexts, setLoadedLongTexts] = useState({
    AR: "",
    FR: "",
    ENG: "",
  });
  const [loadedShortTexts, setLoadedShortTexts] = useState({
    AR: "",
    FR: "",
    ENG: "",
  });
  const [textLoading, setTextLoading] = useState(false);

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
          if (long[lang]?.trim()) {
            mergedLong[lang] += (mergedLong[lang] ? "\n\n" : "") + long[lang];
          }
        });

        Object.keys(short).forEach((lang) => {
          if (short[lang]?.trim()) {
            mergedShort[lang] += (mergedShort[lang] ? "\n\n" : "") + short[lang];
          }
        });
      });

      setLoadedLongTexts(mergedLong);
      setLoadedShortTexts(mergedShort);
      setTextLoading(false);
    };

    // Use description from roomsData.js if available
    if (property.description && property.description !== "Description coming soon...") {
       setTextLoading(false);
       processRawText([property.description]);
       return;
    }

    const urls = property.textUrls || property.texts || [];
    if (!urls.length) {
      setLoadedLongTexts({ AR: "", FR: "", ENG: "" });
      setLoadedShortTexts({ AR: "", FR: "", ENG: "" });
      setTextLoading(false);
      return;
    }

    setTextLoading(true);
    Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        return await response.text();
      }),
    )
      .then(processRawText)
      .catch((error) => {
        console.error("Error loading text files:", error);
        setLoadedLongTexts({ AR: "", FR: "", ENG: "" });
        setLoadedShortTexts({ AR: "", FR: "", ENG: "" });
        setTextLoading(false);
      });
  }, [property]);

  // Sélection automatique d'une langue disponible
  useEffect(() => {
    if (!property) return;

    const availableLanguages = Object.keys(loadedLongTexts).filter(
      (lang) => loadedLongTexts[lang]?.trim() || loadedShortTexts[lang]?.trim(),
    );

    if (
      availableLanguages.length &&
      !availableLanguages.includes(selectedLanguage)
    ) {
      setSelectedLanguage(availableLanguages[0] || "ENG");
    }
  }, [loadedLongTexts, loadedShortTexts, property, selectedLanguage]);

  if (!property) {
    return (
      <div className="property-detail">
        <div className="container">
          <h1>Property Not Found</h1>
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Langues disponibles pour l'affichage
  const availableLanguages = Object.keys(loadedLongTexts).filter((lang) =>
    loadedLongTexts[lang]?.trim() || loadedShortTexts[lang]?.trim()
  );

// getRoomTitle moved to utils.js

  return (
    <div className="property-detail">
      <header className="detail-header">
        <div className="container">
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
          <h1 dir="rtl">{getRoomTitle(property)}</h1>
        </div>
      </header>

      <div className="container">
        <div className="property-content">
          {/* Galerie d'images */}
          <div className="property-gallery">
            <motion.div
              className="main-image-container"
              onClick={() =>
                !isDragging && setExpandedImage(selectedImageIndex)
              }
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
                    setSelectedImageIndex((prevIndex) =>
                      prevIndex === property.gallery.length - 1
                        ? 0
                        : prevIndex + 1,
                    );
                  } else if (info.offset.x > 90) {
                    setSelectedImageIndex((prevIndex) =>
                      prevIndex === 0
                        ? property.gallery.length - 1
                        : prevIndex - 1,
                    );
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
            {/* OVERVIEW - Affiche le Short Description */}
            <motion.div
              className="property-overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2>Overview</h2>
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
                {textLoading ? (
                  <p>Loading description...</p>
                ) : (
                  (() => {
                    const text = loadedShortTexts[selectedLanguage]?.trim();
                    if (!text) return <p>No overview available.</p>;
                    const lines = text.split(/\r?\n/);
                    let titleIndex = -1;
                    for (let i = 0; i < lines.length; i++) {
                      if (lines[i].trim()) {
                        titleIndex = i;
                        break;
                      }
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

              <div className="property-specs">
                <div className="spec-item">
                  <span className="spec-label">Images:</span>
                  <span className="spec-value">
                    {property.gallery.length} photos
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Name:</span>
                  <span className="spec-value" dir="rtl" style={{ display: 'inline-block' }}>{getRoomTitle(property)}</span>
                </div>
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
            {textLoading ? (
              <p>Loading description...</p>
            ) : (
              (() => {
                const text = loadedLongTexts[selectedLanguage]?.trim();
                if (!text) return <p>No description available.</p>;
                const lines = text.split(/\r?\n/);
                let titleIndex = -1;
                for (let i = 0; i < lines.length; i++) {
                  if (lines[i].trim()) {
                    titleIndex = i;
                    break;
                  }
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

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="coming-soon-heading"
        >
          Coming Soon
        </motion.h2>

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
              className="experience-card"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 220 }}
            >
              <div className="experience-preview">
                <img src={property.img} alt="3D model preview" />
              </div>
              <h3>3D Model Preview</h3>
              <p>
                Explore a realistic 3D visualization of the property layout and
                materials. Use the preview to inspect textures, light, and
                space.
              </p>
            </motion.article>

            <motion.article
              className="experience-card"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 220 }}
            >
              {property.videos?.length ? (
                <div
                  className="experience-video-wrapper"
                  onClick={() => setExpandedVideo(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      setExpandedVideo(true);
                    }
                  }}
                >
                  <video
                    className="experience-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source
                      src={property.videos[0]}
                      type={
                        property.videos[0].endsWith(".webm")
                          ? "video/webm"
                          : "video/mp4"
                      }
                    />
                    Your browser does not support video playback.
                  </video>
                </div>
              ) : (
                <div className="experience-icon">🎥</div>
              )}
              <h3>Interactive Animation</h3>
              <p>
                Simulated walkthrough and scene animation help you feel the flow
                of the home before visiting. This builds confidence in the
                layout.
              </p>
            </motion.article>

            <motion.article
              className="experience-card"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 220 }}
            >
              <div className="experience-icon">🔊</div>
              <h3>Audio Narrative</h3>
              <p>
                Listen to a short audio summary that highlights key sustainable
                features and the story behind the design.
              </p>
            </motion.article>
          </div>
        </section>
      </div>

      {/* Modal pour l'image agrandie */}
      {expandedImage !== null && (
        <motion.div
          className="image-modal-overlay"
          onClick={() => setExpandedImage(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="image-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              className="modal-close-btn"
              onClick={() => setExpandedImage(null)}
            >
              ✕
            </button>

            <div className="modal-image-container">
              <motion.img
                src={property.gallery[expandedImage]}
                alt="Expanded view"
                className="expanded-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                key={expandedImage}
              />
            </div>

            <div className="modal-navigation">
              <button
                className="nav-btn prev-btn"
                onClick={() =>
                  setExpandedImage(
                    expandedImage === 0
                      ? property.gallery.length - 1
                      : expandedImage - 1,
                  )
                }
              >
                ← Previous
              </button>
              <span className="image-counter">
                {expandedImage + 1} / {property.gallery.length}
              </span>
              <button
                className="nav-btn next-btn"
                onClick={() =>
                  setExpandedImage(
                    expandedImage === property.gallery.length - 1
                      ? 0
                      : expandedImage + 1,
                  )
                }
              >
                Next →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal pour la vidéo agrandie */}
      {expandedVideo && property.videos?.length && (
        <motion.div
          className="video-modal-overlay"
          onClick={() => setExpandedVideo(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="video-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              className="modal-close-btn"
              onClick={() => setExpandedVideo(false)}
            >
              ✕
            </button>

            <video className="expanded-video" autoPlay muted loop playsInline>
              <source
                src={property.videos[0]}
                type={
                  property.videos[0].endsWith(".webm")
                    ? "video/webm"
                    : "video/mp4"
                }
              />
              Your browser does not support video playback.
            </video>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default PropertyDetail;
