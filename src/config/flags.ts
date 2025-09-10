/**
 * Feature flags for platform-next branch
 * All flags start as false to preserve current behavior
 */
export const flags = {
  // Public marketing site updates with partner entrypoint
  enableNewMarketing: true,
  
  // Member-first navigation and app shell
  enableMemberShell: true,
  
  // Leader/Admin app shell (mounts at /admin2 to avoid collision)
  enableAdminShell: true,
  
  // Messaging system with templates and campaigns
  enableMessaging: true,
  
  // Mutual care ledger with credits and service exchange
  enableCareLedger: true,
  
  // Trust verification via address, church, or workplace email
  enableVerification: true,
  
  // 5C Framework integration across the platform
  enable5C: true,
} as const;

export type FeatureFlag = keyof typeof flags;