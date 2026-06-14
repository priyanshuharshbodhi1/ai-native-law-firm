import type { DraftNdaInput, DraftNdaOutput, ReviewAgreementInput, ReviewAgreementOutput } from "../domain.js";
import { createReviewMemoWithAi, polishDraftWithAi } from "../services/aiProvider.js";
import { draftNdaWorkflow } from "../workflows/draftNdaWorkflow.js";
import { reviewAgreementWorkflow } from "../workflows/reviewAgreementWorkflow.js";

export class NdaBuilderAgent {
  draft(input: DraftNdaInput): DraftNdaOutput {
    return draftNdaWorkflow(input);
  }

  async draftWithAi(input: DraftNdaInput): Promise<DraftNdaOutput> {
    const draft = draftNdaWorkflow(input);
    const polished = await polishDraftWithAi(draft, input.aiSettings);
    if (!polished) return draft;

    return {
      ...draft,
      draftMarkdown: polished.text,
      aiDraftUsed: true,
      aiProvider: polished.provider,
      aiModel: polished.model,
      aiNotes: [
        "AI polished the draft language after the rule-based clause workflow assembled the first version.",
        "A lawyer must still verify enforceability, jurisdiction-specific requirements, and client instructions before sending.",
      ],
      audit: {
        ...draft.audit,
        modelUsed: `${polished.provider}:${polished.model}`,
      },
    };
  }

  review(input: ReviewAgreementInput): ReviewAgreementOutput {
    return reviewAgreementWorkflow(input);
  }

  async reviewWithAi(input: ReviewAgreementInput): Promise<ReviewAgreementOutput> {
    const review = reviewAgreementWorkflow(input);
    const memo = await createReviewMemoWithAi(review, input.agreementText, input.aiSettings);
    if (!memo) return review;

    return {
      ...review,
      aiReviewUsed: true,
      aiProvider: memo.provider,
      aiModel: memo.model,
      aiReviewMemo: memo.memo,
      audit: {
        ...review.audit,
        modelUsed: `${memo.provider}:${memo.model}`,
      },
    };
  }
}

export const ndaBuilderAgent = new NdaBuilderAgent();
