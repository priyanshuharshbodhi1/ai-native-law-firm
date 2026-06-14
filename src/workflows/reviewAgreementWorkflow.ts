import {
  ReviewAgreementInputSchema,
  type ReviewAgreementInput,
  type ReviewAgreementOutput,
  type ReviewIssue,
} from "../domain.js";
import { makeAudit } from "../lib/audit.js";

interface Rule {
  id: string;
  title: string;
  severity: ReviewIssue["severity"];
  test: (text: string, input: ReviewAgreementInput) => boolean;
  issue: string;
  whyItMatters: string;
  suggestedRedline: string;
}

const rules: Rule[] = [
  {
    id: "missing-purpose",
    title: "Purpose",
    severity: "high",
    test: (text) => !/\bpurpose\b|\bpermitted use\b|\bevaluation\b/i.test(text),
    issue: "The agreement does not clearly limit the permitted purpose.",
    whyItMatters: "A narrow purpose prevents the recipient from using information beyond the intended deal discussion.",
    suggestedRedline: "Add a clause: Confidential Information may be used solely to evaluate and discuss the specific transaction or relationship described in the agreement.",
  },
  {
    id: "weak-confidential-info-definition",
    title: "Confidential Information Definition",
    severity: "medium",
    test: (text) => !/confidential information means|non-public information|proprietary information/i.test(text),
    issue: "The definition of Confidential Information may be missing or too vague.",
    whyItMatters: "The definition controls what is protected, including oral disclosures, technical information, trade secrets, and customer data.",
    suggestedRedline: "Define Confidential Information broadly to include written, oral, electronic, visual, technical, business, financial, customer, and product information.",
  },
  {
    id: "no-exclusions",
    title: "Standard Exclusions",
    severity: "medium",
    test: (text) => !/publicly available|already known|independently developed|third party/i.test(text),
    issue: "Standard exclusions are missing.",
    whyItMatters: "Recipients usually need exclusions for public information, prior knowledge, lawful third-party information, and independent development.",
    suggestedRedline: "Add exclusions for information that is public, already known without restriction, lawfully received from a third party, or independently developed.",
  },
  {
    id: "no-return-destruction",
    title: "Return or Destruction",
    severity: "medium",
    test: (text) => !/return|destroy|destruction|delete/i.test(text),
    issue: "No return/destruction mechanism found.",
    whyItMatters: "The discloser may need a way to force cleanup after discussions end.",
    suggestedRedline: "On written request, recipient must return or destroy Confidential Information, except archival/legal backup copies subject to continuing obligations.",
  },
  {
    id: "no-compelled-disclosure",
    title: "Compelled Disclosure",
    severity: "low",
    test: (text) => !/court order|subpoena|required by law|governmental authority|regulator/i.test(text),
    issue: "Compelled disclosure process is missing.",
    whyItMatters: "A recipient may be legally forced to disclose, but the discloser should usually receive notice and a chance to protect the information.",
    suggestedRedline: "If disclosure is legally required, recipient must provide prompt notice where permitted and cooperate to limit disclosure.",
  },
  {
    id: "overbroad-noncompete",
    title: "Restrictive Covenant",
    severity: "high",
    test: (text) => /non-?compete|shall not compete|competing business/i.test(text),
    issue: "The agreement appears to include a non-compete or broad restrictive covenant.",
    whyItMatters: "A non-compete inside an NDA can create major business and enforceability concerns, especially for startups.",
    suggestedRedline: "Delete non-compete language. If needed, replace with narrow non-use and non-disclosure obligations tied to Confidential Information.",
  },
  {
    id: "no-data-security",
    title: "Data Security",
    severity: "medium",
    test: (text, input) =>
      input.clientContext.confidentialInfoTypes.some((type) => /personal|customer|user|data|dpdp/i.test(type)) &&
      !/security|personal data|data protection|breach|unauthorized access/i.test(text),
    issue: "Data/security language is missing despite personal or customer data being in scope.",
    whyItMatters: "If customer or personal data is shared, the NDA should address handling, safeguards, and breach notice.",
    suggestedRedline: "Add data-security obligations, processing limits, reasonable safeguards, and prompt breach notification.",
  },
];

export function reviewAgreementWorkflow(rawInput: ReviewAgreementInput): ReviewAgreementOutput {
  const input = ReviewAgreementInputSchema.parse(rawInput);
  const normalized = input.agreementText.replace(/\s+/g, " ").trim();
  const issues = rules
    .filter((rule) => rule.test(normalized, input))
    .map((rule) => ({
      severity: rule.severity,
      clauseTitle: rule.title,
      issue: rule.issue,
      whyItMatters: rule.whyItMatters,
      suggestedRedline: rule.suggestedRedline,
    }));

  const highCount = issues.filter((issue) => issue.severity === "high").length;
  const mediumCount = issues.filter((issue) => issue.severity === "medium").length;

  return {
    workflow: "review-agreement",
    summary: `Found ${issues.length} issue(s): ${highCount} high, ${mediumCount} medium. Lawyer should review before signature.`,
    issues,
    negotiationPoints: issues.map((issue) => `${issue.clauseTitle}: ${issue.issue}`),
    lawyerChecklist: [
      "Confirm the client role: discloser, recipient, or mutual.",
      "Check whether the NDA is standalone or conflicts with a master agreement, term sheet, or DPA.",
      "Confirm governing law, dispute forum, and execution requirements.",
      "Review all high-severity issues before sending redlines.",
      "Confirm commercial acceptability of term, survival, representatives, and return/destruction obligations.",
    ],
    audit: makeAudit(),
  };
}
