import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Get compliance issues for a content output
router.get('/:outputId', async (req, res, next) => {
  try {
    const issues = await prisma.complianceIssue.findMany({
      where: { outputId: req.params.outputId },
      orderBy: [{ severity: 'asc' }, { createdAt: 'asc' }],
    });
    const output = await prisma.contentOutput.findUnique({
      where: { id: req.params.outputId },
      select: { title: true, body: true, format: true },
    });
    res.json({ output, issues });
  } catch (err) { next(err); }
});

// Resolve / dismiss a compliance issue
router.patch('/:issueId', async (req, res, next) => {
  try {
    const { resolution } = req.body; // 'accepted', 'dismissed', 'fixed'
    if (!resolution) return res.status(400).json({ error: 'resolution is required' });

    const issue = await prisma.complianceIssue.update({
      where: { id: req.params.issueId },
      data: { resolution },
    });
    res.json(issue);
  } catch (err) { next(err); }
});

// Get compliance summary stats
router.get('/', async (req, res, next) => {
  try {
    const [total, critical, high, resolved] = await Promise.all([
      prisma.complianceIssue.count(),
      prisma.complianceIssue.count({ where: { severity: 'critical' } }),
      prisma.complianceIssue.count({ where: { severity: 'high' } }),
      prisma.complianceIssue.count({ where: { resolution: { not: 'pending' } } }),
    ]);
    const recentIssues = await prisma.complianceIssue.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { output: { select: { title: true } } },
    });
    res.json({ stats: { total, critical, high, resolved }, recentIssues });
  } catch (err) { next(err); }
});

export default router;
