# NDA Builder Agent

Lawyer-in-the-loop agent for two workflows:

1. **Draft from scratch** using a prior NDA template, client context, and a clause library.
2. **Review an incoming NDA/agreement** for risky clauses, missing provisions, and negotiation points.

This repo is a TypeScript-first skeleton designed to be plugged into Mastra workflows, a Next.js app, or a standalone API. The current version runs deterministically without a paid model key, so lawyers can inspect the workflow before adding LLM calls.

The browser UI also supports optional AI polishing/review with a user-provided API key for OpenAI, Claude, or Gemini. If no key is added, the same rule-based workflow still works.

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

Open:

```text
http://localhost:3007/
```

Endpoints:

- `POST /draft`
- `POST /review`
- `GET /health`

## AI Settings

In the app, open **AI Settings** and choose:

- Provider: OpenAI / ChatGPT, Claude, Gemini, or None.
- Model: choose a preset or type a custom model name.
- API key: saved only in the current browser's local storage.

Recommended legal-work presets:

- OpenAI: `gpt-5.5` for highest-quality drafting/review, `gpt-5.4` for strong daily work.
- Claude: `claude-fable-5` for highest capability, `claude-opus-4-8` for complex reasoning, `claude-sonnet-4-7` for strong speed/quality balance.
- Gemini: `gemini-3.1-pro-preview` for complex legal reasoning, `gemini-3.5-flash` for stable high-throughput work.

When AI is enabled, the backend uses the selected provider for that request:

- Draft workflow: the rule-based draft is assembled first, then the model polishes it into a cleaner lawyer-reviewable NDA.
- Review workflow: rule-based issues are found first, then the model creates a lawyer review memo.

Every output still requires lawyer approval.

## Deploy to Vercel

This repo includes `api/index.ts` and `vercel.json`, so Vercel can run the same routes as the local server:

- `/`
- `/draft`
- `/review`
- `/health`

Deploy:

```bash
bunx vercel
```

For a production deployment:

```bash
bunx vercel --prod
```

If Vercel asks framework questions, keep the defaults. The app does not need server-side environment variables for provider keys because each lawyer adds their own key in the browser UI.

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

- Draft NDA as a clean legal document view
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
