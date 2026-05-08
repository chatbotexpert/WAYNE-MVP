const prisma = require('../prisma');

/**
 * Creates an immutable audit log entry for compliance tracking.
 * @param {string} user_id - The ID of the user performing the action
 * @param {string} action - e.g., 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'
 * @param {string} target_entity - e.g., 'Workforce', 'Company'
 * @param {string} target_id - The ID of the entity being modified
 * @param {string} ip_address - The IP address of the requester
 * @param {object} details - Additional JSON details (e.g., fields changed)
 */
const logAudit = async (user_id, action, target_entity, target_id, ip_address, details = {}) => {
  try {
    await prisma.auditLog.create({
      data: {
        user_id,
        action,
        target_entity,
        target_id,
        ip_address: ip_address || 'unknown',
        details: JSON.stringify(details)
      }
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Non-blocking error, do not crash the app if audit logging fails
  }
};

module.exports = logAudit;
