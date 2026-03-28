import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, ShieldAlert, TrendingUp, Play, ChevronRight,
  Check, FileText, Globe, Send, AlertTriangle, BarChart3,
  ArrowRight
} from 'lucide-react';
import { Card, Badge, Button, SectionHeader, ProgressBar } from '../components/UI';
import './Pages.css';

const scenarios = [
  {
    id: 'launch',
    title: 'Product Launch Sprint',
    icon: Rocket,
    color: 'hsl(175, 80%, 48%)',
    description: 'Given a product spec document, generate a blog post, 3 social media variants, and an internal FAQ. The blog must pass a brand tone check, and one social variant must be localized to a regional language.',
    steps: [
      { label: 'Input: Product spec for CloudSync Pro', agent: 'System', status: 'done' },
      { label: 'Drafter: Generated blog post (1,284 words, professional tone)', agent: 'Content Drafter', status: 'done' },
      { label: 'Drafter: Generated 3 social media variants (Twitter, LinkedIn, Instagram)', agent: 'Content Drafter', status: 'done' },
      { label: 'Drafter: Generated internal FAQ (5 questions)', agent: 'Content Drafter', status: 'done' },
      { label: 'Brand Review: Tone analysis passed -- Professional/Authoritative', agent: 'Brand Reviewer', status: 'done' },
      { label: 'Brand Review: Style guide compliance -- 2 minor fixes auto-applied', agent: 'Brand Reviewer', status: 'done' },
      { label: 'Compliance: Regulatory scan -- 0 violations detected', agent: 'Compliance Officer', status: 'done' },
      { label: 'Localization: Spanish (Latin America) translation of LinkedIn variant', agent: 'Localizer', status: 'done' },
      { label: 'Localization: Cultural adaptation notes applied', agent: 'Localizer', status: 'done' },
      { label: 'Publisher: Scheduled across 4 channels', agent: 'Publisher', status: 'done' },
    ],
    output: '5 content pieces created, brand-reviewed, compliance-cleared, 1 localized, and scheduled for distribution in 20.1 seconds.',
  },
  {
    id: 'compliance',
    title: 'Compliance Rejection',
    icon: ShieldAlert,
    color: 'hsl(0, 75%, 60%)',
    description: 'A draft blog post contains claims that violate regulatory guidelines (e.g. an unsubstantiated health claim for a fintech product). The agent must catch it, flag the specific sentence, and suggest a compliant rewrite.',
    steps: [
      { label: 'Input: NutriTrack Wellness Platform blog post draft', agent: 'System', status: 'done' },
      { label: 'Compliance: Scanning document for regulatory violations...', agent: 'Compliance Officer', status: 'done' },
      { label: 'VIOLATION: "clinically proven to help users lose up to 15 pounds" -- Unsubstantiated health claim (FTC Act Section 5)', agent: 'Compliance Officer', status: 'flagged' },
      { label: 'VIOLATION: "guaranteed to reduce cholesterol levels by up to 30%" -- Prohibited guarantee language (FTC Health Products Guidance)', agent: 'Compliance Officer', status: 'flagged' },
      { label: 'VIOLATION: "replaces the need for regular medical consultations" -- Unauthorized medical claims (FDA 21 CFR)', agent: 'Compliance Officer', status: 'flagged' },
      { label: 'VIOLATION: "pharmaceutical-grade vitamins that cure deficiencies" -- Drug claim on supplement (DSHEA)', agent: 'Compliance Officer', status: 'flagged' },
      { label: 'VIOLATION: "80% fewer sick days" -- Unsubstantiated statistics (FTC Endorsement Guidelines)', agent: 'Compliance Officer', status: 'flagged' },
      { label: 'Compliance: Generated compliant rewrite for all 5 violations', agent: 'Compliance Officer', status: 'done' },
      { label: 'Human gate: Awaiting reviewer approval of suggested rewrites', agent: 'System', status: 'done' },
      { label: 'Feedback Loop: Returned to Drafter with compliance annotations for revision', agent: 'Content Drafter', status: 'done' },
    ],
    output: '5 regulatory violations detected across 3 categories (Health Claims, Medical Claims, Statistical Claims). Compliant rewrites generated for each. Content returned to Drafter via feedback loop.',
  },
  {
    id: 'pivot',
    title: 'Performance Pivot',
    icon: TrendingUp,
    color: 'hsl(35, 95%, 60%)',
    description: 'Given engagement data showing that video content outperforms text by 4x for a specific audience segment, the agent should recommend a strategy shift and generate a content calendar reflecting the new mix.',
    steps: [
      { label: 'Input: 8 weeks of cross-channel engagement data', agent: 'System', status: 'done' },
      { label: 'Intelligence: Analyzing content performance patterns...', agent: 'Content Intelligence', status: 'done' },
      { label: 'Finding: Video content engagement is 4.2x higher than text across all channels', agent: 'Content Intelligence', status: 'done' },
      { label: 'Finding: Video conversion rate (5.8%) outperforms blog posts (3.2%) by 1.8x', agent: 'Content Intelligence', status: 'done' },
      { label: 'Recommendation: Shift content mix from 10% to 30% video production', agent: 'Content Intelligence', status: 'done' },
      { label: 'Recommendation: Convert top-performing blog posts into video scripts', agent: 'Content Intelligence', status: 'done' },
      { label: 'Recommendation: Implement video-first strategy for product launches', agent: 'Content Intelligence', status: 'done' },
      { label: 'Calendar: Generated new 4-week content calendar with video-heavy mix', agent: 'Content Intelligence', status: 'done' },
      { label: 'Budget: Proposed 40% content budget reallocation to video production', agent: 'Content Intelligence', status: 'done' },
      { label: 'Publisher: Updated scheduling queue to reflect new strategy', agent: 'Publisher', status: 'done' },
    ],
    output: 'Strategy pivot recommended: increase video from 10% to 30% of content mix. New content calendar generated with bi-weekly video series. Projected 2.4x engagement improvement.',
  },
];

