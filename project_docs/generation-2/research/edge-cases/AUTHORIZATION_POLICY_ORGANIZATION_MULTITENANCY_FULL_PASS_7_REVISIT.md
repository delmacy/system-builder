# Generation 2 — Authorization / Policy / Organization / Multitenancy — Full Pass 7 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Authorization / Policy / Organization / Multitenancy
Pass: 7
Authority: `RESEARCH_PIPELINE_STATE.json`, `ADVERSARIAL_SATURATION_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, and `PHYSICAL_PERIPHERAL_OPERATIONS_INTEGRATION_PLANE_BOUNDARY.md`.

Research only. No product code, Work Package, TASK, Construction, implementation guard, direct physical actuation or concrete remediation is authorized. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `external provider state != canonical authority != actual physical/media access success`, and the default route `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Pass-7 technique rotation

This revisit deliberately changed the attack surface from Pass 6 and carried all standing Generation-2 hypotheses plus bounded Legacy Mirroring/Brownfield and Physical/Peripheral integration-plane research:

1. **external-grant semantic substitution** — compare canonical roles/relationships with provider-native roles, groups, entitlements, schedules and resource scopes whose labels look equivalent but whose semantics are provider-owned;
2. **provisioning-to-enforcement fracture** — split requested, accepted, persisted, propagated, effective and physically/media-enforced permission state, including `PARTIAL/UNKNOWN` and offline sites;
3. **negative-inventory falsification** — challenge revoke/deprovision proofs built from pagination, filtered inventory, unsupported provider scopes, stale caches or missing event streams;
4. **site/tenant namespace permutation** — permute provider tenant, client, workspace, site, resource group, external account and canonical subject IDs to expose cross-site/cross-tenant grant aliasing;
5. **residual-access cohort analysis** — trace accounts, groups, credentials, sessions, authorized links/tokens and controller-local state after canonical revoke/deprovision or connector replacement;
6. **authority-class separation** — keep read/query/event, provisioning, access brokering and exceptional physical actuation as different operation classes rather than inferring stronger authority from visibility or connector reach;
7. **break-glass/SoD temporal braid** — cross emergency grant, approval, expiry, delegation and provider synchronization delays with in-flight work and offline enforcement points;
8. **policy-propagation queue pressure** — challenge security-currentness deadlines under bursts, rate limits, retries, provider outage, high fan-out and shared-noisy-neighbor infrastructure;
9. **provider-capability no-silent-drop** — challenge accepted payloads where unsupported role/resource/schedule dimensions are ignored, rounded, widened or narrowed without explicit diagnostic evidence;
10. **decision/provenance non-strengthening** — keep decision provenance, provider acknowledgement, event observation, Fleet telemetry and causal/counterfactual analysis from becoming canonical authority or proof of actual access outcome;
11. **AI/low-code authority composition** — compose individually permitted read/provision/broker operations, inherited groups and provider bindings to search for aggregate authority, SoD bypass or implicit actuation;
12. **duplicate-screen** against all 124 reusable `G2-CONFLICT-PATTERN-*` patterns before admitting novelty.

All 12 mandatory clusters are already covered in Full Pass 7. Authorization and `Identity × Authorization × Station × AGWS × AI` already have streak 2 and must remain capped absent material novelty.

## 2. Fresh comparative evidence

Fresh standards and mature-system evidence strengthens existing patterns without requiring a new reusable ConflictPattern.

### 2.1 SCIM roles/groups are not a portable authorization vocabulary

RFC 7643 defines SCIM `roles` and `entitlements`, but does not define a canonical authorization meaning for them; group membership semantics and resulting authorization behavior are explicitly provider-defined. RFC 7644 supports PATCH/DELETE and version-qualified mutations, but protocol success does not by itself prove downstream permission enforcement or convergence.

Portable inference: `SCIM user/group/role state != canonical authority != effective external access`. Mapping must remain provider/site/revision qualified, and unsupported or semantically lossy mappings cannot be silently treated as equivalent.

