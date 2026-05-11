const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    // Super_Admin has access to all protected routes
    if (req.user.role === 'Super_Admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden, insufficient permissions' });
    }
    next();
  };
};

module.exports = { authorize };
