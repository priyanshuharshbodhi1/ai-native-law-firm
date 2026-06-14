import type { ClientContext, MissingContextQuestion } from "../domain.js";

export function findMissingContext(context: ClientContext): MissingContextQuestion[] {
  const questions: MissingContextQuestion[] = [];

  if (!context.client.address) {
    questions.push({
      field: "client.address",
      question: "What is the client's registered address?",
      whyItMatters: "Party identification should be precise enough for execution and enforcement.",
    });
  }

  if (!context.counterparty.address) {
    questions.push({
      field: "counterparty.address",
      question: "What is the counterparty's registered address?",
      whyItMatters: "The agreement should identify the counterparty correctly before signing.",
    });
  }

  if (!context.transactionContext) {
    questions.push({
      field: "transactionContext",
      question: "What commercial deal, diligence process, or vendor/customer discussion is this NDA supporting?",
      whyItMatters: "A narrow purpose prevents accidental broad disclosure rights.",
    });
  }

  if (!context.client.signatoryName || !context.counterparty.signatoryName) {
    questions.push({
      field: "signatories",
      question: "Who will sign for each party, and what are their titles?",
      whyItMatters: "Execution blocks should match authority and internal signing policy.",
    });
  }

  return questions;
}
