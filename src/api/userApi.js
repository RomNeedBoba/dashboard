import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export const createOrUpdateUser = async (userData) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/users/create-or-update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create/update user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};