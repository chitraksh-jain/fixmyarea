import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Camera, Activity, FileText, CheckCircle, Users, Clock, ThumbsUp, Sparkles } from 'lucide-react'
import { api } from '../utils/api'
import { getCategoryById, getSeverityById, timeAgo } from '../data/mockData'
import styles from './Home.module.css'

function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration])
  return <>{count.toLocaleString()}</>
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Home() {
  const [recentIssues, setRecentIssues] = useState([])
  const [stats, setStats] = useState({
    totalIssues: 1248,
    resolved: 847,
    citizensActive: 3420,
    avgResolutionDays: 4.2
  })

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const issuesData = await api.getIssues()
        setRecentIssues(issuesData.slice(0, 4))

        const statsData = await api.getSummary()
        setStats(statsData)
      } catch (err) {
        console.error('Error loading home data:', err)
      }
    }
    loadHomeData()
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <span /><span /><span />
        </div>
        <div className={styles.heroInner}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className={styles.badge}><Sparkles size={14} /> Smart Civic Platform</div>
          </motion.div>
          <motion.h1 className={styles.heroTitle} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            Report. Track. <span>Fix.</span>
          </motion.h1>
          <motion.p className={styles.heroSub} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
            Empowering citizens to build better cities. Report civic problems, track resolutions in real-time, and make your neighborhood smarter.
          </motion.p>
          <motion.div className={styles.heroBtns} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <Link to="/report" className={styles.btnPrimary}><MapPin size={18} /> Report an Issue</Link>
            <Link to="/map" className={styles.btnSecondary}><ArrowRight size={18} /> Explore Map</Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <motion.div className={styles.statsGrid} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          {[
            { icon: FileText, num: stats.totalIssues, label: 'Issues Reported', bg: '#ECFDF5', color: '#059669' },
            { icon: CheckCircle, num: stats.resolved, label: 'Issues Resolved', bg: '#D1FAE5', color: '#047857' },
            { icon: Users, num: stats.citizensActive, label: 'Active Citizens', bg: '#DBEAFE', color: '#3B82F6' },
            { icon: Clock, num: stats.avgResolutionDays, label: 'Avg Days to Fix', bg: '#FEF3C7', color: '#F59E0B' },
          ].map((s, i) => (
            <motion.div key={i} className={styles.statCard} variants={fadeUp}>
              <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}><s.icon size={26} /></div>
              <div className={styles.statNumber}>{s.num === 4.2 ? '4.2' : <CountUp end={s.num} />}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2>How It Works</h2>
          <p>Three simple steps to make your neighborhood better</p>
        </div>
        <motion.div className={styles.stepsGrid} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          {[
            { icon: Camera, title: 'Spot a Problem', desc: 'See a pothole, broken streetlight, or garbage pile? Take a quick photo with your phone.' },
            { icon: MapPin, title: 'Pin It on the Map', desc: 'Drop a pin on the exact location, add details, and submit your report in under a minute.' },
            { icon: Activity, title: 'Track the Fix', desc: 'Get real-time status updates as authorities acknowledge, assign, and resolve the issue.' },
          ].map((s, i) => (
            <motion.div key={i} className={styles.stepCard} variants={fadeUp}>
              <div className={styles.stepNum}>{i + 1}</div>
              <div className={styles.stepIcon}><s.icon size={32} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Recent Issues */}
      <section className={styles.recent}>
        <div className={styles.sectionHeader}>
          <h2>Recent Reports</h2>
          <p>See what citizens in your city are reporting</p>
        </div>
        <motion.div className={styles.issuesGrid} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {recentIssues.map(issue => {
            const cat = getCategoryById(issue.category) || { color: '#6B7280', label: issue.category }
            const sev = getSeverityById(issue.severity) || { color: '#6B7280', label: issue.severity }
            return (
              <motion.div key={issue.id || issue._id} variants={fadeUp}>
                <Link to={`/issue/${issue.id || issue._id}`} className={styles.issueCard}>
                  <div className={styles.issueTop}>
                    <span className={styles.catBadge} style={{ background: cat.color + '18', color: cat.color }}>{cat.label}</span>
                    <span className={styles.sevBadge} style={{ background: sev.color + '18', color: sev.color }}>{sev.label}</span>
                  </div>
                  <h4>{issue.title}</h4>
                  <div className={styles.issueAddr}><MapPin size={13} /> {issue.address}</div>
                  <div className={styles.issueMeta}>
                    <span className={styles.upvotes}><ThumbsUp size={14} /> {issue.upvotes}</span>
                    <span className={styles.timeAgo}>{timeAgo(issue.createdAt)}</span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of citizens who are making their neighborhoods better, one report at a time.</p>
            <Link to="/report" className={styles.ctaBtn}><MapPin size={18} /> Get Started</Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
