// Sandbox Mock Database Fallback for FixMyArea backend
const jwt = require('jsonwebtoken');

const localUsers = [
  { id: '668172c72b22f6d2f3479001', name: 'Arjun Sharma', email: 'arjun@email.com', role: 'citizen', points: 450, badge: 'hero', reportsCount: 24, joinedDate: new Date() },
  { id: '668172c72b22f6d2f3479002', name: 'Priya Patel', email: 'priya@email.com', role: 'citizen', points: 320, badge: 'active', reportsCount: 18, joinedDate: new Date() },
  { id: '668172c72b22f6d2f3479003', name: 'Rahul Kumar', email: 'rahul@email.com', role: 'citizen', points: 680, badge: 'legend', reportsCount: 42, joinedDate: new Date() },
  { id: '668172c72b22f6d2f3479004', name: 'Sneha Reddy', email: 'sneha@email.com', role: 'citizen', points: 210, badge: 'active', reportsCount: 12, joinedDate: new Date() },
  { id: '668172c72b22f6d2f3479005', name: 'Vikram Singh', email: 'vikram@email.com', role: 'citizen', points: 540, badge: 'hero', reportsCount: 31, joinedDate: new Date() },
  { id: '668172c72b22f6d2f3479006', name: 'Admin User', email: 'admin@email.com', role: 'admin', points: 0, badge: 'admin', reportsCount: 0, joinedDate: new Date() }
];

const localIssues = [
  {
    _id: 'ISS-001',
    title: 'Large pothole near MI Road junction',
    description: 'A dangerous pothole approximately 2 feet wide has formed near the MI Road junction. Multiple vehicles have been damaged.',
    category: 'pothole',
    severity: 'critical',
    status: 'in_progress',
    location: { type: 'Point', coordinates: [75.8050, 26.9150] },
    address: 'MI Road Junction, Jaipur',
    reportedBy: { id: '668172c72b22f6d2f3479001', name: 'Arjun Sharma', badge: 'hero' },
    upvotes: 127,
    upvotedBy: [],
    commentsCount: 3,
    images: [],
    createdAt: new Date()
  },
  {
    _id: 'ISS-002',
    title: 'Streetlight not working on 5th Cross',
    description: 'The streetlight near the park on 5th Cross Road has been non-functional for 2 weeks. The area is dark at night.',
    category: 'streetlight',
    severity: 'high',
    status: 'assigned',
    location: { type: 'Point', coordinates: [75.8190, 26.8530] },
    address: '5th Cross, Malviya Nagar, Jaipur',
    reportedBy: { id: '668172c72b22f6d2f3479002', name: 'Priya Patel', badge: 'active' },
    upvotes: 45,
    upvotedBy: [],
    commentsCount: 0,
    images: [],
    createdAt: new Date()
  },
  {
    _id: 'ISS-003',
    title: 'Garbage pile near school entrance',
    description: 'A large garbage pile has accumulated right next to the entrance of Government Primary School. This is a health hazard.',
    category: 'garbage',
    severity: 'high',
    status: 'reported',
    location: { type: 'Point', coordinates: [75.7420, 26.9020] },
    address: 'Near Govt. Primary School, Vaishali Nagar, Jaipur',
    reportedBy: { id: '668172c72b22f6d2f3479003', name: 'Rahul Kumar', badge: 'legend' },
    upvotes: 89,
    upvotedBy: [],
    commentsCount: 0,
    images: [],
    createdAt: new Date()
  }
];

const localComments = {
  'ISS-001': [
    { id: '1', user: { name: 'Priya Patel', badge: 'active' }, text: 'This is getting worse every day.', createdAt: new Date() },
    { id: '2', user: { name: 'Rahul Kumar', badge: 'legend' }, text: 'I saw the team arrive this morning.', createdAt: new Date() }
  ]
};

// Auth middleware replacement
const mockAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Authorization denied' });
  try {
    const decoded = jwt.verify(token, 'your_super_secret_jwt_key_12345');
    const user = localUsers.find(u => u.id === decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is invalid' });
  }
};

