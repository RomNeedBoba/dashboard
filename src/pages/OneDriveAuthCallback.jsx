import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function OneDriveAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  useEffect(() => {
    const onedrive = searchParams.get('onedrive');
    const error = searchParams.get('error');

    if (error) {
      addToast('❌ Failed to connect OneDrive', 'error');
      navigate('/projects');
      return;
    }

    if (onedrive === 'connected') {
      addToast('✅ OneDrive connected successfully!', 'success');
      
      // Get projectId from localStorage or URL
      const projectId = localStorage.getItem('currentProjectId');
      
      if (projectId) {
        // Close popup and redirect parent
        if (window.opener) {
          window.opener.location.href = `/projects/${projectId}/upload`;
          window.close();
        } else {
          navigate(`/projects/${projectId}/upload`);
        }
      } else {
        navigate('/projects');
      }
      return;
    }

    // If no params, something went wrong
    navigate('/projects');
  }, [searchParams, navigate, addToast]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0078d4 0%, #107c10 100%)'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '20px', 
          animation: 'spin 2s linear infinite' 
        }}>
          ⏳
        </div>
        <h2>Connecting to OneDrive...</h2>
        <p>Please wait while we complete the authorization.</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}