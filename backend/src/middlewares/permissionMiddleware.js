const prisma = require('../prisma');

/**
 * Middleware to check if the user has a specific permission flag.
 * Usage: router.delete('/', protect, requirePermission('can_delete_records'), deleteRecord)
 * 
 * Note: 'Super_Admin' role inherently bypasses all permission checks.
 */
const requirePermission = (requiredFlag) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authorized, no user found.' });
      }

      // Super Admins automatically pass all permission checks
      if (req.user.role === 'Super_Admin') {
        return next();
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { permission_flags: true }
      });

      if (!user || !user.permission_flags) {
        return res.status(403).json({ message: 'Forbidden. No permissions configured for this user.' });
      }

      if (user.permission_flags[requiredFlag] === true) {
        next();
      } else {
        res.status(403).json({ message: `Forbidden. Missing required permission: ${requiredFlag}` });
      }
    } catch (error) {
      console.error('Permission Check Error:', error);
      res.status(500).json({ message: 'Server Error during permission check.' });
    }
  };
};

module.exports = { requirePermission };
