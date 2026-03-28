import { Router } from 'express';
import { prisma } from '../index.js';
import { runPipeline } from '../services/agentOrchestrator.js';

const router = Router();

// Trigger a pipeline run
router.post('/run', async (req, res, next) => {
  try {
    const { briefId } = req.body;
    if (!briefId) return res.status(400).json({ error: 'briefId is required' });

    const brief = await prisma.contentBrief.findUniqueOrThrow({ where: { id: briefId } });

    // Create the run record
    const run = await prisma.pipelineRun.create({
      data: {
        briefId: brief.id,
        userId: brief.userId,
        status: 'running',
        startedAt: new Date(),
      },
    });

    // Run pipeline asynchronously
    runPipeline(run.id, brief).catch(err => {
      console.error('Pipeline error:', err);
    });

    res.status(202).json({ runId: run.id, status: 'running' });
  } catch (err) { next(err); }
});

// Get pipeline run status
router.get('/runs/:id', async (req, res, next) => {
  try {
    const run = await prisma.pipelineRun.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        steps: { orderBy: { createdAt: 'asc' } },
        outputs: true,
        brief: true,
      },
    });
    res.json(run);
  } catch (err) { next(err); }
});

// List recent runs
router.get('/runs', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const runs = await prisma.pipelineRun.findMany({
      take: limit,
      orderBy: { startedAt: 'desc' },
      include: {
        brief: { select: { topic: true } },
        steps: { select: { agentName: true, status: true, durationS: true } },
      },
    });
    res.json({ data: runs });
  } catch (err) { next(err); }
});

router.delete('/runs/:id', async (req, res, next) => {
  try {
    await prisma.pipelineRun.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
