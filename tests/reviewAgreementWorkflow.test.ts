import { describe, expect, it } from "vitest";
import reviewInput from "../samples/review-input.json" with { type: "json" };
import { ReviewAgreementInputSchema } from "../src/domain.js";
import { reviewAgreementWorkflow } from "../src/workflows/reviewAgreementWorkflow.js";

describe("reviewAgreementWorkflow", () => {
  it("flags high-risk non-compete language and missing protections", () => {
    const result = reviewAgreementWorkflow(ReviewAgreementInputSchema.parse(reviewInput));

    expect(result.workflow).toBe("review-agreement");
    expect(result.issues.some((issue) => issue.clauseTitle === "Restrictive Covenant")).toBe(true);
    expect(result.issues.some((issue) => issue.severity === "high")).toBe(true);
    expect(result.negotiationPoints.length).toBe(result.issues.length);
    expect(result.audit.humanReviewRequired).toBe(true);
  });
});