References:
- https://www.rfc-editor.org/rfc/rfc7643
- https://www.rfc-editor.org/rfc/rfc7644

### 2.2 OpenFGA contextual evidence and immutable model versions

OpenFGA contextual tuples are request-scoped, can override stored tuples for that request, and token-derived group relationships can continue conferring access until token expiry even when the underlying membership changes. Authorization models are immutable revisions, and production guidance recommends explicitly pinning the authorization model ID rather than implicitly using `latest`.

Portable inference: authority evaluation may depend on several independently versioned/currentness-qualified cuts: policy/model revision, stored relationships, contextual/token evidence, canonical organization state and effect time. A deterministic `allowed=true` is not proof that all evidence remains current at the eventual external effect.

References:
- https://openfga.dev/docs/interacting/contextual-tuples
- https://openfga.dev/docs/modeling/token-claims-contextual-tuples
- https://openfga.dev/docs/getting-started/immutable-models

### 2.3 Cedar typed slices do not prove external convergence

Cedar level validation can bound entity dereference depth and support constructing a sufficient entity slice for policy evaluation. Schema/policy validation remains distinct from evaluation and from external enforcement.

Portable inference: typed semantic graphs may help prove that an authorization decision consumed a structurally sufficient slice, but graph validity/slice completeness is still distinct from currentness, canonical ownership, provider mapping and enforcement convergence.

Reference:
- https://docs.cedarpolicy.com/policies/level-validation.html

### 2.4 ONVIF reinforces integration-plane versus control-plane separation

ONVIF Profile A explicitly covers access-rule, credential and schedule configuration plus status/events. ONVIF Access Control specifications separately define the access-control unit as the component that makes grant/deny decisions and can control doors. Profile D additionally exposes peripheral operations that can include locking/unlocking, demonstrating that physical actuation is a distinct provider operation class rather than an automatic consequence of inventory/configuration visibility.

Portable inference: System Builder can research provisioning, grant/revoke synchronization, inventory, event/currentness and reconciliation while preserving specialized systems as control/media planes. A future direct actuation capability, if any, requires an explicit separate architecture decision and safety/authority proof.

References:
- https://www.onvif.org/profiles/onvif-profile-a/
- https://www.onvif.org/profiles/profile-d/
- https://www.onvif.org/specs/srv/access/ONVIF-AccessControl-Service-Spec-v2006.pdf

These witnesses do not prescribe a target policy engine, GraphDB, tenancy model, VMS/BMS/access implementation or Fleet control plane.

## 3. Adversarial candidates and duplicate-screen

No candidate survived duplicate-screen as a new material edge scenario or 125th ConflictPattern.

| Candidate challenge | Existing coverage / disposition |
| --- | --- |
| canonical role/group maps to provider role with same label but broader/narrower resource semantics | provider semantic-support mismatch + authority non-amplification + semantic-owner conflict — DUPLICATE |
| provider accepts grant/revoke but offline controller/session/token keeps prior access effective | false convergence + residual cohort + authority-currentness + provider/effect evidence — DUPLICATE |
| deprovision inventory omits a paginated/filter-hidden account and UI reports complete removal | presence/completeness + provider qualification + proof-claim conflation + residual cohort — DUPLICATE |
| provider silently ignores unsupported camera/site/schedule scope and applies a wider default | provider semantic mismatch + no-silent-drop/evidence qualification + authority amplification — DUPLICATE |
| same external account/resource ID is reused across provider tenants/sites and binds to wrong canonical subject | entity-resolution/identity drift + cross-tenant leakage + provider namespace qualification — DUPLICATE |
| connector replacement revokes new provider but residual grants remain authoritative in old provider/site | migration coexistence + residual provider cohort + false cutover convergence — DUPLICATE |
| break-glass expires canonically while provider propagation queue is delayed, leaving emergency grant effective | authority-currentness + temporal/order + resource/capacity + exception/recovery — DUPLICATE |
| healthy sync aggregate hides oldest revoke queue beyond security-currentness policy | resource/capacity + objective/policy precedence + evidence qualification + authority-currentness — DUPLICATE |
| read/query visibility is composed by AI/low-code with provider credential reach and becomes inferred door/camera actuation authority | AI/low-code composition + confused deputy + provider semantic mismatch + authority non-amplification — DUPLICATE |
| Fleet observes entry event after a grant and treats correlation as proof the grant caused access | causal/proof-claim conflation + provenance non-authority + evidence-currentness — DUPLICATE |
| decision engine evaluates a current canonical policy against stale provider permission state and treats denial/allow as globally authoritative | semantic ownership + currentness + provider divergence + distributed/federated truth — DUPLICATE |
| shared connector capacity prioritizes ordinary inventory over revoke/deprovision traffic until security deadline is missed | resource/capacity + objective conflict + authority-currentness + fairness/admission — DUPLICATE |

