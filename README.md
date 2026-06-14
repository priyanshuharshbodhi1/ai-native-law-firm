# NDA Builder Agent

Lawyer-in-the-loop agent for two workflows:

1. **Draft from scratch** using a prior NDA template, client context, and a clause library.
2. **Review an incoming NDA/agreement** for risky clauses, missing provisions, and negotiation points.

This repo is a TypeScript-first skeleton designed to be plugged into Mastra workflows, a Next.js app, or a standalone API. The current version runs deterministically without a paid model key, so lawyers can inspect the workflow before adding LLM calls.

## Stack Decision

Use **TypeScript + Mastra-oriented workflows** for this product.

Why:

- The product needs a web portal, typed forms, document generation, audit logs, and lawyer approval UI.
- NDA drafting/review is mostly a controlled workflow, not an open-ended autonomous agent.
- TypeScript keeps the schema shared between frontend, backend, workflows, and document generation.
- Mastra fits once you add real agents, model routing, memory, evals, observability, and human-in-the-loop approvals.

Use Python + LangGraph only if the core product becomes heavy legal research, court/statute retrieval, complex RAG experiments, or data-science-style model evaluation.

## Run

```bash
bun install
bun run draft:sample
bun run review:sample
bun run test
```

Start the local JSON API:

```bash
bun run server
```

Endpoints:

- `POST /draft`
- `POST /review`
- `GET /health`

## Product Shape

### Draft NDA From Scratch

Input:

- Template choice
- Client/business context
- Parties and jurisdiction
- NDA type: unilateral or mutual
- Purpose of disclosure
- Confidential information categories
- Risk posture
- Optional special clauses

Output:

- Draft NDA in Markdown
- Clause source map
- Missing context questions
- Lawyer review checklist
- Risk notes

### Review Incoming Agreement

Input:

- Agreement text
- Client position: discloser, recipient, or mutual
- Business context
- Jurisdiction
- Risk posture

Output:

- Risk report
- Clause-by-clause issues
- Suggested redlines
- Negotiation summary
- Lawyer review checklist

## Important Legal Guardrail

This software does not provide legal advice by itself. It is designed for an advocate/lawyer to supervise, edit, approve, and sign off on every deliverable.
