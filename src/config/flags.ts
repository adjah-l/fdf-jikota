/**
 * Feature flags for platform-next branch
 * All flags start as false to preserve current behavior
 */
export const flags = {
  // Public marketing site updates with partner entrypoint
  enableNewMarketing: false,
  
  // Member-first navigation and app shell
  enableMemberShell: false,
  
  // Leader/Admin app shell (mounts at /admin2 to avoid collision)
  enableAdminShell: false,
  
  // Messaging system with templates and campaigns
  enableMessaging: false,
  
  // Mutual care ledger with credits and service exchange
  enableCareLedger: false,
  
  // Trust verification via address, church, or workplace email
  enableVerification: false,
} as const;

export type FeatureFlag = keyof typeof flags;