The strongest candidate remains **provider-scope semantic loss combined with successful acknowledgement**: a connector can submit a syntactically accepted external grant while one or more canonical scope dimensions are unsupported, ignored or interpreted differently. This is material as an activation scenario, especially for physical/peripheral integrations, but its incompatible claims, owners, detection routes and future remediation route are already represented by provider semantic mismatch + no-silent-drop/evidence qualification + authority non-amplification + false convergence. No new stable ID is warranted.

## 4. Processual / semantic conflict-family screen

All required families were explicitly exercised:

- **structural:** tenant/site/resource inheritance cycles and orphan external mappings;
- **state/transition:** request/approve/grant/revoke/deprovision/use races and delayed external convergence;
- **semantic ownership:** canonical organization authority versus provider-local roles/groups/credentials/controller state;
- **rule/formula/condition:** time schedules, conditions, provider defaults and incompatible scope intersections;
- **temporal/ordering:** token expiry, break-glass expiry, delayed revoke, future/retroactive policy edits and offline reconnect;
- **resource/capacity:** propagation queues, provider quota, noisy-neighbor starvation, burst fan-out and retry amplification;
- **authority/responsibility/SoD:** delegation, request/approval overlap, provider admin reach and read/provision/broker versus actuation separation;
- **policy/compliance:** site/residency/privacy/security constraints versus availability/cost/provider support;
- **data/consistency:** incomplete inventory, stale permission snapshots, duplicated accounts and external ID reuse;
- **provider/integration:** feature-label equivalence, unsupported scopes, provider outage and acknowledged-but-ineffective mutations;
- **version/migration/coexistence:** old/new policy models, connector replacements, residual providers/controllers/tokens;
- **exception/compensation/recovery:** emergency access, reconnect, restore and obsolete authority resurrection;
- **human-procedure:** contradictory manual revoke/grant/runbook steps or direct vendor-console changes;
- **cross-process:** HR deprovision, security access, site operations and external-account lifecycle interacting on the same subject;
- **objective/optimization:** latency/cost/availability versus least privilege, revoke deadline and tenant isolation;
- **AI/low-code:** safe integration fragments composed into widened authority or physical-control intent.

No `ConflictInstance` is asserted. No prevention or remediation is materialized.

## 5. Standing Generation-2 hypotheses under this revisit

The standing hypotheses survive as research carry-forward only:

