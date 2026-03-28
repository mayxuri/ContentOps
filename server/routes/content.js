import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// List content outputs
router.get('/', async (req, res, next) => {
  try {
    const { format, status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (format) where.format = format;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.contentOutput.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          run: { select: { brief: { select: { topic: true, tone: true } } } },
          _count: { select: { complianceIssues: true, localizations: true, distributions: true } },
        },
      }),
      prisma.contentOutput.count({ where }),
    ]);
    res.json({ data, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
});

// Get single content output
router.get('/:id', async (req, res, next) => {
  try {
    const output = await prisma.contentOutput.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        complianceIssues: true,
        localizations: true,
        distributions: { include: { channel: true } },
      },
    });
    res.json(output);
  } catch (err) { next(err); }
});

// Search content (basic, can be extended with Weaviate)
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    const results = await prisma.contentOutput.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { body: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: results });
  } catch (err) { next(err); }
});

export default router;
