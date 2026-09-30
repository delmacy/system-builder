# Station S3 R7B — Tenant / Export-Import Portability Falsification Matrix 05

Date: 2026-09-30
Truth base: `main@d2cd9b404501781de90564b2029277efdfcb023f`
Research branch: `station-s3-r7b-engineering-benchmark`
Status: research evidence only; non-authoritative; no Construction eligibility implied.

## Scope and guardrails

This tranche pressure-tests only the `dataConfig` and `exitRebuild` dimensions of the Producer Independence Profile established by Matrix 04. It does not add C-levels, primitives, providers, tenant control planes, Core authority, or product code.

Preserved: C0→C10; identity != placement != presentation != action; semantic patterns above primitives; span/discrete composition; one canonical authority with projections; research != authority.

## Evidence matrix

| Benchmark | Primary evidence | Falsifier / pressure | Classification | S3 consequence |
|---|---|---|---|---|
| Kubernetes namespace / multi-tenancy | Namespaces scope namespaced resources, while cluster-wide resources such as StorageClass, Nodes, PersistentVolumes, CRDs and webhooks are outside namespace scope. Multi-tenancy docs describe namespace as a logical management/isolation unit and separately discuss control/data-plane isolation. | `tenant isolated => tenant portable` is false. A tenant boundary does not prove closure over dependencies required to reconstruct it elsewhere. | adopt-pattern | Portability needs an explicit scope/dependency closure proof independent of tenant isolation. |
| Keycloak realm import/export | Export consistency is not guaranteed unless nodes are stopped. Export omits user/admin events, persisted sessions, workflow state and revoked tokens. Admin Console partial export is not suitable for backup/data transfer and masks sensitive values. | `export succeeded => exit/rebuild proven` is false. Export existence does not prove complete or consistent capture. | adopt-pattern / adapt | Export artifacts must declare consistency conditions, omissions and external prerequisites; restore must be verified semantically. |
| PostgreSQL pg_dump / pg_dumpall | pg_dump makes a consistent dump of one database; cluster-wide/global objects such as roles and tablespaces require pg_dumpall. Dumps can reconstruct database state on another machine/architecture, subject to scope and restore prerequisites. | `portable archive => closed reconstruction set` is false. A transferable artifact can still omit required global/external dependencies. | adopt-pattern | Data/config portability must state contained scope versus prerequisites and prove rebind/restore behavior. |

## Deduplicated candidate semantic pattern

`declared portability scope → consistent capture → explicit omissions/external dependencies → transferable artifact → target admission → restore/rebind → semantic verification → exit/rebuild evidence`

This is a semantic lifecycle above primitives. It is not a Station widget hierarchy and does not make Station the authority for tenant, provider, secret, identity, database or business state.

## Producer Independence Profile refinement

Keep Matrix 04 profile dimensions independent:

`{ build, runtime, managementPlane, dataConfig, substitution, exitRebuild }`

For `dataConfig` / `exitRebuild`, evidence should distinguish:

1. **scope closure** — what canonical state and dependencies are claimed portable;
2. **capture consistency** — under what mutation/currentness conditions capture is valid;
3. **coverage/omissions** — what is intentionally absent;
4. **target admission** — compatibility/version/policy prerequisites at the target;
5. **external dependency rebind** — identities, secrets, providers, roles, storage or endpoints not embedded in the artifact;
6. **semantic restore equivalence** — restored behavior/state satisfies declared invariants, not merely import success;
7. **exit/rebuild exercise** — reconstruction without the original producer/service is actually demonstrated.

Success in any one dimension does not imply the others.

## Proof debt delta

The following remain `UNPROVEN`; none is promoted to PASS:

- Portability Scope Closure Proof
- Capture Consistency Proof
- Export Coverage/Omission Proof
- Restore Admission Proof
- External Dependency Rebind Proof
- Semantic Restore Equivalence Proof
- Exit/Rebuild Exercise Proof

These refine Matrix 04 rather than creating duplicate top-level obligations.

## Explicit defer / rejection boundary

Reference-only / defer:
- Kubernetes controllers, CRDs, RBAC implementation and virtual-control-plane machinery;
- Keycloak realm schema, Operator/controller and identity authority;
- PostgreSQL dump/restore implementation;
- provider catalogs, tenant control planes, secrets authority and provider-specific lifecycle machinery.

Rejected inference:
- tenant identity becoming component identity;
- provider/tenant topology becoming C0→C10 grammar;
- export/import machinery becoming Station/Core authority;
- successful serialization/import being treated as proof of semantic portability.

## R7B closure implication

This tranche adds non-duplicative falsification to Producer Independence and closes the planned provider/tenant portability exploration surface sufficiently for a closure audit. Further product catalog expansion on this axis should stop unless the audit identifies a specific unresolved falsifier.

Next dependency-safe batch: audit Matrices 01–05 as one evidence set, deduplicate proof debts/invariants/classifications, identify contradictions or missing falsifiers, and prepare R7B handoff eligibility for S3 synthesis + Decision Graph. Construction remains ineligible.
