import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ThumbsUp, Share2, MapPin, Image, Building, MessageCircle } from 'lucide-react'
import { mockIssues, getUserById, getCategoryById, getSeverityById, getStatusById, STATUSES, timeAgo } from '../data/mockData'
import styles from './IssueDetail.module.css'

const statusOrder = ['reported', 'acknowledged', 'assigned', 'in_progress', 'resolved']

export default function IssueDetail() {
  const { id } = useParams()
  const issue = mockIssues.find(i => i.id === id) || mockIssues[0]
  const cat = getCategoryById(issue.category)
  const sev = getSeverityById(issue.severity)
  const status = getStatusById(issue.status)
  const reporter = getUserById(issue.reportedBy)
  const currentIdx = statusOrder.indexOf(issue.status)
  const [voted, setVoted] = useState(false)
  const [votes, setVotes] = useState(issue.upvotes)

  const handleVote = () => {
    setVoted(!voted)
    setVotes(v => voted ? v - 1 : v + 1)
  }

  const comments = [
    { name: 'Priya Patel', initials: 'PP', time: '2 days ago', text: 'This is getting worse every day. We need immediate action before someone gets hurt.' },
    { name: 'Municipal Dept.', initials: 'MD', time: '1 day ago', text: 'We have dispatched a team to assess the situation. Work will begin within 48 hours.' },
    { name: 'Rahul Kumar', initials: 'RK', time: '5 hours ago', text: 'I saw the team arrive this morning. They\'ve started working on it. Thanks for the quick response!' },
  ]

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <Link to="/map" className={styles.backBtn}><ArrowLeft size={16} /> Back to Map</Link>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={styles.idBadge}>{issue.id}</div>
          <h1>{issue.title}</h1>
          <div className={styles.badges}>
            <span className={styles.badge} style={{ background: cat.color + '18', color: cat.color }}>{cat.label}</span>
            <span className={styles.badge} style={{ background: sev.color + '18', color: sev.color }}>{sev.label}</span>
            <span className={styles.badge} style={{ background: status.color + '18', color: status.color }}>{status.label}</span>
          </div>
          <p className={styles.meta}>Reported by <strong>{reporter?.name}</strong> · {timeAgo(issue.createdAt)}</p>

          {/* Timeline */}
          <div className={styles.card}>
            <h3>Status Timeline</h3>
            <div className={styles.timeline}>
              {statusOrder.map((s, i) => {
                const sInfo = getStatusById(s)
                const isDone = i < currentIdx
                const isActive = i === currentIdx
                return (
                  <div key={s} className={styles.timeStep}>
                    <div className={`${styles.timeDot} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`} />
                    <div className={styles.timeInfo}>
                      <h4 style={isActive ? { color: 'var(--primary)' } : isDone ? { color: 'var(--text-primary)' } : { color: 'var(--text-tertiary)' }}>{sInfo.label}</h4>
                      <p>{isDone ? 'Completed' : isActive ? 'Current' : 'Pending'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className={styles.card}>
            <h3>Description</h3>
            <p className={styles.descText}>{issue.description}</p>
            <div className={styles.imgPlaceholder}><Image size={40} /></div>
            <div className={styles.locRow}><MapPin size={14} /> {issue.address}</div>
            {issue.department && <div className={styles.locRow}><Building size={14} /> Dept: {issue.department}</div>}
          </div>

          {/* Comments */}
          <div className={styles.card}>
            <h3><MessageCircle size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Comments ({comments.length})</h3>
            <div className={styles.commentInput}>
              <input type="text" placeholder="Add a comment..." />
              <button>Post</button>
            </div>
            {comments.map((c, i) => (
              <div key={i} className={styles.comment}>
                <div className={styles.commentAvatar}>{c.initials}</div>
                <div className={styles.commentBody}>
                  <h5>{c.name} <span>{c.time}</span></h5>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sideCard}>
            <button className={`${styles.upvoteBtn} ${voted ? styles.voted : ''}`} onClick={handleVote}>
              <ThumbsUp size={20} /> {votes} Upvotes
            </button>
            <div className={styles.statusBig} style={{ background: status.color + '15', color: status.color }}>
              {status.label}
            </div>
            <button className={styles.shareBtn}><Share2 size={16} /> Share Issue</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
