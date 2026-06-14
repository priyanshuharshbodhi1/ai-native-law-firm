import type { Clause, ClientContext } from "../domain.js";

export const ndaClauses: Clause[] = [
  {
    id: "definition-confidential-information",
    title: "Definition of Confidential Information",
    category: "core",
    appliesTo: ["discloser", "recipient", "mutual"],
    riskPosture: ["friendly", "balanced", "protective"],
    body:
      "Confidential Information means all non-public information disclosed by or on behalf of a party, whether in oral, written, electronic, visual, or other form, including business plans, product plans, technical information, source code, customer data, pricing, financial information, trade secrets, know-how, and any information that should reasonably be understood to be confidential given the nature of the information and the circumstances of disclosure.",
  },
  {
    id: "exclusions",
    title: "Exclusions",
    category: "core",
    appliesTo: ["discloser", "recipient", "mutual"],
    riskPosture: ["friendly", "balanced", "protective"],
    body:
      "Confidential Information does not include information that the receiving party can demonstrate: (a) is or becomes publicly available without breach of this Agreement; (b) was already known to the receiving party without confidentiality obligation; (c) is lawfully received from a third party without confidentiality obligation; or (d) is independently developed without use of or reference to the disclosing party's Confidential Information.",
  },
  {
    id: "use-and-protection",
    title: "Use and Protection",
    category: "core",
    appliesTo: ["discloser", "recipient", "mutual"],
    riskPosture: ["friendly", "balanced", "protective"],
    body:
      "The receiving party will use Confidential Information only for the Purpose and will protect it using at least reasonable care, and no less than the care it uses to protect its own similar confidential information.",
  },
  {
    id: "representatives",
    title: "Representatives",
    category: "core",
    appliesTo: ["discloser", "recipient", "mutual"],
    riskPosture: ["friendly", "balanced", "protective"],
    body:
      "The receiving party may disclose Confidential Information to its employees, contractors, professional advisers, investors, and representatives who need to know it for the Purpose and are bound by confidentiality obligations at least as protective as this Agreement. The receiving party remains responsible for any breach by its representatives.",
  },
  {
    id: "compelled-disclosure",
    title: "Compelled Disclosure",
    category: "core",
    appliesTo: ["discloser", "recipient", "mutual"],
    riskPosture: ["friendly", "balanced", "protective"],
    body:
      "If the receiving party is required by law, regulation, court order, or governmental authority to disclose Confidential Information, it will, to the extent legally permitted, provide prompt notice to the disclosing party and reasonably cooperate to limit the disclosure.",
  },
  {
    id: "return-or-destruction",
    title: "Return or Destruction",
    category: "core",
    appliesTo: ["discloser", "recipient", "mutual"],
    riskPosture: ["balanced", "protective"],
    body:
      "Upon written request, the receiving party will return or destroy Confidential Information, except that it may retain archival copies required by law, compliance policy, or automated backup systems, subject to continuing confidentiality obligations.",
  },
  {
    id: "no-license",
    title: "No License",
    category: "ip",
    appliesTo: ["discloser", "recipient", "mutual"],
    riskPosture: ["friendly", "balanced", "protective"],
    body:
      "All Confidential Information remains the property of the disclosing party. No license, assignment, or other intellectual property right is granted except the limited right to use Confidential Information for the Purpose.",
  },
  {
    id: "injunctive-relief",
    title: "Equitable Relief",
    category: "remedy",
    appliesTo: ["discloser", "mutual"],
    riskPosture: ["balanced", "protective"],
    body:
      "The parties acknowledge that unauthorized disclosure or misuse of Confidential Information may cause irreparable harm for which monetary damages may be inadequate, and the disclosing party may seek injunctive or equitable relief in addition to other remedies available under law.",
  },
  {
    id: "data-security",
    title: "Data Security and Personal Data",
    category: "data",
    appliesTo: ["discloser", "recipient", "mutual"],
    riskPosture: ["balanced", "protective"],
    body:
      "If Confidential Information includes personal data or regulated data, the receiving party will process it only for the Purpose, implement reasonable security safeguards, promptly notify the disclosing party of any suspected unauthorized access, and comply with applicable data protection laws.",
  },
  {
    id: "non-solicit-light",
    title: "Limited Non-Solicitation",
    category: "commercial",
    appliesTo: ["discloser", "mutual"],
    riskPosture: ["protective"],
    body:
      "For the term of this Agreement and twelve months thereafter, neither party will knowingly solicit for employment the other party's employees or contractors introduced through the Purpose, except through general solicitations not targeted at such persons.",
  },
  {
    id: "residual-knowledge",
    title: "Residual Knowledge",
    category: "recipient-friendly",
    appliesTo: ["recipient", "mutual"],
    riskPosture: ["friendly"],
    body:
      "Nothing in this Agreement restricts the receiving party from using general knowledge, skills, and experience retained in unaided memory, provided it does not intentionally memorize or use Confidential Information to circumvent this Agreement.",
  },
];

export function selectClauses(context: ClientContext, requestedClauseIds: string[]) {
  const requested = new Set(requestedClauseIds);
  const base = ndaClauses.filter((clause) => {
    const roleFit = clause.appliesTo.includes(context.clientRole) || clause.appliesTo.includes("mutual");
    const postureFit = clause.riskPosture.includes(context.riskPosture);
    const coreFit = clause.category === "core" || clause.category === "ip";
    const requestedFit = requested.has(clause.id);
    const dataFit =
      clause.category === "data" &&
      context.confidentialInfoTypes.some((type) => /personal|customer|user|data|dpdp/i.test(type));
    return requestedFit || (roleFit && (postureFit || coreFit || dataFit));
  });

  const byId = new Map(base.map((clause) => [clause.id, clause]));
  for (const id of requested) {
    const clause = ndaClauses.find((candidate) => candidate.id === id);
    if (clause) byId.set(id, clause);
  }
  return Array.from(byId.values());
}
