# Generation 2 — Extension / Plugin / Marketplace Architecture — Full Pass 7 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 7
Capability: Extension / Plugin / Marketplace Architecture
Mandatory cluster: Extension/Plugin × authority × provider trust × lifecycle

Research only. `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. No product, Work Package, executive TASK, Construction or remediation is authorized.

## 1. Technique rotation

This revisit used techniques materially different from prior passes:

- **trust-policy time cube** across publish, sign, admit, install, activate, invoke, revoke and residual-use times;
- **diamond-realization satisfiability** across transitive host/API/provider/authority constraints rather than pairwise dependency validity;
- **quiescence subtraction**: remove activation while retaining issued callbacks, jobs, leases, tokens, subscriptions and external effects;
- **graph-rewrite survivorship**: revise extension/capability topology N→N+1 while old invocations and proof obligations remain pinned;
- **local/Fleet evidence disagreement**: runtime-local evidence versus delayed, sampled or absent aggregate projection;
- **brownfield adapter permutation**: treat a legacy connector/mirroring adapter as an extension and challenge whether connectivity/inferred mappings accidentally acquire canonical authority;
- **aggregate semantic-owner permutation**: independently valid extensions contribute rules/decisions/calculations/writes whose composition is not jointly qualified;
- **resource-vector closure**: CPU, memory, queue, provider quota, monetary cost and callback cardinality remain separate dimensions rather than scalar health.

Duplicate-screen baseline: all 124 reusable ConflictPatterns.

## 2. Evidence interpretation

npm documents `peerDependencies` as compatibility constraints between a plugin and host and notes that conflicting peer requirements can make a dependency tree unresolvable. A resolved package tree is therefore evidence about dependency realization, not proof of semantic compatibility, authority or safe aggregate behavior.

Sigstore explicitly separates signature/identity evidence from policy: a valid keyless signature establishes an authenticated signing identity at a time, not that the signer should have signed the artifact or that the artifact is good. Its transparency evidence and short-lived certificates strengthen provenance/integrity/currentness reasoning but do not establish extension admission or business-effect correctness.

Portable conclusion: `dependency resolution != semantic qualification`; `signature/identity != admission/authority`; `admission != invocation-time currentness`; `deactivation/uninstall != quiescence`.

## 3. Typed Semantic Graph / temporal / provenance lenses

The extension domain continues to support distinct typed subjects such as `ExtensionDefinition`, `ExtensionRevision`, `CapabilityUse/Invocation`, `HostRealization`, `ProviderBinding`, `AuthorityPolicyRef`, `TrustEvidenceRef` and effect evidence. Temporal validity and provenance qualify these relations; reachability never upgrades them to authority.

Graph revision N→N+1 must preserve pinned in-flight identity or explicitly invalidate/revalidate dependent claims. `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, provider state and canonical business truth remain distinct. PostgreSQL relational graph remains a plausible baseline; no evidence requires GraphDB. Canvas/Fleet remain non-authoritative projections.

## 4. Legacy Mirroring / brownfield assimilation lens

The newly required Mirroring research front was applied here only as a bounded cross-cutting lens because the authoritative `next_action` remains Extension. A spreadsheet/database/drive/email/legacy adapter can be extension/provider mechanics, but `connected source != canonical authority` and `inferred mapping != approved semantics`.

Extension admission cannot silently promote inferred field meaning, entity resolution, formulas/macros, observed process order or source precedence. Deactivation/uninstall of a mirroring adapter also does not prove synchronization quiescence: residual callbacks, CDC offsets, staged files, retries or externally issued credentials may survive. These candidates duplicate-screen into existing semantic-owner, provenance/currentness, residual-cohort, ambiguous-effect, provider qualification and authority-non-amplification patterns.

No decision is made whether Mirroring is a canonical capability, composite capability, provider family or modernization toolkit. That semantic-ownership question remains mandatory carry-forward for Planning C/D/E and Architecture Reconciliation when the saturation authority reaches the appropriate bounded focus.

## 5. Adversarial dispositions

### Trust-policy time split
A plugin was validly signed and admitted but invocation occurs under a newer trust/admission/authority policy. Detection candidate: qualify each claim by evidence time, policy revision and invocation revision. Existing trust/currentness patterns cover it.

### Diamond realization without joint semantic closure
Every dependency edge is individually valid while aggregate host/API/provider/authority requirements have no common qualified realization. Detection candidate: N-wise constraint intersection plus realized host/provider surface. Existing qualification/dependency-closure patterns cover it.

### False uninstall safety
Plugin is disabled/uninstalled while callbacks, leases, tokens, jobs, subscriptions or external effects survive. Detection candidate: residual reachable capability/effect set and quiescence evidence. Existing residual-cohort/revocation/effect patterns cover it.

### Graph rewrite with pinned invocations
Extension graph revision removes/replaces a node while old durable invocations remain pinned to prior semantics. Detection candidate: affected-subgraph semantic diff plus pinned-instance and proof-obligation impact. Existing revision/currentness/proof invalidation patterns cover it.

### Brownfield adapter authority amplification
A connected legacy source or AI-inferred mapping becomes canonical because its adapter is admitted. Detection candidate: mapping provenance, explicit semantic owner approval and source-of-truth qualification. Existing semantic-owner, provenance and authority patterns cover it.

### Resource-vector scalar collapse
Aggregate plugin composition appears healthy under one scalar while queue, quota, cost or callback cardinality is unstable. Detection candidate: vector bounds and bottleneck-specific headroom. Existing resource/capacity/objective patterns cover it.

## 6. Result and saturation disposition

All material-looking candidates duplicate-screen into the 124 existing reusable ConflictPatterns.

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariant candidates: **0**.

Extension / Plugin / Marketplace Architecture streak remains capped at **2**. Extension/Plugin × authority × provider trust × lifecycle remains capped at **2**. Full Pass 7 advances from **9/28 to 10/28 capabilities** and **9/12 to 10/12 mandatory clusters**. Inventory remains **284 edge scenarios + 124 ConflictPatterns = 408 material findings**. HIGH/CRITICAL without owner/proof/detection route remains **0**. Completed full passes remain **6/8 minimum**; target **12**. Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`; Planning C remains blocked.

## 7. Carry-forward

Planning C must eventually decide extension trust/admission/host/provider boundaries and the Mirroring architecture/source-of-truth/provenance/mapping ownership. Planning D must address residual cohorts, staged migration/coexistence/cutover and rollback/quiescence. Planning E must require product proofs for extension authority/trust/provider realization and, for Mirroring, no-silent-loss ingestion, mapping/reconciliation, sync conflict handling, permission/historical preservation and rollback. These are research carry-forwards, not implementation authorization.

## 8. Next bounded focus

Continue Full Pass 7 with **Commercial Metering / Entitlements / Rating / Billing / Payment** and explicitly exercise the corresponding mandatory cluster. Carry temporal/provenance/decision/units/uncertainty/queue-capacity/graph-revision/causal, Typed Semantic Graph/Federation, Fleet and bounded Legacy Mirroring lenses into usage identity, entitlement versus authorization, revision-sliced rating, late/corrected usage, rerating/credits/refunds/chargebacks, currency/unit/rounding, settlement divergence, residual providers/cohorts, monetary `PARTIAL/UNKNOWN`, proof claims, resource/cost pressure, historical imported usage and AI/low-code composition. Duplicate-screen all 124 patterns. Do not inflate capped streaks and do not enter Planning C.