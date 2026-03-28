import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/Landing';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import ContentStudio from './pages/ContentStudio';
import Compliance from './pages/Compliance';
import Localization from './pages/Localization';
import Distribution from './pages/Distribution';
import Analytics from './pages/Analytics';
import Scenarios from './pages/Scenarios';
import Settings from './pages/Settings';
import Library from './pages/Library';
import Signal from './pages/Signal';
import Muse from './components/Muse/Muse';

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <TopBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Muse />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="studio" element={<ContentStudio />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="localization" element={<Localization />} />
          <Route path="distribution" element={<Distribution />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="scenarios" element={<Scenarios />} />
          <Route path="library"  element={<Library />} />
          <Route path="settings" element={<Settings />} />
          <Route path="signal"   element={<Signal />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
