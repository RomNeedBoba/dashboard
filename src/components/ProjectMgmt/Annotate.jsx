import React, { useState } from 'react';
import { Upload, MoreVertical, Play, CheckCircle, AlertCircle } from 'lucide-react';
import '../../theme/components/Annotate.css';

const Annotate = ({ projectId }) => {
  const [jobs, setJobs] = useState({
    unassigned: [
      {
        id: 1,
        title: 'Upload More Images',
        batches: 0,
        icon: '📤'
      }
    ],
    annotating: [
      {
        id: 2,
        title: 'Somnang: Job 3',
        labeler: 'samnangkong499@gmail.com',
        reviewer: 'Pichphyrom',
        progress: 20,
        images: 1,
        annotated: 0,
        unannotated: 1
      },
      {
        id: 3,
        title: 'Somnang: Job 2',
        labeler: 'samnangkong499@gmail.com',
        reviewer: 'Pichphyrom',
        progress: 0,
        images: 5,
        annotated: 0,
        unannotated: 5
      },
      {
        id: 4,
        title: 'Rom (Game Field): Job 3',
        labeler: 'Pichphyrom',
        reviewer: 'Pichphyrom',
        progress: 80,
        images: 81,
        annotated: 1,
        unannotated: 80
      }
    ],
    review: [
      {
        id: 5,
        title: 'Folder: images - Auto Label',
        label: 'Automatic Labeling',
        reviewer: 'Pichphyrom',
        progress: 100,
        images: 793,
        approved: 0,
        rejected: 0,
        annotated: 713,
        unannotated: 80
      }
    ]
  });

  return (
    <div className="annotate-container">
      <div className="annotate-columns">
        {/* Column 1: Unassigned */}
        <div className="annotate-column">
          <div className="column-header">
            <h3>Unassigned</h3>
            <span className="batch-count">0 Batches</span>
          </div>
          <div className="column-content">
            {jobs.unassigned.map(job => (
              <div key={job.id} className="unassigned-card">
                <div className="unassigned-icon">{job.icon}</div>
                <p className="unassigned-text">{job.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Annotating */}
        <div className="annotate-column">
          <div className="column-header">
            <h3>Annotating</h3>
            <span className="job-count">{jobs.annotating.length} Jobs</span>
          </div>
          <div className="column-content">
            {jobs.annotating.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h4>{job.title}</h4>
                  <button className="menu-btn">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="job-meta">
                  <p>
                    <strong>Labeler:</strong> {job.labeler}
                  </p>
                  <p>
                    <strong>Reviewer:</strong> {job.reviewer}
                  </p>
                </div>

                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{job.progress}%</p>
                </div>

                <div className="job-stats">
                  <div className="stat-box">
                    <span className="stat-icon total">
                      {job.images}
                    </span>
                    <span className="stat-label">Images</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-box">
                    <span className="stat-icon annotated">
                      {job.annotated}
                    </span>
                    <span className="stat-label">Annotated</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-box">
                    <span className="stat-icon unannotated">
                      {job.unannotated}
                    </span>
                    <span className="stat-label">Unannotated</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Review */}
        <div className="annotate-column">
          <div className="column-header">
            <h3>Review</h3>
            <span className="job-count">{jobs.review.length} Job</span>
          </div>
          <div className="column-content">
            {jobs.review.map(job => (
              <div key={job.id} className="review-card">
                <div className="review-header">
                  <h4>{job.title}</h4>
                  <button className="menu-btn">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="review-meta">
                  <p>
                    <strong>Folder:</strong> images - Auto Label
                  </p>
                  <p>
                    <strong>Labeler:</strong> ⚡ {job.label}
                  </p>
                  <p>
                    <strong>Reviewer:</strong> {job.reviewer}
                  </p>
                </div>

                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="review-stats">
                  <div className="stat-row">
                    <span className="stat-label">{job.images} Images</span>
                    <div className="stat-badges">
                      <span className="badge approved">
                        <CheckCircle size={14} />
                        {job.approved} Approved
                      </span>
                      <span className="badge rejected">
                        <AlertCircle size={14} />
                        {job.rejected} Rejected
                      </span>
                    </div>
                  </div>
                  <div className="stat-row">
                    <span className="stat-count annotated">
                      {job.annotated}
                    </span>
                    <span className="stat-label">Annotated</span>
                    <span className="stat-count unannotated">
                      {job.unannotated}
                    </span>
                    <span className="stat-label">Unannotated</span>
                  </div>
                </div>

                <button className="start-annotating-btn">
                  <Play size={16} />
                  Start Annotating →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annotate;