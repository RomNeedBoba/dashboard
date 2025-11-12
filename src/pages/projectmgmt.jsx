import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Wand2, Database, Tag, Shuffle, Construction } from 'lucide-react';
import { getMyProjects } from '../api/projectApi';
import UploadData from '../components/ProjectMgmt/UploadData';
import Annotate from '../components/ProjectMgmt/Annotate';
import Dataset from '../components/ProjectMgmt/Dataset';
import Classes from '../components/ProjectMgmt/Classes';
import DataSplitting from '../components/ProjectMgmt/DataSplitting';
import '../theme/pages/projectmgmt.css';

const ProjectMgmt = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projects = await getMyProjects();
      const foundProject = projects.find(p => p._id === projectId);
      if (foundProject) {
        setProject(foundProject);
      } else {
        navigate('/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="project-mgmt-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-mgmt-container">
        <div className="error">Project not found</div>
      </div>
    );
  }

  const tabs = [
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'annotate', label: 'Annotate', icon: Wand2 },
    { id: 'dataset', label: 'Dataset', icon: Database },
    { id: 'classes', label: 'Classes', icon: Tag }
  ];

  const developmentTabs = [
    { id: 'splitting', label: 'Data Splitting', icon: Shuffle },
    { id: 'augmentation', label: 'Augmentation', icon: Construction }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadData projectId={projectId} />;
      case 'annotate':
        return <Annotate projectId={projectId} />;
      case 'dataset':
        return <Dataset projectId={projectId} />;
      case 'classes':
        return <Classes projectId={projectId} />;
      case 'splitting':
        return <div className="under-development"><Construction size={64} /><h3>Data Splitting</h3><p>Coming soon...</p></div>;
      case 'augmentation':
        return <div className="under-development"><Construction size={64} /><h3>Augmentation</h3><p>Coming soon...</p></div>;
      default:
        return <UploadData projectId={projectId} />;
    }
  };

  return (
    <div className="project-mgmt-container">
      {/* Header */}
      <div className="project-mgmt-header">
        <button 
          className="back-button"
          onClick={() => navigate('/projects')}
          aria-label="Back"
        >
          <ArrowLeft />
        </button>
        <div className="project-info">
          <h1>{project.name}</h1>
          <p className="project-type">{project.type} Project</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="project-nav">
        <div className="nav-section">
          <div className="nav-tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="nav-section development">
          <div className="nav-tabs">
            {developmentTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className="nav-tab disabled"
                  disabled
                  data-tooltip="Under Development"
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="project-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProjectMgmt;