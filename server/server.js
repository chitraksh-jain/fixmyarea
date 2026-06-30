const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Issue = require('./models/Issue');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"]
  }
});

app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/stats', require('./routes/stats'));

// Default Route
app.get('/', (req, res) => {
  res.json({ message: 'FixMyArea API Server is running successfully 🚀' });
});

// Seed data function to populate MongoDB on first start
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('Seeding database with default mock data...');

    // Generate Passwords
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Users
    const citizenData = [
      { name: 'Arjun Sharma', email: 'arjun@email.com', password, role: 'citizen', points: 450, badge: 'hero', reportsCount: 24 },
      { name: 'Priya Patel', email: 'priya@email.com', password, role: 'citizen', points: 320, badge: 'active', reportsCount: 18 },
      { name: 'Rahul Kumar', email: 'rahul@email.com', password, role: 'citizen', points: 680, badge: 'legend', reportsCount: 42 },
      { name: 'Sneha Reddy', email: 'sneha@email.com', password, role: 'citizen', points: 210, badge: 'active', reportsCount: 12 },
      { name: 'Vikram Singh', email: 'vikram@email.com', password, role: 'citizen', points: 540, badge: 'hero', reportsCount: 31 },
      { name: 'Admin User', email: 'admin@email.com', password, role: 'admin', points: 0, badge: 'admin', reportsCount: 0 }
    ];

    const seededUsers = await User.insertMany(citizenData);
    console.log(`Seeded ${seededUsers.length} users.`);

    // Mock Issues
    const arjun = seededUsers.find(u => u.email === 'arjun@email.com');
    const priya = seededUsers.find(u => u.email === 'priya@email.com');
    const rahul = seededUsers.find(u => u.email === 'rahul@email.com');

    const issueData = [
      {
        title: 'Large pothole near MI Road junction',
        description: 'A dangerous pothole approximately 2 feet wide has formed near the MI Road junction. Multiple vehicles have been damaged.',
        category: 'pothole',
        severity: 'critical',
        status: 'in_progress',
        location: { type: 'Point', coordinates: [75.8050, 26.9150] },
        address: 'MI Road Junction, Jaipur',
        reportedBy: arjun._id,
        upvotes: 127
      },
      {
        title: 'Streetlight not working on 5th Cross',
        description: 'The streetlight near the park on 5th Cross Road has been non-functional for 2 weeks. The area is dark at night.',
        category: 'streetlight',
        severity: 'high',
        status: 'assigned',
        location: { type: 'Point', coordinates: [75.8190, 26.8530] },
        address: '5th Cross, Malviya Nagar, Jaipur',
        reportedBy: priya._id,
        upvotes: 45
      },
      {
        title: 'Garbage pile near school entrance',
        description: 'A large garbage pile has accumulated right next to the entrance of Government Primary School. This is a health hazard.',
        category: 'garbage',
        severity: 'high',
        status: 'reported',
        location: { type: 'Point', coordinates: [75.7420, 26.9020] },
        address: 'Near Govt. Primary School, Vaishali Nagar, Jaipur',
        reportedBy: rahul._id,
        upvotes: 89
      }
    ];

    const seededIssues = await Issue.insertMany(issueData);
    console.log(`Seeded ${seededIssues.length} issues.`);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Connect to MongoDB Atlas / Local
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fixmyarea';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB database 🍃');
    await seedDatabase();
    
    server.listen(PORT, () => {
      console.log(`Express server is running on port ${PORT} ⚡`);
    });
  })
  .catch(err => {
    console.warn('\n⚠️  MongoDB connection failed. Starting server in Sandbox Mock DB Mode.');
    console.warn('All operations will run in memory. Install MongoDB for permanent storage.\n');
    
    server.listen(PORT, () => {
      console.log(`Express server is running in Sandbox mode on port ${PORT} ⚡`);
    });
  });

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('Client connected to real-time events:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
