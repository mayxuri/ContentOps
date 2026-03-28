export function errorHandler(err, req, res, next) {
  console.error(`[${req.method}] ${req.path} ->`, err.message);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Record already exists' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}