- **Typed Semantic Graph / Execution:** candidate graph edges for `subject -> role/group -> permission -> external resource` need provider/site/revision/currentness qualification; `CapabilityDefinition != CapabilityUse`; `GraphDefinition != runtime/provider state`; `ExecutionState != ExecutionJournal`.
- **Autonomous Builds / Fleet:** `semantic authority topology != provider permission topology != deployment/runtime truth != local evidence != exported telemetry != Fleet aggregate != control authority`; local/client systems must continue operating without Fleet.
- **Federated Graph:** external systems remain autonomous domains connected by contracts; no shared mutable permission truth is assumed.
- **Temporal graph:** roles, grants, schedules, provider bindings and emergency exceptions require effective-time/currentness semantics where adopted.
- **Provenance:** lineage can record who requested, mapped, accepted and observed a permission change, but `lineage != authority != causal proof`.
- **Decision semantics:** authorization decision, provider provisioning mutation and physical/media access outcome are distinct semantic kinds.
- **Units/vector/uncertainty:** operational state such as revoke lag, stale age, queue depth, currentness confidence and provider quota is multidimensional and must not be silently reduced to a green scalar health score.
- **Queue/capacity:** current success or low utilization does not prove sustainable revoke/provision capacity or bounded security-currentness latency.
- **Graph transformation/revision:** changing site/resource/provider mappings can invalidate authorization proofs and requires affected-subgraph/revision reasoning if the graph hypothesis is adopted.
- **Causal/counterfactual:** Fleet correlation may support diagnosis but cannot itself change grants or claim causality.
- **Legacy/Brownfield:** imported vendor roles/groups/accounts may have ambiguous semantics and residual unmanaged authority; assimilation requires qualified mapping, not automatic canonical adoption.
- **Physical/Peripheral boundary:** provisioning, read/query/event integration, access brokering and reconciliation remain the default research scope; specialized VMS/access/BMS/PDV/device suites remain control/media/runtime planes. Direct physical actuation remains a separate exceptional question for Planning C, not inherited authority.

No evidence in this revisit requires GraphDB, centralized raw video, central biometric matching/storage, direct device control or a Fleet runtime dependency.

## 6. Planning C / D / E carry-forward candidates

Research inputs only, not decisions:

- **Planning C:** decide authorization semantic ownership, temporal/currentness model, external permission/resource mapping, provider-capability qualification, tenant/site isolation, integration-plane operation classes, explicit non-actuation default and whether any exceptional physical actuation capability exists at all. Decide how graph IR, if adopted, represents external grants without becoming a semantic god-object.
- **Planning D:** stage old/new authorization models, connector/provider replacement, external identity/permission mapping, offline/residual accounts/credentials/sessions/resources and brownfield roles; acknowledgement must not equal convergence.
- **Planning E:** prove create/update/disable/delete external user; grant/revoke; provider unsupported-scope reporting; `PARTIAL/UNKNOWN`; permission drift/reconciliation; camera/site isolation; stale/offline external permission evidence; revoke queues/currentness deadlines; provider outage; residual cohorts; no cross-tenant/site leakage; and that generic integration cannot silently escalate into physical/control authority.

## 7. Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariants: **0**;
- bounded Planning-A backfill: **0**;
- Authorization no-material streak: **2 (preserved; capped)**;
- mandatory-cluster streaks: **2 (preserved; all 12 already covered)**;
- material edge inventory: **284**;
- reusable ConflictPattern inventory: **124**;
- combined material findings: **408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 7 capability coverage after this revisit: **17/28**;
- completed full passes: **6/8 minimum**;
- target: **12**, no maximum;
- negative-space review: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## 8. Next rotation

Continue only Full Pass 7 with **Governance / Compliance / Audit**. Carry all standing semantic-graph/execution, autonomous-build/Fleet, federation, temporal, provenance, decision, unit/vector/uncertainty, queue/capacity, graph-revision, causal, Legacy/Brownfield and bounded Physical/Peripheral integration-plane lenses. Challenge time-qualified control applicability to external systems/sites; evidence completeness versus audit/provenance/authority/causal proof; exception/waiver expiry; policy-to-provider enforcement drift; remediation acknowledgement versus effective external closure; retention/privacy of access/event evidence; offline/residual noncompliant accounts/credentials/resources; provider unsupported-scope diagnostics; audit gaps and pagination; shared-infrastructure tenant attribution; risk-vector scalarization; human vendor-console procedures; and AI/low-code that fabricates, mis-scopes or bypasses controls. Duplicate-screen all 124 ConflictPatterns. Governance streak is 1 and may advance to 2 only on an eligible no-new-material revisit. Do not enter Planning C.