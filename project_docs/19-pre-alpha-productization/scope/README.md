# M19 Scope — Pre-Alpha Productization

Status: FORECAST / NOT MATERIALIZED

## In scope
- Compose the existing approved/versioned business-process, analysis/definition, catalog/assembly, validation, compiler, release, deploy and runtime capabilities into one supported vertical factory journey.
- Deterministic fail-closed predecessor/version/lineage validation across that journey.
- Clean reproducible E2E invocation without hand-authored downstream fixture stitching.
- Minimum maintainer/operator bootstrap and diagnostics necessary to run the supported journey.
- Generated runtime materialization in the existing supported topology using immutable artifacts and external config/secrets.
- Builder-off runtime operation/observation and bounded restore/evolve/upgrade/rollback continuity.
- One bounded real maintainer-owned dogfood process and one approved successor process revision.
- Package-level pre-alpha integration/product acceptance and immutable pre-alpha closure evidence when GO.

## Explicitly out of scope
- Production-grade visual builder or broad UX polish.
- SaaS multi-tenancy, billing, marketplace or commercial onboarding.
- Public beta, production SLA/readiness or generalized production hardening.
- Additional deployment topologies not already required by the initial supported path.
- Generalized performance optimization without a pre-alpha blocker.
- A second unrelated client-system acceptance proof.
- Unrelated technical debt/findings, including carried TD-P13-01..04, unless separately materialized or objectively proven to block the declared M19 outcome.
- Hidden L4 architecture/authority changes or substitution of model/Git/PR/classification evidence for human business authority.

## Change-control boundary
A defect necessary to achieve the active committed Sprint goal may enter bounded operational correction under existing authority. New product capability outside this scope, architecture invalidation, new L4 authority or topology redesign blocks the affected successor and requires explicit baseline/ADR/change control. Review and Closure are never overflow construction Sprints.
