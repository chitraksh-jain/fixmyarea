import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, MapPin, PlusCircle, Home, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './SubmitSuccess.module.css'

export default function SubmitSuccess() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem('lastReport')
    if (data) {
      setReport(JSON.parse(data))
    } else {
      navigate('/report')
    }
  }, [navigate])

  const copyTrackingId = () => {
    if (report?.trackingId) {
      navigator.clipboard.writeText(report.trackingId)
      setCopied(true)
      toast.success('Tracking ID copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!report) return null

  const submittedDate = new Date(report.submittedAt)
  const formattedDate = submittedDate.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>

      <motion.div
        className={styles.successIcon}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <CheckCircle size={48} color="white" />
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        Report Submitted! 🎉
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        Your civic issue has been recorded. Authorities will be notified shortly.
      </motion.p>

      <motion.div className={styles.trackingBox} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <label>Your Tracking ID</label>
        <div className={styles.trackingId} onClick={copyTrackingId} style={{ cursor: 'pointer' }}>
          {report.trackingId}
          <button onClick={copyTrackingId} style={{ marginLeft: 8, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', verticalAlign: 'middle' }}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        <p className={styles.trackingHint}>Use this ID to track the status of your report</p>
      </motion.div>

      <motion.div className={styles.summaryCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <h3>Report Summary</h3>
        <dl>
          <div className={styles.row}><dt>Title</dt><dd>{report.title}</dd></div>
          <div className={styles.row}><dt>Category</dt><dd>{report.category}</dd></div>
          <div className={styles.row}><dt>Severity</dt><dd>{report.severity}</dd></div>
          <div className={styles.row}><dt>Location</dt><dd>{report.address}</dd></div>
          {report.photosCount > 0 && (
            <div className={styles.row}><dt>Photos</dt><dd>{report.photosCount} photo(s) attached</dd></div>
          )}
          <div className={styles.row}><dt>Submitted</dt><dd>{formattedDate}</dd></div>
        </dl>
      </motion.div>

      {/* What happens next */}
      <motion.div className={styles.timeline} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <h4>What Happens Next?</h4>
        <div className={styles.timeSteps}>
          {[
            { label: 'Reported', active: true },
            { label: 'Acknowledged', active: false },
            { label: 'Assigned', active: false },
            { label: 'In Progress', active: false },
            { label: 'Resolved', active: false },
          ].map((s, i) => (
            <div key={i} className={styles.timeStep}>
              <div className={`${styles.dot} ${s.active ? styles.active : ''}`}>
                {s.active ? <Check size={12} /> : i + 1}
              </div>
              <span className={s.active ? styles.active : ''}>{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div className={styles.actions} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} style={{ marginTop: 32 }}>
        <Link to="/map" className={styles.btnPrimary}><MapPin size={16} /> View on Map</Link>
        <Link to="/report" className={styles.btnSecondary}><PlusCircle size={16} /> Report Another</Link>
        <Link to="/" className={styles.btnSecondary}><Home size={16} /> Go Home</Link>
      </motion.div>
    </motion.div>
  )
}
