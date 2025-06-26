const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'NOT_FOUND',
    details: {
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
};

export default notFound;
