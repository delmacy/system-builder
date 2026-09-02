# Generation 2 — Deep Research & Conciliation Policy

Status: ACTIVE / USER-DIRECTED RESEARCH METHOD

## Purpose

Generation 2 uses two complementary research layers:

1. **Breadth / recurrent elicitation** — recurring workers rotate through the capability taxonomy, discover representatives, findings, candidates, contradictions, proof obligations and negative space.
2. **Deep Research** — a dedicated researcher selects the highest-value unresolved question produced by the breadth layer and performs a deeper adversarial investigation across production systems, official documentation, standards/specifications, scientific literature and industrial engineering evidence.

The layers are deliberately asymmetric. Breadth discovers and maintains coverage; Deep Research reduces high-impact uncertainty and tests whether emerging architectural interpretations survive stronger evidence.

## Epistemic rule

> Deep Research is a primary source of conciliation, not the primary source of facts.

Original external evidence remains authoritative for factual claims: standards, papers, official documentation, engineering reports, repository reality and other qualified sources. A Deep Research artifact is an evidence-backed reconciliation instrument that organizes competing models, contradictions, invariants, risks and recommended dispositions.

No Deep Research artifact may silently override contradictory primary evidence, repository source-of-truth, authority boundaries or state-machine gates.

## Research Elicitation behavior

During `RESEARCH_ELICITATION`:

- breadth workers continue the normal capability rotation and saturation process;
- the Deep Research worker does **not** increment full-cycle counters or mark a capability revisit as completed solely because a deep dive occurred;
- Deep Research consumes existing dossiers/findings/candidates/proof debt as hypotheses and attempts to falsify or harden them;
- Deep Research may create new findings/candidates when supported by qualified external evidence;
- Deep Research should prefer questions with high architectural impact, high uncertainty, material representative divergence, unclear semantic ownership, universal-primitive implications, provider-portability risk, security/resilience/consistency risk or unresolved proof architecture;
- redundant deep dives are discouraged when expected information gain is low.

## Deep Research artifact contract

Deep Research artifacts live under:

`project_docs/generation-2/research/deep-research/`

Each deep dive should record, as applicable:

- research question and why it is material;
- SB corpus consumed;
- external evidence/source ledger;
- competing architectural models;
- strongest evidence for and against each interpretation;
- contradictions and unresolved divergences;
- invariants and failure assumptions;
- provider-specific mechanisms versus portable semantics;
- security/authority/evidence consequences;
- implications for existing findings/candidates/hypotheses;
- falsification path and proof obligations;
- confidence and residual uncertainty;
- recommended `KEEP / MERGE / GENERALIZE / SPECIALIZE / PROVIDERIZE / DEFER / DO_NOT_BUILD` dispositions when evidence is strong enough.

Maintain `deep-research/DEEP_RESEARCH_INDEX.md` as the navigation and impact ledger.

## Capability Synthesis behavior

When the state machine enters `CAPABILITY_SYNTHESIS`, all synthesis workers must treat the Deep Research corpus as a **primary conciliation corpus** alongside capability dossiers, evidence ledgers, Finding Index, Capability Discovery Register, Capability Proof Matrix and original evidence.

The preferred synthesis flow is:

```text
Breadth dossiers/findings/candidates
        +
Deep Research reconciliation artifacts
        +
Original external evidence
        +
Repository/source-of-truth constraints
        ↓
Independent synthesis/reconciliation by the other research workers
        ↓
Canonical taxonomy / primitives / boundaries / dispositions
```

Deep Research recommendations are therefore high-priority inputs but not self-ratifying decisions. Synthesis workers must independently check whether the recommended reconciliation is consistent with the broader corpus and must preserve a contradiction/unresolved-evidence register when it is not.

## Independence / anti-groupthink rule

The second phase must not merely copy Deep Research text into canonical architecture. Synthesis workers should independently:

- verify the evidence chain for material recommendations;
- search for counterexamples already present in other dossiers;
- test whether a proposed universal primitive actually generalizes across multiple semantic owners;
- reject abstractions whose complexity exceeds their cross-domain value;
- distinguish evidence-backed convergence from repeated citation of the same source lineage;
- preserve a minority/contradiction disposition where strong evidence remains divided.

## Relationship to proof-driven architecture

Every material reconciled architectural claim should eventually map to a proof obligation under `ARCHITECTURE_PROOF_QUALITY_METHOD.md` and `CAPABILITY_PROOF_MATRIX.md`.

The intended chain is:

```text
Breadth discovery
→ Deep Research
→ Conciliation
→ Capability Synthesis
→ Boundary/Architecture Planning
→ Product Proof Acceptance
→ WBS / Work Packages
→ Implementation
→ Executable Evidence
```

## Methodological characterization

This process intentionally combines characteristics of systematic mapping, targeted systematic/deep review, architecture trade-off analysis, adversarial falsification, evidence-based requirements elicitation, living architecture documentation and proof-driven engineering. It is not intended to imitate a single academic methodology mechanically; the purpose is to preserve traceable evidence while supporting an unusually broad, provider-neutral enterprise-system architecture.
