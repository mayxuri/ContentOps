import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UI.css';

export function Button({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, fullWidth, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </motion.button>
  );
}

export function Card({ children, hover = false, glow = false, className = '', padding = 'lg', onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`card card-pad-${padding} ${glow ? 'card-glow' : ''} ${onClick ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export function Badge({ children, variant = 'default', size = 'md' }) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children, width = '560px' }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content glass-strong"
          style={{ maxWidth: width }}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>x</button>
          </div>
          <div className="modal-body">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ProgressBar({ value, max = 100, color = 'var(--accent-primary)', height = 6, label }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-container">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <motion.div
          className="progress-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function AnimatedCounter({ value, suffix = '', prefix = '', duration = 1.5 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = performance.now();
    const target = typeof value === 'number' ? value : parseFloat(value) || 0;
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplayValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [value, duration]);

  return (
    <span className="animated-counter" ref={ref}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export function StatusIndicator({ status = 'active', size = 8, label }) {
  const colorMap = {
    active: 'var(--status-success)',
    completed: 'var(--status-success)',
    inactive: 'var(--text-tertiary)',
    warning: 'var(--status-warning)',
    error: 'var(--status-error)',
    flagged: 'var(--status-error)',
    processing: 'var(--accent-primary)',
    scheduled: 'var(--status-info)',
    paused: 'var(--text-tertiary)',
    published: 'var(--status-success)',
    draft: 'var(--text-tertiary)',
  };
  return (
    <span className="status-indicator">
      <span
        className={`status-dot ${status === 'active' || status === 'processing' ? 'status-pulse' : ''}`}
        style={{ width: size, height: size, background: colorMap[status] || colorMap.active }}
      />
      {label && <span className="status-label">{label}</span>}
    </span>
  );
}

export function Tabs({ tabs, children }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const panels = Array.isArray(children) ? children : [children];
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div>
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && <tab.icon size={15} />}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div className="tab-indicator" layoutId="tab-indicator" />
            )}
          </button>
        ))}
      </div>
      <div className="tab-panel">
        {panels[activeIndex] ?? panels[0]}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={48} strokeWidth={1} />}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}
