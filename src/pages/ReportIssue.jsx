import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import {
  MapPin, Upload, ArrowLeft, ArrowRight, Check, Send, Navigation,
  Keyboard, X, Loader2, CheckCircle,
  CircleAlert, Lightbulb, Trash2, Droplets, Waves, Car, Construction, HelpCircle, ImagePlus
} from 'lucide-react'
import { CATEGORIES, SEVERITIES } from '../data/mockData'
import styles from './ReportIssue.module.css'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const iconMap = { CircleAlert, Lightbulb, Trash2, Droplets, Waves, Car, Construction, HelpCircle }

// Component to pick location by clicking on map
function LocationPicker({ position, setPosition }) {
  const map = useMap()

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      map.flyTo(e.latlng, Math.max(map.getZoom(), 15), { duration: 0.5 })
    }
  })

  return position ? <Marker position={position} /> : null
}

// Component to fly map to a position
function FlyToPosition({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1 })
    }
  }, [position, map])
  return null
}

export default function ReportIssue() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1: Location
  const [locMethod, setLocMethod] = useState(null) // 'gps' | 'map' | 'address'
  const [position, setPosition] = useState(null)
  const [gpsStatus, setGpsStatus] = useState(null) // 'loading' | 'success' | 'error'
  const [gpsError, setGpsError] = useState('')
  const [address, setAddress] = useState({
    street: '', area: '', city: '', state: '', pincode: ''
  })

  // Step 2: Details
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState('')
  const [photos, setPhotos] = useState([]) // Array of { file, preview }
  const fileRefs = [useRef(), useRef(), useRef(), useRef()]

  // GPS Location
  const requestGPS = () => {
    setGpsStatus('loading')
    setGpsError('')
    if (!navigator.geolocation) {
      setGpsStatus('error')
      setGpsError('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setPosition(coords)
        setGpsStatus('success')
        setLocMethod('gps')
        toast.success('Location detected! 📍')
      },
      (err) => {
        setGpsStatus('error')
        if (err.code === 1) setGpsError('Location permission denied. Please allow access or use map/address.')
        else if (err.code === 2) setGpsError('Position unavailable. Try again or use map.')
        else setGpsError('Location request timed out. Try again.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  // Photo handling
  const handlePhotoAdd = (index) => {
    fileRefs[index].current?.click()
  }

  const handleFileChange = (e, index) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    const preview = URL.createObjectURL(file)
    const newPhotos = [...photos]
    // Find the right slot
    if (index < newPhotos.length) {
      URL.revokeObjectURL(newPhotos[index].preview)
      newPhotos[index] = { file, preview }
    } else {
      newPhotos.push({ file, preview })
    }
    setPhotos(newPhotos)
  }

  const removePhoto = (index) => {
    const newPhotos = [...photos]
    URL.revokeObjectURL(newPhotos[index].preview)
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
  }

  // Validation
  const canProceedStep1 = () => {
    if (position) return true
    if (address.street.trim() && address.area.trim() && address.city.trim()) return true
    return false
  }

  const canProceedStep2 = () => {
    return title.trim() && description.trim() && category && severity
  }

  // Submit
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('severity', severity);
      
      const fullAddr = address.street ? `${address.street}, ${address.area}, ${address.city}` : 'Map pinned location';
      formData.append('address', fullAddr);
      
      if (position) {
        formData.append('lat', position[0]);
        formData.append('lng', position[1]);
      } else {
        // default center coordinates fallback
        formData.append('lat', 26.9124);
        formData.append('lng', 75.7873);
      }

      photos.forEach(photo => {
        formData.append('photos', photo.file);
      });

      toast.loading('Submitting report...', { id: 'submit_loading' });
      const newIssue = await api.createIssue(formData);
      toast.dismiss('submit_loading');

      const trackingId = newIssue.id || newIssue._id || 'FMA-' + Date.now().toString(36).toUpperCase().slice(-6);

      const report = {
        trackingId,
        title: newIssue.title,
        description: newIssue.description,
        category: CATEGORIES.find(c => c.id === newIssue.category)?.label || newIssue.category,
        severity: SEVERITIES.find(s => s.id === newIssue.severity)?.label || newIssue.severity,
        address: newIssue.address,
        position: newIssue.location?.coordinates ? [newIssue.location.coordinates[1], newIssue.location.coordinates[0]] : position,
        photosCount: photos.length,
        submittedAt: newIssue.createdAt || new Date().toISOString(),
      };
      
      sessionStorage.setItem('lastReport', JSON.stringify(report));
      toast.success('Issue reported successfully! 🎉');
      navigate('/submit-success');
    } catch (error) {
      toast.dismiss('submit_loading');
      toast.error(error.message || 'Failed to submit report');
    }
  }

  const stepAnim = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 }, transition: { duration: 0.3 } }

  const fullAddress = [address.street, address.area, address.city, address.state, address.pincode].filter(Boolean).join(', ')

  return (
    <motion.div className={styles.page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <h2>Report an Issue</h2>
      <p>Help improve your neighborhood by reporting civic problems</p>

      {/* Progress */}
      <div className={styles.progress}>
        {['Location', 'Details', 'Review'].map((l, i) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={styles.step}>
              <div className={`${styles.stepDot} ${step === i + 1 ? styles.active : step > i + 1 ? styles.done : ''}`}>
                {step > i + 1 ? <Check size={16} /> : i + 1}
              </div>
              <span className={`${styles.stepLabel} ${step === i + 1 ? styles.active : ''}`}>{l}</span>
            </div>
            {i < 2 && <div className={`${styles.stepLine} ${step > i + 1 ? styles.active : ''}`} />}
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <AnimatePresence mode="wait">
          {/* ===== STEP 1: LOCATION ===== */}
          {step === 1 && (
            <motion.div key="s1" {...stepAnim}>
              <div className={styles.field}>
                <label>How would you like to set the location?</label>
                <div className={styles.locationOptions}>
                  <button
                    className={`${styles.locBtn} ${locMethod === 'gps' ? styles.active : ''}`}
                    onClick={requestGPS}
                    disabled={gpsStatus === 'loading'}
                  >
                    {gpsStatus === 'loading' ? <Loader2 size={16} className="spin" /> : <Navigation size={16} />}
                    Use My Location
                  </button>
                  <button
                    className={`${styles.locBtn} ${locMethod === 'map' ? styles.active : ''}`}
                    onClick={() => setLocMethod('map')}
                  >
                    <MapPin size={16} /> Pin on Map
                  </button>
                  <button
                    className={`${styles.locBtn} ${locMethod === 'address' ? styles.active : ''}`}
                    onClick={() => setLocMethod('address')}
                  >
                    <Keyboard size={16} /> Type Address
                  </button>
                </div>

                {/* GPS Status */}
                {gpsStatus === 'loading' && (
                  <div className={`${styles.gpsStatus} ${styles.gpsLoading}`}>
                    <Loader2 size={16} /> Detecting your location...
                  </div>
                )}
                {gpsStatus === 'success' && (
                  <div className={`${styles.gpsStatus} ${styles.gpsSuccess}`}>
                    <CheckCircle size={16} /> Location detected successfully!
                  </div>
                )}
                {gpsStatus === 'error' && (
                  <div className={`${styles.gpsStatus} ${styles.gpsError}`}>
                    <CircleAlert size={16} /> {gpsError}
                  </div>
                )}
              </div>

              {/* Map for GPS result or manual pin */}
              {(locMethod === 'map' || locMethod === 'gps' || position) && (
                <div className={styles.field}>
                  <label>{locMethod === 'map' ? '📍 Click on the map to pin the exact location' : '📍 Your detected location (you can adjust by clicking)'}</label>
                  <div className={styles.mapBox}>
                    <MapContainer center={position || [26.9124, 75.7873]} zoom={position ? 16 : 13} scrollWheelZoom={true}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationPicker position={position} setPosition={setPosition} />
                      {position && <FlyToPosition position={position} />}
                    </MapContainer>
                  </div>
                  {position && (
                    <div className={styles.coords}>
                      <span className={styles.coordsBadge}><MapPin size={12} /> {position[0].toFixed(5)}, {position[1].toFixed(5)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Address fields */}
              {(locMethod === 'address' || locMethod === 'map' || locMethod === 'gps') && (
                <div className={styles.addressSection}>
                  <div className={styles.field}>
                    <label>📝 Enter the full address</label>
                    <div className={styles.addressFields}>
                      <input
                        className={styles.fullWidth}
                        type="text"
                        placeholder="Street / Road / Building name"
                        value={address.street}
                        onChange={e => setAddress({ ...address, street: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Area / Locality"
                        value={address.area}
                        onChange={e => setAddress({ ...address, area: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={e => setAddress({ ...address, city: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={e => setAddress({ ...address, state: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="PIN Code"
                        value={address.pincode}
                        onChange={e => setAddress({ ...address, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.btns}>
                <button
                  className={styles.btnNext}
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1()}
                  style={!canProceedStep1() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 2: DETAILS ===== */}
          {step === 2 && (
            <motion.div key="s2" {...stepAnim}>
              <div className={styles.field}>
                <label>Title *</label>
                <input type="text" placeholder="e.g. Large pothole near MG Road junction" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Description *</label>
                <textarea placeholder="Describe the problem in detail — what you saw, how bad it is, how long it's been there..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Category *</label>
                <div className={styles.catGrid}>
                  {CATEGORIES.map(c => {
                    const Icon = iconMap[c.icon] || HelpCircle
                    return (
                      <div key={c.id} className={`${styles.catCard} ${category === c.id ? styles.selected : ''}`} onClick={() => setCategory(c.id)}>
                        <Icon size={24} color={c.color} />
                        <span>{c.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className={styles.field}>
                <label>Severity *</label>
                <div className={styles.sevGrid}>
                  {SEVERITIES.map(s => (
                    <div key={s.id} className={`${styles.sevCard} ${severity === s.id ? styles.selected : ''}`}
                      style={severity === s.id ? { borderColor: s.color, background: s.color + '15', color: s.color } : {}}
                      onClick={() => setSeverity(s.id)}>
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Upload — up to 4 */}
              <div className={styles.field}>
                <label>📷 Attach Photos (up to 4)</label>
                <div className={styles.photoGrid}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`${styles.photoSlot} ${photos[i] ? styles.filled : ''}`} onClick={() => !photos[i] && handlePhotoAdd(i)}>
                      <input
                        ref={fileRefs[i]}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, i)}
                      />
                      {photos[i] ? (
                        <>
                          <img src={photos[i].preview} alt={`Photo ${i + 1}`} />
                          <button className={styles.removePhoto} onClick={(e) => { e.stopPropagation(); removePhoto(i) }}>
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <ImagePlus size={24} color="var(--text-tertiary)" />
                          <span>Photo {i + 1}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <p className={styles.photoHint}>Max 5MB per image • JPG, PNG supported</p>
              </div>

              <div className={styles.btns}>
                <button className={styles.btnBack} onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
                <button
                  className={styles.btnNext}
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2()}
                  style={!canProceedStep2() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 3: REVIEW ===== */}
          {step === 3 && (
            <motion.div key="s3" {...stepAnim}>
              <h3 style={{ marginBottom: '24px' }}>Review Your Report</h3>
              <dl className={styles.summary}>
                {position && (
                  <div className={styles.summaryRow}>
                    <dt>GPS Coords</dt>
                    <dd>{position[0].toFixed(5)}, {position[1].toFixed(5)}</dd>
                  </div>
                )}
                <div className={styles.summaryRow}><dt>Address</dt><dd>{fullAddress || 'Not provided'}</dd></div>
                <div className={styles.summaryRow}><dt>Title</dt><dd>{title}</dd></div>
                <div className={styles.summaryRow}><dt>Category</dt><dd>{CATEGORIES.find(c => c.id === category)?.label}</dd></div>
                <div className={styles.summaryRow}><dt>Severity</dt><dd>{SEVERITIES.find(s => s.id === severity)?.label}</dd></div>
                <div className={styles.summaryRow}><dt>Description</dt><dd>{description}</dd></div>
                {photos.length > 0 && (
                  <div className={styles.summaryRow}>
                    <dt>Photos</dt>
                    <dd>
                      <div className={styles.photoPreview}>
                        {photos.map((p, i) => <img key={i} src={p.preview} alt={`Photo ${i + 1}`} />)}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
              <div className={styles.btns}>
                <button className={styles.btnBack} onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button>
                <button className={styles.btnNext} onClick={handleSubmit}><Send size={16} /> Submit Report</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
