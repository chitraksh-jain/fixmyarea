import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MapPin, Map, PlusCircle, LayoutDashboard, BarChart3, Trophy, User, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const links = [
    { to: '/map', label: 'Live Map', icon: Map },
    { to: '/my-reports', label: 'My Reports', icon: User },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <MapPin size={20} />
          </div>
          <div className={styles.logoText}>
            Fix<span>My</span>Area
          </div>
        </Link>

        <div className={styles.navLinks}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
          <Link to="/report" className={styles.reportBtn}>
            <PlusCircle size={16} />
            Report Issue
          </Link>
          {user && (
            <div className={styles.userArea}>
              <div className={styles.userAvatar}>
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
          <Link to="/report" className={styles.reportBtn}>
            <PlusCircle size={18} />
            Report Issue
          </Link>
          {user && (
            <button className={styles.logoutMobile} onClick={handleLogout}>
              <LogOut size={18} /> Sign Out ({user.name})
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
