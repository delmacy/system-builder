# Generation 2 — Adaptive Governed Work Surfaces Edge-Case Register

Status: ACTIVE — FULL PASS 1 MATERIAL FINDINGS
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Adaptive Governed Work Surfaces (AGWS)
Paired high-risk cluster: Identity × Authorization × Station × AGWS × AI
Planning-A boundary authority: `project_docs/generation-2/planning/PLANNING_A_ADAPTIVE_GOVERNED_WORK_SURFACES_BOUNDARIES.md`
Planning-B current-state authority: `project_docs/generation-2/planning/PLANNING_B_ADAPTIVE_GOVERNED_WORK_SURFACES_SB_CURRENT_STATE.md`

## 1. Pass-1 research question

Which adversarial states can cause a governed work surface to amplify authority, silently weaken inherited constraints, misrepresent current authorization, duplicate ambiguous external effects, or become operationally unsafe under version skew and pathological composition — while preserving the boundary that AGWS owns governed composition and does not become Authorization, Identity, Integration, generic UI, Workflow, or AI authority?

## 2. External evidence used in this pass

The pass used mature authorization/governance material as adversarial evidence, not as target-architecture prescriptions:

1. NIST SP 800-162, ABAC — authorization depends on subject, object, operation and environment attributes evaluated against policy; changing context therefore matters to authorization validity: https://www.nist.gov/publications/guide-attribute-based-access-control-abac-definition-and-considerations-0
2. OWASP Authorization Cheat Sheet — deny by default and validate permissions on every request; UI visibility is not authorization: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
3. Google Zanzibar — authorization systems must account for ordering/consistency of relationship changes; stale authorization is an explicit distributed-systems problem: https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/
4. OpenFGA immutable authorization models — production checks should pin a specific model revision rather than silently following the latest model: https://openfga.dev/docs/getting-started/immutable-models
5. OpenFGA consistency semantics — lower-latency cached authorization queries can temporarily omit a fresh tuple update, making currentness an explicit decision: https://openfga.dev/docs/interacting/consistency
6. OpenFGA contextual tuples — token-derived claims can remain usable until token expiry even after underlying membership changes, a concrete stale-authority hazard: https://openfga.dev/docs/interacting/contextual-tuples
7. Microsoft Power Platform Managed Environments — delegated/environment administration remains bounded; delegated admins cannot change some managed-environment properties, reinforcing that lower-scope administration is not unconstrained authority: https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-enable

## 3. Material local scenarios

### G2-EDGE-AGWS-001 — stale Role/Station context leaves a previously valid surface actionable

- **Scenario:** a Person changes Role or Station, or loses authority, while a previously resolved AGWS surface remains cached/open. The surface still presents a provider-backed or canonical action that was valid under the old context.
- **Preconditions:** effective surface was resolved under revision/context `C1`; Identity/Authorization/Station truth advances to `C2`; client or runtime still holds `C1`.
- **Trigger:** actor invokes the stale action before the surface is re-resolved.
- **Affected subjects/revisions:** Person identity/session context, Role membership revision, Station assignment/exposure revision, authorization-policy/model revision, surface layer revisions, provider binding revision.
- **Expected safe behavior:** every mutating invocation is re-authorized against qualified current authority; stale surface state can be marked invalid/revalidation-required; loss of authority cannot be masked by cached visibility.
- **Forbidden behavior:** treating prior surface resolution, button visibility, cached token claims, prior provider capability discovery, or a previous authorization decision as continuing authorization.
- **Failure/effect disposition:** `DENIED` when current authority is known insufficient; `INCONCLUSIVE` when required currentness cannot be established; no mutation may proceed on an `INCONCLUSIVE` authorization basis.
- **Owners:** Authorization / Policy / Organization / Multitenancy owns current authority; Identity owns subject/authentication context; AGWS owns revalidation of effective surface participation; Provider/Binding owns current binding qualification.
- **Portable/provider boundary:** portable invariant; provider/session cache mechanics are realization-specific.
- **Authority boundary:** preserves `Enterprise → Station → Role → Person`; no lower layer or AI widens the effective set.
- **Evidence/currentness:** decision must identify subject, Role/Station context, policy/model revision or equivalent qualified decision evidence, and surface revision/currentness horizon.
- **Recovery/reconciliation:** invalidate/re-resolve affected surface; reconcile in-flight invocation if transport/effect became ambiguous; reissue only after current authority and effect state are known.
- **Blast radius:** cross-tenant/cross-Station exposure is possible if stale context is mis-scoped; otherwise actor-local but can reach destructive actions.
- **Severity / misuse likelihood:** **CRITICAL / plausible**.
- **Proof obligation:** `AGWS-ADV-PROOF-001` — demonstrate that a Role/Station/authority change cannot leave a stale surface capable of executing a mutation without a fresh qualified authorization decision.
- **Architecture consequence candidate:** currentness/revalidation must be a first-class proof obligation at surface invocation boundaries; no target module is prescribed here.
- **Saturation status:** MATERIAL — local streak reset to 0.

