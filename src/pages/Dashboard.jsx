// Import React hooks for state management
import React, { useState, useMemo } from 'react';
// Import icons from lucide-react library
import { Search, MoreVertical, Plus, Archive, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
// Import CSS styling for Projects page
import '../theme/pages/Projects.css';

// Main Projects component
const Projects = () => {
  // State for search query input
  const [searchQuery, setSearchQuery] = useState('');
  // State for projects data
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

  // State for tracking which menu is currently open
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  // Format date to relative time (e.g., "2 days ago")
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

  // Filter projects based on search query using useMemo for performance
  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  // Handle archiving a project
  const handleArchiveProject = (projectId) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, status: 'archived' } : p
      )
    );
    setSelectedMenuId(null);
  };

  // Handle deleting a project with confirmation
  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter((p) => p.id !== projectId));
      setSelectedMenuId(null);
    }
  };

  // Handle toggling project public/private status
  const handleTogglePublic = (projectId) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, isPublic: !p.isPublic } : p
      )
    );
  };

  // Main render
  return (
    <div className="projects-container">
      <div className="projects-wrapper">
        {/* Under Development Warning Section */}
        <div className="under-development-banner">
          {/* Warning sign SVG icon */}
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="warning-icon"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          {/* Warning message with legacy version link */}
          <div className="warning-content">
            <p>
              This is still under reviewed by Google Analyst API and Service. Please refer to{' '}
              <a href="https://docs.jomnam.tech/image-annotation/legacy-version" target="_blank" rel="noopener noreferrer">
                legacy version
              </a>
            </p>
          </div>
        </div>

        {/* Header Section */}
        <div className="projects-header">
          <div>
            {/* Page title */}
            <h1 className="projects-title">Projects</h1>
            {/* Project count subtitle */}
            <p className="projects-subtitle">{filteredProjects.length} project(s)</p>
          </div>
          {/* New Project button */}
          <button className="create-project-button">
            <Plus className="icon-sm" />
            New Project
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="projects-search-bar">
          {/* Search icon */}
          <Search className="search-icon" />
          {/* Search input field */}
          <input
            type="text"
            placeholder="Search projects"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Projects Grid or Empty State */}
        {filteredProjects.length > 0 ? (
          // Grid layout for projects
          <div className="projects-grid">
            {/* Map through filtered projects and render each project card */}
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card">
                {/* Project Thumbnail Section */}
                <div className="project-thumbnail">
                  {/* Display thumbnail image or placeholder */}
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} />
                  ) : (
                    // Placeholder SVG when no thumbnail exists
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

                {/* Project Information Section */}
                <div className="project-info">
                  {/* Header info with title and menu button */}
                  <div className="project-header-info">
                    <div>
                      {/* Project type badge */}
                      <p className="project-type">{project.type}</p>
                      {/* Project name */}
                      <h3 className="project-name">{project.name}</h3>
                    </div>
                    {/* Menu button and dropdown */}
                    <div className="project-menu">
                      {/* Menu trigger button */}
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
                      
                      {/* Dropdown menu - shown when menu is selected */}
                      {selectedMenuId === project.id && (
                        <div className="dropdown-menu">
                          {/* Rename menu item */}
                          <button className="menu-item">
                            <Edit2 className="icon-sm" />
                            <span>Rename</span>
                          </button>
                          {/* Toggle public/private menu item */}
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
                          {/* Archive menu item */}
                          <button 
                            className="menu-item"
                            onClick={() => handleArchiveProject(project.id)}
                          >
                            <Archive className="icon-sm" />
                            <span>Archive</span>
                          </button>
                          {/* Delete menu item with special styling */}
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

                  {/* Last edit timestamp */}
                  <p className="project-meta">
                    Edited {formatDate(project.editedAt)}
                  </p>
                  {/* Project statistics: visibility, image count, model count */}
                  <p className="project-stats">
                    {project.isPublic ? 'Public' : 'Private'} • {project.imageCount.toLocaleString()} Images • {project.modelCount} Model{project.modelCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state shown when no projects match search
          <div className="empty-state">
            {/* Empty state icon */}
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
            {/* Empty state title */}
            <h3 className="empty-state-title">No projects found</h3>
            {/* Empty state description with conditional message */}
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

// Export the Projects component as default
export default Projects;