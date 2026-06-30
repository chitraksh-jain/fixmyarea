import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import MapView from './pages/MapView'
import ReportIssue from './pages/ReportIssue'
import IssueDetail from './pages/IssueDetail'
import MyReports from './pages/MyReports'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SubmitSuccess from './pages/SubmitSuccess'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const location = useLocation()

  // Pages where we hide navbar/footer (full-screen map, auth)
  const fullScreenPages = ['/map']
  const authPages = ['/login', '/signup']
  const isFullScreen = fullScreenPages.includes(location.pathname)
  const isAuthPage = authPages.includes(location.pathname)

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'var(--font-family)',
            borderRadius: 'var(--radius)',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            style: { background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' },
            iconTheme: { primary: '#059669', secondary: '#ECFDF5' },
          },
          error: {
            style: { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' },
          },
        }}
      />
      {!isFullScreen && !isAuthPage && <Navbar />}
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public-only routes (redirect to home if already logged in) */}
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
            <Route path="/issue/:id" element={<ProtectedRoute><IssueDetail /></ProtectedRoute>} />
            <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/submit-success" element={<ProtectedRoute><SubmitSuccess /></ProtectedRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isFullScreen && !isAuthPage && <Footer />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
