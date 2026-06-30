import { motion } from 'framer-motion'
import { TrendingUp, PieChart, BarChart3, Activity } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import { monthlyTrend, categoryStats, departmentPerformance, wardScorecard } from '../data/mockData'
import styles from './Analytics.module.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { family: 'Inter', size: 12 } } } } }

export default function Analytics() {
  const trendData = {
    labels: monthlyTrend.map(m => m.month),
    datasets: [
      { label: 'Reported', data: monthlyTrend.map(m => m.reported), borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#3B82F6' },
      { label: 'Resolved', data: monthlyTrend.map(m => m.resolved), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#059669' },
    ],
  }

  const catData = {
    labels: categoryStats.map(c => c.category),
    datasets: [{ data: categoryStats.map(c => c.count), backgroundColor: categoryStats.map(c => c.color), borderWidth: 0, hoverOffset: 8 }],
  }

  const deptData = {
    labels: departmentPerformance.map(d => d.department.split(' ')[0]),
    datasets: [{ label: 'Resolved', data: departmentPerformance.map(d => d.resolved), backgroundColor: '#059669', borderRadius: 6, barThickness: 28 }],
  }

  const resTimeData = {
    labels: departmentPerformance.map(d => d.department.split(' ')[0]),
    datasets: [{ label: 'Avg Days', data: departmentPerformance.map(d => d.avgDays), backgroundColor: '#F59E0B', borderRadius: 6, barThickness: 28 }],
  }

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={styles.header}><h2>Analytics & Insights</h2><p>Data-driven civic governance</p></div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3><TrendingUp size={18} color="var(--primary)" /> Monthly Trend</h3>
          <div className={styles.chartWrap}><Line data={trendData} options={chartOpts} /></div>
        </div>
        <div className={styles.chartCard}>
          <h3><PieChart size={18} color="var(--primary)" /> Issues by Category</h3>
          <div className={styles.chartWrap}><Doughnut data={catData} options={{ ...chartOpts, cutout: '60%' }} /></div>
        </div>
        <div className={styles.chartCard}>
          <h3><BarChart3 size={18} color="var(--primary)" /> Department Performance</h3>
          <div className={styles.chartWrap}><Bar data={deptData} options={{ ...chartOpts, indexAxis: 'y' }} /></div>
        </div>
        <div className={styles.chartCard}>
          <h3><Activity size={18} color="var(--primary)" /> Avg Resolution Time</h3>
          <div className={styles.chartWrap}><Bar data={resTimeData} options={chartOpts} /></div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <h3>Ward-Wise Scorecard</h3>
        <table className={styles.table}>
          <thead><tr><th>Ward</th><th>Total</th><th>Resolved</th><th>Resolution Rate</th><th>Avg Days</th></tr></thead>
          <tbody>
            {wardScorecard.sort((a, b) => b.rate - a.rate).map((w, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{w.ward}</td>
                <td>{w.total}</td>
                <td>{w.resolved}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${w.rate}%`, background: w.rate >= 80 ? '#059669' : w.rate >= 60 ? '#F59E0B' : '#EF4444' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: w.rate >= 80 ? '#059669' : w.rate >= 60 ? '#F59E0B' : '#EF4444' }}>{w.rate}%</span>
                  </div>
                </td>
                <td>{w.avgDays} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
