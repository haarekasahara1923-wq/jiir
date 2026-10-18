import { Role, ManuscriptStatus } from "@prisma/client";

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

export type Permission =
  // User management
  | "users:list"
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "users:block"
  | "users:impersonate"
  | "users:force_verify"
  | "users:reset_password"
  | "users:change_role"
  // Manuscripts
  | "manuscripts:list_all"
  | "manuscripts:view_all"
  | "manuscripts:assign_editor"
  | "manuscripts:invite_reviewer"
  | "manuscripts:initial_check"
  | "manuscripts:request_revision"
  | "manuscripts:accept"
  | "manuscripts:reject"
  | "manuscripts:publish"
  | "manuscripts:withdraw"
  | "manuscripts:upload_staff_files"
  | "manuscripts:view_internal_notes"
  | "manuscripts:skip_peer_review"
  // Reviews
  | "reviews:view_assigned"
  | "reviews:submit"
  | "reviews:view_all"
  // Payments
  | "payments:view_all"
  | "payments:verify_manual"
  | "payments:refund"
  | "payments:create_fee_request"
  | "payments:waive"
  // Issues & Articles
  | "issues:manage"
  | "articles:manage"
  // Certificates
  | "certificates:issue"
  | "certificates:revoke"
  | "certificates:view_all"
  // Editorial Board
  | "editorial:manage"
  // Content / Pages
  | "content:manage"
  | "settings:view"
  | "settings:edit"
  | "settings:edit_sensitive" // Razorpay keys, SMTP
  // Indexing
  | "indexing:manage"
  | "indexing:mark_indexed" // SUPER_ADMIN only
  // Enquiries
  | "enquiries:view"
  | "enquiries:reply"
  | "enquiries:assign"
  // Conferences
  | "conferences:manage"
  // Audit & System
  | "audit:view"
  | "system:health"
  | "system:export"
  | "system:backup"
  // Scholar (own resources only)
  | "scholar:submit_manuscript"
  | "scholar:view_own_manuscripts"
  | "scholar:pay_fee"
  | "scholar:download_certificates";

// ─────────────────────────────────────────────
// PERMISSION MATRIX
// ─────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "users:list",
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "users:block",
    "users:impersonate",
    "users:force_verify",
    "users:reset_password",
    "users:change_role",
    "manuscripts:list_all",
    "manuscripts:view_all",
    "manuscripts:assign_editor",
    "manuscripts:invite_reviewer",
    "manuscripts:initial_check",
    "manuscripts:request_revision",
    "manuscripts:accept",
    "manuscripts:reject",
    "manuscripts:publish",
    "manuscripts:withdraw",
    "manuscripts:upload_staff_files",
    "manuscripts:view_internal_notes",
    "manuscripts:skip_peer_review",
    "reviews:view_all",
    "payments:view_all",
    "payments:verify_manual",
    "payments:refund",
    "payments:create_fee_request",
    "payments:waive",
    "issues:manage",
    "articles:manage",
    "certificates:issue",
    "certificates:revoke",
    "certificates:view_all",
    "editorial:manage",
    "content:manage",
    "settings:view",
    "settings:edit",
    "settings:edit_sensitive",
    "indexing:manage",
    "indexing:mark_indexed",
    "enquiries:view",
    "enquiries:reply",
    "enquiries:assign",
    "conferences:manage",
    "audit:view",
    "system:health",
    "system:export",
    "system:backup",
  ],

  CHIEF_EDITOR: [
    "users:list",
    "users:view",
    "users:block",
    "users:reset_password",
    "manuscripts:list_all",
    "manuscripts:view_all",
    "manuscripts:assign_editor",
    "manuscripts:invite_reviewer",
    "manuscripts:initial_check",
    "manuscripts:request_revision",
    "manuscripts:accept",
    "manuscripts:reject",
    "manuscripts:publish",
    "manuscripts:withdraw",
    "manuscripts:upload_staff_files",
    "manuscripts:view_internal_notes",
    "manuscripts:skip_peer_review",
    "reviews:view_all",
    "payments:view_all",
    "payments:verify_manual",
    "payments:create_fee_request",
    "payments:waive",
    "issues:manage",
    "articles:manage",
    "certificates:issue",
    "certificates:revoke",
    "certificates:view_all",
    "editorial:manage",
    "content:manage",
    "settings:view",
    "settings:edit",
    "enquiries:view",
    "enquiries:reply",
    "enquiries:assign",
    "conferences:manage",
    "audit:view",
    "system:health",
  ],

  EDITOR: [
    "users:list",
    "users:view",
    "manuscripts:list_all",
    "manuscripts:view_all",
    "manuscripts:assign_editor",
    "manuscripts:invite_reviewer",
    "manuscripts:initial_check",
    "manuscripts:request_revision",
    "manuscripts:withdraw",
    "manuscripts:upload_staff_files",
    "manuscripts:view_internal_notes",
    "reviews:view_all",
    "payments:view_all",
    "payments:verify_manual",
    "certificates:view_all",
    "editorial:manage",
    "content:manage",
    "settings:view",
    "enquiries:view",
    "enquiries:reply",
    "conferences:manage",
    "system:health",
  ],

  REVIEWER: [
    "reviews:view_assigned",
    "reviews:submit",
    "system:health",
  ],

  SCHOLAR: [
    "scholar:submit_manuscript",
    "scholar:view_own_manuscripts",
    "scholar:pay_fee",
    "scholar:download_certificates",
  ],
};

