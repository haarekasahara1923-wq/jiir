import {
  ManuscriptStatus,
  Role,
} from "@prisma/client";
import {
  MANUSCRIPT_TRANSITIONS,
  hasMinRole,
  type UserForRbac,
} from "./rbac";

// ─────────────────────────────────────────────
// WORKFLOW STATE MACHINE
// ─────────────────────────────────────────────

/**
 * Check if a manuscript status transition is allowed for a given user.
 */
export function canTransition(
  from: ManuscriptStatus,
  to: ManuscriptStatus,
  user: UserForRbac
): { allowed: boolean; reason?: string } {
  const transition = MANUSCRIPT_TRANSITIONS.find(
    (t) => t.from.includes(from) && t.to === to
  );

  if (!transition) {
    return {
      allowed: false,
      reason: `Transition from ${from} to ${to} is not defined in the workflow`,
    };
  }

  if (!hasMinRole(user, transition.minRole)) {
    return {
      allowed: false,
      reason: `You need at least the ${transition.minRole} role to perform this transition`,
    };
  }

  return { allowed: true };
}

/**
 * Get all valid next statuses from a current status for a given user.
 */
export function getValidTransitions(
  from: ManuscriptStatus,
  user: UserForRbac
): ManuscriptStatus[] {
  return MANUSCRIPT_TRANSITIONS.filter(
    (t) => t.from.includes(from) && hasMinRole(user, t.minRole)
  ).map((t) => t.to);
}

/**
 * Assert a transition is valid, throw on failure.
 */
export function assertTransition(
  from: ManuscriptStatus,
  to: ManuscriptStatus,
  user: UserForRbac
): void {
  const { allowed, reason } = canTransition(from, to, user);
  if (!allowed) {
    throw new WorkflowError(reason ?? "Transition not allowed", 403);
  }
}

/**
 * Check if a transition requires a reason/message.
 */
export function transitionRequiresReason(
  from: ManuscriptStatus,
  to: ManuscriptStatus
): boolean {
  const transition = MANUSCRIPT_TRANSITIONS.find(
    (t) => t.from.includes(from) && t.to === to
  );
  return transition?.requiresReason ?? false;
}

// ─────────────────────────────────────────────
// SCHOLAR-FACING STATUS LABELS
// ─────────────────────────────────────────────

export type StatusDisplay = {
  label: string;
  labelHi: string;
  color: string; // Tailwind color class
  description: string;
  step: number; // 1-15 for the stepper
};