### G2-EDGE-AGWS-002 — lower-layer overlay removes or neutralizes an inherited mandatory component

- **Scenario:** a Station, Role or Person overlay uses deletion, hiding, slot displacement, conflicting conditional visibility, or version-skewed layout semantics to make an Enterprise/Station mandatory component effectively absent.
- **Preconditions:** superior revision marks a component `presence required`; lower revision is based on an older layout/surface revision or submits a conflicting overlay.
- **Trigger:** effective-surface resolution merges revisions concurrently or after a superior constraint change.
- **Affected subjects/revisions:** Enterprise/Station/Role/Person surface layers, mandatory-component constraint revision, layout-contract revision.
- **Expected safe behavior:** monotonic inherited constraints survive merge; if lower-layer intent cannot be reconciled with the current superior revision, resolution is rejected or `INCONCLUSIVE` rather than silently weakening the invariant.
- **Forbidden behavior:** last-write-wins deletion, tombstone, CSS/renderer concealment, alternate slot selection outside the allowed set, or conditional visibility that converts `presence required` into optional.
- **Failure/effect disposition:** `DENIED` for known constraint violation; `INCONCLUSIVE` for unresolved revision/applicability skew.
- **Owners:** AGWS owns mandatory-component and overlay semantics; Lifecycle/Versioning owns revision/coexistence primitives; Authorization owns delegation scope; generic UI cannot override the semantic requirement.
- **Evidence/currentness:** resolution evidence must identify all contributing layer revisions and mandatory/layout constraint revisions.
- **Recovery/reconciliation:** reject/rebase lower overlay on the current superior revision; preserve rejected intent separately from admitted canonical truth.
- **Blast radius:** Role-, Station-, or Enterprise-wide if a weak merge is promoted.
- **Severity / misuse likelihood:** **HIGH / plausible**.
- **Proof obligation:** `AGWS-ADV-PROOF-002` — property/invariant proof that no admitted lower-layer overlay can reduce a superior mandatory-presence constraint under concurrency or version skew.
- **Architecture consequence candidate:** effective-surface resolution needs monotonic-constraint proof semantics; implementation shape deferred.
- **Saturation status:** MATERIAL — local streak reset to 0.

### G2-EDGE-AGWS-003 — AI proposal mixes harmless layout intent with an unauthorized semantic mutation

