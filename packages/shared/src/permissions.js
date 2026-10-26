/**
 * ROLE-BASED ACCESS CONTROL (RBAC) SPECIFICATION
 * 6 Mandatory Roles:
 * 1. Super Admin: Unrestricted platform authority, billing, roles, system settings
 * 2. Content Admin: Subjects, topics, notes, articles, covers, PDF uploads & previews
 * 3. Marketing Admin: Ad slots, direct sponsors, newsletter campaigns, announcements
 * 4. Support Admin: Student inquiries, purchase verification, reading issues, refund requests
 * 5. Security Analyst: Audit logs, security events, failed auth, rate-limit monitors, abuse investigation
 * 6. Student: Personal purchases, secure reading, bookmarks, account settings
 */

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_ADMIN: 'content_admin',
  MARKETING_ADMIN: 'marketing_admin',
  SUPPORT_ADMIN: 'support_admin',
  SECURITY_ANALYST: 'security_analyst',
  STUDENT: 'student',
};

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.CONTENT_ADMIN,
  ROLES.MARKETING_ADMIN,
  ROLES.SUPPORT_ADMIN,
  ROLES.SECURITY_ANALYST,
];

export const PERMISSIONS = {
  // Content permissions
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_EDIT: 'content:edit',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',

  // PDF & Policy permissions
  PDF_VIEW_PROTECTED: 'pdf:view_protected',
  PDF_MANAGE_POLICY: 'pdf:manage_policy',
  WATERMARK_CONFIGURE: 'watermark:configure',

  // Commerce & Entitlements
  COMMERCE_VIEW_ORDERS: 'commerce:view_orders',
  COMMERCE_REFUND: 'commerce:refund',
  COMMERCE_GRANT_MANUAL: 'commerce:grant_manual',
  COMMERCE_MANAGE_COUPONS: 'commerce:manage_coupons',

  // Advertising & Monetization
  ADS_MANAGE: 'ads:manage',
  SPONSORS_MANAGE: 'sponsors:manage',

  // Marketing & Communications
  NEWSLETTER_MANAGE: 'newsletter:manage',
  MESSAGING_MANAGE: 'messaging:manage',

  // Security & Audit
  AUDIT_VIEW: 'audit:view',
  SECURITY_MONITOR: 'security:monitor',
  SECURITY_MANAGE: 'security:manage',

  // User & Role Management
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
  ROLES_ASSIGN: 'roles:assign',
  SETTINGS_SYSTEM: 'settings:system',
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.CONTENT_ADMIN]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.PDF_MANAGE_POLICY,
  ],
  [ROLES.MARKETING_ADMIN]: [
    PERMISSIONS.ADS_MANAGE,
    PERMISSIONS.SPONSORS_MANAGE,
    PERMISSIONS.NEWSLETTER_MANAGE,
    PERMISSIONS.MESSAGING_MANAGE,
    PERMISSIONS.COMMERCE_MANAGE_COUPONS,
    PERMISSIONS.CONTENT_VIEW,
  ],
  [ROLES.SUPPORT_ADMIN]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.COMMERCE_VIEW_ORDERS,
    PERMISSIONS.CONTENT_VIEW,
  ],
  [ROLES.SECURITY_ANALYST]: [
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.SECURITY_MONITOR,
    PERMISSIONS.USERS_VIEW,
  ],
  [ROLES.STUDENT]: [
    PERMISSIONS.PDF_VIEW_PROTECTED, // only for their own entitled notes
  ],
};

export function hasPermission(userRole, requiredPermission) {
  if (!userRole) return false;
  if (userRole === ROLES.SUPER_ADMIN) return true;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(requiredPermission);
}

export function isAdmin(userRole) {
  return ADMIN_ROLES.includes(userRole);
}

export default {
  ROLES,
  ADMIN_ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  isAdmin,
};
