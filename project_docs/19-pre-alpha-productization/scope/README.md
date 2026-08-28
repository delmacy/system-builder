# Scope — M19 Pre-Alpha Productization

## In scope

- one canonical vertical factory journey using real public contracts;
- deterministic composition from approved/versioned business inputs to deployment candidate;
- clean-environment bootstrap and operator-facing entrypoint/diagnostics sufficient for maintainers;
- generated autonomous runtime handoff in the existing initial deployment target;
- Builder-off runtime operation and bounded upgrade/rollback proof;
- one real maintainer-owned dogfood system/process;
- reproducible pre-alpha acceptance evidence and explicit known limitations.

## Not automatically in scope

- architectural redesign of already closed milestones;
- production UX completeness or visual polish;
- generalized SaaS/multi-tenancy, billing, marketplace or external customer onboarding;
- new infrastructure topologies beyond the current initial target;
- unrelated conformance/productization findings or carried technical debt unless they are demonstrated pre-alpha blockers;
- second-system proof required for the eventual full factory acceptance test; that remains post-pre-alpha unless fresh evidence makes it necessary earlier.

## Acceptance intent

Pre-alpha means the factory can be run by its maintainers as a product path rather than only as isolated module APIs and tests. The resulting system may be incomplete and non-production-ready, but the critical path must be real, traceable, repeatable, diagnosable and autonomous after publication.

No forecast item here is execution authority. Materialization must follow `AGENTS.md` and `project_docs/schedule/SPRINT_GENERATION_POLICY.md` from fresh integrated repository truth.