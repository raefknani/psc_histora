import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./LearnMore.css";

function LearnMore() {
  return (
    <div className="learn-more">
      <header className="learn-more-header">
        <div className="container">
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
          <h1>Learn More About Eco-Friendly Living</h1>
        </div>
      </header>

      <div className="container">
        <div className="learn-more-content">
          <motion.section
            className="intro-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Why Choose Eco-Friendly Homes?</h2>
            <p>
              In today's world, sustainable living isn't just a trend—it's a
              necessity. Our eco-friendly homes combine modern comfort with
              environmental responsibility, helping you reduce your carbon
              footprint while enjoying a luxurious lifestyle.
            </p>
          </motion.section>

          <motion.section
            className="benefits-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Key Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <h3>🌱 Environmental Impact</h3>
                <p>
                  Reduce energy consumption by up to 50% with our sustainable
                  designs and renewable energy systems.
                </p>
              </div>
              <div className="benefit-card">
                <h3>💰 Cost Savings</h3>
                <p>
                  Lower utility bills and potential tax incentives for
                  eco-friendly home features.
                </p>
              </div>
              <div className="benefit-card">
                <h3>🏠 Health & Comfort</h3>
                <p>
                  Better indoor air quality, natural lighting, and sustainable
                  materials for healthier living.
                </p>
              </div>
              <div className="benefit-card">
                <h3>🌍 Future-Proof</h3>
                <p>
                  Invest in properties that will remain valuable as
                  sustainability becomes increasingly important.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="features-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Our Sustainable Features</h2>
            <div className="features-list">
              <div className="feature-item">
                <h4>Solar Power Integration</h4>
                <p>
                  Harness clean energy from the sun with advanced solar panel
                  systems and battery storage.
                </p>
              </div>
              <div className="feature-item">
                <h4>Energy-Efficient Design</h4>
                <p>
                  Passive solar design, superior insulation, and smart home
                  technology for optimal energy use.
                </p>
              </div>
              <div className="feature-item">
                <h4>Water Conservation</h4>
                <p>
                  Rainwater harvesting, low-flow fixtures, and drought-resistant
                  landscaping.
                </p>
              </div>
              <div className="feature-item">
                <h4>Sustainable Materials</h4>
                <p>
                  Recycled and renewable building materials that minimize
                  environmental impact.
                </p>
              </div>
              <div className="feature-item">
                <h4>Green Spaces</h4>
                <p>
                  Native plant gardens, community green spaces, and
                  wildlife-friendly landscaping.
                </p>
              </div>
              <div className="feature-item">
                <h4>Smart Home Technology</h4>
                <p>
                  Automated systems for energy management, security, and comfort
                  optimization.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="process-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2>Our Commitment to Sustainability</h2>
            <p>
              Every aspect of our homes is designed with the environment in
              mind. From the initial planning stages to the final construction
              details, we prioritize sustainable practices that benefit both our
              residents and the planet.
            </p>
            <p>
              We work closely with environmental experts, use certified green
              building materials, and implement innovative technologies that
              make eco-friendly living accessible and enjoyable for everyone.
            </p>
          </motion.section>

          <motion.section
            className="cta-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2>Ready to Start Your Eco-Friendly Journey?</h2>
            <p>
              Explore our collection of sustainable homes and discover the
              perfect property for your green lifestyle.
            </p>
            <div className="cta-buttons">
              <Link to="/" className="btn-primary">
                Browse Properties
              </Link>
              <button className="btn-secondary">
                Download Sustainability Guide
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default LearnMore;
