# Generation 2 — Extension / Plugin / Marketplace Architecture — Full Pass 3 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 3
Capability: Extension / Plugin / Marketplace Architecture
Mandatory cluster: Extension/Plugin × authority × provider trust × lifecycle
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. This revisit performs catalogue/classification/detection-candidate/future-remediation analysis only and does not authorize implementation, Work Packages, TASKs or Construction.

## 1. Technique rotation

This Full-Pass-3 revisit deliberately used techniques different from the previous two passes:

- authority-envelope subtraction across already-issued handles, registrations and callbacks;
- host-topology mutation across local/web/remote execution loci;
- activation/deactivation/uninstall quiescence inversion;
- dependency/peer-resolution N-wise mutation with optional and transitive members;
- currentness subtraction for publisher, trust, admission, host API and marketplace/provider evidence;
- residual-cohort analysis after disable/update/uninstall;
- lease/token revocation versus in-flight effects;
- rollback/uninstall eligibility subtraction;
- semantic-owner collision braids across multiple admitted extensions;
- resource/fan-out amplification under individually valid extension compositions;
- AI/low-code composition of individually admitted extensions whose aggregate authority/support cut may differ.

Duplicate-screen baseline: 115 reusable `G2-CONFLICT-PATTERN-*` patterns and the existing extension scenarios through `G2-EDGE-EXTENSION-009` and `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-005`.

## 2. External evidence used as portable support

Current mature extension ecosystems reinforce several already-catalogued distinctions without establishing a new universal conflict family:

- VS Code exposes separate local, web and remote Extension Hosts; execution location depends on available hosts, extension capabilities, installation location and preferred `extensionKind`. Declared dependency therefore does not itself prove a single usable execution/API surface.
- VS Code documents that a remote extension can depend on a local extension while their exported API is unavailable across separate extension hosts; dependency activation and usable semantic surface are distinct facts.
- VS Code documents `deactivate()` as cleanup opportunity and an uninstall hook that executes only when uninstall is completed after restart. Control-plane disable/uninstall therefore does not prove immediate quiescence of all effects or persisted/external state.
- VS Code activation is event-driven and an extension's `activate()` is invoked once for the activation lifetime. Admission/currentness changes after activation therefore require separate qualification reasoning; activation success is not continuing authority evidence.
- npm documents peer-dependency constraints, optional peers and resolver behavior. Pairwise semver/package compatibility does not by itself establish N-wise semantic compatibility of a realized plugin closure.
- Chrome extension runtime exposes cross-extension and native messaging surfaces, reinforcing that an admitted extension may reach effects through additional runtime communication edges whose authority and currentness must be evaluated as part of the effective graph.

Portable principle: `installed/admitted != currently qualified aggregate authority`, `dependency declared/resolved != jointly qualified semantic surface`, and `disabled/uninstalled != proven effect quiescence`.

Sources consulted on 2026-09-05:

- https://code.visualstudio.com/api/advanced-topics/extension-host
- https://code.visualstudio.com/api/advanced-topics/remote-extensions
- https://code.visualstudio.com/api/references/extension-manifest
- https://code.visualstudio.com/api/references/activation-events
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json/
- https://developer.chrome.com/docs/extensions/mv2/reference/runtime

## 3. Candidate challenges and duplicate-screen disposition

### 3.1 Revocation after capability/handle issuance

Candidate: an extension loses marketplace/admission/permission eligibility after it has obtained a host API handle, token, callback registration, queue subscription or provider credential that remains usable.

Disposition: not a new material class. It reduces to existing authority-currentness, permission-composition, lease/revocation, residual-cohort and degraded-authority patterns. The important diagnostic remains whether the *effective reachable authority graph* is still inside the current qualified envelope, not whether the root extension remains installed.

### 3.2 Disable/uninstall while effects remain in flight

Candidate: extension is disabled or uninstalled while async cleanup, jobs, callbacks, provider mutations, external subscriptions or persisted handlers remain active or ambiguous.

