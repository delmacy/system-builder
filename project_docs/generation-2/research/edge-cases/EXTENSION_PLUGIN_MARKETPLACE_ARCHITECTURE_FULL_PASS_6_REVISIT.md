# Generation 2 — Extension / Plugin / Marketplace Architecture — Full Pass 6 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 6
Capability: Extension / Plugin / Marketplace Architecture
Mandatory cluster: Extension/Plugin × authority × provider trust × lifecycle
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. Disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`. No product, Work Package, executive TASK, Construction or remediation is authorized.

## 1. Technique rotation

Full Pass 6 used techniques materially different from Passes 1–5:

- **effective-surface cut mutation**: compare declared dependency graph with the actually co-located host/API/provider surface;
- **capability-handle survivorship analysis**: revoke/disable/uninstall while previously issued handles, callbacks, leases, tokens, jobs or external effects survive;
- **proof-set subtraction**: remove one publisher/identity/admission/host/currentness fact at a time while package integrity remains valid;
- **trust-time diagonalization**: signing/admission time, install time, activation time and invocation time use different trust/policy revisions;
- **N-wise closure mutation**: every pairwise dependency is valid while the aggregate host/API/provider/authority closure has no jointly qualified realization;
- **residual-cohort braid**: old/new plugin revisions, hosts and providers overlap while rollback/deactivation occurs;
- **semantic-owner collision permutation**: independently valid extensions mutate the same canonical subject in different orders;
- **resource-pressure inversion**: locally bounded extensions compose into globally unbounded callback/fan-out/cost pressure;
- **Fleet evidence subtraction**: exported aggregate evidence is available while runtime-local evidence is stale, missing or contradictory;
- **human/AI authority permutation**: operator procedure or AI/low-code composition expands aggregate effect reach without jointly qualifying authority/trust/provider semantics.

Duplicate-screen baseline: all 123 reusable ConflictPatterns, local scenarios through `G2-EDGE-EXTENSION-009`, and cluster scenarios through `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-005`.

## 2. Fresh evidence and portable interpretation

Fresh VS Code documentation records multiple extension hosts (local, web and remote). It also explicitly documents a topology where an extension dependency can exist across different extension hosts while the provider extension's exported API is unavailable to the consumer. This is strong evidence for preserving `declared dependency != jointly usable realized surface`, `ExtensionDefinition != HostRealization`, and `dependency reachability != callable semantic contract`.

VS Code also requires declared host-version compatibility through `engines.vscode`, while web extensions execute under a materially different browser runtime. Compatibility therefore has direction, runtime locus and API-surface dimensions rather than being a single boolean.

npm documents `peerDependencies` as host/plugin compatibility constraints and notes that conflicting peer requirements can make a dependency tree unresolvable. This supports joint closure qualification but does not prove semantic compatibility merely because a tree resolves.

Sigstore verification further separates artifact digest/signature/identity evidence from admission policy. Cosign can verify artifact digest and expected certificate identity/issuer, while Sigstore's own security model describes what identity/trust evidence establishes. Portable conclusion: `signature/integrity/identity evidence != current extension authorization/admission`; current policy and realization qualification remain separate claims.

These sources reinforce existing patterns rather than creating a distinct 124th reusable conflict class.

## 3. Typed Semantic Graph / Execution Model

Status remains **ARCHITECTURE HYPOTHESIS / IN RESEARCH**.

The extension domain strengthens the need for distinct typed subjects:

`CapabilityDefinition -> CapabilityUse/Invocation -> ExtensionRevision -> HostRealization -> ProviderBinding`

with independent typed references to authority policy, trust evidence, contracts, configuration/secrets, runtime/build revision and effect evidence. A graph edge must never silently strengthen into current authorization, compatibility, trust eligibility or effect convergence.

`ExecutionEnvelope` remains plausible for bounded references/deltas at invocation boundaries. It must not carry ambient authority merely because an extension is reachable. `ExecutionJournal` records attempts/traversals/evidence; `ExecutionState` is the current execution snapshot; neither is canonical business truth.

PostgreSQL relational typed graph persistence remains plausible. No evidence in this revisit requires GraphDB; GraphDB remains optional provider/projection-level. Canvas/Graph Explorer remains a non-authoritative projection and must visually distinguish declared dependency, qualified realization, current authority/trust and observed runtime/effect evidence.

## 4. Inter-system / federated extension boundary

An extension may call or expose a capability across autonomous systems. The boundary is best treated as a versioned inter-system contract rather than implicit shared runtime/state. Required qualifications include correlation/effect identity, authentication/authorization, schema/version compatibility, SLA, idempotency, `UNKNOWN` effects, ownership, minimization/privacy, metering and failure responsibility.

A marketplace or shared capability catalog may expose an Enterprise/Federated Graph of provider/consumer dependencies, but economic/service dependency does not authorize runtime coupling. Circular provider relations, shared quota/capacity and internal charging remain detection candidates. Fleet/global graph evidence cannot replace local build/runtime truth.

No new conflict class emerged: candidates reduce to `FEDERATED-CONTINUITY`, provider qualification/currentness, residual cohort, authority non-amplification, resource/capacity and objective-conflict families.

## 5. Control-flow primitives and extension hooks

Extension activation hooks, callbacks and event handlers should remain semantically visible as bounded control-flow relations where they participate in governed workflows. Hidden arbitrary imperative code can defeat static claims about fan-out, waits, cancellation, compensation or termination.

For loops/recursion introduced by plugins, proof status must distinguish: statically proved termination under a supported fragment; operationally bounded termination by max iterations/depth/duration/resource; and unproved termination. Deactivation/uninstall does not prove termination or effect quiescence of already-issued work.

No universal preventive invariant is proposed here because legitimate asynchronous callbacks and long-lived subscriptions exist; qualification must remain contract-sensitive.

## 6. Mathematical / analytical graph semantics

Extensions may contribute formulas, estimators, optimizers or AI inference providers. The graph must preserve analytical kind and provenance: `DETERMINISTIC_DERIVATION`, `STATISTICAL_ESTIMATE`, `OPTIMIZATION_RESULT`, `AI_INFERENCE`, `HUMAN_DECISION`. A plugin/provider substitution that preserves scalar type but changes analytical kind or assumptions is not semantic equivalence.

Formula dependency impact must include extension/provider revision and historical snapshot semantics. This candidate duplicate-screens into `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001`, revision/currentness and historical-recomputation families; no new pattern.

## 7. Workflow soundness / completion proof implications

Plugin admission, signature verification and dependency resolution are not workflow soundness proofs. A completion bundle must continue to distinguish:

1. definition soundness in the analyzed formal fragment;
2. loop/recursion termination proof or operational bound;
3. observed trace conformance;
4. journal integrity/commitment;
5. evidence that required external effects occurred.

A child/composite capability implemented by an extension may contribute a child certificate only when the parent verifier can qualify the child's model/revision, contract mapping, terminal/effect disposition, proof profile, trust/currentness and unresolved `UNKNOWN`s. Signature validity alone cannot upgrade the parent to `PROVEN_COMPLETED`.

This duplicate-screens into `PROOF-CLAIM-CONFLATION` and `CERTIFICATE-COMPOSITION`; no new pattern.

## 8. Adversarial candidate dispositions

### Effective host/API cut mismatch
Declared extension dependencies are valid, but required APIs reside on different hosts or incompatible runtime surfaces. Detection candidate: compute the realized host/API cut and jointly qualify required callable contracts. Owner set: extension contract + host/runtime realization. Existing structural/provider/compatibility patterns cover it.

### Trust-time split
Artifact was validly signed/admitted at publication/install time, but publisher/policy/trust qualification differs at activation/invocation time. Detection candidate: bind each claim to its evidence time and policy revision. Existing trust/currentness and authority patterns cover it.

### Revocation versus surviving capability handles
Extension is disabled/uninstalled or admission revoked while issued callbacks/tokens/jobs/leases remain usable. Detection candidate: reachable effective-capability set plus issuance/revocation/currentness evidence. Existing residual-cohort, revocation, ambiguous-effect and quiescence patterns cover it.

### N-wise plugin closure failure
Every dependency edge/pair is valid while aggregate version/API/provider/authority constraints have no common realization. Detection candidate: N-wise constraint/profile intersection rather than pairwise-only validation. Existing qualification-join/dependency-closure patterns cover it.

### Extension proof-set incompleteness
A signed plugin/result is treated as proof of publisher authority, semantic compatibility or business effect. Detection candidate: proof-claim matrix identifying absent claim/evidence classes. Existing `PROOF-CLAIM-CONFLATION` covers it.

### Semantic-owner collision
Two valid extensions write the same canonical subject with incompatible postconditions. Detection candidate: write-set/owner intersection plus commutativity/merge semantics and ordering analysis. Existing semantic-ownership/data/state patterns cover it.

### Aggregate resource/cost amplification
Individually bounded plugins compose into callback/fan-out/quota/cost explosion. Detection candidate: graph-derived reachable resource set combined with runtime cardinality/capacity/cost bounds. Existing resource/capacity/objective patterns cover it.

### Human/AI aggregate authority expansion
Operator procedure or generated low-code composition chains individually admitted extensions into a reach exceeding initiating authority/trust/provider qualification. Detection candidate: aggregate reachable effect/authority set compared with current qualified envelope. Existing authority non-amplification and AI/low-code composition patterns cover it.

## 9. Conflict-family coverage and result

Structural graph, state-transition, semantic ownership, rule/condition, temporal/ordering, resource/capacity, authority/responsibility/SoD, policy/compliance, data/consistency, provider/integration, version/migration/coexistence, exception/compensation/recovery, human-procedure/instruction, cross-process, objective/optimization and AI/low-code families were explicitly challenged.

All material-looking candidates duplicate-screened into the 123 existing reusable patterns. Therefore this revisit creates:

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariant candidates: **0**.

No `Signal` is promoted to `ConfirmedConflict`. No remediation is initiated.

## 10. Saturation disposition

- Extension / Plugin / Marketplace Architecture streak remains capped at **2**.
- Extension/Plugin × authority × provider trust × lifecycle cluster streak remains capped at **2**.
- Full Pass 6 capability coverage advances **9/28 -> 10/28**.
- Full Pass 6 mandatory-cluster coverage advances **9/12 -> 10/12**.
- Inventory remains **284 edge scenarios + 123 ConflictPatterns = 407 material findings**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Completed full passes remain **5/8 minimum**, target **12**.
- Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`.
- Planning C remains blocked.

## 11. Next bounded focus

Continue Full Pass 6 with **Commercial Metering / Entitlements / Rating / Billing / Payment** and explicitly exercise **Commercial Metering × Entitlements × Rating × Billing × Payment**. Carry Typed Semantic Graph/Federation, formal assurance and Autonomous Builds/Fleet into typed usage/entitlement/rating/invoice/payment identity; revision-sliced aggregation; late/corrected usage after invoice/payment adoption; entitlement versus authorization; rerating versus credits/refunds/chargebacks; currency/unit/rounding joins; replay/dedupe/provider substitution; settlement divergence; historical analytical kinds/snapshots; residual cohorts; monetary `PARTIAL/UNKNOWN`; proof/certificate claims; resource/cardinality/cost exhaustion; shared tenancy; contradictory human billing procedures; objective conflicts; and AI/low-code monetary composition. Duplicate-screen all 123 ConflictPatterns. Commercial and cluster streaks are already 2 and must not be inflated. GraphDB remains optional/provider-level; Fleet remains non-authoritative. Do not enter Planning C.
