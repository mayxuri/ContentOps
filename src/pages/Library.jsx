import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, MessageSquare, HelpCircle, Check, Copy,
  Twitter, Linkedin, Instagram, Clock, ChevronDown, ChevronUp,
  BookOpen, Layers, Trash2,
} from 'lucide-react';
import { Card, Badge, Button, SectionHeader, Tabs } from '../components/UI';
import { useApi } from '../hooks/useApi';
import { pipeline as pipelineApi, briefs as briefsApi } from '../api/client';
import './Pages.css';

function timeAgo(iso) {
  if (!iso) return '–';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60)   return `${Math.round(s)}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

const outputTabs = [
  { id: 'blog',   label: 'Blog Post',    icon: FileText },
  { id: 'social', label: 'Social Media', icon: MessageSquare },
  { id: 'faq',    label: 'FAQ',          icon: HelpCircle },
];

function RunOutputs({ runId, initialOutputs }) {
  const { data: fetched, loading } = useApi(
    () => initialOutputs ? Promise.resolve(null) : pipelineApi.getRun(runId),
    [runId],
  );
  const run     = initialOutputs ? { outputs: initialOutputs } : fetched;
  const isLoading = !initialOutputs && loading;
  const [copied, setCopied] = useState(null);

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) return <div className="lib-loading">Loading outputs…</div>;
  if (!run)      return <div className="lib-loading">No data.</div>;

  const blogOutput    = run.outputs?.find((o) => o.format === 'blog');
  const socialOutputs = run.outputs?.filter((o) => o.format === 'social') ?? [];
  const faqOutput     = run.outputs?.find((o) => o.format === 'faq');
  const faqItems = (() => {
    if (!faqOutput?.body) return [];
    try { return JSON.parse(faqOutput.body); } catch { return []; }
  })();

  return (
    <div className="lib-outputs">
      <Tabs tabs={outputTabs}>
        {/* Blog */}
        <div className="output-content">
          {blogOutput ? (
            <>
              <div className="output-card-header">
                <div>
                  <h4>{blogOutput.title}</h4>
                  <div className="output-meta-row">
                    {blogOutput.metadata?.wordCount && <Badge variant="default" size="sm">{blogOutput.metadata.wordCount} words</Badge>}
                    {blogOutput.metadata?.tone      && <Badge variant="primary" size="sm">{blogOutput.metadata.tone}</Badge>}
                  </div>
                </div>
                <Button variant="ghost" size="sm" icon={copied === 'blog' ? Check : Copy} onClick={() => copyText(blogOutput.body, 'blog')}>
                  {copied === 'blog' ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="article-preview">
                {blogOutput.body.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </>
          ) : <p className="empty-hint">No blog post in this run.</p>}
        </div>

        {/* Social */}
        <div className="output-content">
          <div className="social-grid">
            {socialOutputs.length > 0 ? socialOutputs.map((variant, i) => {
              const platform = variant.metadata?.platform ?? (variant.title?.split(' - ').pop() ?? 'Social');
              const icons = { 'Twitter/X': Twitter, LinkedIn: Linkedin, Instagram };
              const Icon  = icons[platform] ?? MessageSquare;
              return (
                <Card key={variant.id ?? i} padding="lg" className="social-variant-card">
                  <div className="social-card-header">
                    <div className="social-platform"><Icon size={16} /> {platform}</div>
                    <Button variant="ghost" size="sm" icon={copied === `s-${i}` ? Check : Copy} onClick={() => copyText(variant.body, `s-${i}`)}>
                      {copied === `s-${i}` ? 'Copied' : ''}
                    </Button>
                  </div>
                  <p className="social-content">{variant.body}</p>
                  {variant.metadata?.hashtags && <p className="social-hashtags">{variant.metadata.hashtags}</p>}
                </Card>
              );
            }) : <p className="empty-hint">No social variants in this run.</p>}
          </div>
        </div>

        {/* FAQ */}
        <div className="output-content">
          <div className="faq-list">
            {faqItems.length > 0 ? faqItems.map((item, i) => (
              <motion.div key={i} className="faq-item" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <h4>{item.q}</h4>
                <p>{item.a}</p>
              </motion.div>
            )) : <p className="empty-hint">No FAQ in this run.</p>}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default function Library() {
  const [expandedRun, setExpandedRun] = useState(null);
  const [workspace,   setWorkspace]   = useState('');
  const [deletingId,  setDeletingId]  = useState(null);
  const [localRuns,   setLocalRuns]   = useState(null);

  const { data: runsData, loading } = useApi(() => pipelineApi.listRuns({ limit: 50 }), []);

  const sessionRuns = (() => {
    try { return JSON.parse(sessionStorage.getItem('library_runs') || '[]'); } catch { return []; }
  })();

  const apiRuns = runsData?.data ?? [];
  const runs = localRuns ?? (apiRuns.length > 0 ? apiRuns : sessionRuns);

  async function handleDelete(e, runId) {
    e.stopPropagation();
    if (!window.confirm('Delete this content item? This cannot be undone.')) return;
    setDeletingId(runId);
    const isLocal = runId.startsWith('local-');
    try {
      if (!isLocal) await pipelineApi.deleteRun(runId);
      const current = localRuns ?? runs;
      const next = current.filter((r) => r.id !== runId);
      setLocalRuns(next);
      if (isLocal) {
        try {
          const stored = JSON.parse(sessionStorage.getItem('library_runs') || '[]');
          sessionStorage.setItem('library_runs', JSON.stringify(stored.filter((r) => r.id !== runId)));
        } catch { /* ignore */ }
      }
      if (expandedRun === runId) setExpandedRun(null);
    } catch {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  // Filter by workspace name match in brief topic (since workspace is on brief)
  // Real workspace filtering happens via brief workspace field
  const filtered = workspace
    ? runs.filter((r) => r.brief?.workspace === workspace || r.brief?.topic?.toLowerCase().includes(workspace.toLowerCase()))
    : runs;

  return (
    <div className="page-library">
      <SectionHeader
        title="Content Library"
        subtitle="All generated content from past pipeline runs"
        action={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              className="lib-search"
              placeholder="Search by topic…"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
            />
          </div>
        }
      />

      {loading ? (
        <div className="lib-loading">Loading content…</div>
      ) : filtered.length === 0 ? (
        <Card padding="xl" className="lib-empty">
          <Layers size={36} />
          <h3>No content yet</h3>
          <p>Go to Content Studio and generate your first brief to see it here.</p>
        </Card>
      ) : (
        <div className="lib-run-list">
          {filtered.map((run, i) => {
            const isExpanded = expandedRun === run.id;
            const outputCount = run.steps?.filter((s) => s.status === 'completed').length ?? 0;

            return (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card padding="lg" className="lib-run-card">
                  <button
                    className="lib-run-header"
                    onClick={() => setExpandedRun(isExpanded ? null : run.id)}
                  >
                    <div className="lib-run-icon">
                      <BookOpen size={18} />
                    </div>
                    <div className="lib-run-info">
                      <span className="lib-run-topic">{run.brief?.topic ?? 'Untitled'}</span>
                      <span className="lib-run-meta">
                        <Clock size={11} /> {timeAgo(run.startedAt)}
                        {run.brief?.workspace && run.brief.workspace !== 'Personal' && (
                          <Badge variant="info" size="sm">{run.brief.workspace}</Badge>
                        )}
                      </span>
                    </div>
                    <div className="lib-run-badges">
                      <Badge variant={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'error' : 'warning'} size="sm">
                        {run.status}
                      </Badge>
                      {run.totalDurationS && (
                        <span className="lib-run-duration">{run.totalDurationS.toFixed(1)}s</span>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <button
                      className="lib-delete-btn"
                      onClick={(e) => handleDelete(e, run.id)}
                      disabled={deletingId === run.id}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <RunOutputs runId={run.id} initialOutputs={run.id.startsWith('local-') ? run.outputs : null} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
