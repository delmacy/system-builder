# G2-SEMANTIC-IDENTITY-REVISION-CONTRACT-01

Status: `COMMITTED / MATERIALIZED`

Work Package: `G2-WP-01 — Semantic Constitution & Federated Revision Base`

WBS: `G2-WBS-01`

## Goal

Establish the minimal Generation 2 semantic constitution needed before federated composition: stable semantic identity, immutable revision identity, explicit semantic ownership, evidence/provenance qualification, typed node/edge semantics and population/locality-qualified currentness with `PARTIAL/UNKNOWN` preserved.

## Predecessor gate

Planning & Materialization Sprint `G2-WP-01-PLANNING-MATERIALIZATION-01` must be integrated to fresh `main`. Construction branch must be created from that exact integrated main, not from the research branch.

## Committed TASK order

`TASK-G2-001 -> TASK-G2-002 -> TASK-G2-003 -> TASK-G2-004 -> TASK-G2-005`.

Each TASK requires one distinct authoritative commit.

## Growing proof at exit

Use real package APIs/contracts, not hand-authored downstream fixtures where an executable primitive exists, to prove:

- canonical semantic identity is stable across provider/external-ID churn;
- immutable historical revision remains addressable after successor creation;
- owner/evidence/provenance/currentness/locality qualification survives serialization and composition;
- `PARTIAL` and `UNKNOWN` remain explicit and cannot be silently upgraded;
- stale/superseded predecessor revision is detectable;
- typed graph edges cannot strengthen source/owner truth;
- invalid owner, revision, evidence, locality or population qualification fails canonically;
- deterministic output/order/identity where the contract promises determinism.

## Final validation

`npm run verify`

Run `npm run test:product:heavy` only when classifier/applicable proof requires real process/HTTP/TLS/Postgres/openssl infrastructure.

## Stop conditions

Stop for explicit change control on undeclared L4 architecture, new capability ownership, destructive migration, generic physical actuation semantics, security/governance weakening, or any required modification outside the materialized TASK allowed paths.