// ─────────────────────────────────────────────
// PERMISSION CHECK FUNCTIONS
// ─────────────────────────────────────────────

export type UserForRbac = {
  id: string;
  role: Role;
};

/**
 * Check if a user has a specific permission.
 */
export function can(user: UserForRbac, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[user.role];
  return permissions.includes(permission);
}

/**
 * Check if a user has all of the specified permissions.
 */
export function canAll(user: UserForRbac, permissions: Permission[]): boolean {
  return permissions.every((p) => can(user, p));
}

/**
 * Check if a user has any of the specified permissions.
 */
export function canAny(user: UserForRbac, permissions: Permission[]): boolean {
  return permissions.some((p) => can(user, p));
}

/**
 * Assert that a user has a permission, throwing a 403 error if not.
 */
export function requirePermission(
  user: UserForRbac | null | undefined,
  permission: Permission
): void {
  if (!user) {
    throw new RbacError("Authentication required", 401);
  }
  if (!can(user, permission)) {
    throw new RbacError(
      `Access denied: you do not have the '${permission}' permission`,
      403
    );
  }
}

/**
 * Check if a user is a staff member (non-scholar).
 */
export function isStaff(user: UserForRbac): boolean {
  return [
    "SUPER_ADMIN",
    "CHIEF_EDITOR",
    "EDITOR",
    "REVIEWER",
  ].includes(user.role);
}

/**
 * Check if a user can make a final decision (accept/reject/publish).
 */
export function canMakeFinalDecision(user: UserForRbac): boolean {
  return ["SUPER_ADMIN", "CHIEF_EDITOR"].includes(user.role);
}

