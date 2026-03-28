import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler.js';
import briefsRouter from './routes/briefs.js';
import pipelineRouter from './routes/pipeline.js';
import contentRouter from './routes/content.js';
import complianceRouter from './routes/compliance.js';
import localizationRouter from './routes/localization.js';
import distributionRouter from './routes/distribution.js';
import analyticsRouter from './routes/analytics.js';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/briefs', briefsRouter);
app.use('/api/pipeline', pipelineRouter);
app.use('/api/content', contentRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/localization', localizationRouter);
app.use('/api/distribution', distributionRouter);
app.use('/api/analytics', analyticsRouter);

// Error handler
app.use(errorHandler);

// Start
async function start() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    // Clean up any runs that were left 'running' from a previous crashed process
    const cleaned = await prisma.pipelineRun.updateMany({
      where: { status: 'running' },
      data: { status: 'failed' },
    });
    if (cleaned.count > 0) console.log(`Cleaned up ${cleaned.count} orphaned pipeline run(s)`);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();
