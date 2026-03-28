import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createBriefSchema = z.object({
  topic: z.string().min(1).max(200),
  details: z.string().min(1),
  tone: z.string().default('Professional'),
  targetChannels: z.array(z.string()).default(['blog', 'social', 'faq']),
  workspace: z.string().default('Personal'),
});

// Create brief
router.post('/', validate(createBriefSchema), async (req, res, next) => {
  try {
    const brief = await prisma.contentBrief.create({
      data: {
        userId: req.body.userId || (await getDefaultUser()).id,
        workspace: req.body.workspace || 'Personal',
        topic: req.body.topic,
        details: req.body.details,
        tone: req.body.tone || 'Professional',
        targetChannels: req.body.targetChannels || ['blog', 'social', 'faq'],
      },
    });
    res.status(201).json(brief);
  } catch (err) { next(err); }
});

// List briefs
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const where = req.query.workspace ? { workspace: req.query.workspace } : {};
    const [briefs, total] = await Promise.all([
      prisma.contentBrief.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { pipelineRun: { select: { id: true, status: true } } },
      }),
      prisma.contentBrief.count({ where }),
    ]);
    res.json({ data: briefs, total, page, limit });
  } catch (err) { next(err); }
});

// Get single brief
router.get('/:id', async (req, res, next) => {
  try {
    const brief = await prisma.contentBrief.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        pipelineRun: {
          include: { steps: true, outputs: true },
        },
      },
    });
    res.json(brief);
  } catch (err) { next(err); }
});

async function getDefaultUser() {
  return prisma.user.upsert({
    where: { email: 'admin@contentops.ai' },
    create: { email: 'admin@contentops.ai', name: 'Admin User', role: 'admin' },
    update: {},
  });
}

export default router;
