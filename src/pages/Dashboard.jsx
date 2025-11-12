//model  export interface Project {
//   id: string;
//   name: string;
//   type: 'Object Detection' | 'Image Classification' | 'Segmentation' | 'Custom';
//   thumbnail?: string;
//   description?: string;
//   imageCount: number;
//   modelCount: number;
//   isPublic: boolean;
//   createdBy: string;
//   createdAt: Date;
//   editedAt: Date;
//   lastEditedBy?: string;
//   teamId: string;
//   status: 'active' | 'archived';
//   metadata?: {
//     version?: string;
//     tags?: string[];
//   };
// }

// export interface ProjectStats {
//   totalProjects: number;
//   activeProjects: number;
//   archivedProjects: number;
//   totalImages: number;
//   totalModels: number;
// }

// export interface ProjectFilters {
//   searchQuery: string;
//   sortBy: 'date' | 'name' | 'type';
//   filterType?: string;
//   status?: 'active' | 'archived' | 'all';
// }
import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, Plus, Archive, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import '../theme/pages/Projects.css';

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'EYKEBro',
      type: 'Object Detection',
      thumbnail: null,
      imageCount: 5653,
      modelCount: 1,
      isPublic: true,
      createdBy: 'Pichphyrom',
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
      editedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      teamId: 'team-1',
      status: 'active',
    },
    {
      id: '2',
      name: 'h',
      type: 'Object Detection',
      thumbnail: null,
      imageCount: 0,
      modelCount: 0,
      isPublic: true,
      createdBy: 'Svay Monirath',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      editedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      teamId: 'team-1',
      status: 'active',
    },
  ]);

  const [selectedMenuId, setSelectedMenuId] = useState(null);

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

  const handleArchiveProject = (projectId) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, status: 'archived' } : p
      )
    );
    setSelectedMenuId(null);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter((p) => p.id !== projectId));
      setSelectedMenuId(null);
    }
  };

  const handleTogglePublic = (projectId) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, isPublic: !p.isPublic } : p
      )
    );
  };

  return (
    <div className="projects-container">
      <div className="projects-wrapper">
        {/* Header */}
        <div className="projects-header">
          <div>
            <h1 className="projects-title">Projects</h1>
            <p className="projects-subtitle">{filteredProjects.length} project(s)</p>
          </div>
          <button className="create-project-button">
            <Plus className="icon-sm" />
            New Project
          </button>
        </div>

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
              <div key={project.id} className="project-card">
                {/* Project Thumbnail */}
                <div className="project-thumbnail">
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
                    <div>
                      <p className="project-type">{project.type}</p>
                      <h3 className="project-name">{project.name}</h3>
                    </div>
                    <div className="project-menu">
                      <button
                        className="menu-button"
                        onClick={() =>
                          setSelectedMenuId(
                            selectedMenuId === project.id ? null : project.id
                          )
                        }
                      >
                        <MoreVertical className="icon-sm" />
                      </button>
                      
                      {selectedMenuId === project.id && (
                        <div className="dropdown-menu">
                          <button className="menu-item">
                            <Edit2 className="icon-sm" />
                            <span>Rename</span>
                          </button>
                          <button 
                            className="menu-item"
                            onClick={() => handleTogglePublic(project.id)}
                          >
                            {project.isPublic ? (
                              <>
                                <EyeOff className="icon-sm" />
                                <span>Make Private</span>
                              </>
                            ) : (
                              <>
                                <Eye className="icon-sm" />
                                <span>Make Public</span>
                              </>
                            )}
                          </button>
                          <button 
                            className="menu-item"
                            onClick={() => handleArchiveProject(project.id)}
                          >
                            <Archive className="icon-sm" />
                            <span>Archive</span>
                          </button>
                          <button 
                            className="menu-item delete-item"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="icon-sm" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="project-meta">
                    Edited {formatDate(project.editedAt)}
                  </p>
                  <p className="project-stats">
                    {project.isPublic ? 'Public' : 'Private'} • {project.imageCount.toLocaleString()} Images • {project.modelCount} Model{project.modelCount !== 1 ? 's' : ''}
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