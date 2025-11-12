import React, { useState } from 'react';
import { createProject } from '../api/projectApi';
import { useToast } from '../context/ToastContext';
import '../theme/components/CreateProject.css';

const CreateProject = ({ onProjectCreated, onClose, teamId }) => {
  const { addToast } = useToast();
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Audio');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!projectName.trim()) {
        addToast('Project name is required', 'error');
        setLoading(false);
        return;
      }

      const projectData = {
        name: projectName,
        type: projectType,
        description,
        ...(teamId && { teamId }),
        metadata: {
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }
      };

      const result = await createProject(projectData);
      
      // Show success toast
      addToast('Project created ! ', 'success', 3000);
      
      // Close modal immediately
      setShowModal(false);
      onProjectCreated(result);
      if (onClose) onClose();

    } catch (error) {
      addToast(`Failed to create project: ${error.message}`, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="create-project-form">
      <h2>Create New Project</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name *</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Project Type *</label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            disabled={loading}
          >
            <option value="Audio">Audio</option>
            <option value="Images">Images</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            disabled={loading}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (comma-separated)"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              onClose();
            }}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;