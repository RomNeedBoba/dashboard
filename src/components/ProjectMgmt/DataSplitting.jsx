import React from 'react';
import { Zap, Rocket, Coffee, Github } from 'lucide-react';
import '../../theme/components/DataSplitting.css';

const DataSplitting = ({ projectId }) => {
  return (
    <div className="data-splitting-container">
      <div className="under-dev-content">
        {/* Main Icon */}
        <div className="dev-icon-container">
          <Rocket className="main-icon" size={80} />
          <div className="rocket-trail"></div>
        </div>

        {/* Title and Description */}
        <h2 className="dev-title">Data Splitting & Augmentation</h2>
        <p className="dev-description">
          We're working hard to bring you advanced data splitting and augmentation tools
        </p>

        {/* Features Coming Soon */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={24} />
            </div>
            <h3>Train/Test Split</h3>
            <p>Intelligent data splitting with custom ratios</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Coffee size={24} />
            </div>
            <h3>Data Augmentation</h3>
            <p>Transform and augment your dataset automatically</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Github size={24} />
            </div>
            <h3>Advanced Analytics</h3>
            <p>Detailed insights about your data distribution</p>
          </div>
        </div>

        {/* Status Message */}
        <div className="status-message">
          <div className="status-dot"></div>
          <span>Coming very soon! Stay tuned 🎉</span>
        </div>

        {/* CTA */}
        <p className="dev-cta">
          In the meantime, explore the other tools to prepare your data
        </p>
      </div>
    </div>
  );
};

export default DataSplitting;