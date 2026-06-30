import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Login.module.css'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [role, setRole] = useState('citizen')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Please enter your full name'); return }
    if (!email.trim()) { setError('Please enter your email'); return }
    if (password.length < 4) { setError('Password must be at least 4 characters'); return }
    if (password !== confirmPass) { setError('Passwords do not match'); return }

    try {
      signup(name, email, password, role)
      toast.success('Account created successfully! 🎉')
      navigate('/')
    } catch {
      setError('Signup failed. Please try again.')
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
          <h2>Join the Movement</h2>
          <p>Join 3,420+ citizens making their city better, one report at a time.</p>
        </div>
      </div>
      <div className={styles.right}>
        <motion.form className={styles.formCard} onSubmit={handleSubmit} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <h2>Create Account</h2>
          <p>Start making a difference in your community</p>

          {error && <div className={styles.errorBox}><AlertCircle size={16} /> {error}</div>}

          <div className={styles.field}>
            <label>Full Name</label>
            <div className={styles.inputWrap}><input type="text" placeholder="Arjun Sharma" value={name} onChange={e => setName(e.target.value)} /></div>
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <div className={styles.inputWrap}><input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
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
          <div className={styles.field}>
            <label>Confirm Password</label>
            <div className={styles.inputWrap}>
              <input type="password" placeholder="••••••••" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
            </div>
          </div>
          <div className={styles.field}>
            <label>Role</label>
            <div className={styles.inputWrap}>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="citizen">Citizen</option>
                <option value="admin">Admin / Municipal Officer</option>
              </select>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}><UserPlus size={18} /> Create Account</button>
          <p className={styles.switchLink}>Already have an account? <Link to="/login">Sign in</Link></p>
        </motion.form>
      </div>
    </motion.div>
  )
}
