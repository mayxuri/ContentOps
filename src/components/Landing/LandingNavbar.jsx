import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import '../../pages/Landing.css';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`landing-nav ${scrolled ? 'nav-scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <div className="nav-logo-mark">C</div>
          <span className="nav-logo-text">ContentOps</span>
        </Link>

        <div className={`nav-links ${mobileOpen ? 'nav-links-open' : ''}`}>
          <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#agents" onClick={() => setMobileOpen(false)}>Agents</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#scenarios" onClick={() => setMobileOpen(false)}>Scenarios</a>
        </div>

        <div className="nav-actions">
          <Link to="/app" className="nav-cta">
            Launch Platform
            <ArrowRight size={15} />
          </Link>
        </div>

        <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </motion.nav>
  );
}
