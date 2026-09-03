# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## Cycle authority
Cycles 2–6 completed for all 25 active capabilities. Every cycle-6 pass produced material findings; none was saturated.

## Revisit cycle 7
Completed so far: Universal Capability Architecture; Process & Application Modeling; UI / Generated Experience / Low-code Builder; Adaptive Governed Work Surfaces; Workflow & Durable Execution; Integration & Automation; Identity / Authentication / Federation; Authorization / Policy / Organization / Multitenancy.

### Identity / Authentication / Federation — revisit 6
NIST SP 800-63B-4 session management/AAL/reauthentication/federation session boundaries: `DEEP`; SPIFFE Trust Domain and Bundle/Federation/Workload API: `DEEP`; NIST syncable-authenticator guidance: `DEEP`; Keycloak offline-session/offline-token semantics: `DEEP`; prior CAEP/OIDC Federation/Logout/Token Exchange Generation-2 identity research: `DEEP`. Findings `G2-FINDING-IAF-45..52`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped authentication claims, revision-qualified assurance, independent IdP/RP sessions, trust-bundle currentness, mixed identity-provider support vectors, residual cohort drainage, qualified offline authentication and AGWS/AI non-amplification.

### Authorization / Policy / Organization / Multitenancy — revisit 6
OpenFGA immutable-model pinning/contextual tuples/model migration: `DEEP`; OPA bundles/status/decision logs/discovery: `DEEP`; Kubernetes RBAC escalation/bind/impersonation and good practices: `DEEP`; Cedar permit/forbid/default-deny plus schema validation/evolution: `DEEP`; SpiceDB ZedToken consistency/exact-snapshot expiry/expiring relationships: `DEEP`. Findings `G2-FINDING-APOM-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped effective authority, evaluator policy-currentness, schema-qualified conformance, contextual/token-derived fact freshness, evidence replay horizons, mixed authorization support vectors, residual authority cohort drainage, offline/local attenuation and AGWS/AI non-amplification.

## Historical authority
Detailed representative coverage for all other capabilities remains authoritative in their dossiers, earlier ledger revisions and `RESEARCH_PIPELINE_STATE.json` history.