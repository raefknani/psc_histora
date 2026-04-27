import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import img1 from "./images/1000043064.jpg";
import img2 from "./images/1000043066.jpg";
import img3 from "./images/1000043068.jpg";
import img4 from "./images/1000043065.jpg";
import img5 from "./images/1000043067.jpg";
import img6 from "./images/1000043071.jpg";
import img7 from "./images/1000043072.jpg";
import img8 from "./images/1000043073.jpg";
import img9 from "./images/1000043074.jpg";
import img10 from "./images/1000043075.jpg";
import img11 from "./images/1000043076.jpg";
import img12 from "./images/1000043077.jpg";
import img13 from "./images/1000043078.jpg";
import img14 from "./images/1000043079.jpg";
import img15 from "./images/1000043080.jpg";
import img16 from "./images/1000043081.jpg";
import img17 from "./images/1000043082.jpg";
import img18 from "./images/1000043083.jpg";
import img19 from "./images/1000043084.jpg";
import audioNarrative from "./Khali beddalni.mp3";
import "./PropertyDetail.css";

const propertyDetails = [
  {
    id: 1,
    title: "Well Eco-Friendly Homes",
    description:
      "Energy-efficient architecture and comfort with nature-friendly spaces.",
    fullDescription:
      "Experience the perfect blend of modern comfort and environmental responsibility. Our Well Eco-Friendly Homes feature state-of-the-art energy-efficient systems, sustainable materials, and thoughtful design that minimizes environmental impact while maximizing living comfort. Each home includes solar panels, rainwater harvesting, and smart home technology for optimal energy management.",
    features: [
      "Solar Panel Integration",
      "Rainwater Harvesting",
      "Smart Home Automation",
      "Energy-Efficient Insulation",
      "Sustainable Materials",
    ],
    roomNumber: 3,
    area: "2,200 sq ft",
    floorNumber: "Green Valley Estates",
    img: img1,
    gallery: [img1, img4, img2],
  },
  {
    id: 2,
    title: "Sustainability Living Homes",
    description:
      "Smart passive design, renewable systems and modern green lifestyle.",
    fullDescription:
      "Discover homes designed with passive solar principles and integrated renewable energy systems. Our Sustainability Living Homes incorporate cutting-edge green technologies including geothermal heating, wind turbines, and advanced insulation systems. Live in harmony with nature while enjoying all the comforts of modern living.",
    features: [
      "Geothermal Heating",
      "Wind Turbine Integration",
      "Passive Solar Design",
      "Advanced Insulation",
      "Green Roof System",
    ],
    roomNumber: 4,
    area: "2,800 sq ft",
    floorNumber: "Eco Ridge Community",
    img: img2,
    gallery: [img2, img5, img3],
  },
  {
    id: 3,
    title: "Comfortable Living",
    description: "Cozy eco-living spaces in a sustainable, serene community.",
    fullDescription:
      "Nestled in a peaceful, sustainable community, our Comfortable Living homes offer the perfect balance of coziness and eco-consciousness. Each residence features natural materials, abundant natural light, and community-shared green spaces. Experience the joy of living in harmony with both your neighbors and the environment.",
    features: [
      "Natural Lighting Design",
      "Community Gardens",
      "Shared Green Spaces",
      "Natural Materials",
      "Low-Impact Landscaping",
    ],
    roomNumber: 3,
    area: "1,900 sq ft",
    floorNumber: "Harmony Grove",
    img: img3,
    gallery: [img3, img6, img7],
  },
  {
    id: 4,
    title: "Green Oasis Residences",
    description:
      "Luxurious homes surrounded by lush greenery and sustainable gardens.",
    fullDescription:
      "Indulge in luxury living amidst nature's beauty. Our Green Oasis Residences combine high-end finishes with extensive green spaces, creating a true oasis of tranquility. Each home features private gardens, water features, and panoramic views of meticulously maintained landscapes that support local wildlife and biodiversity.",
    features: [
      "Private Gardens",
      "Water Features",
      "Biodiversity Preservation",
      "Luxury Finishes",
      "Panoramic Views",
    ],
    roomNumber: 4,
    area: "3,200 sq ft",
    floorNumber: "Oasis Valley",
    img: img4,
    gallery: [img4, img8, img9],
  },
  {
    id: 5,
    title: "Solar-Powered Villas",
    description:
      "Modern villas with integrated solar panels and energy storage systems.",
    fullDescription:
      "Harness the power of the sun with our Solar-Powered Villas. These modern residences feature comprehensive solar installations, advanced battery storage systems, and energy monitoring dashboards. Generate your own clean energy while enjoying contemporary design and premium amenities in a sustainable lifestyle.",
    features: [
      "Complete Solar Installation",
      "Battery Storage Systems",
      "Energy Monitoring",
      "Contemporary Design",
      "Premium Amenities",
    ],
    roomNumber: 4,
    area: "2,600 sq ft",
    floorNumber: "Solar Ridge Estates",
    img: img5,
    gallery: [img5, img10, img11],
  },
  {
    id: 6,
    title: "Nature-Integrated Living",
    description:
      "Homes designed to blend seamlessly with natural landscapes and ecosystems.",
    fullDescription:
      "Live in perfect harmony with nature in our Nature-Integrated Living homes. These residences are thoughtfully designed to minimize environmental disruption while maximizing connection to the natural world. Features include living green roofs, native plant landscaping, and architectural designs that complement the surrounding ecosystem.",
    features: [
      "Living Green Roofs",
      "Native Plant Landscaping",
      "Ecosystem Integration",
      "Minimal Environmental Impact",
      "Natural Surroundings",
    ],
    roomNumber: 3,
    area: "2,100 sq ft",
    floorNumber: "Wildlife Preserve Area",
    img: img6,
    gallery: [img6, img12, img13],
  },
  {
    id: 7,
    title: "Eco-Modern Apartments",
    description:
      "Contemporary apartments with smart energy management and green features.",
    fullDescription:
      "Experience modern urban living with a green conscience. Our Eco-Modern Apartments feature intelligent energy management systems, recycled materials, and community sustainability programs. Perfect for those who want contemporary design without compromising environmental values.",
    features: [
      "Smart Energy Management",
      "Recycled Materials",
      "Community Programs",
      "Contemporary Design",
      "Urban Green Living",
    ],
    roomNumber: 2,
    area: "1,400 sq ft",
    floorNumber: "Green City Center",
    img: img7,
    gallery: [img7, img14, img15],
  },
  {
    id: 8,
    title: "Sustainable Townhouses",
    description:
      "Community-focused townhouses with shared green spaces and renewable energy.",
    fullDescription:
      "Join a vibrant community of eco-conscious neighbors in our Sustainable Townhouses. These homes feature shared renewable energy systems, community gardens, and collaborative sustainability initiatives. Experience the benefits of community living while maintaining individual privacy and comfort.",
    features: [
      "Shared Renewable Energy",
      "Community Gardens",
      "Collaborative Initiatives",
      "Individual Privacy",
      "Community Benefits",
    ],
    roomNumber: 3,
    area: "1,800 sq ft",
    floorNumber: "Eco Village",
    img: img8,
    gallery: [img8, img16, img17],
  },
  {
    id: 9,
    title: "Forest Retreat Homes",
    description:
      "Peaceful homes nestled in forest settings with minimal environmental impact.",
    fullDescription:
      "Escape to tranquility in our Forest Retreat Homes, carefully placed to preserve natural forest ecosystems. These homes feature elevated designs that minimize ground disturbance, natural material integration, and complete harmony with the surrounding woodland environment. Perfect for those seeking peace and environmental stewardship.",
    features: [
      "Elevated Design",
      "Natural Material Integration",
      "Forest Ecosystem Preservation",
      "Minimal Impact Construction",
      "Woodland Harmony",
    ],
    roomNumber: 3,
    area: "2,400 sq ft",
    floorNumber: "Ancient Forest Preserve",
    img: img9,
    gallery: [img9, img18, img19],
  },
];

function PropertyDetail() {
  const { id } = useParams();
  const property = propertyDetails.find((p) => p.id === parseInt(id));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
            <motion.img
              src={property.gallery[selectedImageIndex]}
              alt={property.title}
              className="main-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              key={selectedImageIndex}
            />
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
                  <span className="spec-label">Room number:</span>
                  <span className="spec-value">{property.roomNumber}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Area:</span>
                  <span className="spec-value">{property.area}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Floor number:</span>
                  <span className="spec-value">{property.floorNumber}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="property-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3>Key Features</h3>
              <ul>
                {property.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
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
    </div>
  );
}

export default PropertyDetail;
