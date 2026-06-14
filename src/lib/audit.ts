import type { WorkflowAudit } from "../domain.js";

export function makeAudit(modelUsed = "deterministic-v0"): WorkflowAudit {
  return {
    generatedAt: new Date().toISOString(),
    modelUsed,
    humanReviewRequired: true,
    disclaimer:
      "Draft output only. A licensed lawyer must review, edit, approve, and own the final legal advice or document.",
  };
}
