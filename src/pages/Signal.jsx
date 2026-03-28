import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, Target, AlertTriangle, TrendingUp, ChevronRight, RefreshCw, Crosshair } from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../components/UI';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

// ─── Trend data ────────────────────────────────────────────────────────────────
// In production this would come from a real trends API (Google Trends, Reddit, etc.)
// ring: 0 = center (hottest) → 1 = outer edge (emerging)
const ALL_SIGNALS = [
  { id:  1, topic: 'React 19 Features',      heat: 0.96, category: 'Frontend',    angle:  18, ring: 0.20, covered: false, format: 'Video + Blog', volume: '128K searches/wk' },
  { id:  2, topic: 'System Design Basics',   heat: 0.92, category: 'Engineering', angle:  62, ring: 0.24, covered: false, format: 'Blog + FAQ',   volume: '94K searches/wk' },
  { id:  3, topic: 'DSA Trees & Graphs',     heat: 0.88, category: 'DSA',         angle: 108, ring: 0.28, covered: true,  format: 'Video',        volume: '81K searches/wk' },
  { id:  4, topic: 'TypeScript Generics',    heat: 0.83, category: 'Frontend',    angle: 152, ring: 0.30, covered: false, format: 'Blog',         volume: '67K searches/wk' },
  { id:  5, topic: 'LeetCode Patterns',      heat: 0.86, category: 'DSA',         angle: 198, ring: 0.26, covered: true,  format: 'Video',        volume: '75K searches/wk' },
  { id:  6, topic: 'Portfolio with React',   heat: 0.79, category: 'Career',      angle: 242, ring: 0.34, covered: true,  format: 'Blog + Video', volume: '59K searches/wk' },
  { id:  7, topic: 'Next.js App Router',     heat: 0.77, category: 'Frontend',    angle: 286, ring: 0.38, covered: false, format: 'Video',        volume: '52K searches/wk' },
  { id:  8, topic: 'CSS Animations',         heat: 0.65, category: 'Frontend',    angle: 330, ring: 0.44, covered: false, format: 'Blog',         volume: '41K searches/wk' },
  { id:  9, topic: 'API Integration (JS)',   heat: 0.72, category: 'Backend',     angle:  40, ring: 0.40, covered: true,  format: 'Blog',         volume: '48K searches/wk' },
  { id: 10, topic: 'Docker for Beginners',   heat: 0.61, category: 'DevOps',      angle:  84, ring: 0.50, covered: false, format: 'Blog + Video', volume: '37K searches/wk' },
  { id: 11, topic: 'Web Performance Tips',   heat: 0.70, category: 'Frontend',    angle: 130, ring: 0.42, covered: false, format: 'Blog',         volume: '44K searches/wk' },
  { id: 12, topic: 'GitHub Actions CI/CD',   heat: 0.58, category: 'DevOps',      angle: 175, ring: 0.54, covered: false, format: 'Blog',         volume: '33K searches/wk' },
  { id: 13, topic: 'Framer Motion Guide',    heat: 0.74, category: 'Frontend',    angle: 220, ring: 0.38, covered: false, format: 'Blog + Video', volume: '50K searches/wk' },
  { id: 14, topic: 'SQL vs NoSQL',           heat: 0.67, category: 'Backend',     angle: 265, ring: 0.46, covered: false, format: 'Blog',         volume: '43K searches/wk' },
  { id: 15, topic: 'AI API Chatbot Build',   heat: 0.90, category: 'AI',          angle: 310, ring: 0.22, covered: true,  format: 'Blog + Video', volume: '88K searches/wk' },
];

const CATEGORY_COLORS = {
  Frontend:    'hsl(175, 80%, 48%)',
  DSA:         'hsl(260, 70%, 65%)',
  Engineering: 'hsl(35, 95%, 60%)',
  Career:      'hsl(150, 70%, 45%)',
  Backend:     'hsl(210, 80%, 60%)',
  DevOps:      'hsl(330, 70%, 55%)',
  AI:          'hsl(50, 90%, 58%)',
};

const CATEGORY_VARIANT = {
  Frontend:    'secondary',
  DSA:         'primary',
  Engineering: 'warning',
  Career:      'success',
  Backend:     'info',
  DevOps:      'error',
  AI:          'warning',
};

