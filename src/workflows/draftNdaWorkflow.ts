import {
  DraftNdaInputSchema,
  type ClauseSource,
  type DraftNdaInput,
  type DraftNdaOutput,
} from "../domain.js";
import { selectClauses } from "../clauses/ndaClauses.js";
import { getTemplate } from "../templates/ndaTemplates.js";
import { makeAudit } from "../lib/audit.js";
import { findMissingContext } from "../lib/questions.js";

export function draftNdaWorkflow(rawInput: DraftNdaInput): DraftNdaOutput {
  const input = DraftNdaInputSchema.parse(rawInput);
  const { clientContext } = input;
  const template = getTemplate(input.templateId);
  const clauses = selectClauses(clientContext, input.requestedClauseIds);

  const clauseSources: ClauseSource[] = clauses.map((clause) => ({
    clauseId: clause.id,
    title: clause.title,
    reason: clause.category === "core" ? "Core NDA clause" : `Selected for ${clause.category} risk`,
  }));

  const body = clauses
    .map((clause, index) => `### ${index + 1}. ${clause.title}\n\n${clause.body}`)
    .join("\n\n");

  const draftMarkdown = [
    `# ${template.title}`,
    "",
    template.renderPreamble(clientContext),
    "",
    `**Purpose:** ${clientContext.purpose}`,
    "",
    `**Term:** ${clientContext.termMonths} months. Confidentiality obligations survive for ${clientContext.confidentialitySurvivalMonths} months unless a longer period applies to trade secrets or applicable law.`,
    "",
    body,
    "",
    "### Governing Law",
    "",
    `This Agreement is governed by the laws of ${clientContext.governingLaw}.`,
    "",
    "### Signatures",
    "",
    `For ${clientContext.client.legalName}: ___________________`,
    "",
    `For ${clientContext.counterparty.legalName}: ___________________`,
  ].join("\n");

  return {
    workflow: "draft-nda",
    draftMarkdown,
    clauseSources,
    missingContextQuestions: findMissingContext(clientContext),
    lawyerChecklist: [
      "Confirm party names, registered addresses, and signing authority.",
      "Confirm purpose is narrow enough for the actual business discussion.",
      "Confirm confidentiality term and survival period are commercially acceptable.",
      "Check whether personal data, source code, trade secrets, or customer data need stronger controls.",
      "Confirm dispute forum, governing law, stamp duty, and execution requirements.",
      "Remove or revise any clause that is not enforceable or appropriate in the relevant jurisdiction.",
    ],
    riskNotes: buildRiskNotes(input),
    audit: makeAudit(),
  };
}

function buildRiskNotes(input: DraftNdaInput) {
  const notes: string[] = [];
  const { clientContext } = input;

  if (clientContext.clientRole === "recipient" && clientContext.riskPosture === "protective") {
    notes.push("Protective posture may be too discloser-friendly for a recipient. Consider residual knowledge and narrower return/destruction obligations.");
  }

  if (clientContext.confidentialInfoTypes.some((type) => /personal|customer|user|data|dpdp/i.test(type))) {
    notes.push("Personal/customer data appears in scope. Lawyer should check DPDP/data protection obligations and security language.");
  }

  if (clientContext.specialConcerns.length > 0) {
    notes.push(`Special concerns to review: ${clientContext.specialConcerns.join("; ")}.`);
  }

  return notes;
}
