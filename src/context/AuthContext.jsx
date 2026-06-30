import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing session
    const saved = localStorage.getItem('fixmyarea_user')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch { localStorage.removeItem('fixmyarea_user') }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Mock login — in production this would call an API
    const userData = {
      id: 'u1',
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role: 'citizen',
      points: 0,
      reportsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    }
    setUser(userData)
    localStorage.setItem('fixmyarea_user', JSON.stringify(userData))
    return userData
  }

  const signup = (name, email, password, role = 'citizen') => {
    const userData = {
      id: 'u_' + Date.now(),
      name,
      email,
      role,
      points: 0,
      reportsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    }
    setUser(userData)
    localStorage.setItem('fixmyarea_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fixmyarea_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
