# Generation 2 — Secrets / Configuration / Environment Portability — Full Pass 5 Revisit

Status: FULL PASS 5 — ELIGIBLE NO-NEW-MATERIAL REVISIT / LOCAL STREAK CAPPED 2 / CLUSTER STREAK CAPPED 2
Capability: Secrets / Configuration / Environment Portability
Paired cluster: Secrets/Config × Runtime × Provider substitution
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research-only disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No product implementation, Work Package, TASK, Construction or target-architecture remediation is authorized. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, provider-native evidence as realization evidence, GraphDB as optional/provider-level, and Fleet aggregate as non-authoritative.

## Full-Pass-5 method

This revisit carried the priority `Typed Semantic Graph + ExecutionEnvelope` hypothesis into secrets/configuration and also challenged the autonomous-build/Fleet-observability hypothesis. Techniques: typed-reference graph cuts; reference-resolution versus materialization separation; build/release/deployment pinning braids; alias/latest/lease/revocation multi-clock analysis; offline/self-hosted revocation visibility; local evidence/redaction subtraction; provider namespace/type differential; bootstrap/recovery cycle search; residual credential/config cohort analysis; `ABSENT/null/default/delete`; `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN`; shared-infrastructure isolation; resource/cardinality pressure; human runbook contradiction; and AI/low-code aggregate-authority composition. All candidates were duplicate-screened against the authoritative 119 reusable ConflictPatterns.

## Evidence refresh

Current provider evidence reinforces existing classifications rather than a new universal family. HashiCorp Vault dynamic secrets use leases with TTL, renewal and revocation; requested renewal duration is advisory and the returned lease must be inspected. Revocation can also be delayed or fail against a backend, so provider-side intent is not sufficient evidence of consumer-side or external-target convergence. AWS Secrets Manager distinguishes `AWSPENDING`, `AWSCURRENT` and `AWSPREVIOUS`; label movement expresses provider version state but does not prove fleet-wide adoption. AWS also documents version accumulation under excessive writes. These are provider realizations, not canonical architecture.

## Typed Semantic Graph hypothesis — secrets/configuration findings

The hypothesis remains viable but undecided. A typed graph can represent a `SecretRef`/`ConfigRef` as a reference node or typed edge from a capability/workflow/build/deployment revision to a semantic requirement without embedding secret material. The graph must distinguish logical reference identity, provider binding, provider object/version/alias, lease/validity interval, authority scope, consumer adoption evidence and revision/currentness. `ExecutionEnvelope` may carry opaque reference identities and qualification metadata, but should not become a secret-value transport or journal-leak path. `ExecutionJournal` may record resolution/renewal/revocation/adoption evidence using redacted identifiers/digests where justified; it must remain distinct from `ExecutionState` and business truth.

A graph traversal that proves a reference is reachable or type-compatible does not prove that its material is current, authorized, adopted, unrevoked or semantically equivalent at the provider. Likewise, a provider alias such as `current/latest` is a time-varying realization and cannot silently become a pinned canonical revision. Recursive workflow/subworkflow composition requires context scoping so child invocations cannot inherit a broader secret/config authority than their declared contract. These obligations are already covered by semantic ownership, revision/currentness, qualification-join, authority non-amplification, provider qualification and residual-cohort patterns.

PostgreSQL remains a plausible baseline for typed reference/edge definitions, revisions and runtime resolution/adoption evidence; bounded JSONB can hold provider-specific configuration that is not canonical semantics. Nothing in this pass establishes a GraphDB requirement. Canvas/Graph Explorer may project secret/config dependencies and risk without exposing values; this remains an architecture hypothesis, not a decision.

## Duplicate-screen results

