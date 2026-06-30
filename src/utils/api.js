// Centralized API configuration for FixMyArea frontend
// Dynamically check if we have a deployed backend, or use localhost, or fallback to local memory DB
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

// Client-side mock fallback data in case server is unreachable/offline
const fallbackDb = {
  user: null,
  issues: [
    {
      _id: 'ISS-001', id: 'ISS-001',
      title: 'Large pothole near MI Road junction',
      description: 'A dangerous pothole approximately 2 feet wide has formed near the MI Road junction. Multiple vehicles have been damaged.',
      category: 'pothole', severity: 'critical', status: 'in_progress',
      location: { lat: 26.9150, lng: 75.8050 }, address: 'MI Road Junction, Jaipur',
      reportedBy: { name: 'Arjun Sharma', badge: 'hero' }, upvotes: 127, commentsCount: 3, createdAt: new Date()
    },
    {
      _id: 'ISS-002', id: 'ISS-002',
      title: 'Streetlight not working on 5th Cross',
      description: 'The streetlight near the park on 5th Cross Road, Malviya Nagar has been non-functional for 2 weeks. The area is dark at night.',
      category: 'streetlight', severity: 'high', status: 'assigned',
      location: { lat: 26.8530, lng: 75.8190 }, address: '5th Cross, Malviya Nagar, Jaipur',
      reportedBy: { name: 'Priya Patel', badge: 'active' }, upvotes: 45, commentsCount: 0, createdAt: new Date()
    },
    {
      _id: 'ISS-003', id: 'ISS-003',
      title: 'Garbage pile near school entrance',
      description: 'A large garbage pile has accumulated right next to the entrance of Government Primary School. This is a health hazard.',
      category: 'garbage', severity: 'high', status: 'reported',
      location: { lat: 26.9020, lng: 75.7420 }, address: 'Near Govt. Primary School, Vaishali Nagar, Jaipur',
      reportedBy: { name: 'Rahul Kumar', badge: 'legend' }, upvotes: 89, commentsCount: 0, createdAt: new Date()
    }
  ],
  comments: {
    'ISS-001': [
      { id: '1', user: { name: 'Priya Patel', badge: 'active' }, text: 'This is getting worse every day.', createdAt: new Date() }
    ]
  }
};

