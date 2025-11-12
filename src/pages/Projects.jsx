import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Plus, Archive, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CreateProject from '../components/CreateProject';
import { getMyProjects, updateProject, deleteProject } from '../api/projectApi';
import '../theme/pages/Projects.css';

const Projects = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      console.warn('User not authenticated');
      setLoading(false);
      return;
    }

    fetchProjects();
  }, [user, authLoading]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects for user:', user?.email);
      const projectsData = await getMyProjects();
      console.log('Projects loaded:', projectsData);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      addToast('Failed to load projects', 'error');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleArchiveProject = async (projectId) => {
    try {
      await updateProject(projectId, { status: 'archived' });
      setProjects(projects.filter(p => p._id !== projectId));
      setSelectedMenuId(null);
      addToast('Project archived', 'success');
    } catch (error) {
      console.error('Failed to archive project:', error);
      addToast('Failed to archive project', 'error');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter((p) => p._id !== projectId));
        setSelectedMenuId(null);
        addToast('Project deleted', 'success');
      } catch (error) {
        console.error('Failed to delete project:', error);
        addToast('Failed to delete project', 'error');
      }
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setShowCreateModal(false);
    addToast('Project created successfully!', 'success', 3000);
    setTimeout(() => {
      navigate(`/project/${newProject._id}`);
    }, 500);
  };

  if (authLoading || loading) {
    return (
      <div className="projects-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ animation: 'spin 1s linear infinite' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="projects-container">
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          Please log in to view projects
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-wrapper">
        {/* Header */}
        <div className="projects-header">
          <div>
            <h1 className="projects-title">Projects</h1>
            <p className="projects-subtitle">{filteredProjects.length} project(s)</p>
          </div>
          <button 
            className="create-project-button"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="icon-sm" />
            New Project
          </button>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <CreateProject 
                onProjectCreated={handleProjectCreated}
                onClose={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="projects-search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search projects"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project._id} className="project-card">
                {/* Project Thumbnail - Clickable */}
                <div 
                  className="project-thumbnail"
                  onClick={() => handleProjectClick(project._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="project-info">
                  <div className="project-header-info">
                    <div 
                      onClick={() => handleProjectClick(project._id)}
                      style={{ cursor: 'pointer', flex: 1 }}
                    >
                      <p className="project-type">{project.type}</p>
                      <h3 className="project-name">{project.name}</h3>
                    </div>
                    <div className="project-menu">
                      <button
                        className="menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMenuId(
                            selectedMenuId === project._id ? null : project._id
                          );
                        }}
                      >
                        <MoreVertical className="icon-sm" />
                      </button>
                      
                      {selectedMenuId === project._id && (
                        <div className="dropdown-menu">
                          <button className="menu-item">
                            <Edit2 className="icon-sm" />
                            <span>Rename</span>
                          </button>
                          <button 
                            className="menu-item"
                            onClick={() => handleArchiveProject(project._id)}
                          >
                            <Archive className="icon-sm" />
                            <span>Archive</span>
                          </button>
                          <button 
                            className="menu-item delete-item"
                            onClick={() => handleDeleteProject(project._id)}
                          >
                            <Trash2 className="icon-sm" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p 
                    className="project-meta"
                    onClick={() => handleProjectClick(project._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    Created {formatDate(project.createdAt)}
                  </p>
                  <p 
                    className="project-stats"
                    onClick={() => handleProjectClick(project._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {project.type} • {project.dataCount || 0} Items
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <h3 className="empty-state-title">No projects found</h3>
            <p className="empty-state-description">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first project to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;