- **Scenario:** a user asks AI to “put customer credit risk beside the order and automate approval.” The generated proposal contains a valid layout move plus a new field/formula/action/provider binding or workflow mutation outside AGWS authority.
- **Preconditions:** AI receives broad natural-language intent and can reference multiple semantic owners.
- **Trigger:** proposal admission path treats the bundle as one surface customization or admits a safe subset without preserving explicit ownership boundaries.
- **Affected subjects/revisions:** surface proposal, domain/schema/formula/action/workflow/provider-binding revisions, actor delegation context.
- **Expected safe behavior:** proposal is decomposed by semantic owner; AGWS-admissible composition may proceed only if independently valid; out-of-scope mutations become explicit owner-level proposals and require separate authority/evidence. Partial admission must be explicit and lineage-preserving.
- **Forbidden behavior:** AI inventing canonical schema, formula meaning, provider binding, workflow, capability exposure or authorization because those changes make the UI request convenient; silent widening during partial admission.
- **Failure/effect disposition:** `PARTIAL` only with explicit partitioned outcome and no hidden side effect; otherwise `DENIED` or `INCONCLUSIVE`.
- **Owners:** AGWS owns surface materialization proposal; Process/Data/Workflow/Provider/Authorization owners retain their semantics; AI has no independent authority.
- **Authority boundary:** AI/AGWS non-amplification is mandatory.
- **Evidence/currentness:** proposal lineage must capture actor intent, generated proposal revision, referenced owner contracts, admitted/rejected partitions and current authority.
- **Recovery/reconciliation:** withdraw/reject unauthorized partitions; if any external mutation became `UNKNOWN`, reconcile before retry or promotion.
- **Blast radius:** from one Person surface to enterprise-wide semantic corruption if auto-promoted.
- **Severity / misuse likelihood:** **CRITICAL / high**.
- **Proof obligation:** `AGWS-ADV-PROOF-003` — adversarial corpus proving syntactically valid AI proposals cannot cross AGWS owner/authority boundaries, including mixed-intent and partial-admission cases.
- **Architecture consequence candidate:** owner-partitioned proposal/admission evidence is required; target topology deferred.
- **Saturation status:** MATERIAL — local streak reset to 0.

### G2-EDGE-AGWS-004 — usage-driven promotion converts personal automation into shared authority

- **Scenario:** a frequently used Person-level action/automation is recommended or auto-promoted to Role/Station scope because usage evidence indicates popularity or productivity.
- **Preconditions:** usage analytics exist; personal automation is valid for the originating actor; promotion mechanism consumes evidence.
- **Trigger:** high usage score, AI recommendation, admin convenience action, or bulk promotion.
- **Affected subjects/revisions:** Person overlay/automation, promotion proposal, Role/Station surface, delegated administration envelope, underlying action/workflow/provider permissions.
- **Expected safe behavior:** usage is evidence only; promotion creates a new governed proposal evaluated against target-scope authority, capability exposure, policy, provider qualification and owner semantics.
- **Forbidden behavior:** popularity, AI confidence, prior personal success, or provider availability being treated as authorization to broaden scope.
- **Failure/effect disposition:** `DENIED`/`INCONCLUSIVE` where target-scope proof is absent; no inherited authority from the source Person.
- **Owners:** AGWS owns promotion intent/lineage; Authorization owns target-scope authority; Integration/Workflow owns automation semantics; Governance may own approval obligations.
- **Evidence/currentness:** target-scope authority and capability-exposure evidence must be current at admission, not copied from personal history.
- **Recovery/reconciliation:** revoke unadmitted promoted realization, identify recipients/actions affected, reconcile any external effects, retain correction/supersession lineage.
- **Blast radius:** Role/Station/Enterprise depending on target promotion scope.
- **Severity / misuse likelihood:** **CRITICAL / plausible**.
- **Proof obligation:** `AGWS-ADV-PROOF-004` — demonstrate that Person → Role/Station promotion never inherits authority from usage or source-person context and always requalifies at target scope.
- **Saturation status:** MATERIAL — local and cluster streak reset to 0.

### G2-EDGE-AGWS-005 — provider-backed action times out and the surface retries an `UNKNOWN` mutation

