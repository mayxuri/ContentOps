import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, PenTool, Shield, Globe, Send, BarChart3,
  Zap, ChevronRight, Eye, Users, TrendingUp, ShieldCheck,
  Activity,
} from 'lucide-react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import './Landing.css';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const featureColors = [
  { color: 'hsl(250, 85%, 67%)', bg: 'hsla(250, 85%, 67%, 0.1)' },
  { color: 'hsl(155, 65%, 48%)', bg: 'hsla(155, 65%, 48%, 0.1)' },
  { color: 'hsl(185, 70%, 50%)', bg: 'hsla(185, 70%, 50%, 0.1)' },
  { color: 'hsl(35, 90%, 58%)', bg: 'hsla(35, 90%, 58%, 0.1)' },
  { color: 'hsl(210, 75%, 58%)', bg: 'hsla(210, 75%, 58%, 0.1)' },
  { color: 'hsl(300, 60%, 60%)', bg: 'hsla(300, 60%, 60%, 0.1)' },
];

const agentData = [
  { icon: PenTool, name: 'Content Drafter', desc: 'Generates content from briefs', time: '12s avg', color: 'hsl(250, 85%, 67%)' },
  { icon: Eye, name: 'Brand Reviewer', desc: 'Checks tone and brand alignment', time: '4s avg', color: 'hsl(185, 70%, 50%)' },
  { icon: Shield, name: 'Compliance Officer', desc: 'Scans for regulatory violations', time: '3s avg', color: 'hsl(0, 70%, 58%)' },
  { icon: Globe, name: 'Localizer', desc: 'Translates and adapts for regions', time: '18s avg', color: 'hsl(35, 90%, 58%)' },
  { icon: Send, name: 'Publisher', desc: 'Distributes across all channels', time: '2s avg', color: 'hsl(210, 75%, 58%)' },
];

const previewKpis = [
  { label: 'Content', value: '1,284', color: 'hsl(250,85%,67%)' },
  { label: 'Compliance', value: '98.7%', color: 'hsl(155,65%,48%)' },
  { label: 'Languages', value: '14', color: 'hsl(185,70%,50%)' },
  { label: 'Channels', value: '8', color: 'hsl(35,90%,58%)' },
];

const previewBars = [45, 68, 52, 78, 62, 88, 74];

const previewActivity = [
  { color: 'hsl(155,65%,48%)', text: 'Blog post generated' },
  { color: 'hsl(0,70%,58%)', text: 'Compliance flagged' },
  { color: 'hsl(185,70%,50%)', text: 'Translated to 6 langs' },
];

const heroStats = [
  { num: '5', label: 'AI Agents', color: 'hsl(250,85%,67%)' },
  { num: '14', label: 'Languages', color: 'hsl(185,70%,50%)' },
  { num: '8', label: 'Channels', color: 'hsl(35,90%,58%)' },
  { num: '98.7%', label: 'Compliance', color: 'hsl(155,65%,48%)' },
];

