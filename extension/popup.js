const API = 'http://localhost:3001/api';

// ── Trend signals (mirrors Signal.jsx) ────────────────────────────────────────
const SIGNALS = [
  { id:  1, topic: 'React 19 Features',    heat: 0.96, category: 'Frontend',    covered: false, color: 'hsl(175,80%,48%)' },
  { id:  2, topic: 'System Design Basics', heat: 0.92, category: 'Engineering', covered: false, color: 'hsl(35,95%,60%)' },
  { id: 15, topic: 'AI API Chatbot Build', heat: 0.90, category: 'AI',          covered: true,  color: 'hsl(50,90%,58%)' },
  { id:  3, topic: 'DSA Trees & Graphs',   heat: 0.88, category: 'DSA',         covered: true,  color: 'hsl(260,70%,65%)' },
  { id:  4, topic: 'TypeScript Generics',  heat: 0.83, category: 'Frontend',    covered: false, color: 'hsl(175,80%,48%)' },
  { id:  5, topic: 'LeetCode Patterns',    heat: 0.86, category: 'DSA',         covered: true,  color: 'hsl(260,70%,65%)' },
  { id: 13, topic: 'Framer Motion Guide',  heat: 0.74, category: 'Frontend',    covered: false, color: 'hsl(175,80%,48%)' },
  { id:  7, topic: 'Next.js App Router',   heat: 0.77, category: 'Frontend',    covered: false, color: 'hsl(175,80%,48%)' },
];

// ── State ─────────────────────────────────────────────────────────────────────
let selectedTone = 'Professional';
let capturedText = null;

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupTone();
  setupButtons();
  renderSignals();
  await checkConnection();
  loadRecent();
  loadCapturedText();
  loadPageRelevance();
});

// ── Connection check ──────────────────────────────────────────────────────────
async function checkConnection() {
  const dot = document.getElementById('status-indicator');
  try {
    const res = await fetch(`${API}/analytics/dashboard`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      dot.className = 'status-dot status-online';
      dot.title = 'Connected to ContentOps';
    } else throw new Error();
  } catch {
    dot.className = 'status-dot status-offline';
    dot.title = 'Backend offline — start your ContentOps server';
  }
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
function setupTabs() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('tab-active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.add('hidden'));
      btn.classList.add('tab-active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
    });
  });
}

// ── Tone selector ─────────────────────────────────────────────────────────────
function setupTone() {
  document.querySelectorAll('.tone-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tone-btn').forEach((b) => b.classList.remove('tone-active'));
      btn.classList.add('tone-active');
      selectedTone = btn.dataset.tone;
    });
  });
}

// ── Buttons ───────────────────────────────────────────────────────────────────
function setupButtons() {
  document.getElementById('btn-generate').addEventListener('click', handleGenerate);
  document.getElementById('btn-open-app').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:5173/app/studio' });
  });
  document.getElementById('capture-clear').addEventListener('click', () => {
    capturedText = null;
    document.getElementById('capture-banner').classList.add('hidden');
    document.getElementById('details').value = '';
  });
}

// ── Generate brief ────────────────────────────────────────────────────────────
async function handleGenerate() {
  const topic   = document.getElementById('topic').value.trim();
  const details = document.getElementById('details').value.trim();
  const errEl   = document.getElementById('brief-error');
  const okEl    = document.getElementById('brief-success');
  const btn     = document.getElementById('btn-generate');
  const label   = document.getElementById('btn-label');
  const spinner = document.getElementById('btn-spinner');

  errEl.classList.add('hidden');
  okEl.classList.add('hidden');

  if (!topic)   { showError('Topic is required.'); return; }
  if (!details) { showError('Add at least one key detail.'); return; }

  btn.disabled = true;
  label.classList.add('hidden');
  spinner.classList.remove('hidden');

  try {
    // 1 — Create brief
    const briefRes = await fetch(`${API}/briefs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, details, tone: selectedTone, channels: ['blog', 'social', 'faq'] }),
    });
    if (!briefRes.ok) throw new Error('Failed to create brief');
    const brief = await briefRes.json();

    // 2 — Kick off pipeline
    const runRes = await fetch(`${API}/pipeline/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ briefId: brief.data?.id ?? brief.id }),
    });
    if (!runRes.ok) throw new Error('Pipeline failed to start');

    okEl.textContent = '✓ Pipeline started! Open ContentOps to track progress.';
    okEl.classList.remove('hidden');
    document.getElementById('topic').value   = '';
    document.getElementById('details').value = '';

    // Refresh recent tab
    setTimeout(() => loadRecent(), 800);

  } catch (err) {
    showError(err.message.includes('fetch') ? 'Cannot reach backend. Is ContentOps running?' : err.message);
  } finally {
    btn.disabled = false;
    label.classList.remove('hidden');
    spinner.classList.add('hidden');
  }
}

