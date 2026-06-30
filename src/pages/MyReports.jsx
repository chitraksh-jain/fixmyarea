import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, MapPin, ThumbsUp } from 'lucide-react'
import { mockIssues, getCategoryById, getSeverityById, getStatusById, timeAgo } from '../data/mockData'
import styles from './MyReports.module.css'

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function MyReports() {
  const [filter, setFilter] = useState('all')
  const myIssues = mockIssues.filter(i => i.reportedBy === 'u1' || i.reportedBy === 'u3')
  const resolved = myIssues.filter(i => i.status === 'resolved').length
  const pending = myIssues.length - resolved

  const filtered = filter === 'all' ? myIssues
    : filter === 'resolved' ? myIssues.filter(i => i.status === 'resolved')
    : filter === 'in_progress' ? myIssues.filter(i => i.status === 'in_progress')
    : myIssues.filter(i => i.status === 'reported' || i.status === 'acknowledged')

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
          { icon: FileText, num: myIssues.length, label: 'Total Reports', bg: '#ECFDF5', color: '#059669' },
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
            const cat = getCategoryById(issue.category)
            const sev = getSeverityById(issue.severity)
            const status = getStatusById(issue.status)
            return (
              <motion.div key={issue.id} variants={fadeUp}>
                <Link to={`/issue/${issue.id}`} className={styles.card}>
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
