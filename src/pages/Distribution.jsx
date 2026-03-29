import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Linkedin, Instagram, Mail, BookOpen, Video, Headphones,
  Clock, ChevronLeft, ChevronRight, Send
} from 'lucide-react';
import { Card, Badge, Button, SectionHeader, StatusIndicator } from '../components/UI';
import { distributionChannels, calendarEvents } from '../data/mockData';
import { useApi } from '../hooks/useApi';
import { distribution as distApi } from '../api/client';
import './Pages.css';

function timeAgo(iso) {
  if (!iso) return '–';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return `${Math.round(s)}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  return `${Math.round(s / 3600)} hr ago`;
}

const iconMap = {
  FileText, Twitter: FileText, Linkedin, Instagram, Mail, BookOpen, Video, Headphones,
};

const statusColors = {
  published: 'success',
  scheduled: 'info',
  draft: 'default',
};

const channelColors = {
  blog:      'hsl(175, 80%, 48%)',
  twitter:   'hsl(200, 90%, 55%)',
  linkedin:  'hsl(210, 80%, 52%)',
  instagram: 'hsl(330, 70%, 55%)',
  email:     'hsl(35,  95%, 60%)',
  medium:    'hsl(0,   0%,  60%)',
  youtube:   'hsl(0,   80%, 55%)',
  podcast:   'hsl(280, 70%, 58%)',
};

const platformIconMap = {
  blog: BookOpen, twitter: FileText, linkedin: Linkedin,
  instagram: Instagram, email: Mail, medium: FileText,
  youtube: Video, podcast: Headphones,
};

export default function Distribution() {
  const now = new Date();
  const [calYear,  setCalYear]  = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1); // 1-based

  const { data: channelData  } = useApi(() => distApi.channels(), []);
  const { data: calData      } = useApi(() => distApi.calendar(calMonth, calYear), [calMonth, calYear]);
  const { data: distListData } = useApi(() => distApi.list(), []);

  // ── Channels ───────────────────────────────────────────────────────────────
  const channelList = channelData?.data?.length
    ? channelData.data.map((ch) => ({
        id:           ch.id,
        name:         ch.name,
        platform:     ch.platform,
        handle:       ch.config?.handle       ?? '',
        followers:    ch.config?.followers     ?? '',
        avgReach:     ch.config?.avgReach      ?? '',
        postsPerMonth:ch.config?.postsPerMonth ?? '',
        posts:        ch._count?.distributions ?? 0,
        status:       ch.status,
        color:        channelColors[ch.platform] ?? 'var(--accent-primary)',
      }))
    : distributionChannels;

  // ── Calendar ───────────────────────────────────────────────────────────────
  const studioEntry = (() => {
    try {
      const raw = sessionStorage.getItem('distribution_studio');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const baseCalEvents = calData?.data?.length
    ? calData.data.map((d) => ({
        day:     new Date(d.scheduledAt).getDate(),
        title:   d.output?.title ?? 'Content',
        channel: d.channel?.platform ?? 'blog',
        status:  d.status,
      }))
    : calendarEvents;

  const calEvents = (() => {
    if (!studioEntry || studioEntry.year !== calYear || studioEntry.month !== calMonth) {
      return baseCalEvents;
    }
    const channelToCalChannel = { blog: 'blog', social: 'twitter', faq: 'blog' };
    const studioItems = studioEntry.channels.map((ch) => ({
      day:     studioEntry.day,
      title:   studioEntry.title,
      channel: channelToCalChannel[ch] ?? ch,
      status:  'scheduled',
    }));
    return [...baseCalEvents, ...studioItems];
  })();

  const monthLabel = new Date(calYear, calMonth - 1, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const startDay    = new Date(calYear, calMonth - 1, 1).getDay();
  const allDays     = [
    ...Array.from({ length: startDay },     (_, i) => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const today = now.getDate();
  const isCurrentMonth = now.getFullYear() === calYear && now.getMonth() + 1 === calMonth;

  const prevMonth = () => { if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

  // ── Publisher log ──────────────────────────────────────────────────────────
  const pubLog = distListData?.data?.length
    ? distListData.data.slice(0, 5).map((d) => ({
        action:  `${d.status === 'published' ? 'Published' : 'Scheduled'} "${d.output?.title ?? 'content'}" to ${d.channel?.name ?? 'channel'}`,
        channel: d.channel?.name ?? 'Channel',
        time:    timeAgo(d.scheduledAt),
        status:  d.status,
      }))
    : [
        { action: 'Published blog post to company website',           channel: 'Blog',      time: '2 min ago',  status: 'completed' },
        { action: 'Scheduled LinkedIn post for next Monday at 10:00', channel: 'LinkedIn',  time: '5 min ago',  status: 'scheduled' },
        { action: 'Formatted Instagram carousel from product images', channel: 'Instagram', time: '12 min ago', status: 'completed' },
        { action: 'Queued email newsletter for 45,000 subscribers',   channel: 'Email',     time: '18 min ago', status: 'scheduled' },
        { action: 'Adapted Twitter thread from blog post content',    channel: 'Twitter/X', time: '25 min ago', status: 'completed' },
      ];

  return (
    <div className="page-distribution">
      <SectionHeader
        title="Distribution"
        subtitle="Multi-channel content scheduling and Publisher agent management"
        action={<Button variant="primary" icon={Send} size="sm">Publish Queue</Button>}
      />

      {/* Channel Cards */}
      <div className="channel-grid">
        {channelList.map((ch, i) => {
          const Icon = platformIconMap[ch.platform] ?? FileText;
          return (
            <Card key={ch.id} hover delay={i * 0.05} className="channel-card" padding="md">
              <div className="channel-card-header">
                <div className="channel-icon-wrap" style={{ background: `${ch.color}18`, color: ch.color }}>
                  <Icon size={18} />
                </div>
                <StatusIndicator status={ch.status} size={7} label={ch.status} />
              </div>
              <h4 className="channel-name">{ch.name}</h4>
              {ch.handle && <p className="channel-handle">{ch.handle}</p>}
              <div className="channel-stats">
                {ch.followers ? (
                  <div className="channel-stat">
                    <span className="stat-value">{Number(ch.followers).toLocaleString()}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                ) : null}
                {ch.avgReach ? (
                  <div className="channel-stat">
                    <span className="stat-value-small">{Number(ch.avgReach).toLocaleString()}</span>
                    <span className="stat-label">Avg Reach</span>
                  </div>
                ) : null}
                {ch.postsPerMonth ? (
                  <div className="channel-stat">
                    <span className="stat-value-small">{ch.postsPerMonth}</span>
                    <span className="stat-label">Posts/mo</span>
                  </div>
                ) : null}
              </div>
              <div className="channel-dist-row">
                <span className="channel-dist-count">{ch.posts}</span>
                <span className="channel-dist-label">content scheduled by agent</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content Calendar */}
      <Card padding="xl" className="calendar-card">
        <div className="calendar-header">
          <div className="calendar-nav">
            <button className="cal-nav-btn" onClick={prevMonth}><ChevronLeft size={18} /></button>
            <h3>{monthLabel}</h3>
            <button className="cal-nav-btn" onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>
          <div className="calendar-legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--status-success)' }} /> Published</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--status-info)' }} /> Scheduled</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--text-tertiary)' }} /> Draft</span>
          </div>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="cal-day-header">{d}</div>
          ))}
          {allDays.map((day, i) => {
            if (day === null) return <div key={`pad-${i}`} className="cal-day cal-day-empty" />;
            const dayEvents = calEvents.filter((e) => e.day === day);
            const isToday = isCurrentMonth && day === today;
            return (
              <motion.div
                key={day}
                className={`cal-day ${isToday ? 'cal-day-today' : ''} ${dayEvents.length > 0 ? 'cal-day-has-events' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.01 }}
              >
                <span className="cal-day-num">{day}</span>
                <div className="cal-events">
                  {dayEvents.slice(0, 3).map((evt, j) => (
                    <div
                      key={j}
                      className="cal-event"
                      style={{ borderLeftColor: channelColors[evt.channel] || 'var(--text-tertiary)' }}
                      title={`${evt.title} · ${evt.status}`}
                    >
                      <span className="cal-event-title">
                        {evt.title.split(' ').slice(0, 4).join(' ')}…
                      </span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="cal-more">+{dayEvents.length - 2} more</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Publisher Agent Log */}
      <Card padding="xl" className="publisher-log">
        <h3>Publisher Agent Activity</h3>
        <div className="pub-log-items">
          {pubLog.map((item, i) => (
            <motion.div
              key={i}
              className="pub-log-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <StatusIndicator status={item.status} size={7} />
              <span className="pub-log-action">{item.action}</span>
              <Badge variant="default" size="sm">{item.channel}</Badge>
              <span className="pub-log-time"><Clock size={11} /> {item.time}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
