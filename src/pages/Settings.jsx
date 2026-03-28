import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon, Plus, Pencil, Trash2, Check, X,
  BookOpen, Linkedin, Instagram, Mail, Video, Headphones,
  FileText, Globe, Link, ChevronDown,
} from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../components/UI';
import { useApi, useMutation } from '../hooks/useApi';
import { distribution as distApi } from '../api/client';
import './Pages.css';

const PLATFORMS = [
  { id: 'blog',      label: 'Company Blog',    icon: BookOpen,   color: 'hsl(175, 80%, 48%)' },
  { id: 'linkedin',  label: 'LinkedIn',         icon: Linkedin,   color: 'hsl(210, 80%, 52%)' },
  { id: 'instagram', label: 'Instagram',        icon: Instagram,  color: 'hsl(330, 70%, 55%)' },
  { id: 'email',     label: 'Email Newsletter', icon: Mail,       color: 'hsl(35,  95%, 60%)' },
  { id: 'youtube',   label: 'YouTube',          icon: Video,      color: 'hsl(0,   80%, 55%)' },
  { id: 'medium',    label: 'Medium',           icon: FileText,   color: 'hsl(0,   0%,  60%)' },
  { id: 'podcast',   label: 'Podcast',          icon: Headphones, color: 'hsl(280, 70%, 58%)' },
  { id: 'twitter',   label: 'Twitter / X',      icon: Globe,      color: 'hsl(200, 90%, 55%)' },
];

const STATUS_OPTIONS = ['active', 'paused', 'scheduled'];

const platformMeta = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

const handlePlaceholder = {
  blog:      'https://yourblog.com',
  linkedin:  'https://linkedin.com/company/yourcompany',
  instagram: '@yourhandle',
  email:     'newsletter@yourcompany.com',
  youtube:   'https://youtube.com/@yourchannel',
  medium:    'https://medium.com/@yourprofile',
  podcast:   'https://anchor.fm/yourpodcast',
  twitter:   '@yourhandle',
};

