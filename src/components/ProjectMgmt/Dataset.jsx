import React from 'react';
import { Database, BarChart3, Filter, Download, Zap } from 'lucide-react';
import '../../theme/components/Dataset.css';

const Dataset = ({ projectId }) => {
  return (
    <div className="dataset-container">
      <div className="under-dev-content">
        {/* Main Icon */}
        <div className="dev-icon-container">
          <div className="database-icon-wrapper">
            <Database className="main-icon" size={80} />
            <div className="data-pulse"></div>
          </div>
        </div>

        {/* Title and Description */}
        <h2 className="dev-title">Dataset Management</h2>
        <p className="dev-description">
          Comprehensive tools to view, analyze, and manage your complete dataset
        </p>

        {/* Features Coming Soon */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={24} />
            </div>
            <h3>Dataset Statistics</h3>
            <p>Detailed analytics and insights about your data</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Filter size={24} />
            </div>
            <h3>Advanced Filtering</h3>
            <p>Filter and search through your dataset easily</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Download size={24} />
            </div>
            <h3>Export Options</h3>
            <p>Download your dataset in multiple formats</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={24} />
            </div>
            <h3>Batch Operations</h3>
            <p>Perform operations on multiple items at once</p>
          </div>
        </div>

        {/* Statistics Preview */}
        <div className="stats-preview">
          <div className="stat-preview-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="stat-preview-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Annotated</span>
          </div>
          <div className="stat-preview-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-preview-item">
            <span className="stat-number">0%</span>
            <span className="stat-label">Completion</span>
          </div>
        </div>

        {/* Status Message */}
        <div className="status-message">
          <div className="status-dot"></div>
          <span>Coming very soon! Stay tuned 🎉</span>
        </div>

        {/* CTA */}
        <p className="dev-cta">
          Upload and annotate your data first to see dataset insights
        </p>
      </div>
    </div>
  );
};

export default Dataset;