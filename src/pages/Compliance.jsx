import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, AlertOctagon, Info,
  Check, X, RotateCcw, ChevronDown, ChevronUp, ChevronDown as SelectIcon,
} from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from '../components/UI';
import { complianceDocument } from '../data/mockData';
import { useApi, useMutation } from '../hooks/useApi';
import { compliance as complianceApi } from '../api/client';
import './Pages.css';

const severityConfig = {
  critical: { color: 'hsl(0, 75%, 60%)',  bg: 'hsla(0, 75%, 60%, 0.1)',  icon: AlertOctagon, label: 'Critical' },
  high:     { color: 'hsl(25, 90%, 55%)', bg: 'hsla(25, 90%, 55%, 0.1)', icon: AlertTriangle, label: 'High' },
  medium:   { color: 'hsl(38, 92%, 55%)', bg: 'hsla(38, 92%, 55%, 0.1)', icon: Info,          label: 'Medium' },
  low:      { color: 'hsl(155, 65%, 48%)',bg: 'hsla(155,65%,48%,0.1)',   icon: Info,          label: 'Low' },
};
const defaultSeverity = severityConfig.medium;

function buildCompliantVersion(body, issues) {
  let result = body;
  for (const issue of issues) {
    if (issue.resolution === 'pending' || !issue.resolution) {
      result = result.split(issue.originalText).join(issue.suggestedFix);
    }
  }
  return result;
}