export default function Scenarios() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [runningStep, setRunningStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const runScenario = (scenario) => {
    setActiveScenario(scenario);
    setRunningStep(-1);
    setIsRunning(true);
    scenario.steps.forEach((_, i) => {
      setTimeout(() => {
        setRunningStep(i);
        if (i === scenario.steps.length - 1) {
          setTimeout(() => setIsRunning(false), 600);
        }
      }, (i + 1) * 400);
    });
  };

  return (
    <div className="page-scenarios">
      <SectionHeader
        title="Scenario Demos"
        subtitle="Interactive walkthroughs of the three shared evaluation scenarios"
      />

      {/* Scenario Cards */}
      <div className="scenario-grid">
        {scenarios.map((sc, i) => {
          const Icon = sc.icon;
          const isActive = activeScenario?.id === sc.id;
          return (
            <Card key={sc.id} hover delay={i * 0.08} className={`scenario-card ${isActive ? 'scenario-card-active' : ''}`} padding="xl">
              <div className="scenario-icon-wrap" style={{ background: `${sc.color}15`, color: sc.color }}>
                <Icon size={24} />
              </div>
              <h3>{sc.title}</h3>
              <p className="scenario-desc">{sc.description}</p>
              <Button
                variant={isActive ? 'secondary' : 'primary'}
                icon={isActive ? ArrowRight : Play}
                onClick={() => runScenario(sc)}
                fullWidth
                disabled={isRunning && isActive}
              >
                {isActive && isRunning ? 'Running...' : isActive ? 'Run Again' : 'Run Scenario'}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Scenario Execution */}
      <AnimatePresence>
        {activeScenario && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <Card padding="xl" className="scenario-execution">
              <div className="scenario-exec-header">
                <div>
                  <h3>Execution: {activeScenario.title}</h3>
                  <p className="chart-subtitle">{activeScenario.steps.length} steps in pipeline</p>
                </div>
                {!isRunning && runningStep >= 0 && (
                  <Badge variant="success" size="lg">Complete</Badge>
                )}
                {isRunning && (
                  <Badge variant="info" size="lg">Running</Badge>
                )}
              </div>

              <div className="scenario-progress">
                <ProgressBar
                  value={runningStep + 1}
                  max={activeScenario.steps.length}
                  color={activeScenario.color}
                  height={4}
                />
              </div>

              <div className="scenario-steps">
                {activeScenario.steps.map((step, i) => {
                  const isComplete = i <= runningStep;
                  const isCurrent = i === runningStep && isRunning;
                  const isFlagged = step.status === 'flagged';
                  return (
                    <motion.div
                      key={i}
                      className={`scenario-step ${isComplete ? 'step-complete' : ''} ${isCurrent ? 'step-current' : ''} ${isFlagged && isComplete ? 'step-flagged' : ''}`}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: isComplete ? 1 : 0.3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="step-indicator">
                        {isComplete ? (
                          isFlagged ? (
                            <AlertTriangle size={14} className="step-flag-icon" />
                          ) : (
                            <Check size={14} className="step-check-icon" />
                          )
                        ) : (
                          <span className="step-num">{i + 1}</span>
                        )}
                      </div>
                      <div className="step-content">
                        <span className="step-label">{step.label}</span>
                        <Badge
                          variant={
                            isFlagged ? 'error' :
                            step.agent === 'System' ? 'default' : 'primary'
                          }
                          size="sm"
                        >
                          {step.agent}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {!isRunning && runningStep >= 0 && (
                <motion.div
                  className="scenario-result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="result-header">
                    <Check size={18} />
                    <h4>Result</h4>
                  </div>
                  <p>{activeScenario.output}</p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
