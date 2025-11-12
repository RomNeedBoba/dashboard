import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export const createTeam = async (teamData) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/teams/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(teamData)
    });
    
    if (!response.ok) throw new Error('Failed to create team');
    return await response.json();
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

export const getMyTeams = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/teams/my/teams`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch teams');
    return await response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const inviteToTeam = async (teamId, email, role) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/teams/invite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ teamId, email, role })
    });
    
    if (!response.ok) throw new Error('Failed to invite user');
    return await response.json();
  } catch (error) {
    console.error('Error inviting user:', error);
    throw error;
  }
};

export const acceptInvitation = async (teamId) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/teams/accept-invitation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ teamId })
    });
    
    if (!response.ok) throw new Error('Failed to accept invitation');
    return await response.json();
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};