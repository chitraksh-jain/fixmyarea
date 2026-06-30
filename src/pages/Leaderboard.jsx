import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, FileText } from 'lucide-react'
import { api } from '../utils/api'
import styles from './Leaderboard.module.css'

const badgeColors = { newcomer: '#6B7280', active: '#3B82F6', hero: '#F59E0B', legend: '#8B5CF6', admin: '#059669', dept: '#059669' }
const avatarColors = ['#059669', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899', '#F97316', '#10B981']
const getInitials = (name = 'Citizen') => name.split(' ').map(n => n[0]).join('').slice(0, 2)

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }

export default function Leaderboard() {
  const [rankedUsers, setRankedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard()
        setRankedUsers(data)
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  if (loading) {
    return <div className={styles.page} style={{ textAlign: 'center', padding: '100px 0' }}>Loading leaderboard...</div>
  }

  const top3 = rankedUsers.slice(0, 3)
  const rest = rankedUsers.slice(3)
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={styles.header}>
        <h2><Trophy size={28} style={{ verticalAlign: 'middle', color: 'var(--primary)', marginRight: 8 }} />Civic Leaderboard</h2>
        <p>Top citizens making a difference in their community</p>
      </div>

      {top3.length > 0 && (
        <div className={styles.podium}>
          {podiumOrder.map((user, idx) => {
            // Find its rank relative to top3
            const originalPos = top3.indexOf(user)
            const medal = originalPos === 0 ? '🥇' : originalPos === 1 ? '🥈' : '🥉'
            const bg = originalPos === 0 ? '#FFD700' : originalPos === 1 ? '#C0C0C0' : '#CD7F32'
            return (
              <motion.div key={user.id || user._id} className={`${styles.podiumCard} ${originalPos === 0 ? styles.gold : originalPos === 1 ? styles.silver : styles.bronze}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: originalPos === 0 ? -20 : 0 }} transition={{ delay: 0.2 + idx * 0.15 }}>
                <div className={styles.rank}>{medal}</div>
                <div className={styles.avatar} style={{ background: bg }}>{getInitials(user.name)}</div>
                <h4>{user.name}</h4>
                <div className={styles.points}>{user.points}</div>
                <div className={styles.reports}><FileText size={12} style={{ verticalAlign: 'middle' }} /> {user.reportsCount} reports</div>
                <span className={styles.badgePill} style={{ background: (badgeColors[user.badge] || '#6B7280') + '18', color: badgeColors[user.badge] || '#6B7280' }}>{user.badge}</span>
              </motion.div>
            )
          })}
        </div>
      )}

      <div className={styles.listCard}>
        <h3>Full Rankings</h3>
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {rest.map((user, i) => (
            <motion.div key={user.id || user._id} className={styles.row} variants={fadeUp}>
              <div className={styles.rowRank}>{i + 4}</div>
              <div className={styles.rowAvatar} style={{ background: avatarColors[(i + 3) % avatarColors.length] }}>{getInitials(user.name)}</div>
              <div className={styles.rowInfo}>
                <h4>{user.name}</h4>
                <p><span className={styles.badgePill} style={{ background: (badgeColors[user.badge] || '#6B7280') + '18', color: badgeColors[user.badge] || '#6B7280', padding: '1px 8px' }}>{user.badge}</span></p>
              </div>
              <div className={styles.rowReports}>{user.reportsCount} reports</div>
              <div className={styles.rowPoints}>{user.points} pts</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
