import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Dashboard KPIs
router.get('/dashboard', async (req, res, next) => {
  try {
    const [contentCount, complianceRate, languageCount, channelCount, recentActivity] = await Promise.all([
      prisma.contentOutput.count(),
      prisma.complianceIssue.count().then(async total => {
        if (total === 0) return 100;
        const resolved = await prisma.complianceIssue.count({ where: { resolution: { not: 'pending' } } });
        return Math.round((resolved / total) * 1000) / 10;
      }),
      prisma.localization.findMany({ distinct: ['languageCode'] }).then(l => l.length),
      prisma.channel.count({ where: { status: 'active' } }),
      prisma.pipelineStep.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { agentName: true, status: true, durationS: true, createdAt: true,
          run: { select: { brief: { select: { topic: true } } } }
        },
      }),
    ]);

    res.json({
      kpi: [
        { label: 'Content Created', value: contentCount, change: 12.5 },
        { label: 'Compliance Rate', value: complianceRate, suffix: '%', change: 2.1 },
        { label: 'Languages Active', value: languageCount || 0, change: 3 },
        { label: 'Channels Live', value: channelCount, change: 1 },
      ],
      recentActivity,
    });
  } catch (err) { next(err); }
});

// Engagement time series
router.get('/engagement', async (req, res, next) => {
  try {
    const snapshots = await prisma.analyticsSnapshot.findMany({
      orderBy: { snapshotDate: 'asc' },
      take: 12,
    });
    res.json({ data: snapshots });
  } catch (err) { next(err); }
});

// Format performance
router.get('/formats', async (req, res, next) => {
  try {
    const outputs = await prisma.contentOutput.groupBy({
      by: ['format'],
      _count: { id: true },
    });
    res.json({ data: outputs });
  } catch (err) { next(err); }
});

// Per-channel breakdown
router.get('/channels', async (req, res, next) => {
  try {
    const channels = await prisma.channel.findMany({
      include: {
        _count: { select: { distributions: true } },
        distributions: {
          select: { status: true, engagementMetrics: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const data = channels.map((ch) => {
      const published  = ch.distributions.filter((d) => d.status === 'published').length;
      const scheduled  = ch.distributions.filter((d) => d.status === 'scheduled').length;
      const followers  = parseInt(ch.config?.followers)  || 0;
      const avgReach   = parseInt(ch.config?.avgReach)   || 0;
      const postsPerMonth = parseInt(ch.config?.postsPerMonth) || 0;
      const totalReach = avgReach * published;

      return {
        id: ch.id, name: ch.name, platform: ch.platform, status: ch.status,
        handle: ch.config?.handle ?? '',
        followers, avgReach, postsPerMonth,
        totalDistributions: ch._count.distributions,
        published, scheduled,
        totalReach,
      };
    });

    res.json({ data });
  } catch (err) { next(err); }
});

// Content output trend (by month)
router.get('/trend', async (req, res, next) => {
  try {
    const snapshots = await prisma.analyticsSnapshot.findMany({
      orderBy: { snapshotDate: 'asc' },
      select: { snapshotDate: true, engagementData: true, formatPerformance: true },
    });
    res.json({ data: snapshots });
  } catch (err) { next(err); }
});

export default router;