/**
 * Get permissions for a role.
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

// ─────────────────────────────────────────────
// MANUSCRIPT WORKFLOW TRANSITIONS
// (also defined in workflow.ts for full state machine)
// ─────────────────────────────────────────────

export type ManuscriptTransition = {
  from: ManuscriptStatus[];
  to: ManuscriptStatus;
  minRole: Role;
  requiresReason?: boolean;
  description: string;
};

export const MANUSCRIPT_TRANSITIONS: ManuscriptTransition[] = [
  {
    from: ["SUBMITTED"],
    to: "INITIAL_EDITORIAL_CHECK",
    minRole: "EDITOR",
    description: "Begin initial editorial screening",
  },
  {
    from: ["INITIAL_EDITORIAL_CHECK"],
    to: "UNDER_PEER_REVIEW",
    minRole: "EDITOR",
    description: "Send to peer review",
  },
  {
    from: ["UNDER_PEER_REVIEW", "FINAL_EDITORIAL_DECISION"],
    to: "REVISION_REQUIRED",
    minRole: "EDITOR",
    requiresReason: true,
    description: "Request revision from author",
  },
  {
    from: ["REVISION_REQUIRED"],
    to: "REVISED_MANUSCRIPT_SUBMITTED",
    minRole: "SCHOLAR",
    description: "Scholar submits revised manuscript",
  },
  {
    from: ["REVISED_MANUSCRIPT_SUBMITTED"],
    to: "UNDER_PEER_REVIEW",
    minRole: "EDITOR",
    description: "Send revised manuscript back to review",
  },
  {
    from: ["UNDER_PEER_REVIEW", "REVISED_MANUSCRIPT_SUBMITTED"],
    to: "FINAL_EDITORIAL_DECISION",
    minRole: "EDITOR",
    description: "Move to final editorial decision",
  },
  {
    from: ["FINAL_EDITORIAL_DECISION", "UNDER_PEER_REVIEW"],
    to: "ACCEPTED",
    minRole: "CHIEF_EDITOR",
    description: "Accept manuscript (Chief Editor / Super Admin only)",
  },
  {
    from: [
      "INITIAL_EDITORIAL_CHECK",
      "UNDER_PEER_REVIEW",
      "REVISION_REQUIRED",
      "FINAL_EDITORIAL_DECISION",
    ],
    to: "REJECTED",
    minRole: "CHIEF_EDITOR",
    requiresReason: true,
    description: "Reject manuscript (Chief Editor / Super Admin only)",
  },
  {
    from: ["ACCEPTED"],
    to: "PUBLICATION_FEE_REQUIRED",
    minRole: "CHIEF_EDITOR",
    description: "Request publication fee",
  },
  {
    from: ["PAYMENT_VERIFIED"],
    to: "PRODUCTION",
    minRole: "EDITOR",
    description: "Move to production",
  },
  {
    from: ["PRODUCTION"],
    to: "PROOFREADING",
    minRole: "EDITOR",
    description: "Send author proof",
  },
  {
    from: ["PROOFREADING"],
    to: "PUBLISHED",
    minRole: "CHIEF_EDITOR",
    description: "Publish article (Chief Editor / Super Admin only)",
  },
  {
    from: [
      "SUBMITTED",
      "INITIAL_EDITORIAL_CHECK",
      "UNDER_PEER_REVIEW",
      "REVISION_REQUIRED",
      "FINAL_EDITORIAL_DECISION",
      "ACCEPTED",
      "PUBLICATION_FEE_REQUIRED",
      "PAYMENT_SUBMITTED",
      "PAYMENT_VERIFIED",
      "PRODUCTION",
      "PROOFREADING",
    ],
    to: "WITHDRAWN",
    minRole: "SCHOLAR",
    requiresReason: true,
    description: "Withdraw manuscript",
  },
];

// ─────────────────────────────────────────────
// ERROR CLASS
// ─────────────────────────────────────────────

export class RbacError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode = 403) {
    super(message);
    this.name = "RbacError";
    this.statusCode = statusCode;
  }
}

// ─────────────────────────────────────────────
// ROLE HIERARCHY HELPERS
// ─────────────────────────────────────────────

const ROLE_RANK: Record<Role, number> = {
  SUPER_ADMIN: 5,
  CHIEF_EDITOR: 4,
  EDITOR: 3,
  REVIEWER: 2,
  SCHOLAR: 1,
};

export function roleRank(role: Role): number {
  return ROLE_RANK[role];
}

export function hasMinRole(user: UserForRbac, minRole: Role): boolean {
  return roleRank(user.role) >= roleRank(minRole);
}
