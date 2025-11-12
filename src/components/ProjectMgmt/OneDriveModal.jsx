import { useState, useEffect } from 'react';
import { X, Folder, FileImage, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchOneDriveFiles, setProjectFolder, importImages } from '../../api/cloud';
import { useToast } from '../../context/ToastContext';
import '../../theme/components/OneDriveModal.css';

export default function OneDriveModal({ projectId, isOpen, onClose, onSuccess }) {
  const { addToast } = useToast();
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderPath, setFolderPath] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen]);

  const loadFiles = async (folderId = null) => {
    try {
      setLoading(true);
      const filesData = await fetchOneDriveFiles(projectId, folderId);

      // Combine folders and files
      const allItems = [
        ...(filesData.folders || []).map(f => ({ ...f, isFolder: true })),
        ...(filesData.files || []).map(f => ({ ...f, isFolder: false }))
      ];

      setFiles(allItems);
      setSelected(new Set());
      setCurrentFolderId(folderId);
    } catch (error) {
      console.error('Error loading files:', error);
      addToast('Failed to load files from OneDrive', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = async (folder) => {
    const newPath = [...folderPath, { id: folder.id, name: folder.name }];
    setFolderPath(newPath);
    await loadFiles(folder.id);
  };

  const handleBreadcrumbClick = async (index) => {
    const newPath = folderPath.slice(0, index);
    setFolderPath(newPath);
    const folderId = index > 0 ? newPath[newPath.length - 1].id : null;
    await loadFiles(folderId);
  };

  const handleSetFolder = async (folder) => {
    try {
      setLoading(true);
      await setProjectFolder(projectId, folder.id, folder.name);
      addToast(`✅ Folder "${folder.name}" set as default`, 'success');
      setLoading(false);
    } catch (error) {
      console.error('Error setting folder:', error);
      addToast('Failed to set folder', 'error');
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileId) => {
    const newSelected = new Set(selected);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    const imageFiles = files.filter(f => !f.isFolder);
    if (selected.size === imageFiles.length && imageFiles.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(imageFiles.map(f => f.id)));
    }
  };

  const handleImportFiles = async () => {
    if (selected.size === 0) {
      addToast('Please select at least one file', 'warning');
      return;
    }

    try {
      setImporting(true);
      await importImages(projectId, Array.from(selected));
      addToast(`✅ Successfully imported ${selected.size} file(s)`, 'success');
      setSelected(new Set());
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error importing files:', error);
      addToast('Failed to import files', 'error');
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  const imageFiles = files.filter(f => !f.isFolder);

  return (
    <div className="onedrive-modal-overlay">
      <div className="onedrive-modal">
        {/* Header */}
        <div className="onedrive-modal-header">
          <h2>Select Files from OneDrive</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        {/* Breadcrumb */}
        {folderPath.length > 0 && (
          <div className="breadcrumb">
            <button onClick={() => handleBreadcrumbClick(0)} className="breadcrumb-item">
              📁 Root
            </button>
            {folderPath.map((folder, index) => (
              <div key={folder.id}>
                <ChevronRight size={14} />
                <button onClick={() => handleBreadcrumbClick(index + 1)} className="breadcrumb-item">
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="onedrive-modal-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner">⟳</div>
              <p>Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="empty-state">
              <FileImage size={48} />
              <p>No files or folders found</p>
            </div>
          ) : (
            <>
              {imageFiles.length > 0 && (
                <div className="select-all-row">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selected.size === imageFiles.length && imageFiles.length > 0}
                    onChange={toggleSelectAll}
                  />
                  <span className="select-all-text">
                    Select All ({selected.size}/{imageFiles.length})
                  </span>
                </div>
              )}

              <div className="files-list">
                {files.map(file => (
                  <div key={file.id} className="file-item">
                    {!file.isFolder && (
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selected.has(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                      />
                    )}
                    {file.isFolder && <div className="checkbox-placeholder"></div>}
                    
                    <div className="file-icon">
                      {file.isFolder ? <Folder size={16} /> : <FileImage size={16} />}
                    </div>
                    
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-meta">
                        {file.isFolder ? (
                          'Folder'
                        ) : (
                          `${file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'} • ${new Date(file.createdAt).toLocaleDateString()}`
                        )}
                      </p>
                    </div>

                    {file.isFolder && (
                      <div className="folder-actions">
                        <button 
                          onClick={() => handleFolderClick(file)} 
                          className="btn btn-sm btn-outline"
                          disabled={loading}
                        >
                          Open
                        </button>
                        <button 
                          onClick={() => handleSetFolder(file)} 
                          className="btn btn-sm btn-outline"
                          disabled={loading}
                        >
                          Set Default
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="onedrive-modal-footer">
          <div className="info-notice">
            <AlertCircle size={16} />
            <p>Selected images will be imported and ready for annotation.</p>
          </div>

          <div className="modal-actions">
            <button onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              onClick={handleImportFiles}
              className="btn btn-success"
              disabled={selected.size === 0 || importing}
            >
              {importing ? (
                <>
                  <span className="spinner">⟳</span>
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Import {selected.size} File{selected.size !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}