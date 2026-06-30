import { Link } from 'react-router-dom'
import { MapPin, Globe, MessageCircle, ExternalLink, Heart } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.brand}>
            <h3>
              <MapPin size={22} />
              Fix<span>My</span>Area
            </h3>
            <p>
              Empowering citizens to build better neighborhoods. Report civic issues,
              track resolutions, and make your city smarter — one fix at a time.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Platform</h4>
            <Link to="/map">Live Map</Link>
            <Link to="/report">Report Issue</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/analytics">Analytics</Link>
          </div>

          <div className={styles.footerCol}>
            <h4>Resources</h4>
            <a href="#">How It Works</a>
            <a href="#">API Docs</a>
            <a href="#">Community</a>
            <a href="#">Blog</a>
          </div>

          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Contact Us</a>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.footerBottom}>
          <p>
            © {new Date().getFullYear()} FixMyArea. Built with <span><Heart size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /></span> for better cities.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Website"><Globe size={18} /></a>
            <a href="#" className={styles.socialLink} aria-label="Community"><MessageCircle size={18} /></a>
            <a href="#" className={styles.socialLink} aria-label="Links"><ExternalLink size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
