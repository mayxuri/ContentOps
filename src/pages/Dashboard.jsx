import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FileText, TrendingUp, Globe, Send, Clock } from 'lucide-react';
import { Card, Badge, SectionHeader, AnimatedCounter, StatusIndicator } from '../components/UI';
import { agents } from '../data/agents';
import { kpiData, contentOutputData, pipelineActivity } from '../data/mockData';
import { useApi } from '../hooks/useApi';
import { analytics } from '../api/client';
import './Pages.css';

const kpiIcons = [FileText, TrendingUp, Globe, Send];

const kpiColors = [
  { color: 'hsl(250, 85%, 67%)', bg: 'hsla(250, 85%, 67%, 0.1)' },
  { color: 'hsl(155, 65%, 48%)', bg: 'hsla(155, 65%, 48%, 0.1)' },
  { color: 'hsl(185, 70%, 50%)', bg: 'hsla(185, 70%, 50%, 0.1)' },
  { color: 'hsl(35,  90%, 58%)', bg: 'hsla(35,  90%, 58%, 0.1)' },
];

function timeAgo(isoString) {
  if (!isoString) return '–';
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60)   return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} hr ago`;
  return `${Math.round(diff / 86400)} days ago`;
}

function agentActionLabel(agentName, topic) {
  const t = topic ? `"${topic}"` : 'content';
  const map = {
    'Content Drafter':   `Generated draft for ${t}`,
    'Brand Reviewer':    `Reviewed brand alignment for ${t}`,
    'Compliance Officer': `Scanned compliance for ${t}`,
    'Localizer':         `Localized ${t}`,
    'Publisher':         `Published ${t}`,
  };
  return map[agentName] ?? `Processed ${t}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip glass-strong">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: item.color }} />
          <span>{item.name}: {item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { data: dashData } = useApi(() => analytics.dashboard(), []);
  const { data: trendData } = useApi(() => analytics.trend(), []);

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const kpiList = dashData?.kpi?.length ? dashData.kpi : kpiData;

  // ── Chart data ──────────────────────────────────────────────────────────────
  const chartData = (() => {
    const snapshots = trendData?.data ?? [];
    if (!snapshots.length) return contentOutputData;
    return snapshots.map((s) => ({
      month: new Date(s.snapshotDate).toLocaleString('default', { month: 'short' }),
      blogs:  Math.round((s.formatPerformance?.blog?.views  ?? 0) / 1000),
      social: Math.round((s.formatPerformance?.social?.views ?? 0) / 1000),
    }));
  })();

  // ── Activity feed ───────────────────────────────────────────────────────────
  const activityList = (() => {
    const raw = dashData?.recentActivity ?? [];
    if (!raw.length) return pipelineActivity;
    return raw.map((item, i) => ({
      id:     i,
      agent:  item.agentName,
      action: agentActionLabel(item.agentName, item.run?.brief?.topic),
      status: item.status,
      time:   timeAgo(item.createdAt),
      type:   'processing',
    }));
  })();

  return (
    <div className="page-dashboard">
      <SectionHeader
        title="Dashboard"
        subtitle="Overview of your content operations"
      />

      {/* KPIs */}
      <div className="kpi-grid">
        {kpiList.map((kpi, i) => {
          const Icon = kpiIcons[i];
          const { color, bg } = kpiColors[i] ?? kpiColors[0];
          return (
            <Card key={kpi.label} hover delay={i * 0.06} className="kpi-card" padding="lg">
              <div className="kpi-icon-wrap" style={{ background: bg, color }}>
                <Icon size={20} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">{kpi.label}</span>
                <span className="kpi-value" style={{ color }}>
                  <AnimatedCounter value={kpi.value} suffix={kpi.suffix || ''} />
                </span>
                <span className="kpi-change">+{kpi.change}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="dashboard-grid">
        {/* Content Output Chart */}
        <Card padding="xl">
          <h3>Content Output</h3>
          <p className="chart-subtitle">Monthly generated content across all formats</p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(220,15%,50%,0.06)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="blogs"  name="Blog"   stroke="var(--accent-primary)"   fill="var(--accent-primary-soft)"   strokeWidth={2} />
                <Area type="monotone" dataKey="social" name="Social" stroke="var(--accent-secondary)" fill="var(--accent-secondary-soft)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Agent Fleet */}
        <Card padding="xl">
          <h3>Agent Fleet</h3>
          <p className="chart-subtitle">Active agents and their throughput</p>
          <div className="agent-list-dash">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                className="agent-row"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="agent-row-left">
                  <div className="agent-row-icon" style={{ background: `${agent.color}12`, color: agent.color }}>
                    <agent.icon size={16} />
                  </div>
                  <div className="agent-row-info">
                    <span className="agent-row-name">{agent.name}</span>
                    <span className="agent-row-meta">{agent.avgTime} avg | {agent.accuracy}% accuracy</span>
                  </div>
                </div>
                <div className="agent-row-right">
                  <span className="agent-throughput">{agent.throughput}/hr</span>
                  <StatusIndicator status="active" size={7} />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card padding="xl">
        <div className="chart-header">
          <div>
            <h3>Pipeline Activity</h3>
            <p className="chart-subtitle">Recent agent actions</p>
          </div>
          <Badge variant="info">Live</Badge>
        </div>
        <div className="activity-feed">
          {activityList.map((item, i) => (
            <motion.div
              key={item.id ?? i}
              className="activity-item"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="activity-timeline">
                <div className={`activity-dot activity-dot-${item.status}`} />
                {i < activityList.length - 1 && <div className="activity-line" />}
              </div>
              <div className="activity-content">
                <div className="activity-header-row">
                  <span className="activity-agent">{item.agent}</span>
                  <Badge
                    variant={item.status === 'flagged' ? 'error' : item.status === 'completed' ? 'success' : 'info'}
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="activity-desc">{item.action}</p>
                <span className="activity-time"><Clock size={11} /> {item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
