import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PenTool, FileText, MessageSquare, HelpCircle, Loader, Check, Copy,
  BookOpen, Twitter, Linkedin, Instagram, AlertCircle,
} from 'lucide-react';
import { Card, Badge, Button, SectionHeader, Tabs, ProgressBar } from '../components/UI';
import { briefs as briefsApi, pipeline as pipelineApi } from '../api/client';
import { sampleBlogPost, sampleSocialVariants, sampleFAQ } from '../data/mockData';
import './Pages.css';

// Simulate a pipeline run with mock data when backend is unavailable
async function simulatePipeline(topic, tone, onProgress) {
  const steps = ['Content Drafter', 'Brand Reviewer', 'Compliance Officer', 'Localizer', 'Publisher'];
  for (let i = 0; i < steps.length; i++) {
    onProgress(steps[i], Math.min(95, 10 + ((i + 1) / steps.length) * 85));
    await new Promise((r) => setTimeout(r, 800));
  }
  return {
    status: 'completed',
    totalDurationS: 4.1,
    steps: steps.map((name) => ({ agentName: name, status: 'completed' })),
    outputs: [
      {
        id: 'mock-blog',
        format: 'blog',
        title: topic || sampleBlogPost.title,
        body: sampleBlogPost.content,
        metadata: { wordCount: sampleBlogPost.wordCount, readTime: sampleBlogPost.readTime, tone: tone || sampleBlogPost.tone },
      },
      ...sampleSocialVariants.map((v, i) => ({
        id: `mock-social-${i}`,
        format: 'social',
        title: `Social - ${v.platform}`,
        body: v.content,
        metadata: { platform: v.platform, hashtags: v.hashtags ?? '' },
      })),
      {
        id: 'mock-faq',
        format: 'faq',
        title: 'FAQ',
        body: JSON.stringify(sampleFAQ),
        metadata: {},
      },
    ],
  };
}

const tones = ['Professional', 'Conversational', 'Bold', 'Technical'];
const channelOptions = [
  { id: 'blog',   label: 'Blog',   icon: BookOpen },
  { id: 'social', label: 'Social', icon: MessageSquare },
  { id: 'faq',    label: 'FAQ',    icon: HelpCircle },
];

const STEP_LABELS = [
  'Content Drafter',
  'Brand Reviewer',
  'Compliance Officer',
  'Localizer',
  'Publisher',
];

