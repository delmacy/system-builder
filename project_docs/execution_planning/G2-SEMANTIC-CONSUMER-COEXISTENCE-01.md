# G2-SEMANTIC-CONSUMER-COEXISTENCE-01

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: G2-WP-01 — Semantic Constitution & Federated Revision Base
Fresh-main base: `1d49b29380c3234422031bf6d34b50aafd15e70a`
Predecessor reviewed head: `39237d52a971399a767da911c1d94b9b72a68be7`
Predecessor merge tree: `b77252cb0f394f6619fa76a0a3d3a9e93f73684b`
Planning authority: `research/g2-capability-pipeline` at `2ef10187d691666b45cba5978671570f0ff90c2a`

## Goal
Prove directional coexistence between the integrated G2 semantic substrate and a small set of historically authoritative G1 domain contracts without rewriting their identities, binary evidence semantics, ownership or lifecycle authority. Consumers may reference the substrate additively; the substrate must not become a universal evaluator or source of truth.

## Readiness
Construction A TASK-463..468 is reviewed/integrated. Deterministic CI #1398 and Heavy Product Tests #874 passed its exact reviewed head. Reviewed head -> merge-main has zero changed files. Fresh main contains the semantic-substrate contract family and integrated growing proof.

## Committed TASK chain
`TASK-469 -> TASK-470 -> TASK-471 -> TASK-472`

- TASK-469: process-versioning coexistence proof/reference.
- TASK-470: evidence-provenance coexistence proof/reference.
- TASK-471: factory-boundary coexistence proof/reference.
- TASK-472: integrated multi-owner coexistence/adversarial proof.

## Boundaries
Additive only. Existing G1 contracts remain historically authoritative. No destructive migration, no replacement of process-versioning/evidence-provenance/factory-boundary semantics, no Runtime/Builder topology change, no provider facade, no generic policy/authority broker, no persistence or migration.

Directional dependency is consumer -> semantic substrate. Do not introduce semantic-substrate -> domain-owner imports. If coexistence requires changing canonical domain meaning, a new lifecycle owner, reverse dependency, or L4 topology, stop for change control.

## Growing proof
`G1 canonical domain identity/provenance -> owner-qualified semantic reference -> exact immutable revision/currentness qualification -> directional typed relation -> preserved G1 evidence/lineage semantics -> multi-owner coexistence proof`.

## Exit proof
At least process-versioning, evidence-provenance and factory-boundary are exercised through real public exports alongside semantic-substrate references. Equal labels/provider/external identifiers cannot collapse owner-qualified canonical identity; stale/unknown currentness cannot strengthen G1 truth; G2 references cannot rewrite historical G1 revision/evidence; directional graph edges cannot imply reverse authority.

## Forecast after exit
Construction C remains OPTIONAL / FORECAST. After this Sprint integrates, reconstruct fresh main and decide from evidence whether a bounded hardening Sprint is necessary; otherwise proceed to Package Integration & Review.
