import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ThumbsUp, Share2, MapPin, Image, Building, MessageCircle } from 'lucide-react'
import { api } from '../utils/api'
import { getCategoryById, getSeverityById, getStatusById, timeAgo } from '../data/mockData'
import styles from './IssueDetail.module.css'

const statusOrder = ['reported', 'acknowledged', 'assigned', 'in_progress', 'resolved']

export default function IssueDetail() {
  const { id } = useParams()
  const [issue, setIssue] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState(false)
  const [votes, setVotes] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const issueData = await api.getIssueById(id)
        setIssue(issueData)
        setVotes(issueData.upvotes)
        
        const commentsData = await api.getComments(id)
        setComments(commentsData)
      } catch (err) {
        console.error('Error loading issue details:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleVote = async () => {
    try {
      const data = await api.upvoteIssue(id)
      setVotes(data.upvotes)
      setVoted(data.hasUpvoted)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const added = await api.addComment(id, newComment)
      setComments([...comments, added])
      setNewComment('')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className={styles.page} style={{ textAlign: 'center', padding: '100px 0' }}>Loading details...</div>
  }

  if (!issue) {
    return <div className={styles.page} style={{ textAlign: 'center', padding: '100px 0' }}>Issue not found</div>
  }

  const cat = getCategoryById(issue.category) || { color: '#6B7280', label: issue.category }
  const sev = getSeverityById(issue.severity) || { color: '#6B7280', label: issue.severity }
  const status = getStatusById(issue.status) || { color: '#6B7280', label: issue.status }
  const reporterName = issue.reportedBy?.name || 'Citizen'
  const currentIdx = statusOrder.indexOf(issue.status)

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <Link to="/map" className={styles.backBtn}><ArrowLeft size={16} /> Back to Map</Link>

      <div className={styles.grid}>
        <div className={styles.main}>
          <div className={styles.idBadge}>{issue.id || issue._id}</div>
          <h1>{issue.title}</h1>
          <div className={styles.badges}>
            <span className={styles.badge} style={{ background: cat.color + '18', color: cat.color }}>{cat.label}</span>
            <span className={styles.badge} style={{ background: sev.color + '18', color: sev.color }}>{sev.label}</span>
            <span className={styles.badge} style={{ background: status.color + '18', color: status.color }}>{status.label}</span>
          </div>
          <p className={styles.meta}>Reported by <strong>{reporterName}</strong> · {timeAgo(issue.createdAt)}</p>

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
            {issue.images && issue.images.length > 0 ? (
              <div className={styles.photoGrid} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {issue.images.map((img, i) => (
                  <img key={i} src={`http://localhost:5000${img}`} alt={`Upload ${i + 1}`} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                ))}
              </div>
            ) : (
              <div className={styles.imgPlaceholder}><Image size={40} /></div>
            )}
            <div className={styles.locRow}><MapPin size={14} /> {issue.address}</div>
            {issue.department && <div className={styles.locRow}><Building size={14} /> Dept: {issue.department}</div>}
          </div>

          {/* Comments */}
          <div className={styles.card}>
            <h3><MessageCircle size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Comments ({comments.length})</h3>
            <form onSubmit={handleCommentSubmit} className={styles.commentInput}>
              <input type="text" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} />
              <button type="submit">Post</button>
            </form>
            {comments.map((c, i) => (
              <div key={i} className={styles.comment}>
                <div className={styles.commentAvatar}>
                  {(c.user?.name || 'Citizen').split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className={styles.commentBody}>
                  <h5>{c.user?.name || 'Citizen'} <span>{timeAgo(c.createdAt)}</span></h5>
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
