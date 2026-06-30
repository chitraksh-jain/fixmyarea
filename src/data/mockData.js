// FixMyArea — Mock Data Layer
// All mock data for the frontend prototype

export const CATEGORIES = [
  { id: 'pothole', label: 'Pothole', icon: 'CircleAlert', color: '#EF4444' },
  { id: 'streetlight', label: 'Streetlight', icon: 'Lightbulb', color: '#F59E0B' },
  { id: 'garbage', label: 'Garbage Dump', icon: 'Trash2', color: '#10B981' },
  { id: 'water', label: 'Water Leak', icon: 'Droplets', color: '#3B82F6' },
  { id: 'drainage', label: 'Drainage', icon: 'Waves', color: '#8B5CF6' },
  { id: 'parking', label: 'Illegal Parking', icon: 'Car', color: '#EC4899' },
  { id: 'road', label: 'Road Damage', icon: 'Construction', color: '#F97316' },
  { id: 'other', label: 'Other', icon: 'HelpCircle', color: '#6B7280' },
];

export const SEVERITIES = [
  { id: 'low', label: 'Low', color: '#10B981' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'high', label: 'High', color: '#F97316' },
  { id: 'critical', label: 'Critical', color: '#EF4444' },
];

export const STATUSES = [
  { id: 'reported', label: 'Reported', color: '#6B7280' },
  { id: 'acknowledged', label: 'Acknowledged', color: '#3B82F6' },
  { id: 'assigned', label: 'Assigned', color: '#8B5CF6' },
  { id: 'in_progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'resolved', label: 'Resolved', color: '#10B981' },
  { id: 'rejected', label: 'Rejected', color: '#EF4444' },
];

export const DEPARTMENTS = [
  { id: 'roads', label: 'Roads & Infrastructure' },
  { id: 'sanitation', label: 'Sanitation & Waste' },
  { id: 'electrical', label: 'Electrical & Lighting' },
  { id: 'water', label: 'Water & Drainage' },
  { id: 'traffic', label: 'Traffic & Parking' },
];

export const mockUsers = [
  { id: 'u1', name: 'Arjun Sharma', email: 'arjun@email.com', role: 'citizen', points: 450, badge: 'hero', avatar: null, reportsCount: 24, joinedDate: '2025-03-15' },
  { id: 'u2', name: 'Priya Patel', email: 'priya@email.com', role: 'citizen', points: 320, badge: 'active', avatar: null, reportsCount: 18, joinedDate: '2025-05-20' },
  { id: 'u3', name: 'Rahul Kumar', email: 'rahul@email.com', role: 'citizen', points: 680, badge: 'legend', avatar: null, reportsCount: 42, joinedDate: '2024-11-10' },
  { id: 'u4', name: 'Sneha Reddy', email: 'sneha@email.com', role: 'citizen', points: 210, badge: 'active', avatar: null, reportsCount: 12, joinedDate: '2025-07-01' },
  { id: 'u5', name: 'Vikram Singh', email: 'vikram@email.com', role: 'citizen', points: 540, badge: 'hero', avatar: null, reportsCount: 31, joinedDate: '2025-01-22' },
  { id: 'u6', name: 'Ananya Gupta', email: 'ananya@email.com', role: 'citizen', points: 150, badge: 'newcomer', avatar: null, reportsCount: 8, joinedDate: '2026-01-15' },
  { id: 'u7', name: 'Karthik Nair', email: 'karthik@email.com', role: 'citizen', points: 390, badge: 'active', avatar: null, reportsCount: 20, joinedDate: '2025-04-10' },
  { id: 'u8', name: 'Deepika Joshi', email: 'deepika@email.com', role: 'citizen', points: 290, badge: 'active', avatar: null, reportsCount: 15, joinedDate: '2025-06-18' },
  { id: 'u9', name: 'Amit Verma', email: 'amit@email.com', role: 'admin', points: 0, badge: 'admin', avatar: null, reportsCount: 0, joinedDate: '2024-01-01' },
  { id: 'u10', name: 'Ravi Dept', email: 'ravi@municipal.gov', role: 'department', points: 0, badge: 'dept', avatar: null, reportsCount: 0, joinedDate: '2024-01-01' },
];

export const mockIssues = [
  {
    id: 'ISS-001',
    title: 'Large pothole near MG Road junction',
    description: 'A dangerous pothole approximately 2 feet wide has formed near the MG Road and Brigade Road junction. Multiple vehicles have been damaged. Immediate repair needed before monsoon worsens it.',
    category: 'pothole',
    severity: 'critical',
    status: 'in_progress',
    location: { lat: 12.9716, lng: 77.5946 },
    address: 'MG Road Junction, Bangalore',
    images: ['/placeholder-pothole.jpg'],
    reportedBy: 'u1',
    assignedTo: 'u10',
    department: 'roads',
    upvotes: 127,
    upvotedBy: ['u2', 'u3', 'u4'],
    commentsCount: 14,
    createdAt: '2026-06-15T10:30:00Z',
    updatedAt: '2026-06-20T14:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-002',
    title: 'Streetlight not working on 5th Cross',
    description: 'The streetlight near the park on 5th Cross Road, Indiranagar has been non-functional for 2 weeks. The area is very dark at night making it unsafe for pedestrians.',
    category: 'streetlight',
    severity: 'high',
    status: 'assigned',
    location: { lat: 12.9784, lng: 77.6408 },
    address: '5th Cross, Indiranagar, Bangalore',
    images: ['/placeholder-streetlight.jpg'],
    reportedBy: 'u2',
    assignedTo: 'u10',
    department: 'electrical',
    upvotes: 45,
    upvotedBy: ['u1', 'u5'],
    commentsCount: 6,
    createdAt: '2026-06-18T08:15:00Z',
    updatedAt: '2026-06-22T11:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-003',
    title: 'Garbage pile near school entrance',
    description: 'A large garbage pile has accumulated right next to the entrance of Government Primary School. This is a health hazard for children. The municipal truck hasn\'t collected waste for a week.',
    category: 'garbage',
    severity: 'high',
    status: 'acknowledged',
    location: { lat: 12.9352, lng: 77.6245 },
    address: 'Near Govt. Primary School, Koramangala, Bangalore',
    images: ['/placeholder-garbage.jpg'],
    reportedBy: 'u3',
    assignedTo: null,
    department: 'sanitation',
    upvotes: 89,
    upvotedBy: ['u1', 'u2', 'u4'],
    commentsCount: 11,
    createdAt: '2026-06-20T06:45:00Z',
    updatedAt: '2026-06-21T09:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-004',
    title: 'Water pipeline burst on 3rd Main',
    description: 'A major water pipeline has burst on 3rd Main Road causing water wastage and road flooding. Water has been flowing continuously for 3 days. Urgent fix needed.',
    category: 'water',
    severity: 'critical',
    status: 'in_progress',
    location: { lat: 12.9611, lng: 77.5981 },
    address: '3rd Main Road, Jayanagar, Bangalore',
    images: ['/placeholder-water.jpg'],
    reportedBy: 'u4',
    assignedTo: 'u10',
    department: 'water',
    upvotes: 156,
    upvotedBy: ['u1', 'u2', 'u3', 'u5'],
    commentsCount: 19,
    createdAt: '2026-06-22T07:00:00Z',
    updatedAt: '2026-06-25T16:30:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-005',
    title: 'Blocked drainage causing waterlogging',
    description: 'The drainage system near the market area is completely blocked. Even light rain causes severe waterlogging affecting shops and pedestrians.',
    category: 'drainage',
    severity: 'medium',
    status: 'reported',
    location: { lat: 12.9856, lng: 77.6053 },
    address: 'Market Area, Ulsoor, Bangalore',
    images: ['/placeholder-drainage.jpg'],
    reportedBy: 'u5',
    assignedTo: null,
    department: null,
    upvotes: 34,
    upvotedBy: ['u3'],
    commentsCount: 4,
    createdAt: '2026-06-25T11:20:00Z',
    updatedAt: '2026-06-25T11:20:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-006',
    title: 'Illegal parking blocking footpath',
    description: 'Cars and bikes are consistently parked on the footpath near Commercial Street, forcing pedestrians to walk on the road. This is dangerous especially during peak hours.',
    category: 'parking',
    severity: 'medium',
    status: 'reported',
    location: { lat: 12.9822, lng: 77.6086 },
    address: 'Commercial Street, Bangalore',
    images: ['/placeholder-parking.jpg'],
    reportedBy: 'u6',
    assignedTo: null,
    department: null,
    upvotes: 67,
    upvotedBy: ['u1', 'u2'],
    commentsCount: 8,
    createdAt: '2026-06-26T14:00:00Z',
    updatedAt: '2026-06-26T14:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-007',
    title: 'Road caved in after heavy rain',
    description: 'A section of the road near Silk Board junction has caved in after the recent heavy rains. Approximately 3x2 meter section has collapsed creating a dangerous sinkhole.',
    category: 'road',
    severity: 'critical',
    status: 'resolved',
    location: { lat: 12.9173, lng: 77.6228 },
    address: 'Near Silk Board Junction, Bangalore',
    images: ['/placeholder-road.jpg'],
    reportedBy: 'u3',
    assignedTo: 'u10',
    department: 'roads',
    upvotes: 234,
    upvotedBy: ['u1', 'u2', 'u4', 'u5', 'u6'],
    commentsCount: 28,
    createdAt: '2026-06-10T09:00:00Z',
    updatedAt: '2026-06-24T17:00:00Z',
    resolvedAt: '2026-06-24T17:00:00Z',
  },
  {
    id: 'ISS-008',
    title: 'Overflowing garbage bin near bus stop',
    description: 'The community garbage bin at the Majestic bus stop has been overflowing for 4 days. Stray animals are scattering the waste across the road.',
    category: 'garbage',
    severity: 'high',
    status: 'resolved',
    location: { lat: 12.9767, lng: 77.5713 },
    address: 'Majestic Bus Stand, Bangalore',
    images: ['/placeholder-garbage2.jpg'],
    reportedBy: 'u7',
    assignedTo: 'u10',
    department: 'sanitation',
    upvotes: 78,
    upvotedBy: ['u1', 'u3'],
    commentsCount: 9,
    createdAt: '2026-06-12T08:00:00Z',
    updatedAt: '2026-06-18T10:00:00Z',
    resolvedAt: '2026-06-18T10:00:00Z',
  },
  {
    id: 'ISS-009',
    title: 'Multiple streetlights out on Ring Road',
    description: 'A stretch of about 500 meters on the Outer Ring Road near Marathahalli has all streetlights out. Very dangerous for night commuters.',
    category: 'streetlight',
    severity: 'high',
    status: 'in_progress',
    location: { lat: 12.9591, lng: 77.6974 },
    address: 'Outer Ring Road, Marathahalli, Bangalore',
    images: ['/placeholder-streetlight2.jpg'],
    reportedBy: 'u8',
    assignedTo: 'u10',
    department: 'electrical',
    upvotes: 92,
    upvotedBy: ['u1', 'u2', 'u5'],
    commentsCount: 12,
    createdAt: '2026-06-19T19:30:00Z',
    updatedAt: '2026-06-26T11:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-010',
    title: 'Pothole cluster on service road',
    description: 'Multiple potholes have formed on the service road near Electronic City Phase 1. At least 5 potholes within a 200 meter stretch making driving hazardous.',
    category: 'pothole',
    severity: 'high',
    status: 'assigned',
    location: { lat: 12.8458, lng: 77.6601 },
    address: 'Service Road, Electronic City Phase 1, Bangalore',
    images: ['/placeholder-pothole2.jpg'],
    reportedBy: 'u5',
    assignedTo: 'u10',
    department: 'roads',
    upvotes: 103,
    upvotedBy: ['u1', 'u3', 'u7'],
    commentsCount: 15,
    createdAt: '2026-06-21T12:00:00Z',
    updatedAt: '2026-06-25T14:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-011',
    title: 'Sewage overflow in residential area',
    description: 'Sewage is overflowing from a manhole cover in the residential area near HSR Layout Sector 2. Causing terrible smell and unsanitary conditions.',
    category: 'drainage',
    severity: 'critical',
    status: 'acknowledged',
    location: { lat: 12.9121, lng: 77.6446 },
    address: 'HSR Layout Sector 2, Bangalore',
    images: ['/placeholder-drainage2.jpg'],
    reportedBy: 'u1',
    assignedTo: null,
    department: 'water',
    upvotes: 145,
    upvotedBy: ['u2', 'u3', 'u4', 'u5'],
    commentsCount: 22,
    createdAt: '2026-06-23T06:30:00Z',
    updatedAt: '2026-06-24T08:00:00Z',
    resolvedAt: null,
  },
  {
    id: 'ISS-012',
    title: 'Fallen tree blocking sidewalk',
    description: 'A large tree has fallen due to the storm yesterday and is completely blocking the sidewalk and partially the road on 12th Main Road, BTM Layout.',
    category: 'other',
    severity: 'medium',
    status: 'resolved',
    location: { lat: 12.9166, lng: 77.6101 },
    address: '12th Main Road, BTM Layout, Bangalore',
    images: ['/placeholder-tree.jpg'],
    reportedBy: 'u2',
    assignedTo: 'u10',
    department: 'roads',
    upvotes: 56,
    upvotedBy: ['u4', 'u6'],
    commentsCount: 7,
    createdAt: '2026-06-14T07:00:00Z',
    updatedAt: '2026-06-16T15:00:00Z',
    resolvedAt: '2026-06-16T15:00:00Z',
  },
];

// Stats for dashboards
export const mockStats = {
  totalIssues: 1248,
  resolved: 847,
  pending: 312,
  inProgress: 89,
  avgResolutionDays: 4.2,
  citizensActive: 3420,
  resolvedThisMonth: 156,
  reportedThisMonth: 198,
};

// Monthly trend data for charts
export const monthlyTrend = [
  { month: 'Jan', reported: 142, resolved: 118 },
  { month: 'Feb', reported: 156, resolved: 134 },
  { month: 'Mar', reported: 178, resolved: 155 },
  { month: 'Apr', reported: 165, resolved: 148 },
  { month: 'May', reported: 189, resolved: 167 },
  { month: 'Jun', reported: 198, resolved: 156 },
];

// Category-wise data for charts
export const categoryStats = [
  { category: 'Pothole', count: 342, color: '#EF4444' },
  { category: 'Streetlight', count: 218, color: '#F59E0B' },
  { category: 'Garbage', count: 289, color: '#10B981' },
  { category: 'Water Leak', count: 156, color: '#3B82F6' },
  { category: 'Drainage', count: 134, color: '#8B5CF6' },
  { category: 'Parking', count: 67, color: '#EC4899' },
  { category: 'Road Damage', count: 32, color: '#F97316' },
  { category: 'Other', count: 10, color: '#6B7280' },
];

// Department performance data
export const departmentPerformance = [
  { department: 'Roads & Infrastructure', resolved: 234, pending: 45, avgDays: 3.8 },
  { department: 'Sanitation & Waste', resolved: 312, pending: 28, avgDays: 2.1 },
  { department: 'Electrical & Lighting', resolved: 178, pending: 34, avgDays: 4.5 },
  { department: 'Water & Drainage', resolved: 89, pending: 52, avgDays: 5.2 },
  { department: 'Traffic & Parking', resolved: 34, pending: 15, avgDays: 6.8 },
];

// Ward scorecard
export const wardScorecard = [
  { ward: 'Koramangala', total: 156, resolved: 128, rate: 82, avgDays: 3.2 },
  { ward: 'Indiranagar', total: 134, resolved: 112, rate: 84, avgDays: 2.9 },
  { ward: 'Jayanagar', total: 98, resolved: 78, rate: 80, avgDays: 3.5 },
  { ward: 'BTM Layout', total: 112, resolved: 85, rate: 76, avgDays: 4.1 },
  { ward: 'HSR Layout', total: 145, resolved: 102, rate: 70, avgDays: 4.8 },
  { ward: 'Whitefield', total: 167, resolved: 109, rate: 65, avgDays: 5.2 },
  { ward: 'Electronic City', total: 89, resolved: 62, rate: 70, avgDays: 4.5 },
  { ward: 'Marathahalli', total: 123, resolved: 78, rate: 63, avgDays: 5.8 },
];

// Helper: get user by id
export const getUserById = (id) => mockUsers.find(u => u.id === id);

// Helper: get category info
export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id);

// Helper: get severity info
export const getSeverityById = (id) => SEVERITIES.find(s => s.id === id);

// Helper: get status info
export const getStatusById = (id) => STATUSES.find(s => s.id === id);

// Helper: format date
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Helper: time ago
export const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
};
