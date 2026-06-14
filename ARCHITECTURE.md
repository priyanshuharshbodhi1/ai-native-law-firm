# Architecture

## Core Principle

The product is not a chatbot. It is a controlled legal workflow with lawyer review.

The agent can:

- collect context,
- choose templates,
- assemble clauses,
- flag risks,
- suggest redlines,
- produce summaries.

The lawyer must:

- verify facts,
- decide legal strategy,
- approve final language,
- own the final advice.

## Workflows

### Draft From Scratch

```mermaid
flowchart LR
  A["Client Intake"] --> B["Validate Context"]
  B --> C["Select NDA Template"]
  C --> D["Select Clause Set"]
  D --> E["Generate Draft"]
  E --> F["Missing Questions"]
  E --> G["Lawyer Checklist"]
  F --> H["Lawyer Review"]
  G --> H
  H --> I["Client Deliverable"]
```

### Review Existing Agreement

```mermaid
flowchart LR
  A["Upload Agreement"] --> B["Normalize Text"]
  B --> C["Rule/Playbook Review"]
  C --> D["Risk Issues"]
  C --> E["Suggested Redlines"]
  D --> F["Lawyer Review"]
  E --> F
  F --> G["Negotiation Memo"]
```

## Recommended Next Product Modules

- DOCX ingestion and export.
- Clause playbook editor controlled by lawyer users.
- Redline generation in Word format.
- Client portal with matter intake.
- Matter/audit database.
- Human approval queue.
- LLM provider adapter.
- Eval set using previously reviewed NDAs.
