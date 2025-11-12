import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authorizeGoogle } from '../api/cloud';

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    handleCallback();
  }, [searchParams]);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const projectId = sessionStorage.getItem('authProjectId');

      if (error) {
        alert('❌ Authorization failed: ' + error);
        navigate('/projects');
        return;
      }

      if (!code || !projectId) {
        alert('❌ Invalid callback');
        navigate('/projects');
        return;
      }

      // Exchange code for tokens
      const result = await authorizeGoogle(code, projectId);
      
      sessionStorage.removeItem('authProjectId');
      
      alert(`✅ Google Drive Connected! Welcome ${result.name || result.email}`);
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Connection failed: ' + error.message);
      navigate('/projects');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
        <h2>Connecting to Google Drive...</h2>
        <p>Please wait while we authorize your account</p>
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