# Generation 2 — Finding Index

Prior stable findings remain authoritative in their capability dossiers and pipeline history. Compacting this index does not revoke them.

## Cycle 6 authority through Artifact / Release / SBOM / Provenance
All previously indexed cycle-6 findings through `G2-FINDING-ARSP-45` remain authoritative in their dossiers and prior index revision.

### Deployment / Environment / Runtime — revisit 5
- **G2-FINDING-DER-38** — Deployment identity is typed across QualifiedRelease, DeploymentIntent, EnvironmentProfile, RuntimeBinding, Attempt, ProviderRealization, RoutingAssignment, ReadinessEvidence and RollbackEligibility; provider revision IDs are realization identities, not canonical System/Station identity.
- **G2-FINDING-DER-39** — Effective deployment qualification is a multi-axis revision vector; release, config, schema, trust, topology, provider, routing, readiness-gate and rollout-policy changes can independently stale prior evidence.
- **G2-FINDING-DER-40** — Positive rollout/provider conditions are observation artifacts, not timeless health facts; condition reason, observed subject/revision and current availability/readiness must participate in composite qualification.
- **G2-FINDING-DER-41** — Rollout deadlines are state-scoped TransitionClocks with pause/resume and policy semantics; raw wall-clock elapsed time cannot universally prove rollout failure.
- **G2-FINDING-DER-42** — Runtime realization, traffic assignment and capacity/scale are independent effective-state dimensions; a revision may exist with zero traffic and traffic weight may diverge from replica percentage.
- **G2-FINDING-DER-43** — Local realization success does not imply aggregate fleet/region/Station qualification; explicit coverage/barrier semantics can leave locally complete units globally BLOCKED or PARTIAL.
- **G2-FINDING-DER-44** — Rollback eligibility is dynamic revision-bound evidence over retained compatible closure, distinct from historical success and from rollback authority.
- **G2-FINDING-DER-45** — Routing mutation is a canonical effective-state transition requiring expected-base/ownership fencing; authorized stale writers must not overwrite newer traffic ownership silently.

## Cycle closures
Cycles 3, 4 and 5 completed all 25 active capabilities. Every cycle-5 pass produced material architectural findings; no capability was SATURATED at cycle close. Cycle 6 is active with fourteen capabilities completed through Deployment / Environment / Runtime.

## Historical authority
All prior findings, including cycle 1–5 and compacted cycle-6 findings, remain authoritative in their dossiers and prior index revisions.