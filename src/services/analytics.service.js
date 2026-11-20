const { db } = require('../db/database');
const authService = require('./auth.service');

const MIN_THRESHOLD = 5;

function getAggregatedStats(user) {
  if (!user || ![
    authService.ROLES.SUPER_ADMIN,
    authService.ROLES.PLATFORM_ADMIN,
    authService.ROLES.SAFEGUARDING_SUPERVISOR,
    authService.ROLES.AUDITOR
  ].includes(user.role)) {
    throw new Error('Forbidden');
  }

  const totalRequests = db.prepare('SELECT COUNT(*) as count FROM help_requests').get().count;
  const newRequests = db.prepare("SELECT COUNT(*) as count FROM help_requests WHERE status = 'NEW'").get().count;
  const urgentRequests = db.prepare("SELECT COUNT(*) as count FROM help_requests WHERE urgency = 'urgent'").get().count;
  const resolvedCases = db.prepare("SELECT COUNT(*) as count FROM help_requests WHERE status IN ('RESOLVED', 'CLOSED')").get().count;
  const totalReferrals = db.prepare('SELECT COUNT(*) as count FROM referrals').get().count;
  const verifiedPartners = db.prepare('SELECT COUNT(*) as count FROM organizations WHERE is_verified = 1').get().count;

  const byGroupRaw = db.prepare('SELECT beneficiary_group as grp, COUNT(*) as count FROM help_requests GROUP BY beneficiary_group').all();
  const byGroup = {};
  for (const row of byGroupRaw) {
    byGroup[row.grp] = row.count >= MIN_THRESHOLD ? row.count : `<${MIN_THRESHOLD} (suppressed)`;
  }

  return {
    totalRequests,
    newRequests,
    urgentRequests,
    resolvedCases,
    totalReferrals,
    verifiedPartners,
    byGroup,
    privacyRule: `Minimum group-size threshold (${MIN_THRESHOLD}) applied to prevent re-identification.`
  };
}

module.exports = {
  getAggregatedStats
};