// Handlers
const fallbackAuth = {
  signup: (req, res) => {
    const { name, email, role } = req.body;
    let user = localUsers.find(u => u.email === email);
    if (user) return res.status(400).json({ error: 'Email already registered' });
    
    user = {
      id: 'mock_' + Date.now(),
      name,
      email,
      role: role || 'citizen',
      points: 0,
      badge: 'newcomer',
      reportsCount: 0,
      joinedDate: new Date()
    };
    localUsers.push(user);
    const token = jwt.sign({ id: user.id }, 'your_super_secret_jwt_key_12345');
    res.status(201).json({ token, user });
  },
  login: (req, res) => {
    const { email } = req.body;
    const user = localUsers.find(u => u.email === email) || localUsers[0]; // fallback to Arjun
    const token = jwt.sign({ id: user.id }, 'your_super_secret_jwt_key_12345');
    res.json({ token, user });
  }
};

const fallbackIssues = {
  create: (req, res) => {
    const { title, description, category, severity, address, lat, lng } = req.body;
    const issue = {
      _id: 'ISS-' + Date.now().toString().slice(-4),
      title,
      description,
      category,
      severity,
      status: 'reported',
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      address,
      reportedBy: { id: req.user.id, name: req.user.name, badge: req.user.badge },
      upvotes: 0,
      upvotedBy: [],
      commentsCount: 0,
      images: req.files ? req.files.map(f => `/uploads/${f.filename}`) : [],
      createdAt: new Date()
    };
    localIssues.unshift(issue);
    req.user.points += 20;
    req.user.reportsCount += 1;
    res.status(201).json(issue);
  },
  getAll: (req, res) => {
    const { category, severity, status } = req.query;
    let list = [...localIssues];
    if (category) list = list.filter(i => i.category === category);
    if (severity) list = list.filter(i => i.severity === severity);
    if (status) list = list.filter(i => i.status === status);
    res.json(list);
  },
  getOne: (req, res) => {
    const issue = localIssues.find(i => i._id === req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    res.json(issue);
  },
  upvote: (req, res) => {
    const issue = localIssues.find(i => i._id === req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    const idx = issue.upvotedBy.indexOf(req.user.id);
    if (idx > -1) {
      issue.upvotedBy.splice(idx, 1);
      issue.upvotes = Math.max(0, issue.upvotes - 1);
    } else {
      issue.upvotedBy.push(req.user.id);
      issue.upvotes += 1;
    }
    res.json({ upvotes: issue.upvotes, hasUpvoted: idx === -1 });
  },
  updateStatus: (req, res) => {
    const issue = localIssues.find(i => i._id === req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    const { status, department, assignedTo } = req.body;
    if (status) issue.status = status;
    if (department) issue.department = department;
    res.json(issue);
  }
};

const fallbackComments = {
  get: (req, res) => {
    const list = localComments[req.params.issueId] || [];
    res.json(list);
  },
  create: (req, res) => {
    const { text } = req.body;
    const issueId = req.params.issueId;
    const issue = localIssues.find(i => i._id === issueId);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });
    
    const comment = {
      id: 'comment_' + Date.now(),
      user: { name: req.user.name, badge: req.user.badge },
      text,
      createdAt: new Date()
    };
    if (!localComments[issueId]) localComments[issueId] = [];
    localComments[issueId].push(comment);
    issue.commentsCount += 1;
    res.status(201).json(comment);
  }
};

const fallbackStats = {
  getSummary: (req, res) => {
    const totalIssues = localIssues.length;
    const resolved = localIssues.filter(i => i.status === 'resolved').length;
    const pending = localIssues.filter(i => ['reported', 'acknowledged'].includes(i.status)).length;
    const inProgress = localIssues.filter(i => ['assigned', 'in_progress'].includes(i.status)).length;
    res.json({
      totalIssues,
      resolved,
      pending,
      inProgress,
      avgResolutionDays: 4.2,
      citizensActive: localUsers.length
    });
  },
  getLeaderboard: (req, res) => {
    const list = [...localUsers].sort((a, b) => b.points - a.points);
    res.json(list);
  }
};

module.exports = {
  mockAuth,
  fallbackAuth,
  fallbackIssues,
  fallbackComments,
  fallbackStats
};
