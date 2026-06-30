import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, MapPin, ThumbsUp } from 'lucide-react'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { getCategoryById, getSeverityById, getStatusById, timeAgo } from '../data/mockData'
import styles from './MyReports.module.css'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function MyReports() {
  const [issues, setIssues] = useState([])
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const data = await api.getIssues()
        // Filter issues reported by current logged in user
        const userId = user?.id || user?._id
        const filteredData = data.filter(i => {
          const reporterId = i.reportedBy?._id || i.reportedBy?.id || i.reportedBy
          return reporterId === userId
        })
        setIssues(filteredData)
      } catch (err) {
        console.error('Error fetching my issues:', err)
      }
    }
    if (user) fetchMyIssues()
  }, [user])

  const resolved = issues.filter(i => i.status === 'resolved').length
  const pending = issues.length - resolved

  const filtered = filter === 'all' ? issues
    : filter === 'resolved' ? issues.filter(i => i.status === 'resolved')
    : filter === 'in_progress' ? issues.filter(i => i.status === 'in_progress')
    : issues.filter(i => ['reported', 'acknowledged'].includes(i.status))

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'reported', label: 'Pending' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
  ]

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={styles.header}>
        <h2>My Reports</h2>
        <p>Track all the issues you've reported</p>
      </div>

      <div className={styles.statsRow}>
        {[
          { icon: FileText, num: issues.length, label: 'Total Reports', bg: '#ECFDF5', color: '#059669' },
          { icon: CheckCircle, num: resolved, label: 'Resolved', bg: '#D1FAE5', color: '#047857' },
          { icon: Clock, num: pending, label: 'Pending', bg: '#FEF3C7', color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} className={styles.miniStat}>
            <div className={styles.miniStatIcon} style={{ background: s.bg, color: s.color }}><s.icon size={20} /></div>
            <div>
              <div className={styles.miniStatNum}>{s.num}</div>
              <div className={styles.miniStatLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tabs}>
        {tabs.map(t => (
          <button key={t.id} className={`${styles.tab} ${filter === t.id ? styles.active : ''}`} onClick={() => setFilter(t.id)}>{t.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>No issues found for this filter.</div>
      ) : (
        <motion.div className={styles.grid} variants={stagger} initial="hidden" animate="visible">
          {filtered.map(issue => {
            const cat = getCategoryById(issue.category) || { color: '#6B7280', label: issue.category }
            const sev = getSeverityById(issue.severity) || { color: '#6B7280', label: issue.severity }
            const status = getStatusById(issue.status) || { color: '#6B7280', label: issue.status }
            return (
              <motion.div key={issue.id || issue._id} variants={fadeUp}>
                <Link to={`/issue/${issue.id || issue._id}`} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div><span className={styles.dot} style={{ background: cat.color }} /><span className={styles.catLabel}>{cat.label}</span></div>
                    <span className={styles.sevBadge} style={{ background: sev.color + '18', color: sev.color }}>{sev.label}</span>
                  </div>
                  <h4>{issue.title}</h4>
                  <div className={styles.addr}><MapPin size={13} /> {issue.address}</div>
                  <div className={styles.cardBottom}>
                    <span className={styles.statusPill} style={{ background: status.color + '18', color: status.color }}>{status.label}</span>
                    <span className={styles.votes}><ThumbsUp size={13} /> {issue.upvotes}</span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
