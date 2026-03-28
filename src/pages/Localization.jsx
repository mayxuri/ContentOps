import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Check, Star } from 'lucide-react';
import { Card, Badge, Button, SectionHeader, ProgressBar } from '../components/UI';
import { localizationSamples, sampleBlogPost } from '../data/mockData';
import { useApi } from '../hooks/useApi';
import { localization as localizationApi } from '../api/client';
import './Pages.css';

const flagMap = { es: 'ES', fr: 'FR', de: 'DE', hi: 'HI', ja: 'JP', ar: 'AR' };

export default function Localization() {
  const [selectedLang, setSelectedLang] = useState(0);

  const { data: locData } = useApi(() => localizationApi.list(), []);

  // Build language list from API or fall back to mock
  const langList = locData?.recent?.length
    ? (() => {
        // Deduplicate by languageCode and grab first translation per language
        const seen = new Set();
        return locData.recent
          .filter((loc) => { if (seen.has(loc.languageCode)) return false; seen.add(loc.languageCode); return true; })
          .map((loc) => ({
            language:        loc.languageName,
            code:            loc.languageCode,
            flag:            flagMap[loc.languageCode.split('-')[0]] ?? loc.languageCode.toUpperCase().slice(0, 2),
            quality:         loc.qualityScore,
            content:         loc.translatedBody,
            adaptationNotes: loc.adaptationNotes ?? 'Translation adapted for local market conventions and register.',
          }));
      })()
    : localizationSamples;

  const current = langList[Math.min(selectedLang, langList.length - 1)];

  return (
    <div className="page-localization">
      <SectionHeader
        title="Localization"
        subtitle="AI-powered translation and cultural adaptation across 6 target regions"
      />

      {/* Language Selector */}
      <div className="lang-grid">
        {langList.map((lang, i) => (
          <motion.div
            key={lang.code}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              hover
              className={`lang-card ${selectedLang === i ? 'lang-card-active' : ''}`}
              padding="md"
              onClick={() => setSelectedLang(i)}
            >
              <div className="lang-card-top">
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-name">{lang.language}</span>
              </div>
              <div className="lang-card-quality">
                <ProgressBar
                  value={lang.quality}
                  color={lang.quality > 96 ? 'var(--status-success)' : lang.quality > 94 ? 'var(--accent-primary)' : 'var(--status-warning)'}
                  height={4}
                />
                <span className="lang-quality-val">{lang.quality}%</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Translation Comparison */}
      <div className="translation-layout">
        <Card padding="xl" className="source-panel">
          <div className="translation-panel-header">
            <Badge variant="info">Source -- English</Badge>
            <span className="translation-meta">Original content</span>
          </div>
          <div className="translation-content">
            <h4>{sampleBlogPost.title}</h4>
            <p>{sampleBlogPost.content.split('\n\n')[0]}</p>
          </div>
        </Card>

        <div className="translation-arrow">
          <div className="arrow-connector">
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </div>
          <Badge variant="primary">{current.language}</Badge>
        </div>

        <Card padding="xl" className="target-panel">
          <div className="translation-panel-header">
            <Badge variant="success">Translation -- {current.code}</Badge>
            <div className="quality-badge">
              <Star size={13} />
              <span>{current.quality}% confidence</span>
            </div>
          </div>
          <div className="translation-content">
            <p>{current.content}</p>
          </div>
        </Card>
      </div>

      {/* Adaptation Notes */}
      <Card padding="xl" className="adaptation-card">
        <h3>Cultural Adaptation Notes</h3>
        <p className="adaptation-subtitle">Region-specific adjustments made by the Localizer agent</p>
        <motion.div
          key={current.code}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="adaptation-content"
        >
          <div className="adaptation-note">
            <div className="adaptation-icon">
              <Globe size={16} />
            </div>
            <p>{current.adaptationNotes}</p>
          </div>
        </motion.div>
        <div className="adaptation-actions">
          <Button variant="primary" icon={Check} size="sm">Approve Translation</Button>
          <Button variant="secondary" size="sm">Request Revision</Button>
        </div>
      </Card>
    </div>
  );
}
