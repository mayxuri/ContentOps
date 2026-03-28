import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Zap, RotateCcw, CheckCircle, AlertTriangle, Settings
} from 'lucide-react';
import { Card, Badge, StatusIndicator, SectionHeader, Button } from '../components/UI';
import { agents } from '../data/agents';
import './Pages.css';

const pipelineSteps = [
  { agentIndex: 0, label: 'Draft', outputLabel: 'Raw Content' },
  { agentIndex: 1, label: 'Review', outputLabel: 'Brand-Checked' },
  { agentIndex: 2, label: 'Compliance', outputLabel: 'Compliant' },
  { agentIndex: 3, label: 'Localize', outputLabel: 'Multi-Language' },
  { agentIndex: 4, label: 'Publish', outputLabel: 'Distributed' },
];

const activityLog = [
  { step: 'Draft', message: 'Generated blog post: "CloudSync Pro Launch" (1,284 words)', time: '0.0s', status: 'done' },
  { step: 'Draft', message: 'Generated 3 social media variants (Twitter, LinkedIn, Instagram)', time: '4.2s', status: 'done' },
  { step: 'Draft', message: 'Generated internal FAQ document (12 questions)', time: '6.8s', status: 'done' },
  { step: 'Review', message: 'Brand tone analysis: Professional/Authoritative -- PASS', time: '8.1s', status: 'done' },
  { step: 'Review', message: 'Style guide check: 2 minor suggestions applied', time: '9.3s', status: 'done' },
  { step: 'Compliance', message: 'Regulatory scan complete: 0 violations found', time: '10.1s', status: 'done' },
  { step: 'Compliance', message: 'Health/financial claims check: CLEAR', time: '10.8s', status: 'done' },
  { step: 'Localize', message: 'Translating to Spanish (Latin America)...', time: '12.0s', status: 'done' },
  { step: 'Localize', message: 'Translating to French...', time: '16.4s', status: 'done' },
  { step: 'Localize', message: 'Cultural adaptation review: 3 adjustments made', time: '18.2s', status: 'done' },
  { step: 'Publish', message: 'Scheduling blog post: March 24, 09:00 UTC', time: '19.0s', status: 'done' },
  { step: 'Publish', message: 'Queued social posts across 3 platforms', time: '19.5s', status: 'done' },
  { step: 'Publish', message: 'Pipeline complete -- all content delivered', time: '20.1s', status: 'done' },
];

export default function Pipeline() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showLog, setShowLog] = useState(true);

  return (
    <div className="page-pipeline">
      <SectionHeader
        title="Agent Pipeline"
        subtitle="Multi-agent workflow for content lifecycle automation"
        action={<Button variant="secondary" icon={Settings} size="sm">Configure</Button>}
      />

      {/* Pipeline Flow */}
      <Card className="pipeline-flow-card" padding="xl">
        <div className="pipeline-flow">
          {pipelineSteps.map((step, i) => {
            const agent = agents[step.agentIndex];
            const AgentIcon = agent.icon;
            const isSelected = selectedAgent === i;
            return (
              <motion.div
                key={step.label}
                className="pipeline-step-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {i > 0 && (
                  <div className="pipeline-connector">
                    <motion.div
                      className="connector-line"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                    />
                    <motion.div
                      className="connector-arrow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 + 0.5 }}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                )}
                <motion.div
                  className={`pipeline-node ${isSelected ? 'pipeline-node-selected' : ''}`}
                  style={{ '--agent-color': agent.color }}
                  onClick={() => setSelectedAgent(isSelected ? null : i)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="pipeline-node-icon" style={{ background: `${agent.color}18`, color: agent.color }}>
                    <AgentIcon size={22} />
                  </div>
                  <span className="pipeline-node-name">{agent.name}</span>
                  <StatusIndicator status="active" size={6} label={agent.avgTime} />
                  <div className="pipeline-node-output">
                    <ArrowRight size={11} />
                    <span>{step.outputLabel}</span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Feedback Loop */}
        <motion.div
          className="feedback-loop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="feedback-loop-line" />
          <div className="feedback-loop-label">
            <RotateCcw size={13} />
            <span>Feedback Loop: Compliance failures return to Drafter for revision</span>
          </div>
        </motion.div>
      </Card>

      <div className="pipeline-bottom">
        {/* Agent Detail */}
        {selectedAgent !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="agent-detail-card" padding="xl">
              {(() => {
                const agent = agents[pipelineSteps[selectedAgent].agentIndex];
                const AgentIcon = agent.icon;
                return (
                  <>
                    <div className="agent-detail-header">
                      <div className="agent-detail-icon" style={{ background: `${agent.color}18`, color: agent.color }}>
                        <AgentIcon size={28} />
                      </div>
                      <div>
                        <h3>{agent.name}</h3>
                        <p className="agent-detail-desc">{agent.description}</p>
                      </div>
                    </div>
                    <div className="agent-capabilities">
                      <h4>Capabilities</h4>
                      <div className="cap-list">
                        {agent.capabilities.map((cap) => (
                          <Badge key={cap} variant="default">{cap}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="agent-metrics-row">
                      <div className="agent-metric">
                        <span className="metric-value">{agent.throughput}/hr</span>
                        <span className="metric-label">Throughput</span>
                      </div>
                      <div className="agent-metric">
                        <span className="metric-value">{agent.accuracy}%</span>
                        <span className="metric-label">Accuracy</span>
                      </div>
                      <div className="agent-metric">
                        <span className="metric-value">{agent.avgTime}</span>
                        <span className="metric-label">Avg Latency</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </Card>
          </motion.div>
        )}

        {/* Activity Log */}
        {showLog && (
          <Card className="pipeline-log-card" padding="xl">
            <div className="chart-header">
              <div>
                <h3>Execution Log</h3>
                <p className="chart-subtitle">Last pipeline run: Product launch sprint</p>
              </div>
              <Badge variant="success">Completed in 20.1s</Badge>
            </div>
            <div className="pipeline-log">
              {activityLog.map((item, i) => (
                <motion.div
                  key={i}
                  className="log-entry"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <span className="log-time">{item.time}</span>
                  <Badge variant={item.status === 'done' ? 'success' : 'warning'} size="sm">{item.step}</Badge>
                  <span className="log-msg">{item.message}</span>
                  <CheckCircle size={14} className="log-check" />
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
