import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronRight } from 'lucide-react';
import './Layout.css';

const routeNames = {
  '/app': 'Dashboard',
  '/app/pipeline': 'Agent Pipeline',
  '/app/studio': 'Content Studio',
  '/app/compliance': 'Compliance Review',
  '/app/localization': 'Localization',
  '/app/distribution': 'Distribution',
  '/app/analytics': 'Analytics & Intelligence',
  '/app/scenarios': 'Scenario Demos',
};

export default function TopBar() {
  const location = useLocation();
  const currentPage = routeNames[location.pathname] || 'Dashboard';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span className="breadcrumb-root">ContentOps</span>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span className="breadcrumb-current">{currentPage}</span>
        </div>
      </div>

      <div className="topbar-center">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search content, agents, channels..."
            className="search-input"
          />
          <kbd className="search-shortcut">Ctrl+K</kbd>
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" title="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>
        <div className="topbar-avatar">
          <div className="avatar-circle">M</div>
        </div>
      </div>
    </header>
  );
}