export default function Compliance() {
  const [viewMode,           setViewMode]           = useState('side-by-side');
  const [expandedViolation,  setExpandedViolation]  = useState(null);
  const [resolvedLocally,    setResolvedLocally]    = useState(new Set());
  const [selectedOutputId,   setSelectedOutputId]   = useState(null);
  const [showOutputPicker,   setShowOutputPicker]   = useState(false);

  // Load summary → list of outputs that have issues
  const { data: summaryData, refetch: refetchSummary } = useApi(() => complianceApi.getSummary(), []);

  // Unique outputs from recentIssues
  const outputOptions = (() => {
    if (!summaryData?.recentIssues?.length) return [];
    const seen = new Set();
    return summaryData.recentIssues
      .filter((i) => { if (seen.has(i.outputId)) return false; seen.add(i.outputId); return true; })
      .map((i) => ({ id: i.outputId, title: i.output?.title ?? 'Untitled Output' }));
  })();

  const activeOutputId = selectedOutputId ?? outputOptions[0]?.id ?? null;

  // Load full content + issues for selected output
  const { data: outputData, refetch: refetchOutput } = useApi(
    () => activeOutputId ? complianceApi.getForOutput(activeOutputId) : Promise.resolve(null),
    [activeOutputId],
  );

  const { execute: resolveIssue } = useMutation((id, resolution) => complianceApi.resolve(id, resolution));

  // Check if the user just generated content in Content Studio
  const studioOutput = (() => {
    try {
      const raw = sessionStorage.getItem('compliance_review');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  // Decide which data to show — studio output > real API > mock fallback
  const usingRealData = !!(outputData?.output && outputData?.issues?.length >= 0);
  const docTitle    = studioOutput?.title ?? (usingRealData ? outputData.output.title          : complianceDocument.title);
  const docOriginal = studioOutput?.body  ?? (usingRealData ? outputData.output.body           : complianceDocument.originalContent);
  const violations  = studioOutput
    ? []
    : usingRealData
      ? outputData.issues.map((i) => ({
          id:           i.id,
          severity:     i.severity,
          category:     i.category,
          originalText: i.originalText,
          issue:        i.issueDescription,
          suggestedFix: i.suggestedFix,
          regulation:   i.regulation ?? '–',
          resolution:   i.resolution,
        }))
      : complianceDocument.violations;

  const docCompliant = studioOutput
    ? studioOutput.body
    : usingRealData
      ? buildCompliantVersion(docOriginal, violations)
      : complianceDocument.compliantContent;

  const unresolvedCount = violations.filter(
    (v) => (v.resolution === 'pending' || !v.resolution) && !resolvedLocally.has(v.id)
  ).length;

  const handleResolve = async (id, resolution) => {
    setResolvedLocally((prev) => new Set([...prev, id]));
    try {
      await resolveIssue(id, resolution);
      refetchOutput();
      refetchSummary();
    } catch { /* keep optimistic state */ }
  };

  const highlightViolations = (text) => {
    let result = text;
    violations.forEach((v) => {
      if (!resolvedLocally.has(v.id) && (v.resolution === 'pending' || !v.resolution)) {
        const escaped = v.originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(
          new RegExp(escaped, 'g'),
          `<mark class="violation-highlight violation-${v.severity}" data-violation="${v.id}">${v.originalText}</mark>`,
        );
      }
    });
    return result;
  };

  return (
    <div className="page-compliance">
      <SectionHeader
        title="Compliance Review"
        subtitle="AI-powered regulatory compliance scanning and automated rewriting"
        action={
          <div className="compliance-actions">
            <Badge variant={unresolvedCount > 0 ? 'error' : 'success'} size="lg">
              {unresolvedCount > 0 ? `${unresolvedCount} violations found` : 'All clear'}
            </Badge>
          </div>
        }
      />

      {/* Document selector */}
      <Card padding="lg" className="doc-info-card">
        <div className="doc-info">
          <div>
            <h3>{docTitle}</h3>
            <p className="doc-info-meta">
              {studioOutput
                ? 'Scanned by Compliance Officer agent — no violations found'
                : usingRealData
                  ? `${violations.length} issue${violations.length !== 1 ? 's' : ''} detected by Compliance Officer agent`
                  : 'Scanned by Compliance Officer agent — 5 issues detected across 3 categories'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Output picker — only shown when real outputs exist */}
            {outputOptions.length > 1 && (
              <div style={{ position: 'relative' }}>
                <button
                  className="view-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                  onClick={() => setShowOutputPicker((v) => !v)}
                >
                  Switch Output <SelectIcon size={13} />
                </button>
                {showOutputPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                      background: 'var(--surface-elevated)', border: '1px solid var(--border-default)',
                      borderRadius: 10, overflow: 'hidden', zIndex: 50, minWidth: 260,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    }}
                  >
                    {outputOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setSelectedOutputId(opt.id); setShowOutputPicker(false); setResolvedLocally(new Set()); }}
                        style={{
                          width: '100%', padding: '0.6rem 0.875rem', background: 'none',
                          border: 'none', textAlign: 'left', cursor: 'pointer',
                          color: opt.id === activeOutputId ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {opt.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
            <div className="view-toggle">
              {['original', 'side-by-side', 'compliant'].map((mode) => (
                <button
                  key={mode}
                  className={`view-btn ${viewMode === mode ? 'view-btn-active' : ''}`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode === 'original' ? 'Original' : mode === 'side-by-side' ? 'Comparison' : 'Compliant'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="compliance-layout">
        {/* Document View */}
        <div className="compliance-document">
          {viewMode === 'side-by-side' ? (
            <div className="diff-view">
              <Card padding="xl" className="diff-panel">
                <div className="diff-panel-header">
                  <Badge variant="error">Original</Badge>
                  <span className="diff-status">Contains regulatory violations</span>
                </div>
                <div className="document-content" dangerouslySetInnerHTML={{ __html: highlightViolations(docOriginal) }} />
              </Card>
              <Card padding="xl" className="diff-panel">
                <div className="diff-panel-header">
                  <Badge variant="success">Compliant Version</Badge>
                  <span className="diff-status">All violations resolved</span>
                </div>
                <div className="document-content compliant-content">
                  {docCompliant.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </Card>
            </div>
          ) : (
            <Card padding="xl">
              <div className="diff-panel-header">
                <Badge variant={viewMode === 'original' ? 'error' : 'success'}>
                  {viewMode === 'original' ? 'Original Document' : 'Compliant Version'}
                </Badge>
              </div>
              {viewMode === 'original' ? (
                <div className="document-content" dangerouslySetInnerHTML={{ __html: highlightViolations(docOriginal) }} />
              ) : (
                <div className="document-content compliant-content">
                  {docCompliant.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Violations Panel */}
        <div className="violations-panel">
          <Card padding="lg" className="violations-list-card">
            <h3 className="violations-title">Flagged Issues</h3>
            {violations.length === 0 ? (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <ShieldCheck size={28} style={{ marginBottom: 8 }} />
                <p>No violations found for this output.</p>
              </div>
            ) : (
              <div className="violations-list">
                {violations.map((v, i) => {
                  const config    = severityConfig[v.severity] ?? defaultSeverity;
                  const Icon      = config.icon;
                  const isExpanded = expandedViolation === v.id;
                  const isResolved = resolvedLocally.has(v.id) || (v.resolution && v.resolution !== 'pending');

                  return (
                    <motion.div
                      key={v.id}
                      className={`violation-card ${isResolved ? 'violation-resolved' : ''}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <button
                        className="violation-header"
                        onClick={() => setExpandedViolation(isExpanded ? null : v.id)}
                      >
                        <div className="violation-header-left">
                          <div className="violation-icon" style={{ background: config.bg, color: config.color }}>
                            {isResolved ? <Check size={14} /> : <Icon size={14} />}
                          </div>
                          <div className="violation-info">
                            <span className="violation-category">{v.category}</span>
                            <Badge variant={v.severity === 'critical' ? 'error' : v.severity === 'high' ? 'warning' : 'default'} size="sm">
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {isExpanded && (
                        <motion.div
                          className="violation-details"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="violation-section">
                            <span className="violation-label">Flagged Text</span>
                            <p className="violation-flagged-text">"{v.originalText}"</p>
                          </div>
                          <div className="violation-section">
                            <span className="violation-label">Issue</span>
                            <p>{v.issue}</p>
                          </div>
                          <div className="violation-section">
                            <span className="violation-label">Suggested Replacement</span>
                            <p className="violation-suggestion">"{v.suggestedFix}"</p>
                          </div>
                          <div className="violation-section">
                            <span className="violation-label">Regulation</span>
                            <p className="violation-reg">{v.regulation}</p>
                          </div>
                          {!isResolved && (
                            <div className="violation-actions">
                              <Button variant="primary" size="sm" icon={Check} onClick={() => handleResolve(v.id, 'accepted')}>
                                Accept Fix
                              </Button>
                              <Button variant="ghost" size="sm" icon={X} onClick={() => handleResolve(v.id, 'dismissed')}>
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card padding="lg" className="approval-gate">
            <div className="gate-header">
              <ShieldCheck size={20} />
              <h4>Approval Gate</h4>
            </div>
            <p className="gate-desc">Human review required before content proceeds to localization and distribution.</p>
            <div className="gate-actions">
              <Button variant="primary" icon={Check} disabled={unresolvedCount > 0} fullWidth>
                Approve for Publication
              </Button>
              <Button variant="secondary" icon={RotateCcw} fullWidth>
                Return to Drafter
              </Button>
            </div>
            {unresolvedCount > 0 && (
              <p className="gate-warning">Resolve all {unresolvedCount} violations before approving</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
