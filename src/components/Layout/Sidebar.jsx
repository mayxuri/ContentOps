import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PenTool,
  ShieldCheck,
  Globe,
  Send,
  BarChart3,
  GitBranch,
  Zap,
  Library,
  Settings,
  Radio,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './Layout.css';

const navItems = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/pipeline', label: 'Agent Pipeline', icon: GitBranch },
  { path: '/app/studio', label: 'Content Studio', icon: PenTool },
  { path: '/app/compliance', label: 'Compliance', icon: ShieldCheck },
  { path: '/app/localization', label: 'Localization', icon: Globe },
  { path: '/app/distribution', label: 'Distribution', icon: Send },
  { path: '/app/analytics', label: 'Analytics',       icon: BarChart3 },
  { path: '/app/signal',    label: 'Signal',          icon: Radio },
  { path: '/app/library',   label: 'Content Library', icon: Library },
  { path: '/app/scenarios', label: 'Scenarios',       icon: Zap },
  { path: '/app/settings',  label: 'Settings',        icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="sidebar-header">
        <motion.div className="sidebar-logo" animate={{ opacity: 1 }}>
          <div className="logo-icon">
            <GitBranch size={20} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="logo-title">ContentOps</span>
                <span className="logo-subtitle">AI Platform</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    className="nav-active-bg"
                    layoutId="nav-active"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
                <item.icon size={20} className="nav-icon" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="nav-label"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className="sidebar-footer-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="plan-badge-card">
                <div className="plan-badge-header">
                  <span className="plan-badge-dot" />
                  <span className="plan-badge-label">PRO PLAN</span>
                </div>
                <div className="plan-badge-sub">All features unlocked</div>
              </div>
              <div className="agent-status-mini">
                <span className="status-dot-live" />
                <span>5 agents active</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