export const STATUS_DISPLAY: Record<ManuscriptStatus, StatusDisplay> = {
  SUBMITTED: {
    label: "Submitted",
    labelHi: "प्रस्तुत",
    color: "blue",
    description: "Your manuscript has been received and is awaiting initial review.",
    step: 1,
  },
  INITIAL_EDITORIAL_CHECK: {
    label: "Initial Editorial Check",
    labelHi: "प्रारंभिक संपादकीय जांच",
    color: "blue",
    description: "Your manuscript is undergoing initial editorial screening.",
    step: 2,
  },
  UNDER_PEER_REVIEW: {
    label: "Under Peer Review",
    labelHi: "सहकर्मी समीक्षाधीन",
    color: "purple",
    description: "Your manuscript is being evaluated by expert reviewers.",
    step: 3,
  },
  REVISION_REQUIRED: {
    label: "Revision Required",
    labelHi: "संशोधन आवश्यक",
    color: "amber",
    description: "Reviewers have requested revisions. Please check the comments and submit a revised version.",
    step: 4,
  },
  REVISED_MANUSCRIPT_SUBMITTED: {
    label: "Revised Manuscript Submitted",
    labelHi: "संशोधित पांडुलिपि प्रस्तुत",
    color: "blue",
    description: "Your revised manuscript has been received and is under evaluation.",
    step: 5,
  },
  FINAL_EDITORIAL_DECISION: {
    label: "Final Editorial Decision",
    labelHi: "अंतिम संपादकीय निर्णय",
    color: "purple",
    description: "The editorial team is making a final decision on your manuscript.",
    step: 6,
  },
  ACCEPTED: {
    label: "Accepted",
    labelHi: "स्वीकृत",
    color: "green",
    description: "Congratulations! Your manuscript has been accepted for publication.",
    step: 7,
  },
  PUBLICATION_FEE_REQUIRED: {
    label: "Publication Fee Required",
    labelHi: "प्रकाशन शुल्क आवश्यक",
    color: "amber",
    description: "Your manuscript is accepted. Please pay the Article Processing Charge (APC) to proceed.",
    step: 8,
  },
  PAYMENT_SUBMITTED: {
    label: "Payment Submitted",
    labelHi: "भुगतान प्रस्तुत",
    color: "blue",
    description: "Your payment has been received and is being verified.",
    step: 9,
  },
  PAYMENT_VERIFIED: {
    label: "Payment Verified",
    labelHi: "भुगतान सत्यापित",
    color: "green",
    description: "Payment confirmed. Your manuscript is entering production.",
    step: 10,
  },
  PRODUCTION: {
    label: "In Production",
    labelHi: "उत्पादन में",
    color: "blue",
    description: "Your manuscript is being typeset and formatted for publication.",
    step: 11,
  },
  PROOFREADING: {
    label: "Proofreading",
    labelHi: "प्रूफरीडिंग",
    color: "blue",
    description: "Please review the author proof sent to your email and approve or request corrections.",
    step: 12,
  },
  PUBLISHED: {
    label: "Published",
    labelHi: "प्रकाशित",
    color: "green",
    description: "Your article has been published in JIIR.",
    step: 13,
  },
  REJECTED: {
    label: "Rejected",
    labelHi: "अस्वीकृत",
    color: "red",
    description: "We regret to inform you that your manuscript has not been accepted for publication at this time.",
    step: 0,
  },
  WITHDRAWN: {
    label: "Withdrawn",
    labelHi: "वापस लिया गया",
    color: "gray",
    description: "This manuscript has been withdrawn.",
    step: 0,
  },
};

// ─────────────────────────────────────────────
// WORKFLOW ERROR
// ─────────────────────────────────────────────

export class WorkflowError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "WorkflowError";
    this.statusCode = statusCode;
  }
}

// ─────────────────────────────────────────────
// PAYMENT TIMING
// ─────────────────────────────────────────────

/**
 * Manuscript statuses where payment can be initiated.
 */
export const PAYMENT_REQUIRED_STATUSES: ManuscriptStatus[] = [
  "PUBLICATION_FEE_REQUIRED",
];

export function isPaymentRequired(status: ManuscriptStatus): boolean {
  return PAYMENT_REQUIRED_STATUSES.includes(status);
}

// ─────────────────────────────────────────────
// STEPPER DATA
// ─────────────────────────────────────────────

export const WORKFLOW_STEPS = [
  { step: 1, status: "SUBMITTED" as ManuscriptStatus, label: "Manuscript Submitted" },
  { step: 2, status: "INITIAL_EDITORIAL_CHECK" as ManuscriptStatus, label: "Initial Editorial Check" },
  { step: 3, status: "UNDER_PEER_REVIEW" as ManuscriptStatus, label: "Peer Review" },
  { step: 4, status: "REVISION_REQUIRED" as ManuscriptStatus, label: "Revision (if required)" },
  { step: 5, status: "FINAL_EDITORIAL_DECISION" as ManuscriptStatus, label: "Final Editorial Decision" },
  { step: 6, status: "ACCEPTED" as ManuscriptStatus, label: "Accepted" },
  { step: 7, status: "PUBLICATION_FEE_REQUIRED" as ManuscriptStatus, label: "Publication Fee" },
  { step: 8, status: "PAYMENT_VERIFIED" as ManuscriptStatus, label: "Payment Verified" },
  { step: 9, status: "PRODUCTION" as ManuscriptStatus, label: "Production & Typesetting" },
  { step: 10, status: "PROOFREADING" as ManuscriptStatus, label: "Author Proof" },
  { step: 11, status: "PUBLISHED" as ManuscriptStatus, label: "Published Online" },
];
