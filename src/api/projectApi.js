import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get Firebase token with logging
async function getFirebaseToken() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('❌ No current user in Firebase');
      throw new Error('Not authenticated');
    }

    const token = await user.getIdToken(true); // Force refresh
    console.log('✅ Firebase token obtained:', token.substring(0, 20) + '...');
    return token;
  } catch (error) {
    console.error('❌ Failed to get Firebase token:', error.message);
    throw error;
  }
}

// Get request headers with token
async function getHeaders() {
  try {
    const token = await getFirebaseToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('✅ Headers prepared with auth token');
    return headers;
  } catch (error) {
    console.error('❌ Failed to prepare headers:', error.message);
    throw error;
  }
}

// Get all my projects
export async function getMyProjects() {
  try {
    console.log('📤 Fetching projects...');
    const headers = await getHeaders();
    const res = await axios.get(
      `${API_BASE}/projects/my/projects`,
      { headers }
    );
    console.log('✅ Projects fetched successfully');
    return res.data;
  } catch (error) {
    console.error('❌ getMyProjects error:', error.response?.data || error.message);
    throw error;
  }
}

// Create new project
export async function createProject(projectData) {
  try {
    console.log('📤 Creating project:', projectData);
    const headers = await getHeaders();
    const res = await axios.post(
      `${API_BASE}/projects`,
      projectData,
      { headers }
    );
    console.log('✅ Project created');
    return res.data;
  } catch (error) {
    console.error('❌ createProject error:', error.response?.data || error.message);
    throw error;
  }
}

// Get project by ID
export async function getProjectById(projectId) {
  try {
    const headers = await getHeaders();
    const res = await axios.get(
      `${API_BASE}/projects/${projectId}`,
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error('❌ getProjectById error:', error.response?.data || error.message);
    throw error;
  }
}

// Update project
export async function updateProject(projectId, updateData) {
  try {
    const headers = await getHeaders();
    const res = await axios.put(
      `${API_BASE}/projects/${projectId}`,
      updateData,
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error('❌ updateProject error:', error.response?.data || error.message);
    throw error;
  }
}

// Delete project
export async function deleteProject(projectId) {
  try {
    const headers = await getHeaders();
    const res = await axios.delete(
      `${API_BASE}/projects/${projectId}`,
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error('❌ deleteProject error:', error.response?.data || error.message);
    throw error;
  }
}

// Invite team member
export async function inviteTeamMember(projectId, email, role) {
  try {
    const headers = await getHeaders();
    const res = await axios.post(
      `${API_BASE}/projects/${projectId}/invite`,
      { email, role },
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error('❌ inviteTeamMember error:', error.response?.data || error.message);
    throw error;
  }
}

// Get project team
export async function getProjectTeam(projectId) {
  try {
    const headers = await getHeaders();
    const res = await axios.get(
      `${API_BASE}/projects/${projectId}/team`,
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error('❌ getProjectTeam error:', error.response?.data || error.message);
    throw error;
  }
}