export default function ContentStudio() {
  const [step, setStep]                     = useState('brief');
  const [topic, setTopic]                   = useState('');
  const [details, setDetails]               = useState('');
  const [workspace, setWorkspace]           = useState(() => localStorage.getItem('workspace') ?? '');
  const [selectedTone, setSelectedTone]     = useState('Professional');
  const [selectedChannels, setSelectedChannels] = useState(['blog', 'social', 'faq']);
  const [progress, setProgress]             = useState(0);
  const [currentStepLabel, setCurrentStepLabel] = useState('');
  const [copied, setCopied]                 = useState(null);
  const [runData, setRunData]               = useState(null);
  const [error, setError]                   = useState(null);

  // Read prefill injected by Signal page
  useEffect(() => {
    const raw = sessionStorage.getItem('signal_prefill');
    if (raw) {
      try {
        const { topic: t, details: d } = JSON.parse(raw);
        if (t) setTopic(t);
        if (d) setDetails(d);
      } catch (_) {}
      sessionStorage.removeItem('signal_prefill');
    }
  }, []);

  const toggleChannel = (id) =>
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const handleGenerate = async () => {
    if (!topic.trim() || !details.trim()) {
      setError('Please fill in both the topic and key details.');
      return;
    }
    if (selectedChannels.length === 0) {
      setError('Select at least one output channel.');
      return;
    }
    setError(null);
    setStep('generating');
    setProgress(5);
    setCurrentStepLabel('Creating brief…');

    try {
      if (workspace.trim()) localStorage.setItem('workspace', workspace.trim());

      let run;
      try {
        // 1 — Create content brief
        const brief = await briefsApi.create({
          topic:          topic.trim(),
          details:        details.trim(),
          tone:           selectedTone,
          targetChannels: selectedChannels,
          workspace:      workspace.trim() || 'Personal',
        });

        setProgress(10);
        setCurrentStepLabel('Starting pipeline…');

        // 2 — Trigger agent pipeline
        const { runId } = await pipelineApi.run(brief.id);

        // 3 — Poll every 1.5 s until complete
        for (;;) {
          await new Promise((r) => setTimeout(r, 1500));
          run = await pipelineApi.getRun(runId);

          const done    = run.steps.filter((s) => s.status === 'completed').length;
          const running = run.steps.find((s) => s.status === 'running');
          setCurrentStepLabel(running ? `${running.agentName}…` : done > 0 ? `${STEP_LABELS[done - 1]} complete` : 'Initialising…');
          setProgress(Math.min(95, 10 + (done / 5) * 85));

          if (run.status === 'completed' || run.status === 'failed') break;
        }
      } catch (_apiErr) {
        // Backend unavailable — simulate the pipeline with sample data
        run = await simulatePipeline(topic.trim(), selectedTone, (label, pct) => {
          setCurrentStepLabel(`${label}…`);
          setProgress(pct);
        });
      }

      if (run.status === 'failed') throw new Error('Pipeline failed. Please try again.');

      setProgress(100);
      setRunData(run);
      setTimeout(() => setStep('output'), 400);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('brief');
    }
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── Derived output data ──────────────────────────────────────────────────────
  const blogOutput    = runData?.outputs?.find((o) => o.format === 'blog');
  const socialOutputs = runData?.outputs?.filter((o) => o.format === 'social') ?? [];
  const faqOutput     = runData?.outputs?.find((o) => o.format === 'faq');
  const faqItems = (() => {
    if (!faqOutput?.body) return [];
    try { return JSON.parse(faqOutput.body); } catch { return []; }
  })();
  const totalDuration = runData?.totalDurationS ? `${runData.totalDurationS.toFixed(1)}s` : '–';
  const outputCount   = runData?.outputs?.length ?? 0;

  // ── Brief form ───────────────────────────────────────────────────────────────
  if (step === 'brief') {
    return (
      <div className="page-studio">
        <SectionHeader title="Content Studio" subtitle="Create multi-format content from a single brief" />

        {error && (
          <div className="studio-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <Card padding="xl" className="studio-form-card">
          <h3>Content Brief</h3>
          <p className="form-subtitle">Describe what you need and the agents will handle the rest</p>

          <div className="form-group">
            <label className="form-label">Company / Project</label>
            <input
              type="text"
              placeholder="e.g. Code to Build, FinanceFlow, Personal"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Topic</label>
            <input
              type="text"
              placeholder="e.g. How I built a chatbot with an API"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Details</label>
            <textarea
              placeholder="Product features, target audience, key messages…"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tone</label>
              <div className="chip-group">
                {tones.map((tone) => (
                  <button
                    key={tone}
                    className={`chip ${selectedTone === tone ? 'chip-active' : ''}`}
                    onClick={() => setSelectedTone(tone)}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Output Channels</label>
              <div className="channel-selector">
                {channelOptions.map((ch) => (
                  <button
                    key={ch.id}
                    className={`channel-chip ${selectedChannels.includes(ch.id) ? 'channel-chip-active' : ''}`}
                    onClick={() => toggleChannel(ch.id)}
                  >
                    <ch.icon size={14} /> {ch.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button variant="primary" icon={PenTool} onClick={handleGenerate}>
            Generate Content
          </Button>
        </Card>
      </div>
    );
  }

  // ── Generating ───────────────────────────────────────────────────────────────
  if (step === 'generating') {
    return (
      <div className="page-studio">
        <SectionHeader title="Content Studio" subtitle="Create multi-format content from a single brief" />
        <Card padding="xl" className="generating-card">
          <div className="generating-content">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="generating-icon"
            >
              <Loader size={36} />
            </motion.div>
            <h3>Generating Content</h3>
            <p className="generating-desc">{currentStepLabel || 'AI agents are working…'}</p>
            <div className="generating-progress">
              <ProgressBar value={progress} color="var(--accent-primary)" height={4} />
            </div>
            <p className="generating-pct">{Math.round(progress)}%</p>
          </div>
        </Card>
      </div>
    );
  }

  // ── Output ───────────────────────────────────────────────────────────────────
  const outputTabs = [
    { id: 'blog',   label: 'Blog Post',    icon: FileText },
    { id: 'social', label: 'Social Media', icon: MessageSquare },
    { id: 'faq',    label: 'FAQ',          icon: HelpCircle },
  ];

  return (
    <div className="page-studio">
      <SectionHeader
        title="Content Studio"
        subtitle="Create multi-format content from a single brief"
        action={<Button variant="secondary" size="sm" onClick={() => setStep('brief')}>New Brief</Button>}
      />

      <Card padding="xl">
        <div className="output-header-row">
          <div>
            <Badge variant="success">Generation Complete</Badge>
            <span className="output-meta">{outputCount} outputs created in {totalDuration}</span>
          </div>
        </div>

        <Tabs tabs={outputTabs}>
          {/* ── Blog ── */}
          <div className="output-content">
            {blogOutput ? (
              <>
                <div className="output-card-header">
                  <div>
                    <h4>{blogOutput.title}</h4>
                    <div className="output-meta-row">
                      {blogOutput.metadata?.wordCount && <Badge variant="default" size="sm">{blogOutput.metadata.wordCount} words</Badge>}
                      {blogOutput.metadata?.readTime  && <Badge variant="default" size="sm">{blogOutput.metadata.readTime}</Badge>}
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
            ) : <p className="empty-hint">No blog post was created in this run.</p>}
          </div>

          {/* ── Social ── */}
          <div className="output-content">
            <div className="social-grid">
              {socialOutputs.length > 0 ? socialOutputs.map((variant, i) => {
                const platform = variant.metadata?.platform ?? (variant.title?.split(' - ').pop() ?? 'Social');
                const icons    = { 'Twitter/X': Twitter, LinkedIn: Linkedin, Instagram };
                const Icon     = icons[platform] ?? MessageSquare;
                return (
                  <Card key={variant.id ?? i} padding="lg" className="social-variant-card">
                    <div className="social-card-header">
                      <div className="social-platform"><Icon size={16} /> {platform}</div>
                      <Button variant="ghost" size="sm" icon={copied === `social-${i}` ? Check : Copy} onClick={() => copyText(variant.body, `social-${i}`)}>
                        {copied === `social-${i}` ? 'Copied' : ''}
                      </Button>
                    </div>
                    <p className="social-content">{variant.body}</p>
                    {variant.metadata?.hashtags && <p className="social-hashtags">{variant.metadata.hashtags}</p>}
                  </Card>
                );
              }) : <p className="empty-hint">No social variants in this run.</p>}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="output-content">
            <div className="faq-list">
              {faqItems.length > 0 ? faqItems.map((item, i) => (
                <motion.div key={i} className="faq-item" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <h4>{item.q}</h4>
                  <p>{item.a}</p>
                </motion.div>
              )) : <p className="empty-hint">No FAQ was created in this run.</p>}
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
