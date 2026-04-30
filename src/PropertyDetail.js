import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import audioNarrative from "./Khali beddalni.mp3";
import roomsData from "./roomsData";
import "./PropertyDetail.css";

function PropertyDetail() {
  const { id } = useParams();
  const property = roomsData.find((p) => p.id === parseInt(id));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && expandedImage !== null) {
        setExpandedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedImage]);

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

  return (
    <div className="property-detail">
      <header className="detail-header">
        <div className="container">
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
          <h1>{property.title}</h1>
        </div>
      </header>

      <div className="container">
        <div className="property-content">
          <div className="property-gallery">
            <motion.div
              className="main-image-container"
              onClick={() => setExpandedImage(selectedImageIndex)}
              whileHover={{ cursor: "pointer" }}
            >
              <motion.img
                src={property.gallery[selectedImageIndex]}
                alt={property.title}
                className="main-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                key={selectedImageIndex}
              />
              <div className="expand-icon">🔍 Expand</div>
            </motion.div>
            <div className="gallery-thumbs">
              {property.gallery.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${property.title} ${index + 1}`}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`thumb-image ${selectedImageIndex === index ? "active" : ""}`}
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
              <h2>Overview</h2>
              <p className="description">{property.fullDescription}</p>

              <div className="property-specs">
                <div className="spec-item">
                  <span className="spec-label">Images:</span>
                  <span className="spec-value">
                    {property.gallery.length} photos
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Category:</span>
                  <span className="spec-value">{property.title}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="property-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3>Description</h3>
              <p>{property.text}</p>
            </motion.div>

            <motion.div
              className="property-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="btn-secondary">Download Brochure</button>
            </motion.div>
          </div>
        </div>

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
              <div className="experience-icon">🎥</div>
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
              <audio controls className="property-audio" src={audioNarrative}>
                Your browser does not support the audio element.
              </audio>
            </motion.article>
          </div>
        </section>
      </div>

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
    </div>
  );
}

export default PropertyDetail;
