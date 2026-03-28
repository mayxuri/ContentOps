import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Minimize2 } from 'lucide-react';
import './Muse.css';

// ── Contextual response engine ─────────────────────────────────────────────
const RESPONSES = [
  {
    match: /brief|topic|write|generate|create/i,
    reply: "Head to Content Studio and drop your topic, tone, and key details. The pipeline picks it up from there — Drafter → Reviewer → Compliance → Localizer → Publisher. Usually done in under a minute.",
  },
  {
    match: /compliance|violation|flag|legal|regulation/i,
    reply: "The Compliance page shows every flagged issue with the exact sentence and a suggested rewrite. You can resolve or dismiss each one. The engine runs automatically as part of every pipeline run.",
  },
  {
    match: /signal|trend|gap|radar/i,
    reply: "Signal is your content radar. It shows trending topics by heat score and marks gaps — topics your niche is searching for that you haven't covered yet. Click any signal to prefill a brief instantly.",
  },
  {
    match: /analytics|performance|engagement|stats/i,
    reply: "Analytics breaks down output volume, compliance rate, channel performance, and engagement trends. Check the Content Mix chart to see which formats are working best.",
  },
  {
    match: /distribut|channel|publish|schedule/i,
    reply: "Go to Distribution to configure your channels and schedule posts. Supports blog, social, email, and more. Each pipeline run auto-formats content per channel.",
  },
  {
    match: /local|translat|language|region/i,
    reply: "Localization runs after the Compliance step. The Localizer agent adapts content across 14 languages — it's not just translation, it adjusts cultural references too. Check per-language quality scores in the Localization tab.",
  },
  {
    match: /library|history|past|previous|delete/i,
    reply: "Everything generated is saved in the Content Library. You can search by topic, expand any run to see the full outputs (blog, social variants, FAQ), copy the text, or delete runs you no longer need.",
  },
  {
    match: /pipeline|agent|step|run|status/i,
    reply: "The Pipeline page shows every run in real time — each agent step, its duration, and status. Click a run to see the full step breakdown. Failed steps are highlighted with the error reason.",
  },
  {
    match: /extension|chrome|browser|dot/i,
    reply: "The ContentOps Chrome extension marks content relevance inline on any page — green dots for on-topic, red for off-topic. Works on YouTube thumbnails, Google results, and news headlines. Load it from the `extension/` folder in dev mode.",
  },
  {
    match: /plan|pro|price|pricing|upgrade|starter|enterprise/i,
    reply: "You're on the Pro plan — all agents, unlimited runs, Signal radar, and the Chrome extension are unlocked. Enterprise adds custom agent training, SSO, and API access. Check the landing page pricing section for a full comparison.",
  },
  {
    match: /hello|hi|hey|what can|help/i,
    reply: "I'm Muse — your ContentOps assistant. Ask me about writing briefs, understanding pipeline steps, reading your analytics, finding content gaps, or anything else in the platform.",
  },
];

const FALLBACK = "I can help with briefs, pipeline runs, compliance, localization, analytics, distribution, and the Signal radar. What are you working on?";

function getReply(input) {
  const match = RESPONSES.find((r) => r.match.test(input));
  return match ? match.reply : FALLBACK;
}

// ── Component ──────────────────────────────────────────────────────────────
let msgId = 0;

const GREETING = {
  id: ++msgId,
  role: 'muse',
  text: "Hey — I'm Muse, your ContentOps assistant. Ask me anything about briefs, pipeline runs, signals, analytics, or any part of the platform.",
  ts: new Date(),
};

export default function Muse() {
  const [open,     setOpen]     = useState(false);
  const [input,    setInput]    = useState('');
  const [messages, setMessages] = useState([GREETING]);
  const [typing,   setTyping]   = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: ++msgId, role: 'user', text, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = getReply(text);
      setTyping(false);
      setMessages((prev) => [...prev, { id: ++msgId, role: 'muse', text: reply, ts: new Date() }]);
    }, 700 + Math.random() * 400);
  }

  function fmt(ts) {
    return ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="muse-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Corner decorations */}
            <div className="muse-corner muse-corner-tl" />
            <div className="muse-corner muse-corner-br" />

            {/* Header */}
            <div className="muse-header">
              <div className="muse-header-identity">
                <div className="muse-avatar">
                  <Sparkles size={14} />
                </div>
                <div>
                  <div className="muse-name">Muse</div>
                  <div className="muse-status">
                    <span className="muse-status-dot" />
                    ContentOps AI
                  </div>
                </div>
              </div>
              <button className="muse-close" onClick={() => setOpen(false)} title="Close">
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="muse-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`muse-msg muse-msg-${msg.role}`}>
                  {msg.role === 'muse' && (
                    <div className="muse-msg-avatar"><Sparkles size={10} /></div>
                  )}
                  <div className="muse-msg-bubble">
                    <p>{msg.text}</p>
                    <span className="muse-msg-time">{fmt(msg.ts)}</span>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="muse-msg muse-msg-muse">
                  <div className="muse-msg-avatar"><Sparkles size={10} /></div>
                  <div className="muse-msg-bubble muse-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form className="muse-input-row" onSubmit={send}>
              <input
                ref={inputRef}
                className="muse-input"
                placeholder="Ask Muse anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
              />
              <button className="muse-send" type="submit" disabled={!input.trim()}>
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB trigger ── */}
      <motion.button
        className={`muse-fab ${open ? 'muse-fab-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        title="Muse — ContentOps AI"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Minimize2 size={20} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sparkles size={20} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && <span className="muse-fab-label">Muse</span>}
      </motion.button>
    </>
  );
}
