import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Create default user
  const user = await prisma.user.upsert({
    where: { email: 'admin@contentops.ai' },
    create: { email: 'admin@contentops.ai', name: 'Admin User', role: 'admin' },
    update: {},
  });
  console.log('User created:', user.email);

  // Create channels
  const channelData = [
    { name: 'Company Blog', platform: 'blog', status: 'active' },
    { name: 'Twitter/X', platform: 'twitter', status: 'active' },
    { name: 'LinkedIn', platform: 'linkedin', status: 'active' },
    { name: 'Instagram', platform: 'instagram', status: 'active' },
    { name: 'Email Newsletter', platform: 'email', status: 'active' },
    { name: 'Medium', platform: 'medium', status: 'active' },
    { name: 'YouTube', platform: 'youtube', status: 'paused' },
    { name: 'Podcast', platform: 'podcast', status: 'paused' },
  ];

  for (const ch of channelData) {
    await prisma.channel.upsert({
      where: { name: ch.name },
      create: ch,
      update: ch,
    });
  }
  console.log(`${channelData.length} channels created`);

  // Create a sample brief + pipeline run with full outputs
  const brief = await prisma.contentBrief.create({
    data: {
      userId: user.id,
      topic: 'CloudSync Pro 3.0',
      details: 'Cloud-native sync platform with end-to-end encryption and real-time collaboration for enterprise teams.',
      tone: 'Professional',
      targetChannels: ['blog', 'social', 'faq'],
    },
  });

  const run = await prisma.pipelineRun.create({
    data: {
      briefId: brief.id,
      userId: user.id,
      status: 'completed',
      totalDurationS: 20.1,
      startedAt: new Date(Date.now() - 25000),
      completedAt: new Date(Date.now() - 5000),
    },
  });

  // Pipeline steps
  const steps = [
    { agentName: 'Content Drafter', status: 'completed', durationS: 12.4 },
    { agentName: 'Brand Reviewer', status: 'completed', durationS: 3.8 },
    { agentName: 'Compliance Officer', status: 'completed', durationS: 2.1 },
    { agentName: 'Localizer', status: 'completed', durationS: 1.2 },
    { agentName: 'Publisher', status: 'completed', durationS: 0.6 },
  ];
  for (const s of steps) {
    await prisma.pipelineStep.create({
      data: { runId: run.id, ...s, outputSnapshot: { result: 'success' } },
    });
  }
  console.log('Pipeline steps created');

  // Blog post
  const blogOutput = await prisma.contentOutput.create({
    data: {
      runId: run.id,
      format: 'blog',
      title: 'Introducing CloudSync Pro: Enterprise File Collaboration Reimagined',
      body: `The modern enterprise demands seamless collaboration across distributed teams, and traditional file-sharing solutions simply cannot keep pace. Today, we are introducing CloudSync Pro -- a fundamentally new approach to enterprise file collaboration that combines real-time editing, intelligent version control, and enterprise-grade security in a single platform.\n\nCloudSync Pro addresses three critical pain points that enterprise teams face daily. First, version conflicts that waste an average of 3.2 hours per team member each week. Second, security gaps that emerge when employees resort to consumer-grade file-sharing tools. Third, the collaboration friction that occurs when teams span multiple time zones and work asynchronously.\n\nOur platform introduces Intelligent Merge Technology, which automatically reconciles concurrent edits without the merge conflicts that plague existing solutions. Combined with our Zero-Trust File Architecture, every document interaction is authenticated, encrypted, and auditable from creation to archival.\n\nEarly access customers report a 67% reduction in time spent on document management and a 94% decrease in version-related errors. CloudSync Pro integrates natively with existing enterprise infrastructure including Microsoft 365, Google Workspace, Slack, and over 200 additional platforms through our open API.`,
      metadata: { wordCount: 214, readTime: '3 min', tone: 'Professional, authoritative', audience: 'Enterprise IT Decision Makers' },
      status: 'published',
    },
  });

  // Social variants
  const socialData = [
    { platform: 'Twitter/X', content: 'Enterprise file collaboration is broken. Version conflicts waste 3.2 hours per team member weekly. CloudSync Pro fixes this with Intelligent Merge Technology.', hashtags: '#EnterpriseTech #CloudSync' },
    { platform: 'LinkedIn', content: 'We have been building CloudSync Pro for the past 18 months. The problem: distributed teams lose 3.2 hours/week to version conflicts. Our approach: Intelligent Merge Technology with Zero-Trust security.' },
    { platform: 'Instagram', content: 'The future of enterprise collaboration starts now. CloudSync Pro brings Intelligent Merge Technology to teams worldwide.' },
  ];
  for (const s of socialData) {
    await prisma.contentOutput.create({
      data: {
        runId: run.id,
        format: 'social',
        title: `CloudSync Pro - ${s.platform}`,
        body: s.content,
        metadata: { platform: s.platform, hashtags: s.hashtags || null },
        status: 'published',
      },
    });
  }

  // FAQ
  await prisma.contentOutput.create({
    data: {
      runId: run.id,
      format: 'faq',
      title: 'CloudSync Pro - FAQ',
      body: JSON.stringify([
        { q: 'What is CloudSync Pro?', a: 'CloudSync Pro is an enterprise file collaboration platform combining real-time editing, intelligent version control, and zero-trust security.' },
        { q: 'How does Intelligent Merge Technology work?', a: 'It uses contextual analysis to automatically reconcile concurrent edits without conflicts.' },
        { q: 'What integrations are supported?', a: 'Microsoft 365, Google Workspace, Slack, Jira, and 200+ platforms via REST API.' },
        { q: 'What are the security features?', a: 'Zero-Trust File Architecture with AES-256 encryption, SSO via SAML 2.0, SOC 2 Type II compliance.' },
        { q: 'Pricing?', a: 'Usage-based pricing. Contact sales for a custom quote.' },
      ]),
      metadata: { questionCount: 5 },
      status: 'published',
    },
  });
  console.log('Content outputs created');

  // Compliance issues on the blog
  const violations = [
    { severity: 'medium', category: 'Statistical Claims', originalText: '67% reduction in time spent', issueDescription: 'Specific percentage claims require citation of methodology.', suggestedFix: 'Significant reduction in time spent, as reported by early access customers', regulation: 'FTC Endorsement Guidelines', resolution: 'accepted' },
    { severity: 'low', category: 'Marketing Claims', originalText: 'fundamentally new approach', issueDescription: 'Superlative language should be substantiated.', suggestedFix: 'a modern approach', regulation: 'FTC Act Section 5', resolution: 'dismissed' },
  ];
  for (const v of violations) {
    await prisma.complianceIssue.create({
      data: { outputId: blogOutput.id, ...v },
    });
  }
  console.log('Compliance issues created');

  // Localizations
  const localizations = [
    { code: 'es-LA', name: 'Spanish (Latin America)', quality: 97.2, notes: 'Formal usted register for enterprise B2B. Adapted "reimagined" to "reimaginada".' },
    { code: 'fr-FR', name: 'French', quality: 96.8, notes: 'Used "Decouvrez" instead of direct "Introducing" for natural marketing flow.' },
    { code: 'de-DE', name: 'German', quality: 95.4, notes: 'Compound words used. Formal Sie register. Tech terms kept in English.' },
    { code: 'hi-IN', name: 'Hindi', quality: 94.1, notes: 'Romanized Hindi. Technical terms retained in English.' },
    { code: 'ja-JP', name: 'Japanese', quality: 96.0, notes: 'Honorific prefix go- added. Keigo maintained.' },
    { code: 'ar-SA', name: 'Arabic', quality: 93.8, notes: 'RTL required. Modern Standard Arabic for pan-Arab audience.' },
  ];
  for (const loc of localizations) {
    await prisma.localization.create({
      data: {
        outputId: blogOutput.id,
        languageCode: loc.code,
        languageName: loc.name,
        translatedBody: `[${loc.name} translation of blog post]`,
        qualityScore: loc.quality,
        adaptationNotes: loc.notes,
      },
    });
  }
  console.log('Localizations created');

  // Distributions
  const channels = await prisma.channel.findMany({ where: { status: 'active' }, take: 5 });
  for (const ch of channels) {
    await prisma.distribution.create({
      data: {
        outputId: blogOutput.id,
        channelId: ch.id,
        status: 'published',
        scheduledAt: new Date(Date.now() - 3600000),
        publishedAt: new Date(),
        engagementMetrics: { views: Math.floor(Math.random() * 5000 + 1000), clicks: Math.floor(Math.random() * 500 + 100) },
      },
    });
  }
  console.log('Distributions created');

  // Analytics snapshots
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  for (let i = 0; i < months.length; i++) {
    const date = new Date(2025, 8 + i, 1);
    await prisma.analyticsSnapshot.create({
      data: {
        snapshotDate: date,
        engagementData: {
          views: 12400 + i * 3200,
          clicks: 1840 + i * 500,
          shares: 342 + i * 80,
          conversions: 89 + i * 25,
        },
        formatPerformance: {
          blog: { views: 45200 + i * 2000, engagement: 8.4 + i * 0.3 },
          social: { views: 98600 + i * 5000, engagement: 12.7 + i * 0.5 },
          video: { views: 182400 + i * 8000, engagement: 24.1 + i * 1.2 },
        },
        channelMetrics: {
          blog: { posts: 42 + i * 7, views: 12400 + i * 1500 },
          twitter: { posts: 128 + i * 18, impressions: 8200 + i * 2000 },
          linkedin: { posts: 64 + i * 9, impressions: 23100 + i * 3000 },
        },
      },
    });
  }
  console.log('Analytics snapshots created');

  console.log('Seed completed successfully!');
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
