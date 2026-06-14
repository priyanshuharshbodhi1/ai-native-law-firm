import type { DraftNdaInput, DraftNdaOutput, ReviewAgreementInput, ReviewAgreementOutput } from "../domain.js";
import { draftNdaWorkflow } from "../workflows/draftNdaWorkflow.js";
import { reviewAgreementWorkflow } from "../workflows/reviewAgreementWorkflow.js";

export class NdaBuilderAgent {
  draft(input: DraftNdaInput): DraftNdaOutput {
    return draftNdaWorkflow(input);
  }

  review(input: ReviewAgreementInput): ReviewAgreementOutput {
    return reviewAgreementWorkflow(input);
  }
}

export const ndaBuilderAgent = new NdaBuilderAgent();
