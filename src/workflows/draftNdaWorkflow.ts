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
  const templateClauseIds = inferClauseIdsFromReferenceTemplate(input.referenceTemplateText);
  const clauses = selectClauses(clientContext, [...input.requestedClauseIds, ...templateClauseIds]);

  const clauseSources: ClauseSource[] = clauses.map((clause) => ({
    clauseId: clause.id,
    title: clause.title,
    reason: templateClauseIds.includes(clause.id)
      ? "Included because a similar concept appears in the lawyer's previous template"
      : clause.category === "core"
        ? "Core NDA clause"
        : `Selected for ${clause.category} risk`,
  }));
  if (input.referenceTemplateText?.trim()) {
    clauseSources.unshift({
      clauseId: "lawyer-reference-template",
      title: "Lawyer reference template",
      reason: "The lawyer supplied a previous NDA/template; the workflow used it to identify matching clause concepts and review points.",
    });
  }

  const body = clauses
    .map((clause, index) => `${index + 1}. ${clause.title}\n\n${clause.body}`)
    .join("\n\n");

  const draftMarkdown = [
    template.title.toUpperCase(),
    "",
    template.renderPreamble(clientContext),
    "",
    `Purpose: ${clientContext.purpose}`,
    "",
    `Term: ${clientContext.termMonths} months. Confidentiality obligations survive for ${clientContext.confidentialitySurvivalMonths} months unless a longer period applies to trade secrets or applicable law.`,
    "",
    body,
    "",
    "Governing Law",
    "",
    `This Agreement is governed by the laws of ${clientContext.governingLaw}.`,
    "",
    "Signatures",
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

function inferClauseIdsFromReferenceTemplate(referenceTemplateText = "") {
  const text = referenceTemplateText.toLowerCase();
  const ids = new Set<string>();

  if (/return|destroy|destruction|delete/.test(text)) ids.add("return-or-destruction");
  if (/injunctive|equitable relief|irreparable/.test(text)) ids.add("injunctive-relief");
  if (/personal data|data protection|security|breach|unauthorized access|dpdp/.test(text)) ids.add("data-security");
  if (/non[- ]?solicit|solicitation/.test(text)) ids.add("non-solicit-light");
  if (/residual|unaided memory/.test(text)) ids.add("residual-knowledge");
  if (/license|intellectual property|ip rights|ownership/.test(text)) ids.add("no-license");

  return Array.from(ids);
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

  if (input.referenceTemplateText?.trim()) {
    notes.push("A previous NDA/template was supplied. Lawyer should compare the generated draft against firm-standard positions before sending it out.");
  }

  return notes;
}