1. **Typed-reference reachability mistaken for usable authority.** A graph path exists from workflow/capability to a secret/config reference, but current authority, lease, provider qualification or consumer adoption is absent/stale. Covered by qualification-join/currentness/authority patterns; no new class.
2. **Pinned graph revision with floating provider alias.** Definition revision is immutable while `latest/current` resolves differently across attempts or cohorts. Covered by revision-vector/currentness and provider-binding identity separation.
3. **Build-time material versus runtime rotation.** Artifact/release pins a logical reference while runtime consumers resolve different generations. Safe only when contract declares resolution semantics; existing coexistence/currentness/semantic-ownership patterns cover it.
4. **Offline revocation horizon.** Disconnected self-hosted consumers can retain locally usable material after central revocation intent. Covered by stale evidence, degraded authority and residual cohorts. Fleet observation cannot prove universal revocation.
5. **Local evidence without leakage.** Journal/telemetry can become a secondary secret store through values, URLs, exception text or high-cardinality labels. Covered by cumulative privacy/trust, redaction and semantic-ownership patterns; no new universal family.
6. **Provider namespace/type substitution.** Equal-looking references can denote different scope/type/tenant or reveal/use semantics. Covered by provider semantic qualification and trust-namespace separation.
7. **Bootstrap/recovery cycle.** Safe startup needs current config/trust/secret while retrieving it needs the same runtime/provider path. Covered by structural-cycle, recovery qualification and degraded-authority patterns.
8. **Residual old-provider credentials/config.** Provider cutover leaves old credentials/config usable by a cohort or external target. Covered by provider coexistence/residual-cohort/currentness patterns.
9. **Presence transduction.** `ABSENT`, `null`, default and delete differ across graph config, environment, provider API and runtime. Covered by `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`.
10. **`PARTIAL/UNKNOWN` rotation/adoption.** Provider mutation succeeds while reload/adoption is mixed or unknown. Covered by ambiguous-effect, convergence and reconcile-before-retry patterns.
11. **Resource/cardinality pressure.** Valid per-node references create lease/version/watch/reload storms. Covered by resource/capacity boundedness; pressure does not authorize stale or cross-scope reuse.
12. **Shared-infrastructure isolation.** Individually valid references compose into cross-tenant visibility/use through shared caches, agents or graph context. Covered by authority non-amplification, trust namespace and isolation patterns.
13. **Human procedures.** Rotate/revoke/restart/rollback runbooks can be individually valid but jointly contradictory in order/currentness assumptions. Covered by human-procedure, temporal and owner/authority patterns.
14. **AI/low-code aggregate authority.** Generated composition combines permitted references into a wider effective target population, tenant scope or privilege. Covered by composition admissibility and authority non-amplification; a signal is not a confirmed conflict.

## Conflict classification and detection candidates

No new material ConflictPattern survived duplicate screening. Activation conditions, incompatible claims/actions/states, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness and false-positive risk therefore remain governed by the existing reusable patterns and their originating registers. Detection candidates remain typed-reference/static graph validation, authority/currentness requalification before resolution/use, provider semantic qualification, revision-set compatibility, residual-cohort/adoption evidence, bounded lease/version/cardinality observation, leakage/redaction checks and runtime reconciliation for ambiguous effects. Future remediation disposition remains route-to-owner only after activation evidence; no hypothetical remediation is materialized here.

No new preventive invariant candidate is proposed. Existing candidates for qualified revision sets/currentness, authority non-amplification, reconcile-before-retry, presence semantics, semantic-owner separation and bounded resource use remain sufficient without forbidding legitimate rotation, offline operation or provider substitution.

## Saturation disposition

- New local material edge scenarios: **0**.
- New cross-capability material scenarios: **0**.
- New reusable ConflictPatterns: **0** after duplicate-screen against 119 patterns.
- Secrets local no-material streak: **remains capped at 2**.
- Secrets/Config × Runtime × Provider substitution cluster streak: **remains capped at 2**.
- HIGH/CRITICAL without owner/proof/detection route introduced here: **0**.
- Inventory remains **284 edge scenarios + 119 ConflictPatterns = 403 material findings**.
- `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` require no new material IDs.
- Full Pass 5 remains active; negative-space remains `NOT_STARTED`; Planning C remains blocked.

## Next bounded step

Continue Full Pass 5 with **Build / Dependency Graph / Reproducibility** and explicitly exercise **Build × Artifact/Release × Deployment × Runtime** without inflating its already-satisfied streak above 2. Carry `Typed Semantic Graph + ExecutionEnvelope` and Autonomous Builds/Fleet Observability into typed build dependency/provenance edges, graph-revision versus lock/toolchain/provider pinning, cache-key completeness, platform/conditional dependency divergence, reproducible bytes versus semantic/provenance equivalence, concurrent build/promotion cuts, remote `PARTIAL/UNKNOWN`, offline currentness, resource/cardinality pressure, shared-infrastructure isolation, human release procedures and AI/low-code supply-chain authority. Keep GraphDB optional and Fleet non-authoritative. Do not enter Planning C.
