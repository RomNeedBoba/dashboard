import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Copy } from 'lucide-react';
import '../../theme/components/Classes.css';

const Classes = ({ projectId }) => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'body',
      color: '#9333ea',
      count: 1
    },
    {
      id: 2,
      name: 'hoop',
      color: '#84cc16',
      count: 4993
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassColor, setNewClassColor] = useState('#667eea');

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colorOptions = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#00f2fe', '#43e97b', '#fa709a', '#feca57',
    '#ff9ff3', '#54a0ff', '#48dbfb', '#1dd1a1',
    '#9333ea', '#84cc16', '#ef4444', '#06b6d4'
  ];

  const handleAddClass = () => {
    if (newClassName.trim()) {
      const newClass = {
        id: Math.max(...classes.map(c => c.id), 0) + 1,
        name: newClassName,
        color: newClassColor,
        count: 0
      };
      setClasses([...classes, newClass]);
      setNewClassName('');
      setNewClassColor('#667eea');
      setShowAddModal(false);
    }
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(cls => cls.id !== classId));
    }
  };

  const handleDuplicateClass = (classItem) => {
    const duplicatedClass = {
      id: Math.max(...classes.map(c => c.id), 0) + 1,
      name: `${classItem.name} (copy)`,
      color: classItem.color,
      count: 0
    };
    setClasses([...classes, duplicatedClass]);
  };

  return (
    <div className="classes-container">
      <div className="classes-wrapper">
        {/* Header */}
        <div className="classes-header">
          <div className="header-left">
            <h2>Classes & Tags</h2>
            <span className="class-count">{classes.length}</span>
          </div>
          <button
            className="btn-add-class"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            Add Class
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Add Class Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Add New Class</h3>
              
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  placeholder="Enter class name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      className={`color-option ${newClassColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewClassColor(color)}
                      title={color}
                    >
                      {newClassColor === color && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-add"
                  onClick={handleAddClass}
                  disabled={!newClassName.trim()}
                >
                  Add Class
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Classes Table */}
        <div className="classes-table">
          <div className="table-header">
            <div className="col-color">COLOR</div>
            <div className="col-name">CLASS NAME</div>
            <div className="col-count">COUNT</div>
            <div className="col-actions">ACTIONS</div>
          </div>

          {filteredClasses.length > 0 ? (
            <div className="table-body">
              {filteredClasses.map(classItem => (
                <div key={classItem.id} className="table-row">
                  <div className="col-color">
                    <div
                      className="color-dot"
                      style={{ backgroundColor: classItem.color }}
                      title={classItem.color}
                    />
                  </div>
                  <div className="col-name">
                    <span className="class-name">{classItem.name}</span>
                  </div>
                  <div className="col-count">
                    <span className="count-badge">{classItem.count.toLocaleString()}</span>
                  </div>
                  <div className="col-actions">
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn duplicate"
                        title="Duplicate"
                        onClick={() => handleDuplicateClass(classItem)}
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => handleDeleteClass(classItem.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No classes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;