import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('fixmyarea_token')
      if (token) {
        try {
          const profile = await api.getProfile()
          setUser(profile)
        } catch {
          localStorage.removeItem('fixmyarea_token')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const data = await api.login(email, password)
    setUser(data.user)
    localStorage.setItem('fixmyarea_token', data.token)
    return data.user
  }

  const signup = async (name, email, password, role = 'citizen') => {
    const data = await api.signup(name, email, password, role)
    setUser(data.user)
    localStorage.setItem('fixmyarea_token', data.token)
    return data.user
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fixmyarea_token')
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
