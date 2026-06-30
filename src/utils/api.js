// Centralized API configuration for FixMyArea frontend
const BASE_URL = 'http://localhost:5000/api';

// Helper to get auth header
const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('fixmyarea_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  signup: async (name, email, password, role) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password, role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  // Issues
  getIssues: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/issues?${query}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch issues');
    return res.json();
  },

  getIssueById: async (id) => {
    const res = await fetch(`${BASE_URL}/issues/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch issue details');
    return res.json();
  },

  createIssue: async (formData) => {
    const res = await fetch(`${BASE_URL}/issues`, {
      method: 'POST',
      headers: getHeaders(true), // true for multipart/form-data
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json();
  },

  upvoteIssue: async (id) => {
    const res = await fetch(`${BASE_URL}/issues/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to upvote issue');
    return res.json();
  },

  updateStatus: async (id, statusData) => {
    const res = await fetch(`${BASE_URL}/issues/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(statusData)
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Comments
  getComments: async (issueId) => {
    const res = await fetch(`${BASE_URL}/comments/${issueId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load comments');
    return res.json();
  },

  addComment: async (issueId, text) => {
    const res = await fetch(`${BASE_URL}/comments/${issueId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Failed to post comment');
    return res.json();
  },

  // Stats
  getSummary: async () => {
    const res = await fetch(`${BASE_URL}/stats/summary`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch summary');
    return res.json();
  },

  getLeaderboard: async () => {
    const res = await fetch(`${BASE_URL}/stats/leaderboard`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  }
};
export default api;
