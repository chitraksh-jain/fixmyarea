import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Clock, Loader, CheckCircle, Eye, Download, Settings } from 'lucide-react'
import { mockIssues, mockStats, departmentPerformance, getCategoryById, getSeverityById, getStatusById, formatDate } from '../data/mockData'
import styles from './Dashboard.module.css'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

export default function Dashboard() {
  const stats = [
    { icon: FileText, num: mockStats.totalIssues.toLocaleString(), label: 'Total Issues', bg: '#ECFDF5', color: '#059669' },
    { icon: Clock, num: mockStats.pending, label: 'Pending', bg: '#FEF3C7', color: '#F59E0B' },
    { icon: Loader, num: mockStats.inProgress, label: 'In Progress', bg: '#DBEAFE', color: '#3B82F6' },
    { icon: CheckCircle, num: mockStats.resolved, label: 'Resolved', bg: '#D1FAE5', color: '#047857' },
  ]

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={styles.header}><h2>Admin Dashboard</h2><p>Manage and resolve civic issues</p></div>

      <motion.div className={styles.statsGrid} variants={stagger} initial="hidden" animate="visible">
        {stats.map((s, i) => (
          <motion.div key={i} className={styles.statCard} variants={fadeUp}>
            <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}><s.icon size={24} /></div>
            <div><div className={styles.statNum}>{s.num}</div><div className={styles.statLabel}>{s.label}</div></div>
          </motion.div>
        ))}
      </motion.div>

      <div className={styles.actions}>
        <button className={styles.actionBtn}><Eye size={16} /> View All Issues</button>
        <button className={styles.actionBtn}><Download size={16} /> Export Report</button>
        <button className={styles.actionBtn}><Settings size={16} /> Manage Departments</button>
      </div>

      <div className={styles.tableCard}>
        <h3>Recent Issues</h3>
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Title</th><th>Category</th><th>Severity</th><th>Status</th><th>Reported</th><th>Action</th></tr>
          </thead>
          <tbody>
            {mockIssues.slice(0, 8).map(issue => {
              const cat = getCategoryById(issue.category)
              const sev = getSeverityById(issue.severity)
              const status = getStatusById(issue.status)
              return (
                <tr key={issue.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px' }}>{issue.id}</td>
                  <td style={{ fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.title}</td>
                  <td><span className={styles.pill} style={{ background: cat.color + '18', color: cat.color }}>{cat.label}</span></td>
                  <td><span className={styles.pill} style={{ background: sev.color + '18', color: sev.color }}>{sev.label}</span></td>
                  <td><span className={styles.pill} style={{ background: status.color + '18', color: status.color }}>{status.label}</span></td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{formatDate(issue.createdAt)}</td>
                  <td><Link to={`/issue/${issue.id}`} className={styles.viewBtn}>View</Link></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Department Overview</h3>
      <div className={styles.deptGrid}>
        {departmentPerformance.map((d, i) => (
          <div key={i} className={styles.deptCard}>
            <h4>{d.department}</h4>
            <div className={styles.deptStat}><span>Resolved</span><strong>{d.resolved}</strong></div>
            <div className={styles.deptStat}><span>Pending</span><strong>{d.pending}</strong></div>
            <div className={styles.deptStat}><span>Avg Days</span><strong>{d.avgDays}</strong></div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