Disposition: not a new material class. It is already covered by residual-cohort, quiescence/currentness, ambiguous-effect, recovery/rollback-eligibility and compensation-after-adoption families. Uninstall state is control-plane evidence, not proof of external-effect convergence.

### 3.3 Host API semantic skew across extension hosts

Candidate: the same admitted extension graph runs across local/web/remote hosts or after host/runtime upgrade, with nominally compatible APIs but different available semantics or execution location.

Disposition: not a new material class. It reduces to provider/host qualification, revision-vector, conformance-semantics, qualification-join and residual-cohort patterns, including `G2-EDGE-EXTENSION-008`.

### 3.4 Transitive permission join and dependency diamond

Candidate: every extension/dependency is individually admitted, but the union of permissions/capabilities or the realized dependency closure exceeds the root admission envelope or has no jointly qualified semantic cut.

Disposition: already covered by permission-composition/currentness and `G2-EDGE-EXTENSION-008` plus `G2-XEDGE-EXTENSION-AUTH-TRUST-LIFECYCLE-005`. No distinct reusable pattern emerged.

### 3.5 Competing extension hooks and semantic ownership

Candidate: multiple admitted extensions register handlers over the same event/fact and activation or host scheduling changes precedence.

Disposition: already materialized as `G2-EDGE-EXTENSION-009` and existing semantic-ownership / temporal-ordering conflict families. No new class.

### 3.6 Marketplace/provider substitution and trust currentness

Candidate: marketplace, publisher, signing/trust state, package source or provider binding changes while a previously admitted extension remains active.

Disposition: existing provider-substitution, trust-authority, currentness/revision-vector and residual-cohort patterns cover the class. Root identity stability must not be treated as proof that the effective closure remains admitted.

### 3.7 Resource amplification and AI/low-code composition

Candidate: individually valid extensions combine into recursive triggers, fan-out, high-cardinality registrations or mutually activating automation paths, or AI/low-code composes them into an aggregate plan with greater reachable effect surface than any component alone.

Disposition: existing resource-amplification, structural-cycle, authority-non-amplification, objective-conflict and AI/low-code composition patterns cover these cases. A concrete detector must reason over the aggregate graph and declared boundedness rather than globally reject composition.

## 4. Conflict-family coverage check

The revisit explicitly challenged structural, state/transition, semantic ownership, temporal/ordering, resource/capacity, authority/SoD, policy/trust, provider/integration, version/migration/coexistence, exception/recovery, cross-process/objective and AI/low-code composition conflicts.

No material conflict family lacked an existing owner set or detection/remediation route after duplicate screening. No `ConflictInstance` is asserted.

Research disposition remains:

`CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## 5. Saturation result

- New local material edge scenarios: 0.
- New mandatory-cluster material scenarios: 0.
- New reusable ConflictPatterns: 0.
- Extension / Plugin / Marketplace Architecture local revisit: eligible no-new-material; streak `0 -> 1`.
- Extension/Plugin × authority × provider trust × lifecycle cluster revisit: eligible no-new-material; streak `0 -> 1`.
- Existing material inventory remains 278 edge scenarios + 115 ConflictPatterns = 393 material findings.
- HIGH/CRITICAL without owner/proof/detection route: 0.
- Saturation remains `NOT_SATURATED`.
- Negative-space review remains `NOT_STARTED`.
- Planning C remains blocked.

## 6. Next bounded focus

Continue Full Pass 3 with Commercial Metering / Entitlements / Rating / Billing / Payment and explicitly revisit Commercial Metering × Entitlements × Rating × Billing × Payment, rotating techniques beyond Full Passes 1 and 2. Challenge aggregation-window/revision joins; corrected/late usage after invoice/payment adoption; rerating versus refunds/credits/chargebacks; currency/unit/rounding profile joins; dedupe identity across provider substitution/replay; entitlement/authorization drift; settlement versus invoice/payment state; historical reproduction versus current rerating; residual billing/payment provider cohorts; monetary `PARTIAL/UNKNOWN`; cardinality/resource exhaustion; and AI/low-code compositions that can create unauthorized grants, duplicate billing or objective conflicts.
