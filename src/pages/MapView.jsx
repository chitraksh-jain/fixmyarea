import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Filter, X, PlusCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { mockIssues, CATEGORIES, SEVERITIES, STATUSES, getCategoryById, getSeverityById, getStatusById } from '../data/mockData'
import styles from './MapView.module.css'

// Fix default marker icons for Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createCategoryIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

export default function MapView() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [catFilter, setCatFilter] = useState([])
  const [sevFilter, setSevFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])

  const toggleFilter = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }

  const filtered = useMemo(() => {
    return mockIssues.filter(i => {
      if (catFilter.length && !catFilter.includes(i.category)) return false
      if (sevFilter.length && !sevFilter.includes(i.severity)) return false
      if (statusFilter.length && !statusFilter.includes(i.status)) return false
      return true
    })
  }, [catFilter, sevFilter, statusFilter])

  const clearAll = () => { setCatFilter([]); setSevFilter([]); setStatusFilter([]) }

  return (
    <div className={styles.page}>
      <div className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarHidden : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>Filter Issues</h3>
          <Link to="/" className={styles.backBtn}><ArrowLeft size={14} /> Home</Link>
        </div>

        <div className={styles.filterGroup}>
          <h4>Category</h4>
          {CATEGORIES.map(c => (
            <label key={c.id} className={styles.checkItem}>
              <input type="checkbox" checked={catFilter.includes(c.id)} onChange={() => toggleFilter(catFilter, setCatFilter, c.id)} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <h4>Severity</h4>
          {SEVERITIES.map(s => (
            <label key={s.id} className={styles.checkItem}>
              <input type="checkbox" checked={sevFilter.includes(s.id)} onChange={() => toggleFilter(sevFilter, setSevFilter, s.id)} />
              <span>{s.label}</span>
            </label>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <h4>Status</h4>
          {STATUSES.map(s => (
            <label key={s.id} className={styles.checkItem}>
              <input type="checkbox" checked={statusFilter.includes(s.id)} onChange={() => toggleFilter(statusFilter, setStatusFilter, s.id)} />
              <span>{s.label}</span>
            </label>
          ))}
        </div>

        <button className={styles.clearBtn} onClick={clearAll}>Clear All Filters</button>
        <div className={styles.count}>Showing <strong>{filtered.length}</strong> of {mockIssues.length} issues</div>
      </div>

      <button className={styles.toggleBtn} style={sidebarOpen ? { left: '352px' } : { left: '16px' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={16} /> : <Filter size={16} />}
        {sidebarOpen ? 'Close' : 'Filters'}
      </button>

      <div className={styles.mapWrap}>
        <MapContainer center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map(issue => {
            const cat = getCategoryById(issue.category)
            const sev = getSeverityById(issue.severity)
            const status = getStatusById(issue.status)
            return (
              <Marker key={issue.id} position={[issue.location.lat, issue.location.lng]} icon={createCategoryIcon(cat.color)}>
                <Popup>
                  <div className={styles.popup}>
                    <h4>{issue.title}</h4>
                    <div className={styles.popupMeta}>
                      <span className={styles.popupBadge} style={{ background: cat.color + '20', color: cat.color }}>{cat.label}</span>
                      <span className={styles.popupBadge} style={{ background: sev.color + '20', color: sev.color }}>{sev.label}</span>
                      <span className={styles.popupBadge} style={{ background: status.color + '20', color: status.color }}>{status.label}</span>
                    </div>
                    <Link to={`/issue/${issue.id}`} className={styles.popupLink}>View Details <ArrowRight size={14} /></Link>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
        <Link to="/report" className={styles.fab}><PlusCircle size={20} /> Report Issue</Link>
      </div>
    </div>
  )
}
