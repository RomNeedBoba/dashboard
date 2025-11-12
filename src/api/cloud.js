import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function getFirebaseToken() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return await user.getIdToken(true);
}

async function getHeaders() {
    try {
        const token = await getFirebaseToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    } catch (error) {
        console.warn('⚠️ Could not get auth token:', error.message);
        return {
            'Content-Type': 'application/json'
        };
    }
}

// Get OneDrive auth URL (NO AUTH NEEDED)
export async function getOneDriveAuthUrl(projectId) {
    try {
        console.log(`📡 Fetching auth URL from: ${API_BASE}/onedrive/auth-url/${projectId}`);
        
        const res = await axios.get(
            `${API_BASE}/onedrive/auth-url/${projectId}`
        );
        
        console.log('✅ Auth URL received:', res.data);
        return res.data;
    } catch (error) {
        console.error('❌ getOneDriveAuthUrl error:', error.response?.data || error.message);
        throw error;
    }
}

// Get OneDrive connection status (with auth)
export async function getCloudStatus(projectId) {
    try {
        const headers = await getHeaders();
        const res = await axios.get(
            `${API_BASE}/onedrive/status/${projectId}`,
            { headers }
        );
        return res.data;
    } catch (error) {
        console.error('❌ getCloudStatus error:', error.response?.data || error.message);
        throw error;
    }
}

// Fetch files from OneDrive (with auth)
export async function fetchOneDriveFiles(projectId, folderId) {
    try {
        const headers = await getHeaders();
        const url = folderId 
            ? `${API_BASE}/onedrive/files/${projectId}?folderId=${folderId}`
            : `${API_BASE}/onedrive/files/${projectId}`;
        
        const res = await axios.get(url, { headers });
        return res.data;
    } catch (error) {
        console.error('❌ fetchOneDriveFiles error:', error.response?.data || error.message);
        throw error;
    }
}

// Set project folder (with auth)
export async function setProjectFolder(projectId, folderId, folderName) {
    try {
        const headers = await getHeaders();
        const res = await axios.post(
            `${API_BASE}/onedrive/set-folder`,
            { projectId, folderId, folderName },
            { headers }
        );
        return res.data;
    } catch (error) {
        console.error('❌ setProjectFolder error:', error.response?.data || error.message);
        throw error;
    }
}

// Import images (with auth)
export async function importImages(projectId, fileIds) {
    try {
        const headers = await getHeaders();
        const res = await axios.post(
            `${API_BASE}/onedrive/import`,
            { projectId, fileIds },
            { headers }
        );
        return res.data;
    } catch (error) {
        console.error('❌ importImages error:', error.response?.data || error.message);
        throw error;
    }
}

// Disconnect OneDrive (with auth)
export async function disconnectOneDrive(projectId) {
    try {
        const headers = await getHeaders();
        const res = await axios.post(
            `${API_BASE}/onedrive/disconnect`,
            { projectId },
            { headers }
        );
        return res.data;
    } catch (error) {
        console.error('❌ disconnectOneDrive error:', error.response?.data || error.message);
        throw error;
    }
}

// Authorize Google (with auth)
export async function authorizeGoogle(projectId, code) {
    try {
        const headers = await getHeaders();
        const res = await axios.post(
            `${API_BASE}/google/authorize`,
            { projectId, code },
            { headers }
        );
        return res.data;
    } catch (error) {
        console.error('❌ authorizeGoogle error:', error.response?.data || error.message);
        throw error;
    }
}