function ProductPreview() {
  return (
    <div className="hero-preview">
      {/* Browser chrome */}
      <div className="preview-chrome">
        <div className="preview-chrome-dots">
          <span style={{ background: '#ff5f57' }} />
          <span style={{ background: '#febc2e' }} />
          <span style={{ background: '#28c840' }} />
        </div>
        <div className="preview-chrome-url">contentops.ai/app</div>
        <div className="preview-live-pill">
          <span className="preview-live-dot" />
          Live
        </div>
      </div>

      {/* KPI row */}
      <div className="preview-kpi-row">
        {previewKpis.map((kpi) => (
          <div key={kpi.label} className="preview-kpi">
            <div className="preview-kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="preview-kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + activity */}
      <div className="preview-lower">
        <div className="preview-chart">
          <div className="preview-section-title">Content Output</div>
          <div className="preview-bars">
            {previewBars.map((h, i) => (
              <div
                key={i}
                className="preview-bar"
                style={{
                  height: `${h}%`,
                  background: i % 2 === 0 ? 'hsl(250,85%,67%)' : 'hsl(185,70%,50%)',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="preview-feed">
          <div className="preview-section-title">Pipeline</div>
          {previewActivity.map((item, i) => (
            <div key={i} className="preview-act-row">
              <span className="preview-act-dot" style={{ background: item.color }} />
              <span className="preview-act-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="preview-footer-pill">
        <span className="preview-pulse-dot" />
        <span>5 agents active</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="landing-page">
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-inner">
          {/* Left: text */}
          <div className="hero-left">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Activity size={12} />
              AI-Powered Content Operations
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Enterprise content,
              <br />
              <span className="hero-gradient-text">automated end to end.</span>
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              From draft to distribution in minutes, not weeks. Our multi-agent AI system
              handles creation, compliance review, localization, and publishing across every channel.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Link to="/app" className="hero-btn hero-btn-primary">
                Open Platform <ArrowRight size={16} />
              </Link>
              <a href="#features" className="hero-btn hero-btn-secondary">
                How it works <ChevronRight size={16} />
              </a>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {heroStats.flatMap((stat, i) => [
                i > 0 ? <div key={`sep-${i}`} className="hero-stat-divider" /> : null,
                <div key={stat.label} className="hero-stat">
                  <span className="stat-number" style={{ color: stat.color }}>{stat.num}</span>
                  <span className="stat-desc">{stat.label}</span>
                </div>,
              ]).filter(Boolean)}
            </motion.div>
          </div>

          {/* Right: product preview */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.55, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-preview-glow" />
            <ProductPreview />
          </motion.div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section section-about" id="about">
        <div className="section-inner">
          <motion.div {...fadeUp} className="about-content">
            <h2 className="section-label">About ContentOps</h2>
            <h3 className="about-heading">
              We build intelligent systems that transform how enterprises create and manage content.
            </h3>
            <p className="about-text">
              ContentOps is an AI-native platform purpose-built for enterprise content operations.
              We replace fragmented workflows — scattered across writing tools, review chains,
              translation services, and publishing dashboards — with a single, intelligent system
              powered by specialized AI agents that coordinate seamlessly.
            </p>
            <p className="about-text">
              Our platform reduces content cycle time from weeks to minutes while maintaining
              full regulatory compliance, brand consistency, and cultural accuracy
              across every market you serve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" id="features">
        <div className="section-inner">
          <motion.div {...fadeUp} className="section-header-center">
            <h2 className="section-label">Capabilities</h2>
            <h3 className="section-title">Everything your content team needs</h3>
            <p className="section-desc">
              A complete pipeline from content brief to multi-channel publication, with AI handling
              the heavy lifting at every stage.
            </p>
          </motion.div>

          <div className="features-grid">
            {[
              { icon: PenTool, title: 'AI Content Draft', desc: 'Generate blog posts, social media, FAQs, and sales collateral from a single brief.' },
              { icon: ShieldCheck, title: 'Compliance Review', desc: 'Automatic regulatory scanning catches violations and suggests compliant alternatives.' },
              { icon: Globe, title: 'Localization', desc: 'Translate and culturally adapt content across 14 languages with quality scoring.' },
              { icon: Send, title: 'Multi-Channel Distribution', desc: 'Publish to blogs, social platforms, email, and more with channel-specific formatting.' },
              { icon: BarChart3, title: 'Performance Analytics', desc: 'Track engagement, spot patterns, and get AI-driven strategy recommendations.' },
              { icon: Users, title: 'Human-in-the-Loop', desc: 'Approval gates at every stage ensure human oversight without slowing the pipeline.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                style={{ '--feature-color': featureColors[i].color }}
                {...stagger}
                transition={{ delay: i * 0.08 }}
              >
                <div className="feature-icon-wrap" style={{ background: featureColors[i].bg, color: featureColors[i].color }}>
                  <feature.icon size={20} />
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agent Fleet ── */}
      <section className="section section-alt" id="agents">
        <div className="section-inner">
          <motion.div {...fadeUp} className="section-header-center">
            <h2 className="section-label">Agent Fleet</h2>
            <h3 className="section-title">Five specialized agents working in concert</h3>
            <p className="section-desc">
              Each agent is an expert in its domain, handing off to the next in a coordinated pipeline
              with built-in feedback loops for continuous improvement.
            </p>
          </motion.div>

          <div className="agents-flow">
            {agentData.map((agent, i) => (
              <motion.div
                key={agent.name}
                className="agent-flow-card"
                {...stagger}
                transition={{ delay: i * 0.1 }}
              >
                {i > 0 && (
                  <div className="agent-connector">
                    <div className="connector-track" />
                    <div className="connector-pulse" />
                    <ChevronRight size={13} className="connector-chevron" />
                  </div>
                )}
                <div
                  className="agent-card-inner"
                  style={{ '--agent-color': agent.color, borderTopColor: agent.color }}
                >
                  <div className="agent-icon" style={{ color: agent.color, background: `${agent.color}18` }}>
                    <agent.icon size={20} />
                  </div>
                  <h4>{agent.name}</h4>
                  <p>{agent.desc}</p>
                  <span className="agent-time">{agent.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" id="how-it-works">
        <div className="section-inner">
          <motion.div {...fadeUp} className="section-header-center">
            <h2 className="section-label">How It Works</h2>
            <h3 className="section-title">Brief to publish in three steps</h3>
          </motion.div>

          <div className="steps-grid">
            {[
              { num: '01', title: 'Submit a brief', desc: 'Describe your product, select tone, audience, and target channels. Upload supporting docs if needed.' },
              { num: '02', title: 'Agents do the work', desc: 'The Drafter creates content, the Reviewer checks brand fit, Compliance scans for issues, and the Localizer translates.' },
              { num: '03', title: 'Review and publish', desc: 'Approve at the human gate, and the Publisher distributes across all channels with optimal scheduling.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="step-card"
                {...stagger}
                transition={{ delay: i * 0.12 }}
              >
                <span className="step-num">{step.num}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenarios ── */}
      <section className="section section-alt" id="scenarios">
        <div className="section-inner">
          <motion.div {...fadeUp} className="section-header-center">
            <h2 className="section-label">Demo Scenarios</h2>
            <h3 className="section-title">See the platform handle real challenges</h3>
            <p className="section-desc">
              Three interactive walkthroughs demonstrating end-to-end content operations.
            </p>
          </motion.div>

          <div className="scenarios-grid">
            {[
              { icon: Zap, title: 'Product Launch Sprint', desc: 'Generate a blog, 3 social variants and FAQ from a product spec. Brand-checked, compliance-cleared, and localized.', color: 'hsl(155,65%,48%)' },
              { icon: Shield, title: 'Compliance Rejection', desc: 'A blog with regulatory violations is flagged sentence by sentence, with compliant rewrites generated automatically.', color: 'hsl(0,70%,58%)' },
              { icon: TrendingUp, title: 'Performance Pivot', desc: 'Engagement data reveals video outperforms text 4x. The system recommends a strategy shift and new content calendar.', color: 'hsl(35,90%,58%)' },
            ].map((sc, i) => (
              <motion.div
                key={sc.title}
                className="scenario-landing-card"
                style={{ '--sc-color': sc.color }}
                {...stagger}
                transition={{ delay: i * 0.1 }}
              >
                <div className="scenario-icon-wrap" style={{ background: `${sc.color}18`, color: sc.color }}>
                  <sc.icon size={22} />
                </div>
                <h4>{sc.title}</h4>
                <p>{sc.desc}</p>
                <Link to="/app/scenarios" className="scenario-link" style={{ color: sc.color }}>
                  Try it <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="section section-pricing" id="pricing">
        <div className="section-inner">
          <motion.div {...fadeUp} className="section-header">
            {/* <div className="section-eyebrow">MONETIZATION</div> */}
            <h2 className="section-title">Choose your plan</h2>
            <p className="section-sub">Scale your content operations with the right tier.</p>
          </motion.div>

          <div className="pricing-grid">
            {/* Starter */}
            <motion.div {...stagger} transition={{ delay: 0.1, duration: 0.45 }} className="pricing-card">
              <div className="pricing-corner pricing-corner-tl" />
              <div className="pricing-corner pricing-corner-br" />
              <div className="pricing-tier-badge">STARTER</div>
              <div className="pricing-price">
                <span className="pricing-amount">$0</span>
                <span className="pricing-period">/ month</span>
              </div>
              <p className="pricing-desc">For solo creators getting started with AI content.</p>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> 3 pipeline runs / month</li>
                <li><span className="pricing-check">✓</span> 2 AI agents</li>
                <li><span className="pricing-check">✓</span> Basic analytics</li>
                <li><span className="pricing-check">✓</span> Content Studio</li>
                <li><span className="pricing-x">✕</span> Signal radar</li>
                <li><span className="pricing-x">✕</span> Compliance engine</li>
                <li><span className="pricing-x">✕</span> Multi-channel distribution</li>
              </ul>
              <Link to="/app" className="pricing-btn pricing-btn-ghost">Get Started Free</Link>
            </motion.div>

            {/* Pro — highlighted */}
            <motion.div {...stagger} transition={{ delay: 0.2, duration: 0.45 }} className="pricing-card pricing-card-pro">
              <div className="pricing-corner pricing-corner-tl" />
              <div className="pricing-corner pricing-corner-br" />
              <div className="pricing-popular-tag">MOST POPULAR</div>
              <div className="pricing-tier-badge pricing-tier-badge-pro">PRO</div>
              <div className="pricing-price">
                <span className="pricing-amount">$49</span>
                <span className="pricing-period">/ month</span>
              </div>
              <p className="pricing-desc">For growing teams shipping content at scale.</p>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> Unlimited pipeline runs</li>
                <li><span className="pricing-check">✓</span> All 5 AI agents</li>
                <li><span className="pricing-check">✓</span> Full analytics dashboard</li>
                <li><span className="pricing-check">✓</span> Signal radar + gap detection</li>
                <li><span className="pricing-check">✓</span> Compliance engine</li>
                <li><span className="pricing-check">✓</span> Multi-channel distribution</li>
                <li><span className="pricing-check">✓</span> Chrome extension</li>
              </ul>
              <Link to="/app" className="pricing-btn pricing-btn-primary">Start Pro Trial →</Link>
            </motion.div>

            {/* Enterprise */}
            <motion.div {...stagger} transition={{ delay: 0.3, duration: 0.45 }} className="pricing-card">
              <div className="pricing-corner pricing-corner-tl" />
              <div className="pricing-corner pricing-corner-br" />
              <div className="pricing-tier-badge">ENTERPRISE</div>
              <div className="pricing-price">
                <span className="pricing-amount">Custom</span>
              </div>
              <p className="pricing-desc">For agencies and orgs with high-volume needs.</p>
              <ul className="pricing-features">
                <li><span className="pricing-check">✓</span> Everything in Pro</li>
                <li><span className="pricing-check">✓</span> Custom AI agent training</li>
                <li><span className="pricing-check">✓</span> Dedicated workspace per brand</li>
                <li><span className="pricing-check">✓</span> SSO + team roles</li>
                <li><span className="pricing-check">✓</span> SLA + priority support</li>
                <li><span className="pricing-check">✓</span> API access</li>
                <li><span className="pricing-check">✓</span> White-label option</li>
              </ul>
              <a href="mailto:sales@contentops.ai" className="pricing-btn pricing-btn-ghost">Contact Sales</a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section section-cta">
        <div className="cta-glow cta-glow-1" />
        <div className="cta-glow cta-glow-2" />
        <div className="section-inner">
          <motion.div {...fadeUp} className="cta-content">
            <div className="cta-eyebrow">Ready to transform your content ops?</div>
            <h2>Automate your entire content pipeline today.</h2>
            <p>Launch the platform and explore every feature, agent, and scenario interactively.</p>
            <Link to="/app" className="hero-btn hero-btn-primary cta-cta-btn">
              Launch Platform <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="section-inner footer-inner">
          <div className="footer-brand">
            <div className="nav-logo-mark">C</div>
            <div className="footer-brand-info">
              <span className="footer-brand-name">ContentOps</span>
              <span className="footer-brand-tagline">AI-powered enterprise content</span>
            </div>
          </div>
          <p className="footer-copy">© 2026 ContentOps. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