// ─── Radar SVG ─────────────────────────────────────────────────────────────────
function TrendRadar({ signals, selected, onSelect }) {
  const CX = 250, CY = 250, MAX_R = 200;
  const [tick, setTick] = useState(0);

  // Pulse animation tick
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  const toXY = (angleDeg, ring) => {
    const r = ring * MAX_R;
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };

  // Sweepline animation (radar sweep)
  const sweepAngle = (tick * 1.2) % 360;
  const sweepRad = (sweepAngle - 90) * Math.PI / 180;
  const sweepX = CX + MAX_R * Math.cos(sweepRad);
  const sweepY = CY + MAX_R * Math.sin(sweepRad);

  const spokeAngles = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg width="100%" viewBox="0 0 500 500" className="signal-radar-svg">
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="hsl(250, 85%, 67%)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="hsl(250, 85%, 67%)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hotZone" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="hsl(250, 85%, 67%)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="hsl(250, 85%, 67%)" stopOpacity="0" />
        </radialGradient>
        {/* Sweep gradient */}
        <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="hsl(250, 85%, 67%)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(250, 85%, 67%)" stopOpacity="0" />
        </linearGradient>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer fill */}
      <circle cx={CX} cy={CY} r={MAX_R} fill="url(#radarGlow)" />

      {/* Concentric rings */}
      {[70, 130, 200].map((r, i) => (
        <circle key={r} cx={CX} cy={CY} r={r}
          fill="none"
          stroke={`hsla(250, 85%, 67%, ${0.18 - i * 0.04})`}
          strokeWidth={i === 0 ? 1.5 : 1}
          strokeDasharray={i > 0 ? '5 5' : undefined}
        />
      ))}

      {/* Spoke grid lines */}
      {spokeAngles.map((angle) => {
        const rad = (angle - 90) * Math.PI / 180;
        return (
          <line key={angle}
            x1={CX} y1={CY}
            x2={CX + MAX_R * Math.cos(rad)}
            y2={CY + MAX_R * Math.sin(rad)}
            stroke="hsla(250, 85%, 67%, 0.07)" strokeWidth="1"
          />
        );
      })}

      {/* Hot zone fill */}
      <circle cx={CX} cy={CY} r={70} fill="url(#hotZone)" />

      {/* Sweep line */}
      <line x1={CX} y1={CY} x2={sweepX} y2={sweepY}
        stroke="hsl(250, 85%, 67%)" strokeWidth="1.5" opacity="0.35"
      />
      {/* Sweep arc fade (last 60°) */}
      <path
        d={describeArc(CX, CY, MAX_R, sweepAngle - 50, sweepAngle)}
        fill="hsla(250, 85%, 67%, 0.04)" stroke="none"
      />

      {/* Zone labels */}
      <text x={CX + 6} y={CY - 74}  fill="hsla(250, 85%, 67%, 0.55)" fontSize="9" fontWeight="700" letterSpacing="0.1em">HOT</text>
      <text x={CX + 6} y={CY - 134} fill="hsla(250, 85%, 67%, 0.38)" fontSize="9" fontWeight="700" letterSpacing="0.1em">WARM</text>
      <text x={CX + 6} y={CY - 208} fill="hsla(250, 85%, 67%, 0.22)" fontSize="9" fontWeight="700" letterSpacing="0.1em">EMERGING</text>

      {/* Nodes */}
      {signals.map((sig) => {
        const { x, y } = toXY(sig.angle, sig.ring);
        const nodeR = 5 + sig.heat * 7;
        const color = CATEGORY_COLORS[sig.category] || 'var(--accent-primary)';
        const isSelected = selected?.id === sig.id;
        const isGap = !sig.covered;
        // Pulse radius (animated)
        const pulseR = nodeR + 8 + Math.sin(tick * 0.05 + sig.id) * 4;

        return (
          <g key={sig.id} onClick={() => onSelect(sig === selected ? null : sig)} style={{ cursor: 'pointer' }}>
            {/* Pulse ring — only for gaps (uncovered hot topics) */}
            {isGap && sig.heat > 0.7 && (
              <circle cx={x} cy={y} r={pulseR}
                fill="none" stroke={color} strokeWidth="1"
                opacity={0.3 + 0.2 * Math.sin(tick * 0.05 + sig.id)}
              />
            )}
            {/* Dashed ring for uncovered topics */}
            {isGap && (
              <circle cx={x} cy={y} r={nodeR + 5}
                fill="none" stroke={color} strokeWidth="1"
                strokeDasharray="3 3" opacity="0.5"
              />
            )}
            {/* Selection halo */}
            {isSelected && (
              <circle cx={x} cy={y} r={nodeR + 12}
                fill="none" stroke={color} strokeWidth="1.5" opacity="0.9"
              />
            )}
            {/* Main node */}
            <circle cx={x} cy={y} r={nodeR}
              fill={color}
              opacity={isGap ? 0.92 : 0.45}
              filter="url(#nodeGlow)"
            />
            {/* Covered indicator (X or dot) */}
            {sig.covered && (
              <text x={x} y={y + 3.5} textAnchor="middle"
                fill="white" fontSize="8" fontWeight="700" opacity="0.7"
              >✓</text>
            )}
            {/* Topic label */}
            <text x={x} y={y - nodeR - 5}
              fill={isSelected ? 'hsl(220, 20%, 95%)' : 'hsla(220, 20%, 95%, 0.75)'}
              fontSize="9" textAnchor="middle" fontWeight={isSelected ? '700' : '500'}
              letterSpacing="0.04em"
            >
              {sig.topic.split(' ').slice(0, 2).join(' ')}
            </text>
          </g>
        );
      })}

      {/* Center crosshair */}
      <line x1={CX - 12} y1={CY} x2={CX + 12} y2={CY} stroke="hsla(250, 85%, 67%, 0.5)" strokeWidth="1" />
      <line x1={CX} y1={CY - 12} x2={CX} y2={CY + 12} stroke="hsla(250, 85%, 67%, 0.5)" strokeWidth="1" />
      <circle cx={CX} cy={CY} r={3} fill="hsl(250, 85%, 67%)" />
    </svg>
  );
}