- **Scenario:** an AGWS action invokes an external provider. Transport times out after the provider may have applied the mutation. UI/runtime reports failure and allows or automatically performs retry.
- **Preconditions:** provider mutation lacks a qualified idempotency guarantee or receipt sufficient to determine effect.
- **Trigger:** timeout, disconnect, failover, provider substitution, or browser retry.
- **Affected subjects/revisions:** surface action invocation, canonical action contract, provider binding revision, external mutation/receipt.
- **Expected safe behavior:** classify the effect `UNKNOWN`; disable unsafe blind retry; reconcile provider/domain state first unless the operation-specific contract proves idempotency under the same canonical intent/idempotency key.
- **Forbidden behavior:** transport failure ⇒ `NOT_APPLIED`; provider failover ⇒ safe repeat; UI “Try again” issuing an unqualified second mutation.
- **Owners:** Integration & Automation owns external effect/reconciliation; Provider/Binding owns realization qualification; AGWS owns safe invocation presentation and must not reinterpret effect status.
- **Evidence/currentness:** canonical invocation identity, provider binding revision, idempotency qualification, receipt/query evidence and reconciliation timestamp.
- **Recovery/reconciliation:** query/reconcile original effect, then either adopt applied outcome or issue a new authorized mutation; provider substitution cannot erase original cohort/effect lineage.
- **Blast radius:** duplicate payment/order/change or repeated destructive mutation; scope depends on action.
- **Severity / misuse likelihood:** **CRITICAL / common distributed-failure class**.
- **Proof obligation:** `AGWS-ADV-PROOF-005` — prove AGWS-originated external mutations cannot blind-retry `UNKNOWN` effects and preserve canonical invocation identity across provider failure/substitution.
- **Saturation status:** MATERIAL — local and cross-capability safety obligation opened.

### G2-EDGE-AGWS-006 — pathological overlay/component graph exhausts resolution resources and induces unsafe fallback

- **Scenario:** valid-but-pathological surface composition creates huge layer depth, component fan-out, cyclic/recursive references, high-cardinality conditional visibility or provider action expansion. Resolver times out or exceeds resource budget.
- **Preconditions:** compositional limits are missing or only renderer-side.
- **Trigger:** adversarial/misconfigured low-code or AI-generated composition, bulk inherited overlays, or repeated promotions.
- **Affected subjects/revisions:** surface/layer revisions, component/layout graph, capability/action references, resolution evidence.
- **Expected safe behavior:** bounded deterministic evaluation; reject cycles and excessive complexity before admission or fail closed with explicit resource-exhaustion/`INCONCLUSIVE` outcome; never skip authorization/mandatory constraints to render a degraded surface.
- **Forbidden behavior:** partial resolver fallback that omits required components, drops policy checks, truncates action lists silently, or materializes a surface whose proof inputs were not fully evaluated.
- **Failure/effect disposition:** `DENIED` for invalid cyclic/limit-exceeding definitions when limits are contractual; otherwise `INCONCLUSIVE`/resource-exhausted with no broader authority.
- **Owners:** AGWS owns bounded effective-surface semantics; UI owns rendering resource behavior; Authorization remains mandatory for action invocation; AI cannot override limits.
- **Evidence/currentness:** complexity/budget decision tied to exact surface and component revisions; incomplete resolution is never equivalent to valid resolution.
- **Recovery/reconciliation:** reduce/rebase composition, preserve rejected revision lineage, rerun full qualified resolution.
- **Blast radius:** availability degradation up to Station/Enterprise if shared surface; unsafe fallback could additionally amplify authority.
- **Severity / misuse likelihood:** **HIGH / plausible**.
- **Proof obligation:** `AGWS-ADV-PROOF-006` — property/resource-bound tests for cycles, deep overlays, fan-out and high-cardinality conditions proving fail-closed behavior without dropping inherited constraints.
- **Saturation status:** MATERIAL — local streak reset to 0.

## 4. Paired cluster material scenarios

### G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-001 — stale identity relationship + cached surface + AI action suggestion

A Role/Station relationship changes, but a stale authorization/context representation and cached surface remain. AI recommends an action available under the previous context and the user invokes it.