function ChannelForm({ initial = {}, onSave, onCancel, saving }) {
  const [platform,      setPlatform]      = useState(initial.platform ?? 'blog');
  const [name,          setName]          = useState(initial.name     ?? '');
  const [handle,        setHandle]        = useState(initial.config?.handle        ?? '');
  const [url,           setUrl]           = useState(initial.config?.url           ?? '');
  const [followers,     setFollowers]     = useState(initial.config?.followers     ?? '');
  const [avgReach,      setAvgReach]      = useState(initial.config?.avgReach      ?? '');
  const [postsPerMonth, setPostsPerMonth] = useState(initial.config?.postsPerMonth ?? '');
  const [status,        setStatus]        = useState(initial.status   ?? 'active');
  const [showPlat,      setShowPlat]      = useState(false);

  const selected = platformMeta[platform] ?? PLATFORMS[0];
  const Icon     = selected.icon;

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      platform,
      name:   name.trim(),
      status,
      config: {
        handle:        handle.trim(),
        url:           url.trim(),
        followers:     followers.trim(),
        avgReach:      avgReach.trim(),
        postsPerMonth: postsPerMonth.trim(),
      },
    });
  };

  return (
    <form onSubmit={submit} className="channel-form">
      {/* Platform picker */}
      <div className="cf-field">
        <label className="cf-label">Platform</label>
        <div className="cf-platform-select">
          <button
            type="button"
            className="cf-platform-btn"
            onClick={() => setShowPlat((v) => !v)}
          >
            <span className="cf-platform-icon" style={{ color: selected.color }}>
              <Icon size={16} />
            </span>
            <span>{selected.label}</span>
            <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
          </button>
          <AnimatePresence>
            {showPlat && (
              <motion.div
                className="cf-platform-dropdown"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`cf-platform-opt ${platform === p.id ? 'cf-platform-opt-active' : ''}`}
                    onClick={() => { setPlatform(p.id); setShowPlat(false); if (!name) setName(p.label); }}
                  >
                    <p.icon size={15} style={{ color: p.color }} />
                    {p.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Name */}
      <div className="cf-field">
        <label className="cf-label">Channel Name</label>
        <input
          className="cf-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={selected.label}
          required
        />
      </div>

      {/* Handle / @username */}
      <div className="cf-field">
        <label className="cf-label">Handle / Username</label>
        <input
          className="cf-input"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder={handlePlaceholder[platform] ?? '@handle'}
        />
      </div>

      {/* Profile URL */}
      <div className="cf-field">
        <label className="cf-label">Profile URL</label>
        <div className="cf-input-icon-wrap">
          <Link size={13} className="cf-input-icon" />
          <input
            className="cf-input cf-input-padded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="cf-field">
        <label className="cf-label">Followers / Subscribers</label>
        <input className="cf-input" value={followers} onChange={(e) => setFollowers(e.target.value)} placeholder="e.g. 4200" />
      </div>
      <div className="cf-field">
        <label className="cf-label">Avg Reach / Views per Post</label>
        <input className="cf-input" value={avgReach} onChange={(e) => setAvgReach(e.target.value)} placeholder="e.g. 800" />
      </div>
      <div className="cf-field">
        <label className="cf-label">Posts per Month</label>
        <input className="cf-input" value={postsPerMonth} onChange={(e) => setPostsPerMonth(e.target.value)} placeholder="e.g. 12" />
      </div>

      {/* Status */}
      <div className="cf-field">
        <label className="cf-label">Status</label>
        <div className="cf-status-row">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={`cf-status-btn ${status === s ? 'cf-status-btn-active' : ''}`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="cf-actions">
        <Button type="submit" variant="primary" icon={Check} loading={saving} size="sm">
          {initial.id ? 'Save Changes' : 'Add Channel'}
        </Button>
        <Button type="button" variant="ghost" icon={X} size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { data: channelData, refetch } = useApi(() => distApi.channels(), []);
  const { execute: createCh, loading: creating } = useMutation((data) => distApi.createChannel(data));
  const { execute: updateCh, loading: updating } = useMutation((id, data) => distApi.updateChannel(id, data));
  const { execute: deleteCh } = useMutation((id) => distApi.deleteChannel(id));

  const [showAdd,    setShowAdd]    = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const channels = channelData?.data ?? [];

  const handleCreate = async (data) => {
    await createCh(data);
    setShowAdd(false);
    refetch();
  };

  const handleUpdate = async (id, data) => {
    await updateCh(id, data);
    setEditingId(null);
    refetch();
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteCh(id);
      refetch();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-settings">
      <SectionHeader
        title="Settings"
        subtitle="Manage your connected channels and distribution endpoints"
        action={
          <Button variant="primary" icon={Plus} size="sm" onClick={() => { setShowAdd(true); setEditingId(null); }}>
            Add Channel
          </Button>
        }
      />

      {/* Add Channel form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card padding="xl" className="settings-add-card">
              <h3 className="settings-form-title">New Channel</h3>
              <ChannelForm
                onSave={handleCreate}
                onCancel={() => setShowAdd(false)}
                saving={creating}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Channel list */}
      <Card padding="xl" className="settings-channels-card">
        <h3 className="settings-section-title">Connected Channels</h3>
        {channels.length === 0 ? (
          <div className="settings-empty">
            <Globe size={32} />
            <p>No channels yet. Add your first channel to start distributing content.</p>
          </div>
        ) : (
          <div className="settings-channel-list">
            {channels.map((ch, i) => {
              const meta  = platformMeta[ch.platform] ?? { color: 'var(--accent-primary)', icon: Globe, label: ch.platform };
              const Icon  = meta.icon;
              const isEditing = editingId === ch.id;

              return (
                <motion.div
                  key={ch.id}
                  className="settings-channel-row"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {isEditing ? (
                    <div className="settings-channel-edit-form">
                      <ChannelForm
                        initial={{ ...ch }}
                        onSave={(data) => handleUpdate(ch.id, data)}
                        onCancel={() => setEditingId(null)}
                        saving={updating}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="sch-icon" style={{ background: `${meta.color}18`, color: meta.color }}>
                        <Icon size={18} />
                      </div>
                      <div className="sch-info">
                        <span className="sch-name">{ch.name}</span>
                        <span className="sch-meta">
                          {ch.config?.handle && <span>{ch.config.handle}</span>}
                          {ch.config?.url    && <a href={ch.config.url} target="_blank" rel="noreferrer" className="sch-url">{ch.config.url}</a>}
                          {!ch.config?.handle && !ch.config?.url && <span className="sch-meta-empty">No handle configured</span>}
                        </span>
                      </div>
                      <Badge
                        variant={ch.status === 'active' ? 'success' : ch.status === 'paused' ? 'warning' : 'info'}
                        size="sm"
                      >
                        {ch.status}
                      </Badge>
                      <div className="sch-actions">
                        <button
                          className="sch-action-btn"
                          title="Edit"
                          onClick={() => { setEditingId(ch.id); setShowAdd(false); }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="sch-action-btn sch-action-delete"
                          title="Delete"
                          disabled={deletingId === ch.id}
                          onClick={() => handleDelete(ch.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