function showError(msg) {
  const el = document.getElementById('brief-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

// ── Signals tab ───────────────────────────────────────────────────────────────
function renderSignals() {
  const container = document.getElementById('signals-list');
  container.innerHTML = SIGNALS.map((s, i) => `
    <div class="signal-row ${!s.covered ? 'signal-row-gap' : ''}"
         data-topic="${esc(s.topic)}" data-heat="${s.heat}">
      <span class="signal-rank">${String(i + 1).padStart(2, '0')}</span>
      <span class="signal-cat-dot" style="background:${s.color}"></span>
      <span class="signal-topic">${esc(s.topic)}</span>
      <div class="signal-bar-wrap">
        <div class="signal-bar" style="width:${Math.round(s.heat*100)}%;background:${s.color}"></div>
      </div>
      <span class="signal-heat-num">${Math.round(s.heat * 100)}</span>
      ${!s.covered ? '<span class="signal-gap-badge">GAP</span>' : ''}
    </div>
  `).join('');

  // Click a signal → switch to brief tab with topic prefilled
  container.querySelectorAll('.signal-row').forEach((row) => {
    row.addEventListener('click', () => {
      document.querySelector('[data-tab="capture"]').click();
      document.getElementById('topic').value = row.dataset.topic;
      document.getElementById('topic').focus();
    });
  });
}

// ── Recent runs ───────────────────────────────────────────────────────────────
async function loadRecent() {
  const container = document.getElementById('recent-list');
  try {
    const res = await fetch(`${API}/pipeline/runs?limit=5`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const runs = (json.data ?? json).slice(0, 5);

    if (!runs.length) {
      container.innerHTML = '<p class="empty-msg">No pipeline runs yet.<br/>Create your first brief above.</p>';
      return;
    }

    container.innerHTML = runs.map((r) => {
      const topic     = r.brief?.topic ?? r.topic ?? 'Untitled';
      const status    = r.status ?? 'unknown';
      const workspace = r.brief?.workspace ?? '';
      const time      = timeAgo(r.createdAt);
      const statusCls = `recent-status-${status === 'completed' ? 'completed' : status === 'running' ? 'running' : 'failed'}`;
      return `
        <div class="recent-row">
          <span class="recent-topic">${esc(topic)}</span>
          <div class="recent-meta">
            <span class="recent-status ${statusCls}">${status}</span>
            <span class="recent-time">${time}</span>
            ${workspace ? `<span class="recent-workspace">${esc(workspace)}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch {
    container.innerHTML = '<p class="empty-msg">Could not load runs.<br/>Make sure ContentOps server is running.</p>';
  }
}

// ── Captured text (from content script) ──────────────────────────────────────
function loadCapturedText() {
  chrome.storage.local.get(['captured_text', 'captured_url'], ({ captured_text, captured_url }) => {
    if (!captured_text) return;
    capturedText = captured_text;

    // Show banner
    const banner = document.getElementById('capture-banner');
    const src    = document.getElementById('capture-source');
    src.textContent = `From: ${captured_url || 'web page'}`;
    banner.classList.remove('hidden');

    // Prefill details
    const details = document.getElementById('details');
    details.value = captured_text.slice(0, 400);

    // Clear from storage
    chrome.storage.local.remove(['captured_text', 'captured_url']);
  });
}

// ── Page relevance bar ────────────────────────────────────────────────────────
function loadPageRelevance() {
  chrome.storage.local.get(['page_relevance'], ({ page_relevance: r }) => {
    if (!r) return;
    // Only show if the stored relevance is for the current tab and < 30s old
    const fresh = (Date.now() - r.ts) < 30_000;
    if (!fresh) return;

    const bar       = document.getElementById('page-relevance-bar');
    const dot       = document.getElementById('rel-bar-dot');
    const labelEl   = document.getElementById('rel-bar-label');
    const titleEl   = document.getElementById('rel-bar-title');
    const scoreEl   = document.getElementById('rel-bar-score');

    dot.style.background  = r.color;
    dot.style.boxShadow   = `0 0 6px ${r.color}`;
    labelEl.textContent   = r.label;
    labelEl.style.color   = r.color;
    titleEl.textContent   = r.title || 'Current page';
    scoreEl.textContent   = `${r.score > 0 ? '+' : ''}${r.score}`;
    bar.classList.remove('hidden');
  });

  // Also try to get fresh relevance from the active tab's content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) return;
    chrome.tabs.sendMessage(tabs[0].id, { type: 'get_relevance' }).catch(() => {});
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function timeAgo(iso) {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60)   return `${Math.round(s)}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400)return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}