- **Expected safe behavior:** invocation re-authorizes under current qualified Identity/Role/Station/Policy context and surface revision; stale AI context cannot act as authority.
- **Forbidden behavior:** AI recommendation, cached surface presence or stale token/tuple context bypassing current authorization.
- **Owners:** Identity + Authorization + AGWS; AI has no authority.
- **Evidence/currentness:** relationship/policy decision evidence current enough for the mutation; stale evidence yields `INCONCLUSIVE`/deny, not allow.
- **Recovery:** invalidate surface/AI context; reconcile any ambiguous attempted effect before retry.
- **Blast radius / severity:** cross-Station privilege escalation; **CRITICAL**.
- **Proof obligation:** `XAGWS-ADV-PROOF-001` — concurrent relationship-change tests covering stale caches/tokens/surface/AI context with mandatory fresh mutation authorization.
- **Saturation status:** MATERIAL — cluster streak = 0.

### G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-002 — Station transition races with proposal approval/promotion

A surface or personal-automation proposal is created under Station A, then the Person transitions to Station B or loses the originating Role while approval is pending. The proposal is later admitted using the original context.

- **Expected safe behavior:** admission revalidates actor, target scope, superior constraints, capability exposure and proposal applicability at commit/admission time; stale proposal context cannot transfer authority between Stations.
- **Forbidden behavior:** “approved once” or “proposal created while authorized” being treated as perpetual admission authority.
- **Owners:** AGWS owns proposal applicability; Authorization/Identity owns current authority; Governance owns approval obligation where applicable.
- **Evidence/currentness:** proposal base revisions plus current admission-time authority/Station evidence.
- **Recovery:** reject/rebase proposal; if realization already propagated, withdraw and reconcile all affected cohorts.
- **Blast radius / severity:** cross-Station unauthorized surface/action exposure; **CRITICAL**.
- **Proof obligation:** `XAGWS-ADV-PROOF-002` — race/model-check candidate for proposal create→approve→admit versus Role/Station change.
- **Saturation status:** MATERIAL — cluster streak = 0.

### G2-XEDGE-IDENTITY-AUTH-STATION-AGWS-AI-003 — inherited mandatory guardrail is rendered but AI routes around it

A mandatory approval/compliance component remains visible, satisfying superficial surface checks, but AI invokes a lower-level action/provider path that bypasses the guarded UI flow.

- **Expected safe behavior:** mandatory UI/work-surface constraints do not substitute for canonical workflow/authorization/governance enforcement; AI invocation must traverse the same owner-level control semantics as any other caller.
- **Forbidden behavior:** presence of a mandatory component being used as proof that all mutations went through it, or AI obtaining a direct action path unavailable through the governed control.
- **Owners:** AGWS owns presence/composition; Workflow/Governance/Authorization own enforced control semantics; AI cannot bypass them.
- **Evidence/currentness:** mutation evidence identifies the authoritative control/approval decision, not merely rendered component presence.
- **Recovery:** quarantine/reconcile bypassed mutations; correction/supersession and affected-scope review.
- **Blast radius / severity:** systematic control bypass; **CRITICAL**.
- **Proof obligation:** `XAGWS-ADV-PROOF-003` — prove control enforcement is owner-level and caller-independent across UI, AI, automation and provider invocation paths.
- **Saturation status:** MATERIAL — cluster streak = 0.

## 5. Saturation result for this visit

This is the **first real adversarial visit** for AGWS in Full Pass 1. Material findings were discovered, so AGWS earns no no-material revisit streak and the paired high-risk cluster earns no no-material streak.

- AGWS local no-material streak: **0**.
- Identity × Authorization × Station × AGWS × AI cluster no-material streak: **0**.
- Full Pass 1: **not complete**; only one of 28 local capabilities and one mandatory cluster were challenged in this increment.
- Planning C: remains blocked.

No scenario above proposes a target module. All findings are expressed as invariants, owners, evidence/currentness obligations, recovery semantics and proof obligations for later architecture work.
