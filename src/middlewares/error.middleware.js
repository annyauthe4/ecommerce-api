module.exports = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
  });
};