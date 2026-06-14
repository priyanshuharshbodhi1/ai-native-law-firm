import type { ClientContext } from "../domain.js";

export interface NdaTemplate {
  id: "startup-unilateral-india" | "mutual-saas-india" | "short-form-india";
  title: string;
  description: string;
  renderPreamble: (context: ClientContext) => string;
}

export const ndaTemplates: NdaTemplate[] = [
  {
    id: "startup-unilateral-india",
    title: "Startup Unilateral NDA - India",
    description: "Protective unilateral NDA for startup/customer/vendor diligence.",
    renderPreamble: (context) =>
      `This Non-Disclosure Agreement is entered into between ${context.client.legalName} and ${context.counterparty.legalName} for the purpose of ${context.purpose}.`,
  },
  {
    id: "mutual-saas-india",
    title: "Mutual SaaS NDA - India",
    description: "Mutual NDA for SaaS partnership, integration, vendor, or customer discussions.",
    renderPreamble: (context) =>
      `This Mutual Non-Disclosure Agreement is entered into between ${context.client.legalName} and ${context.counterparty.legalName} in connection with ${context.purpose}.`,
  },
  {
    id: "short-form-india",
    title: "Short-Form NDA - India",
    description: "Short NDA for early conversations where speed matters.",
    renderPreamble: (context) =>
      `${context.client.legalName} and ${context.counterparty.legalName} agree to keep confidential information shared for ${context.purpose} confidential under the terms below.`,
  },
];

export function getTemplate(templateId: NdaTemplate["id"]) {
  const template = ndaTemplates.find((candidate) => candidate.id === templateId);
  if (!template) {
    throw new Error(`Unknown NDA template: ${templateId}`);
  }
  return template;
}
