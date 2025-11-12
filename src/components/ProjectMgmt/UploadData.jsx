import { useState, useEffect } from 'react';
import { Cloud, AlertCircle } from 'lucide-react';
import {
  getCloudStatus,
  getOneDriveAuthUrl,
  disconnectOneDrive
} from '../../api/cloud';
import OneDriveModal from './OneDriveModal';
import { useToast } from '../../context/ToastContext';
import Loader from '../Loading';
import '../../theme/components/UploadData.css';

const UploadData = ({ projectId }) => {
  const { addToast } = useToast();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [popupWindow, setPopupWindow] = useState(null);

  useEffect(() => {
    checkConnection();
  }, [projectId]);

  useEffect(() => {
    // ✅ Listen for messages from popup window
    const handleMessage = (event) => {
      console.log('📨 Message received:', event.data);
      
      // For security, verify origin
      if (event.origin !== window.location.origin) {
        console.warn('⚠️ Message from untrusted origin:', event.origin);
        return;
      }

      if (event.data.type === 'ONEDRIVE_CONNECTED') {
        console.log('✅ OneDrive connected via popup:', event.data);
        addToast(`✅ OneDrive connected as ${event.data.email}!`, 'success');
        setConnecting(false);
        setPopupWindow(null);
        
        // Wait a moment then check connection
        setTimeout(() => {
          checkConnection();
          setShowModal(true);
        }, 500);
      } else if (event.data.type === 'ONEDRIVE_ERROR') {
        console.error('❌ OneDrive connection failed:', event.data.error);
        addToast(`❌ Failed to connect OneDrive: ${event.data.error}`, 'error');
        setConnecting(false);
        setPopupWindow(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const statusData = await getCloudStatus(projectId);
      console.log('📊 Connection status:', statusData);
      setStatus(statusData);
    } catch (error) {
      console.error('Error checking connection:', error);
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectOneDrive = async () => {
    try {
      setConnecting(true);
      
      const response = await getOneDriveAuthUrl(projectId);
      const authUrl = response.authUrl;
      
      if (!authUrl) {
        throw new Error('No auth URL received');
      }

      console.log('🔐 Opening auth URL in popup');
      
      // ✅ Open popup with larger size to see consent screen
      const popup = window.open(
        authUrl, 
        'onedrive_auth', 
        'width=800,height=900,toolbar=no,menubar=no,location=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked - please allow popups for this site');
      }

      setPopupWindow(popup);

      // ✅ Monitor popup window
      const popupCheckInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupCheckInterval);
          console.log('📌 Popup closed');
          setPopupWindow(null);
          // Don't set connecting to false here - wait for message
        }
      }, 500);

    } catch (error) {
      console.error('Error getting auth URL:', error);
      addToast(`Failed to connect to OneDrive: ${error.message}`, 'error');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect OneDrive?')) return;

    try {
      setLoading(true);
      await disconnectOneDrive(projectId);
      setStatus({ connected: false });
      addToast('OneDrive disconnected', 'success');
    } catch (error) {
      console.error('Error disconnecting:', error);
      addToast('Failed to disconnect OneDrive', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!status?.connected) {
    return (
      <div className="upload-container">
        <div className="cloud-selection">
          <div className="selection-header">
            <Cloud size={48} color="#0078d4" />
            <h2>Connect Cloud Storage</h2>
            <p>Upload images from your cloud storage for annotation</p>
          </div>

          <div className="cloud-grid">
            <div className="cloud-card">
              <div className="coming-soon-badge">
                <span>Active</span>
              </div>
              <div className="card-logo">
                <img
                  src="/OneDrive.svg"
                  alt="Microsoft OneDrive"
                  width="64"
                  height="64"
                  loading="lazy"
                />
              </div>
              <h3>Microsoft OneDrive</h3>
              <p>Upload and manage images from your OneDrive account</p>
              <button
                className="btn btn-primary"
                onClick={handleConnectOneDrive}
                disabled={connecting}
              >
                {connecting ? (
                  <>
                    <span className="spinner">⟳</span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1055/1055566.png"
                      alt=""
                      width="16"
                      height="16"
                      loading="lazy"
                      style={{ marginRight: '6px' }}
                    />
                    Connect OneDrive
                  </>
                )}
              </button>
            </div>

            <div className="cloud-card cloud-card-disabled">
              <div className="coming-soon-badge">
                <span>Coming Soon</span>
              </div>
              <div className="card-logo card-logo-disabled">
                <img
                  src="/Googledrive.svg"
                  alt="Google Drive"
                  width="64"
                  height="64"
                  loading="lazy"
                />
              </div>
              <h3>Google Drive</h3>
              <p>Google Drive integration coming soon</p>
              <button className="btn btn-secondary btn-disabled" disabled={true}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt=""
                  width="16"
                  height="16"
                  loading="lazy"
                  style={{ marginRight: '6px', opacity: 0.5 }}
                />
                Coming Soon
              </button>
            </div>
          </div>

          <div className="privacy-notice">
            <AlertCircle size={20} />
            <div>
              <h4>Privacy & Security</h4>
              <p>We only access files you explicitly select. Your cloud credentials are never stored on our servers.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <div className="upload-wrapper">
        <div className="connected-banner">
          <div className="connected-info">
            <div className="status-indicator"></div>
            <div>
              <p className="label">Connected to OneDrive</p>
              <p className="email">{status.email || 'OneDrive Account'}</p>
            </div>
          </div>
          <div className="banner-actions">
            <button
              className="btn btn-primary-sm"
              onClick={() => setShowModal(true)}
            >
              📁 Browse Files
            </button>
            <button
              className="btn btn-danger-sm"
              onClick={handleDisconnect}
              disabled={loading}
            >
              🔌 Disconnect
            </button>
          </div>
        </div>

        <OneDriveModal
          projectId={projectId}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => checkConnection()}
        />
      </div>
    </div>
  );
};

export default UploadData;