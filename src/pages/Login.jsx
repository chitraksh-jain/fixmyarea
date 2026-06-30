import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!password.trim()) { setError('Please enter your password'); return }
    if (password.length < 4) { setError('Password must be at least 4 characters'); return }

    try {
      await login(email, password)
      toast.success('Welcome back! 👋')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    }
  }

  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className={styles.left}>
        <div className={styles.circle} /><div className={styles.circle} /><div className={styles.circle} />
        <div className={styles.leftContent}>
          <div className={styles.logoBox}>
            <div className={styles.logoIcon}><MapPin size={24} color="white" /></div>
            <div className={styles.logoText}>Fix<span>My</span>Area</div>
          </div>
          <h2>Welcome Back!</h2>
          <p>Sign in to continue reporting and tracking civic issues in your neighborhood.</p>
        </div>
      </div>
      <div className={styles.right}>
        <motion.form className={styles.formCard} onSubmit={handleSubmit} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <h2>Sign In</h2>
          <p>Enter your credentials to access your account</p>

          {error && <div className={styles.errorBox}><AlertCircle size={16} /> {error}</div>}

          <div className={styles.field}>
            <label>Email</label>
            <div className={styles.inputWrap}>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <div className={styles.inputWrap}>
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              <button className={styles.eyeBtn} onClick={() => setShowPass(!showPass)} type="button">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}><LogIn size={18} /> Sign In</button>
          <p className={styles.switchLink}>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </motion.form>
      </div>
    </motion.div>
  )
}