// Arc path helper
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end   = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ─── Heat Bar ──────────────────────────────────────────────────────────────────
function HeatBar({ value }) {
  const color = value > 0.85 ? 'hsl(0, 80%, 60%)' : value > 0.7 ? 'hsl(35, 95%, 60%)' : 'hsl(175, 80%, 48%)';
  return (
    <div className="signal-heat-bar-track">
      <motion.div
        className="signal-heat-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Signal() {
  const navigate = useNavigate();
  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('all'); // 'all' | 'gaps' | 'covered'
  const [refreshKey, setRefreshKey] = useState(0);
  const [scanning, setScanning]   = useState(false);
  const [newAlerts, setNewAlerts] = useState([]);

  const gaps     = ALL_SIGNALS.filter((s) => !s.covered).sort((a, b) => b.heat - a.heat);
  const topHot   = [...ALL_SIGNALS].sort((a, b) => b.heat - a.heat).slice(0, 8);

  const visibleSignals = filter === 'gaps'    ? ALL_SIGNALS.filter((s) => !s.covered)
                       : filter === 'covered' ? ALL_SIGNALS.filter((s) => s.covered)
                       : ALL_SIGNALS;

  const handleScan = () => {
    setScanning(true);
    setNewAlerts([]);
    setTimeout(() => {
      setScanning(false);
      setRefreshKey((k) => k + 1);
      setNewAlerts([
        'New signal: "Bun.js vs Node.js" rising fast',
        'Gap detected: "Tailwind v4" — 0 content in library',
      ]);
    }, 2200);
  };

  const handleGenerate = (sig) => {
    // Pass prefill via sessionStorage → ContentStudio reads it on mount
    sessionStorage.setItem('signal_prefill', JSON.stringify({
      topic:   sig.topic,
      details: `Create content about "${sig.topic}". Format suggestion: ${sig.format}. This topic is trending with ${sig.volume}.`,
    }));
    navigate('/app/studio');
  };

  return (
    <div className="page-signal">
      <SectionHeader
        title="Signal — Content Intelligence"
        subtitle="Trend-aware gap detection · auto-brief generation from live signals"
        action={
          <Button variant="primary" icon={scanning ? RefreshCw : Radio} size="sm" onClick={handleScan}>
            {scanning ? 'Scanning…' : 'Scan Trends'}
          </Button>
        }
      />

      {/* Alert strip */}
      <AnimatePresence>
        {newAlerts.map((alert, i) => (
          <motion.div key={i} className="signal-alert"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ delay: i * 0.15 }}
          >
            <Zap size={13} /> {alert}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="signal-layout">
        {/* Left: radar */}
        <div className="signal-radar-col">
          <Card padding="xl" className="signal-radar-card">
            <div className="signal-radar-header">
              <div className="signal-radar-title">
                <Crosshair size={16} />
                <span>TREND RADAR</span>
                <span className={`signal-live-dot ${scanning ? 'signal-live-scanning' : ''}`} />
                <span className="signal-live-label">{scanning ? 'SCANNING' : 'LIVE'}</span>
              </div>
              <div className="signal-filter-row">
                {['all', 'gaps', 'covered'].map((f) => (
                  <button key={f}
                    className={`signal-filter-btn ${filter === f ? 'signal-filter-active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'All' : f === 'gaps' ? 'Gaps ●' : 'Covered ✓'}
                  </button>
                ))}
              </div>
            </div>

            <TrendRadar key={refreshKey} signals={visibleSignals} selected={selected} onSelect={setSelected} />

            <div className="signal-radar-legend">
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <span key={cat} className="signal-legend-item">
                  <span className="signal-legend-dot" style={{ background: color }} />
                  {cat}
                </span>
              ))}
            </div>
            <div className="signal-radar-key">
              <span><span className="signal-key-dashed" /> = Content Gap</span>
              <span><span className="signal-key-solid" /> = Covered</span>
            </div>
          </Card>
        </div>

        {/* Right: signal list + selected detail */}
        <div className="signal-info-col">
          {/* Selected signal detail */}
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                <Card padding="xl" className="signal-detail-card">
                  <div className="signal-detail-header">
                    <Target size={15} />
                    <span className="signal-detail-label">SELECTED SIGNAL</span>
                    <Badge variant={CATEGORY_VARIANT[selected.category] ?? 'default'} size="sm">
                      {selected.category}
                    </Badge>
                    {!selected.covered && <Badge variant="error" size="sm">GAP</Badge>}
                    {selected.covered  && <Badge variant="success" size="sm">COVERED</Badge>}
                  </div>
                  <h3 className="signal-detail-topic">{selected.topic}</h3>
                  <div className="signal-detail-meta">
                    <div className="signal-meta-row">
                      <span className="signal-meta-key">HEAT INDEX</span>
                      <div style={{ flex: 1 }}><HeatBar value={selected.heat} /></div>
                      <span className="signal-meta-val">{Math.round(selected.heat * 100)}</span>
                    </div>
                    <div className="signal-meta-row">
                      <span className="signal-meta-key">VOLUME</span>
                      <span className="signal-meta-val signal-meta-accent">{selected.volume}</span>
                    </div>
                    <div className="signal-meta-row">
                      <span className="signal-meta-key">FORMAT</span>
                      <span className="signal-meta-val">{selected.format}</span>
                    </div>
                  </div>
                  {!selected.covered && (
                    <Button variant="primary" size="sm" icon={ChevronRight}
                      onClick={() => handleGenerate(selected)}
                    >
                      Generate Brief
                    </Button>
                  )}
                  {selected.covered && (
                    <p className="signal-covered-note">✓ You've already covered this topic.</p>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}>
                <Card padding="xl" className="signal-detail-card signal-detail-empty">
                  <Crosshair size={24} />
                  <p>Click a node on the radar to inspect a signal</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top signals list */}
          <Card padding="xl" className="signal-list-card">
            <div className="signal-list-title">
              <TrendingUp size={14} />
              <span>TOP SIGNALS</span>
            </div>
            <div className="signal-list">
              {topHot.map((sig, i) => (
                <motion.div key={sig.id}
                  className={`signal-row ${selected?.id === sig.id ? 'signal-row-active' : ''}`}
                  onClick={() => setSelected(sig === selected ? null : sig)}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <span className="signal-rank">{String(i + 1).padStart(2, '0')}</span>
                  <span className="signal-row-dot" style={{ background: CATEGORY_COLORS[sig.category] }} />
                  <span className="signal-row-topic">{sig.topic}</span>
                  <div className="signal-row-bar">
                    <div className="signal-row-fill"
                      style={{
                        width: `${sig.heat * 100}%`,
                        background: CATEGORY_COLORS[sig.category],
                        boxShadow: !sig.covered ? `0 0 5px ${CATEGORY_COLORS[sig.category]}` : undefined,
                      }}
                    />
                  </div>
                  <span className="signal-row-heat">{Math.round(sig.heat * 100)}</span>
                  {!sig.covered
                    ? <Badge variant="error"   size="sm">GAP</Badge>
                    : <Badge variant="default" size="sm">✓</Badge>
                  }
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Content Gaps section */}
      <div className="signal-gaps-header">
        <AlertTriangle size={16} />
        <h3>CONTENT GAPS — Trending topics not yet in your library</h3>
        <Badge variant="error" size="md">{gaps.length} gaps</Badge>
      </div>
      <div className="signal-gaps-grid">
        {gaps.map((sig, i) => (
          <motion.div key={sig.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover className="signal-gap-card" padding="md">
              <div className="signal-gap-top">
                <span className="signal-gap-dot" style={{ background: CATEGORY_COLORS[sig.category] }} />
                <Badge variant={CATEGORY_VARIANT[sig.category] ?? 'default'} size="sm">{sig.category}</Badge>
                <span className="signal-gap-heat" style={{ color: CATEGORY_COLORS[sig.category] }}>
                  {Math.round(sig.heat * 100)}
                </span>
              </div>
              <p className="signal-gap-topic">{sig.topic}</p>
              <p className="signal-gap-volume">{sig.volume}</p>
              <p className="signal-gap-format">Suggested: {sig.format}</p>
              <Button variant="primary" size="sm" icon={Zap}
                onClick={() => handleGenerate(sig)}
              >
                Generate Brief
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
