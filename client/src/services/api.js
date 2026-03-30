/* eslint-disable no-useless-catch */
const API_BASE_URL = 'http://localhost:5000/api';

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...(body && { body: JSON.stringify(body) })
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Individual endpoints
export const individual = {
  getProfile: () => apiCall('/auth/individual/profile'),
  getDashboard: () => apiCall('/auth/individual/dashboard'),
  updateProfile: (data) => apiCall('/auth/individual/profile', 'PUT', data),
  registerEvent: (data) => apiCall('/auth/individual/register-event', 'POST', data)
};

// Organization endpoints
export const organization = {
  getProfile: () => apiCall('/auth/organization/profile'),
  getDashboard: () => apiCall('/auth/organization/dashboard')
};

// Opportunities (public)
export const opportunities = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/opportunities?${params}`);
  },
  getById: (id) => apiCall(`/opportunities/${id}`),
  search: (query) => apiCall(`/opportunities/search?q=${query}`)
};
