const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
};

exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
};
