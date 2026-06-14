import { describe, expect, it } from "vitest";
import draftInput from "../samples/draft-input.json" with { type: "json" };
import { DraftNdaInputSchema } from "../src/domain.js";
import { draftNdaWorkflow } from "../src/workflows/draftNdaWorkflow.js";

describe("draftNdaWorkflow", () => {
  it("generates a draft with clause sources and lawyer checklist", () => {
    const result = draftNdaWorkflow(DraftNdaInputSchema.parse(draftInput));

    expect(result.workflow).toBe("draft-nda");
    expect(result.draftMarkdown).toContain("MUTUAL SAAS NDA - INDIA");
    expect(result.draftMarkdown).toContain("Data Security and Personal Data");
    expect(result.clauseSources.length).toBeGreaterThan(4);
    expect(result.lawyerChecklist.length).toBeGreaterThan(3);
    expect(result.audit.humanReviewRequired).toBe(true);
  });
});
