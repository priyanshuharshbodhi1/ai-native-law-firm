import * as z from "zod";

export const PartySchema = z.object({
  legalName: z.string().min(1),
  entityType: z.string().optional(),
  address: z.string().optional(),
  signatoryName: z.string().optional(),
  signatoryTitle: z.string().optional(),
});

export const ClientContextSchema = z.object({
  client: PartySchema,
  counterparty: PartySchema,
  clientRole: z.enum(["discloser", "recipient", "mutual"]),
  jurisdiction: z.string().default("India"),
  governingLaw: z.string().default("India"),
  purpose: z.string().min(10),
  transactionContext: z.string().optional(),
  confidentialInfoTypes: z.array(z.string()).min(1),
  termMonths: z.number().int().positive().default(24),
  confidentialitySurvivalMonths: z.number().int().positive().default(36),
  riskPosture: z.enum(["friendly", "balanced", "protective"]).default("balanced"),
  specialConcerns: z.array(z.string()).default([]),
});

export const DraftNdaInputSchema = z.object({
  templateId: z.enum(["startup-unilateral-india", "mutual-saas-india", "short-form-india"]),
  clientContext: ClientContextSchema,
  requestedClauseIds: z.array(z.string()).default([]),
  referenceTemplateText: z.string().optional(),
  lawyerReviewer: z.string().optional(),
});

export const ReviewAgreementInputSchema = z.object({
  agreementText: z.string().min(200),
  clientContext: ClientContextSchema,
  reviewGoal: z.enum(["sign-fast", "negotiate-balanced", "maximize-protection"]).default("negotiate-balanced"),
  lawyerReviewer: z.string().optional(),
});

export type Party = z.infer<typeof PartySchema>;
export type ClientContext = z.infer<typeof ClientContextSchema>;
export type DraftNdaInput = z.infer<typeof DraftNdaInputSchema>;
export type ReviewAgreementInput = z.infer<typeof ReviewAgreementInputSchema>;

export type Severity = "low" | "medium" | "high";

export interface Clause {
  id: string;
  title: string;
  category: string;
  body: string;
  appliesTo: Array<"discloser" | "recipient" | "mutual">;
  riskPosture: Array<"friendly" | "balanced" | "protective">;
}

export interface MissingContextQuestion {
  field: string;
  question: string;
  whyItMatters: string;
}

export interface ClauseSource {
  clauseId: string;
  title: string;
  reason: string;
}

export interface DraftNdaOutput {
  workflow: "draft-nda";
  draftMarkdown: string;
  clauseSources: ClauseSource[];
  missingContextQuestions: MissingContextQuestion[];
  lawyerChecklist: string[];
  riskNotes: string[];
  audit: WorkflowAudit;
}

export interface ReviewIssue {
  severity: Severity;
  clauseTitle: string;
  issue: string;
  whyItMatters: string;
  suggestedRedline: string;
}

export interface ReviewAgreementOutput {
  workflow: "review-agreement";
  summary: string;
  issues: ReviewIssue[];
  negotiationPoints: string[];
  lawyerChecklist: string[];
  audit: WorkflowAudit;
}

export interface WorkflowAudit {
  generatedAt: string;
  modelUsed: string;
  humanReviewRequired: true;
  disclaimer: string;
}