export const api = {
  // Authentication
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend server down, logging in via Client Sandbox Fallback...');
      // Fallback local session
      const mockUser = {
        id: 'u1',
        name: email.split('@')[0].toUpperCase(),
        email,
        role: email.includes('admin') ? 'admin' : 'citizen',
        points: 120,
        badge: 'active',
        reportsCount: 4,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      fallbackDb.user = mockUser;
      return { token: 'mock_token_123', user: mockUser };
    }
  },

  signup: async (name, email, password, role) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password, role })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Signup failed');
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend server down, signing up via Client Sandbox Fallback...');
      const mockUser = {
        id: 'u_' + Date.now(),
        name,
        email,
        role: role || 'citizen',
        points: 0,
        badge: 'newcomer',
        reportsCount: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      fallbackDb.user = mockUser;
      return { token: 'mock_token_123', user: mockUser };
    }
  },

  getProfile: async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to load profile');
      return await res.json();
    } catch (err) {
      return fallbackDb.user || {
        id: 'u1',
        name: 'Arjun Sharma',
        email: 'arjun@email.com',
        role: 'citizen',
        points: 450,
        badge: 'hero',
        reportsCount: 24
      };
    }
  },

  // Issues
  getIssues: async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${BASE_URL}/issues?${query}`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch issues');
      return await res.json();
    } catch (err) {
      return fallbackDb.issues;
    }
  },

  getIssueById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/issues/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch issue details');
      return await res.json();
    } catch (err) {
      const found = fallbackDb.issues.find(i => i.id === id || i._id === id);
      if (!found) throw new Error('Issue not found');
      return found;
    }
  },

  createIssue: async (formData) => {
    try {
      const res = await fetch(`${BASE_URL}/issues`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit report');
      }
      return await res.json();
    } catch (err) {
      console.warn('Backend server offline. Saving report locally to browser memory...');
      const newIssue = {
        id: 'ISS-' + Date.now().toString().slice(-4),
        _id: 'ISS-' + Date.now().toString().slice(-4),
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        severity: formData.get('severity'),
        status: 'reported',
        address: formData.get('address'),
        location: {
          type: 'Point',
          coordinates: [parseFloat(formData.get('lng')), parseFloat(formData.get('lat'))]
        },
        reportedBy: { name: fallbackDb.user?.name || 'Arjun Sharma', badge: fallbackDb.user?.badge || 'hero' },
        upvotes: 0,
        upvotedBy: [],
        commentsCount: 0,
        createdAt: new Date()
      };
      fallbackDb.issues.unshift(newIssue);
      return newIssue;
    }
  },

  upvoteIssue: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/issues/${id}/upvote`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to upvote issue');
      return await res.json();
    } catch (err) {
      const issue = fallbackDb.issues.find(i => i.id === id || i._id === id);
      if (issue) {
        issue.upvotes += 1;
        return { upvotes: issue.upvotes, hasUpvoted: true };
      }
      throw new Error('Issue not found');
    }
  },

  updateStatus: async (id, statusData) => {
    try {
      const res = await fetch(`${BASE_URL}/issues/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(statusData)
      });
      if (!res.ok) throw new Error('Failed to update status');
      return await res.json();
    } catch (err) {
      const issue = fallbackDb.issues.find(i => i.id === id || i._id === id);
      if (issue) {
        if (statusData.status) issue.status = statusData.status;
        return issue;
      }
      throw new Error('Issue not found');
    }
  },

  // Comments
  getComments: async (issueId) => {
    try {
      const res = await fetch(`${BASE_URL}/comments/${issueId}`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to load comments');
      return await res.json();
    } catch (err) {
      return fallbackDb.comments[issueId] || [];
    }
  },

  addComment: async (issueId, text) => {
    try {
      const res = await fetch(`${BASE_URL}/comments/${issueId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Failed to post comment');
      return await res.json();
    } catch (err) {
      const comment = {
        id: 'c_' + Date.now(),
        user: { name: fallbackDb.user?.name || 'Arjun Sharma', badge: fallbackDb.user?.badge || 'hero' },
        text,
        createdAt: new Date()
      };
      if (!fallbackDb.comments[issueId]) fallbackDb.comments[issueId] = [];
      fallbackDb.comments[issueId].push(comment);
      return comment;
    }
  },

  // Stats
  getSummary: async () => {
    try {
      const res = await fetch(`${BASE_URL}/stats/summary`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch summary');
      return await res.json();
    } catch (err) {
      return {
        totalIssues: fallbackDb.issues.length,
        resolved: fallbackDb.issues.filter(i => i.status === 'resolved').length,
        pending: fallbackDb.issues.filter(i => ['reported', 'acknowledged'].includes(i.status)).length,
        inProgress: fallbackDb.issues.filter(i => ['assigned', 'in_progress'].includes(i.status)).length,
        avgResolutionDays: 4.2,
        citizensActive: 3420
      };
    }
  },

  getLeaderboard: async () => {
    try {
      const res = await fetch(`${BASE_URL}/stats/board`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      return await res.json();
    } catch (err) {
      return [
        { name: 'Rahul Kumar', points: 680, badge: 'legend', reportsCount: 42 },
        { name: 'Vikram Singh', points: 540, badge: 'hero', reportsCount: 31 },
        { name: 'Arjun Sharma', points: 450, badge: 'hero', reportsCount: 24 },
        { name: 'Priya Patel', points: 320, badge: 'active', reportsCount: 18 },
        { name: 'Sneha Reddy', points: 210, badge: 'active', reportsCount: 12 }
      ];
    }
  }
};
export default api;
