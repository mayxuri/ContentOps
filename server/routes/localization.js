import { Router } from 'express';
import { prisma } from '../index.js';

const router = Router();

// Get localizations for a content output
router.get('/:outputId', async (req, res, next) => {
  try {
    const localizations = await prisma.localization.findMany({
      where: { outputId: req.params.outputId },
      orderBy: { qualityScore: 'desc' },
    });
    const output = await prisma.contentOutput.findUnique({
      where: { id: req.params.outputId },
      select: { title: true, body: true },
    });
    res.json({ source: output, localizations });
  } catch (err) { next(err); }
});

// List all localizations with stats
router.get('/', async (req, res, next) => {
  try {
    const localizations = await prisma.localization.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { output: { select: { title: true, format: true } } },
    });

    // Group by language
    const byLanguage = {};
    for (const loc of localizations) {
      if (!byLanguage[loc.languageCode]) {
        byLanguage[loc.languageCode] = {
          code: loc.languageCode,
          name: loc.languageName,
          count: 0,
          avgQuality: 0,
          totalQuality: 0,
        };
      }
      byLanguage[loc.languageCode].count++;
      byLanguage[loc.languageCode].totalQuality += loc.qualityScore;
    }
    for (const lang of Object.values(byLanguage)) {
      lang.avgQuality = Math.round((lang.totalQuality / lang.count) * 10) / 10;
      delete lang.totalQuality;
    }

    res.json({ languages: Object.values(byLanguage), recent: localizations.slice(0, 10) });
  } catch (err) { next(err); }
});

export default router;
