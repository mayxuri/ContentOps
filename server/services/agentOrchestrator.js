import { prisma } from '../index.js';

/**
 * Agent pipeline orchestrator.
 * Runs the 5-agent sequence: Drafter -> Brand Reviewer -> Compliance -> Localizer -> Publisher.
 * Currently simulates AI processing with realistic delays and pre-built content.
 */

const AGENTS = [
  { name: 'Content Drafter', avgDuration: 2.0 },
  { name: 'Brand Reviewer', avgDuration: 0.8 },
  { name: 'Compliance Officer', avgDuration: 0.6 },
  { name: 'Localizer', avgDuration: 1.5 },
  { name: 'Publisher', avgDuration: 0.4 },
];

function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export async function runPipeline(runId, brief) {
  const startTime = Date.now();

  try {
    for (const agent of AGENTS) {
      // Create step record
      const step = await prisma.pipelineStep.create({
        data: {
          runId,
          agentName: agent.name,
          status: 'running',
          inputSnapshot: { topic: brief.topic, tone: brief.tone },
        },
      });

      // Simulate processing
      const duration = agent.avgDuration + (Math.random() * 0.5);
      await delay(duration);

      // Agent-specific logic
      let outputSnapshot = {};

      if (agent.name === 'Content Drafter') {
        outputSnapshot = await handleDrafter(runId, brief);
      } else if (agent.name === 'Brand Reviewer') {
        outputSnapshot = { result: 'approved', toneMatch: 97.8 };
      } else if (agent.name === 'Compliance Officer') {
        outputSnapshot = await handleCompliance(runId);
      } else if (agent.name === 'Localizer') {
        outputSnapshot = await handleLocalizer(runId);
      } else if (agent.name === 'Publisher') {
        outputSnapshot = await handlePublisher(runId);
      }

      // Update step as completed
      await prisma.pipelineStep.update({
        where: { id: step.id },
        data: {
          status: 'completed',
          durationS: duration,
          outputSnapshot,
        },
      });
    }

    // Mark run as completed
    const totalDuration = (Date.now() - startTime) / 1000;
    await prisma.pipelineRun.update({
      where: { id: runId },
      data: { status: 'completed', totalDurationS: totalDuration, completedAt: new Date() },
    });

    return { status: 'completed', totalDurationS: totalDuration };
  } catch (err) {
    await prisma.pipelineRun.update({
      where: { id: runId },
      data: { status: 'failed' },
    });
    throw err;
  }
}

async function handleDrafter(runId, brief) {
  // Generate content outputs
  const blogPost = await prisma.contentOutput.create({
    data: {
      runId,
      format: 'blog',
      title: `${brief.topic}: A Comprehensive Overview`,
      body: `The modern enterprise demands innovative solutions, and ${brief.topic} represents a fundamentally new approach to solving critical business challenges. This platform combines cutting-edge technology with intuitive design to deliver measurable results.\n\n${brief.details}\n\nEarly adopters report significant improvements in productivity, efficiency, and team collaboration. The platform integrates natively with existing enterprise infrastructure, ensuring a smooth transition from legacy systems.\n\nContact our solutions team today to learn how ${brief.topic} can transform your operations.`,
      metadata: { wordCount: 85, readTime: '2 min', tone: brief.tone, audience: 'Enterprise Decision Makers' },
      status: 'draft',
    },
  });

  // Social variants
  for (const platform of ['Twitter/X', 'LinkedIn', 'Instagram']) {
    await prisma.contentOutput.create({
      data: {
        runId,
        format: 'social',
        title: `${brief.topic} - ${platform}`,
        body: `Introducing ${brief.topic} -- a breakthrough in enterprise operations. ${brief.details.substring(0, 120)}... Learn more at our website.`,
        metadata: { platform, charCount: 180 },
        status: 'draft',
      },
    });
  }

  // FAQ
  await prisma.contentOutput.create({
    data: {
      runId,
      format: 'faq',
      title: `${brief.topic} - FAQ`,
      body: JSON.stringify([
        { q: `What is ${brief.topic}?`, a: brief.details },
        { q: 'What integrations are supported?', a: 'Native integration with Microsoft 365, Google Workspace, Slack, and 200+ platforms via REST API.' },
        { q: 'What is the pricing model?', a: 'Usage-based pricing that scales with your organization. Contact sales for a custom quote.' },
      ]),
      metadata: { questionCount: 3 },
      status: 'draft',
    },
  });

  return { outputsCreated: 5, formats: ['blog', 'social', 'faq'] };
}

async function handleCompliance(runId) {
  const outputs = await prisma.contentOutput.findMany({ where: { runId, format: 'blog' } });

  let issuesFound = 0;
  for (const output of outputs) {
    // Simulate finding a compliance issue
    await prisma.complianceIssue.create({
      data: {
        outputId: output.id,
        severity: 'medium',
        category: 'Marketing Claims',
        originalText: 'significant improvements in productivity',
        issueDescription: 'Vague comparative claim without quantitative evidence.',
        suggestedFix: 'measurable improvements in operational efficiency, as reported by early access customers',
        regulation: 'FTC Endorsement Guidelines',
        resolution: 'pending',
      },
    });
    issuesFound++;
  }

  return { issuesScanned: outputs.length, issuesFound };
}

async function handleLocalizer(runId) {
  const blogOutputs = await prisma.contentOutput.findMany({ where: { runId, format: 'blog' } });

  const languages = [
    { code: 'es-LA', name: 'Spanish (Latin America)', quality: 97.2 },
    { code: 'fr-FR', name: 'French', quality: 96.8 },
    { code: 'de-DE', name: 'German', quality: 95.4 },
  ];

  let count = 0;
  for (const output of blogOutputs) {
    for (const lang of languages) {
      await prisma.localization.create({
        data: {
          outputId: output.id,
          languageCode: lang.code,
          languageName: lang.name,
          translatedBody: `[${lang.name}] ${output.body.substring(0, 200)}...`,
          qualityScore: lang.quality,
          adaptationNotes: `Adapted for ${lang.name} market. Formal register used for B2B context.`,
        },
      });
      count++;
    }
  }

  return { translationsCreated: count, languages: languages.map(l => l.code) };
}

async function handlePublisher(runId) {
  const outputs = await prisma.contentOutput.findMany({ where: { runId } });
  const channels = await prisma.channel.findMany({ where: { status: 'active' }, take: 3 });

  let scheduled = 0;
  for (const output of outputs.slice(0, 3)) {
    for (const channel of channels.slice(0, 2)) {
      await prisma.distribution.create({
        data: {
          outputId: output.id,
          channelId: channel.id,
          status: 'scheduled',
          scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      });
      scheduled++;
    }
  }

  // Mark outputs as published
  await prisma.contentOutput.updateMany({
    where: { runId },
    data: { status: 'published' },
  });

  return { distributionsScheduled: scheduled };
}
