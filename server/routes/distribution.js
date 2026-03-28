import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Create a channel
router.post('/channels', async (req, res, next) => {
  try {
    const { name, platform, status = 'active', config = {} } = req.body;
    if (!name || !platform) return res.status(400).json({ error: 'name and platform are required' });
    const channel = await prisma.channel.create({ data: { name, platform, status, config } });
    res.status(201).json(channel);
  } catch (err) { next(err); }
});

// Update a channel
router.patch('/channels/:id', async (req, res, next) => {
  try {
    const { name, platform, status, config } = req.body;
    const channel = await prisma.channel.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(platform && { platform }), ...(status && { status }), ...(config && { config }) },
    });
    res.json(channel);
  } catch (err) { next(err); }
});

// Delete a channel
router.delete('/channels/:id', async (req, res, next) => {
  try {
    await prisma.channel.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

// List channels
router.get('/channels', async (req, res, next) => {
  try {
    const channels = await prisma.channel.findMany({
      include: {
        _count: { select: { distributions: true } },
        distributions: {
          where: { status: 'published' },
          select: { engagementMetrics: true },
          take: 1,
          orderBy: { publishedAt: 'desc' },
        },
      },
    });
    res.json({ data: channels });
  } catch (err) { next(err); }
});

// Schedule content for distribution
router.post('/schedule', async (req, res, next) => {
  try {
    const { outputId, channelId, scheduledAt } = req.body;
    if (!outputId || !channelId) {
      return res.status(400).json({ error: 'outputId and channelId are required' });
    }
    const distribution = await prisma.distribution.create({
      data: {
        outputId,
        channelId,
        status: 'scheduled',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      },
    });
    res.status(201).json(distribution);
  } catch (err) { next(err); }
});

// Get distribution calendar
router.get('/calendar', async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const y = parseInt(year) || now.getFullYear();
    const m = parseInt(month) || now.getMonth() + 1;

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const distributions = await prisma.distribution.findMany({
      where: {
        scheduledAt: { gte: startDate, lte: endDate },
      },
      include: {
        output: { select: { title: true, format: true } },
        channel: { select: { name: true, platform: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
    res.json({ data: distributions, month: m, year: y });
  } catch (err) { next(err); }
});

// List all distributions
router.get('/', async (req, res, next) => {
  try {
    const distributions = await prisma.distribution.findMany({
      take: 50,
      orderBy: { scheduledAt: 'desc' },
      include: {
        output: { select: { title: true } },
        channel: { select: { name: true } },
      },
    });
    res.json({ data: distributions });
  } catch (err) { next(err); }
});

export default router;
