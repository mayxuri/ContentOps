import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, Lightbulb, BarChart3, PieChart as PieIcon,
  Users, Send, Eye, BookOpen, Linkedin, Instagram, Mail, Video, Headphones, FileText, Globe,
} from 'lucide-react';
import { Card, Badge, Button, SectionHeader, AnimatedCounter, Tabs } from '../components/UI';
import { engagementData, formatPerformance, performancePivot } from '../data/mockData';
import { useApi } from '../hooks/useApi';
import { analytics } from '../api/client';
import './Pages.css';

const COLORS = [
  'hsl(175, 80%, 48%)', 'hsl(260, 70%, 65%)', 'hsl(210, 80%, 60%)',
  'hsl(35, 95%, 60%)', 'hsl(150, 70%, 45%)', 'hsl(330, 70%, 55%)',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip glass-strong">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: item.color }} />
          <span>{item.name}: {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [pivotView, setPivotView] = useState('current');

  const { data: engagementApiData } = useApi(() => analytics.engagement(), []);
  const { data: formatsApiData    } = useApi(() => analytics.formats(),    []);
  const { data: channelApiData    } = useApi(() => analytics.channels(),   []);

  // Engagement chart — API returns analyticsSnapshots; map to week-level display
  const chartEngagementData = (() => {
    const snaps = engagementApiData?.data ?? [];
    if (!snaps.length) return engagementData;
    return snaps.map((s, i) => ({
      week:        `W${i + 1}`,
      views:       s.engagementData?.views       ?? 0,
      clicks:      s.engagementData?.clicks      ?? 0,
      shares:      s.engagementData?.shares      ?? 0,
      conversions: s.engagementData?.conversions ?? 0,
    }));
  })();

  // Format performance — API returns grouped counts; map to engagement display
  const chartFormatData = (() => {
    const rows = formatsApiData?.data ?? [];
    if (!rows.length) return formatPerformance;
    return rows.map((r, i) => ({
      format:     r.format.charAt(0).toUpperCase() + r.format.slice(1),
      engagement: r._count?.id ?? 0,
    }));
  })();

  const totalViews       = chartEngagementData.reduce((s, d) => s + d.views, 0);
  const totalConversions = chartEngagementData.reduce((s, d) => s + d.conversions, 0);
  const avgEngagement    = chartEngagementData.length
    ? (chartEngagementData.reduce((s, d) => s + (d.views ? (d.clicks / d.views) * 100 : 0), 0) / chartEngagementData.length).toFixed(1)
    : '0.0';

  return (
    <div className="page-analytics">
      <SectionHeader
        title="Analytics & Intelligence"
        subtitle="Content performance insights and AI-driven strategy recommendations"
      />

      {/* Summary KPIs */}
      <div className="analytics-kpis">
        {[
          { label: 'Total Views', value: totalViews, suffix: '', icon: TrendingUp, change: '+18.4%', positive: true },
          { label: 'Conversions', value: totalConversions, suffix: '', icon: ArrowUpRight, change: '+24.1%', positive: true },
          { label: 'Avg Engagement', value: parseFloat(avgEngagement), suffix: '%', icon: BarChart3, change: '+3.2%', positive: true },
          { label: 'Content Cycle Time', value: 2.4, suffix: ' days', icon: PieIcon, change: '-1.8 days', positive: true },
        ].map((kpi, i) => (
          <Card key={kpi.label} hover delay={i * 0.06} className="analytics-kpi">
            <div className="analytics-kpi-top">
              <span className="analytics-kpi-label">{kpi.label}</span>
              <kpi.icon size={16} className="analytics-kpi-icon" />
            </div>
            <span className="analytics-kpi-value">
              <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
            </span>
            <span className={`analytics-kpi-change ${kpi.positive ? 'change-positive' : 'change-negative'}`}>
              {kpi.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {kpi.change}
            </span>
          </Card>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Engagement Over Time */}
        <Card padding="xl" className="analytics-chart-card">
          <h3>Engagement Over Time</h3>
          <p className="chart-subtitle">Weekly performance metrics across all channels</p>
          <div className="chart-container-lg">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartEngagementData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,20%,50%,0.08)" />
                <XAxis dataKey="week" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="views" name="Views" stroke="hsl(175, 80%, 48%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(175, 80%, 48%)' }} />
                <Line type="monotone" dataKey="clicks" name="Clicks" stroke="hsl(260, 70%, 65%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(260, 70%, 65%)' }} />
                <Line type="monotone" dataKey="shares" name="Shares" stroke="hsl(35, 95%, 60%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(35, 95%, 60%)' }} />
                <Line type="monotone" dataKey="conversions" name="Conversions" stroke="hsl(150, 70%, 45%)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(150, 70%, 45%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Content Format Performance */}
        <Card padding="xl" className="analytics-chart-card">
          <h3>Format Performance</h3>
          <p className="chart-subtitle">Engagement rate by content format</p>
          <div className="chart-container-lg">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartFormatData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,20%,50%,0.08)" />
                <XAxis dataKey="format" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="engagement" name="Engagement %" radius={[6, 6, 0, 0]}>
                  {chartFormatData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Performance Pivot */}
      <Card padding="xl" className="pivot-card">
        <div className="pivot-header">
          <div className="pivot-icon-wrap">
            <Lightbulb size={22} />
          </div>
          <div>
            <h3>Performance Pivot Recommendation</h3>
            <p className="pivot-finding">{performancePivot.finding}</p>
          </div>
          <Badge variant="warning" size="lg">Strategy Shift Required</Badge>
        </div>

        <div className="pivot-comparison">
          <div className="pivot-side">
            <h4>Current Content Mix</h4>
            <div className="pivot-chart">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={performancePivot.currentMix}
                    dataKey="percentage"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                  >
                    {performancePivot.currentMix.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pivot-legend">
              {performancePivot.currentMix.map((item, i) => (
                <div key={item.type} className="pivot-legend-item">
                  <span className="pivot-legend-dot" style={{ background: COLORS[i] }} />
                  <span>{item.type}: {item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pivot-arrow-col">
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="pivot-arrow"
            >
              <ArrowUpRight size={28} />
            </motion.div>
            <span className="pivot-arrow-label">Recommended Shift</span>
          </div>

          <div className="pivot-side">
            <h4>Recommended Content Mix</h4>
            <div className="pivot-chart">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={performancePivot.recommendedMix}
                    dataKey="percentage"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                  >
                    {performancePivot.recommendedMix.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pivot-legend">
              {performancePivot.recommendedMix.map((item, i) => (
                <div key={item.type} className="pivot-legend-item">
                  <span className="pivot-legend-dot" style={{ background: COLORS[i] }} />
                  <span>{item.type}: {item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pivot-recommendations">
          <h4>Action Items</h4>
          <div className="pivot-rec-list">
            {performancePivot.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                className="pivot-rec"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="pivot-rec-num">{i + 1}</span>
                <span>{rec}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pivot-actions">
          <Button variant="primary">Apply Recommended Strategy</Button>
          <Button variant="secondary">Generate New Content Calendar</Button>
        </div>
      </Card>

      {/* Channel Breakdown */}
      <ChannelBreakdown data={channelApiData?.data ?? []} />
    </div>
  );
}

const platformIconMap = {
  blog: BookOpen, linkedin: Linkedin, instagram: Instagram,
  email: Mail, youtube: Video, podcast: Headphones,
  twitter: Globe, medium: FileText,
};

const platformColors = {
  blog:      'hsl(175, 80%, 48%)',
  linkedin:  'hsl(210, 80%, 52%)',
  instagram: 'hsl(330, 70%, 55%)',
  email:     'hsl(35,  95%, 60%)',
  youtube:   'hsl(0,   80%, 55%)',
  podcast:   'hsl(280, 70%, 58%)',
  twitter:   'hsl(200, 90%, 55%)',
  medium:    'hsl(0,   0%,  60%)',
};

function ChannelBreakdown({ data }) {
  if (!data.length) return null;

  const chartData = data
    .filter((ch) => ch.totalDistributions > 0 || ch.followers > 0)
    .map((ch) => ({ name: ch.name, Followers: ch.followers, Scheduled: ch.totalDistributions }));

  return (
    <Card padding="xl" className="channel-breakdown-card">
      <h3>Channel Performance</h3>
      <p className="chart-subtitle">Followers and content scheduled per channel</p>

      {/* Summary cards */}
      <div className="channel-breakdown-grid">
        {data.map((ch, i) => {
          const Icon  = platformIconMap[ch.platform] ?? Globe;
          const color = platformColors[ch.platform] ?? 'var(--accent-primary)';
          return (
            <motion.div
              key={ch.id}
              className="ch-breakdown-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ '--ch-color': color }}
            >
              <div className="ch-bd-top">
                <div className="ch-bd-icon" style={{ background: `${color}18`, color }}>
                  <Icon size={16} />
                </div>
                <Badge variant={ch.status === 'active' ? 'success' : 'warning'} size="sm">{ch.status}</Badge>
              </div>
              <div className="ch-bd-name">{ch.name}</div>
              {ch.handle && <div className="ch-bd-handle">{ch.handle}</div>}
              <div className="ch-bd-stats">
                <div className="ch-bd-stat">
                  <Users size={11} />
                  <span>{ch.followers ? ch.followers.toLocaleString() : '–'}</span>
                  <span className="ch-bd-stat-label">followers</span>
                </div>
                <div className="ch-bd-stat">
                  <Eye size={11} />
                  <span>{ch.avgReach ? ch.avgReach.toLocaleString() : '–'}</span>
                  <span className="ch-bd-stat-label">avg reach</span>
                </div>
                <div className="ch-bd-stat">
                  <Send size={11} />
                  <span>{ch.totalDistributions}</span>
                  <span className="ch-bd-stat-label">scheduled</span>
                </div>
              </div>
              {ch.totalReach > 0 && (
                <div className="ch-bd-reach">
                  Est. total reach: <strong>{ch.totalReach.toLocaleString()}</strong>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bar chart comparison */}
      {chartData.length > 0 && (
        <div className="chart-container-lg" style={{ marginTop: '1.5rem' }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(210,20%,50%,0.08)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Followers" fill="hsl(250, 85%, 67%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scheduled" fill="hsl(175, 80%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
