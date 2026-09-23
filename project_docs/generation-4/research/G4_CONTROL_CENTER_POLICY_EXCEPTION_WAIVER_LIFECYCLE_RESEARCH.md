# G4 — Control Center Policy Exception / Waiver Lifecycle Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Web Desktop & Application Environment — Control Center / policy-constrained configuration / Application Manager / declarative deployment / external and co-managed applications

## Purpose

Continuation of `G4_CONTROL_CENTER_CONFIG_INHERITANCE_PROVENANCE_RESEARCH.md` for its highest-value open gap: how a policy exception/waiver can relax one named predicate for a bounded subject, operation and horizon without becoming a global bypass, configuration override, authority transfer or retroactive rewrite of already-realized effects.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or product changes.

## Repository inputs reconciled

- Constitutional boundaries remain `Builder != Runtime`, published runtime autonomy, compatibility before replacement, replaceable suite modules and explicit bounded-context contracts.
- Configuration inheritance/provenance research established `Policy != configuration`, `Scope nesting != configuration precedence`, live inheritance versus materialized copy, explicit provenance and target-specific affected-set proof.
- Cross-application change-set research established target-local authority, conservative blast-radius proof, revision-qualified plans and partial effectiveness.
- Application management handoff research established that management authority revision is orthogonal to effect identity and that predecessor effects survive authority transition.
- Recent :00 undo/redo/compensation research established `UNDO != REVERT != COMPENSATE`, canonical revert as a new admitted mutation, and historical/effect lineage surviving window/session lifecycle.
- Recent :10 verifier/privacy/findings research established that historical interpretation, current admissibility and requalification are distinct; verifier replacement does not rewrite historical evidence; findings may have an `ACCEPTED_EXCEPTION` lifecycle without erasing the finding or its basis.

## External evidence classes and portable lessons

### Azure Policy exemptions

Azure Policy models an exemption as a distinct resource tied to a policy assignment and a resource/resource-hierarchy scope. It can target selected policy definitions inside an initiative, classify the exemption as `Waiver` or `Mitigated`, carry an optional expiration, and remain present for record-keeping after expiration while no longer being honored. Resource selectors can further narrow rollout. Portable lesson: exception identity, target scope, predicate/policy reference, category and validity horizon are explicit and auditable; expiration can revoke future exception admissibility without deleting history.

### HashiCorp Sentinel / HCP Terraform

Sentinel separates policy logic from enforcement level. `soft-mandatory` permits an authorized override while `hard-mandatory` does not; HCP Terraform records overrides and a run-specific override does not automatically apply to future runs. Portable lesson: overrideability is a property of the policy/enforcement contract, not a generic administrator superpower, and an override should bind to a concrete evaluation/admission rather than silently weakening the policy globally.

### Kyverno temporary PolicyException patterns

Kyverno documents PolicyException as a first-class exception mechanism and publishes a pattern for time-bounded exceptions whose expiration removes the exception and returns the relevant rules to effect. Portable lesson: temporary exception lifecycle must not be confused with deletion of the underlying policy or permanent mutation of the governed resource.

These are pattern sources only. No provider or policy engine is selected by this research.

## Core finding — exception is a bounded authorization over a policy failure, not a configuration value

Candidate semantic object:

```text
PolicyException
  exceptionSemanticId
  policyRef
  predicateRefs[]
  subjectSelector / targetRefs[]
  operationScope[]
  environmentRef?
  clientRef
  exceptionKind = WAIVER | MITIGATED_BY_ALTERNATIVE_CONTROL | BREAK_GLASS
  justificationRef
  requestedBy
  approvedBy / authorityEvidenceRef
  issuedAt
  validFrom
  expiresAt?
  currentnessBasis
  inheritedScopePolicy
  effectOnAdmission
  compensatingControlRefs[]?
  revocationRef?
  status
```

Primary invariants:

```text
POLICY EXCEPTION != CONFIGURATION OVERRIDE
POLICY EXCEPTION != POLICY DELETION
POLICY EXCEPTION != OWNERSHIP TRANSFER
POLICY EXCEPTION != MANAGEMENT AUTHORITY
EXCEPTION AUTHORIZED != TARGET EFFECTIVE
EXCEPTION PRESENT != EXCEPTION CURRENTLY ADMISSIBLE
```

The exception answers a narrow question: may this named policy predicate be treated as non-blocking for this declared subject/operation/horizon under this authority? It does not decide the target setting value, install/deploy authority, secret access or provider mutation authority.

## Finding 2 — exception scope is multidimensional; hierarchy alone is insufficient

A safe exception scope may need to bind all material dimensions:

```text
ExceptionScope
  clientRef
  workspaceRef?
  environmentRef?
  applicationRefs / selectors?
  serviceRefs / selectors?
  policyRef
  predicateRefs[]
  operationKinds[]
  resource/effect kinds[]?
  managementAuthorityRevision?
  semantic/profile revision constraints?
```

Therefore:

```text
PARENT-SCOPE EXCEPTION != DESCENDANT EXCEPTION BY DEFAULT
SAME POLICY != SAME EXCEPTION SCOPE
SAME TARGET != SAME OPERATION EXCEPTION
SAME PREDICATE TEXT != SAME POLICY REVISION
```

Inheritance of an exception must be declared by the exception/policy contract and constrained by the policy assignment scope. Navigation nesting or configuration inheritance cannot manufacture waiver inheritance.

A broad Client-level waiver may be legitimate only when explicitly authorized as broad. A Service cannot infer that an Environment exception applies merely because it lives under that Environment.

## Finding 3 — waiver, mitigation and break-glass are not synonyms

Candidate distinctions:

- `WAIVER`: known non-compliance is temporarily accepted for a declared scope/horizon.
- `MITIGATED_BY_ALTERNATIVE_CONTROL`: the original predicate is not met literally, but a separately evidenced control is claimed to satisfy the protected intent.
- `BREAK_GLASS`: exceptional admission under emergency authority with stronger audit/review/recovery obligations.

```text
WAIVED != COMPLIANT
MITIGATED != PREDICATE PASSED
BREAK_GLASS != ORDINARY OVERRIDE
ALTERNATIVE CONTROL CLAIMED != ALTERNATIVE CONTROL EFFECTIVE
```

This avoids a green UI that hides known policy deviation.

## Finding 4 — exception issuance and use are separate events

An exception may exist without being exercised. Each material use should bind the policy evaluation and target operation to the exception evidence that made admission possible.

Candidate:

```text
ExceptionUse
  exceptionRef
  policyEvaluationRef
  targetRef
  operationIdentity
  authorityRevision
  policyRevision
  configurationRevision
  usedAt
  disposition
```

```text
EXCEPTION ISSUED != EXCEPTION USED
EXCEPTION USED ONCE != FUTURE USE AUTHORIZED
OVERRIDE REQUESTED != OVERRIDE REQUIRED
```

This mirrors mature run-scoped policy override behavior and preserves non-repudiation without turning an exception into a floating capability.

## Finding 5 — expiry changes future admissibility, not historical reality

Expiry needs at least three questions:

1. Is the exception admissible for a new operation now?
2. May an already-admitted operation continue?
3. Does an already-realized external state now require remediation/reconciliation?

These are independent.

```text
EXCEPTION EXPIRED != PRIOR EFFECT UNDONE
EXCEPTION EXPIRED != CONFIGURATION AUTO-REVERTED
EXCEPTION EXPIRED != HISTORICAL USE INVALIDATED
EXCEPTION EXPIRED != IN-FLIGHT EFFECT CANCELLED
```

Candidate dispositions after expiry:

```text
NO_NEW_ADMISSION
CONTINUATION_ALLOWED_UNTIL_BOUNDARY
REQUALIFICATION_REQUIRED
REMEDIATION_REQUIRED
MANUAL_REVIEW_REQUIRED
UNKNOWN_EFFECT_RECONCILIATION
```

The governing policy decides which applies. Expiry cannot manufacture rollback semantics.

## Finding 6 — exception currentness is revision-qualified

A waiver approved against policy revision P1 may not automatically apply to P2. A target or management-authority change can also invalidate its basis.

Candidate currentness basis:

```text
ExceptionCurrentness
  policyRevision
  predicateSemanticIds[]
  targetSelectorRevision
  authorityBasisRevision
  compensatingControlRevision?
  securityFloor/currentness?
  validFrom/expiresAt
  revocationState
```

```text
POLICY UPDATED != OLD EXCEPTION STILL APPLICABLE
SAME POLICY NAME != SAME WAIVED SEMANTICS
TARGET MEMBERSHIP CHANGED != SELECTOR PROOF CURRENT
MAPPING UNCHANGED != MAPPING PROOF CURRENT
```

If compatibility between P1 and P2 cannot be proven for the waived predicate, disposition becomes stale/requalification-required rather than inherited silently.

## Finding 7 — exception inheritance and configuration inheritance are independent graphs

A setting may inherit from Environment while its policy exception does not. Conversely, a policy exception may intentionally cover a resource hierarchy while configuration remains locally owned.

```text
CONFIG INHERITANCE != EXCEPTION INHERITANCE
POLICY SCOPE != CONFIG OWNER SCOPE
EXCEPTION SCOPE != SECRET SCOPE
```

Blast-radius analysis therefore tracks separate edges:

```text
ConfigContribution dependency
Policy applicability dependency
Exception applicability dependency
Authority dependency
Apply/effect dependency
```

A parent exception creation/expiry/revocation can affect descendants only through the exception applicability graph, never merely because their configuration is inherited.

## Finding 8 — expiry/revocation is a cross-application change-set input, not an implicit mutation

If one exception covers many targets, its expiry may make many targets non-compliant or block future operations. Control Center should compute a conservative affected set and expose required actions, but must not silently restart/redeploy/reconfigure all targets.

Candidate:

```text
ExceptionLifecycleChange
 -> affected policy evaluations
 -> affected target/operation set
 -> current desired/observed/effective state
 -> management authority qualification
 -> remediation/change-plan candidates
```

```text
EXCEPTION EXPIRED != GLOBAL RESTART
NONCOMPLIANT NOW != MUTATION AUTHORIZED
POLICY ENFORCEMENT != CONTROL CENTER OWNERSHIP
```

For externally managed/observe-only applications, the result may be finding/export/recommendation rather than mutation.

## Finding 9 — already-effective state and future admission can diverge legitimately

Example: an application was deployed under a valid temporary waiver. The waiver expires while the application is still running.

Possible policy contracts include:

- block only future deploy/update operations;
- require remediation by a deadline while allowing continued operation;
- require immediate quarantine/disable only where an explicit high-safety policy grants such authority;
- require human review because effect state/currentness is incomplete.

Therefore:

```text
CURRENTLY RUNNING != CURRENTLY ADMISSIBLE FOR NEW DEPLOY
POLICY NONCOMPLIANT != SERVICE INEFFECTIVE
SERVICE EFFECTIVE != POLICY COMPLIANT
```

This preserves `Desired != Observed != Effective` and prevents compliance state from being conflated with service health.

## Finding 10 — alternative-control mitigation requires independent evidence

A `MITIGATED_BY_ALTERNATIVE_CONTROL` exception must reference evidence for the alternative control and its currentness. The exception itself is not that evidence.

```text
MITIGATION DECLARED != MITIGATION EFFECTIVE
EXCEPTION SIGNED != COMPENSATING CONTROL VERIFIED
CONTROL EVIDENCE STALE != EXCEPTION STILL SAFE BY ASSUMPTION
```

If the compensating control becomes stale/unknown, the mitigation exception can become stale even before its wall-clock expiry.

## Finding 11 — external/co-managed systems preserve policy and management boundaries

For an external or co-managed application:

- SB may evaluate policy against declared/observed evidence without owning the setting;
- an SB policy exception does not grant provider credentials;
- provider-side exemptions/waivers are separate semantic objects unless a qualified adapter proves a declared mapping;
- an external manager may continue to mutate within its authority even while SB records non-compliance;
- SB cannot fabricate enforcement by changing only its local projection.

```text
SB EXCEPTION != PROVIDER EXCEPTION
ADAPTER NORMALIZATION != EXCEPTION EQUIVALENCE
POLICY EVALUATED != POLICY ENFORCED AT TARGET
CONNECT != OWN
```

## Finding 12 — secret and tenant boundaries survive exception handling

An exception may reference a `SecretRef` or secret-binding policy but never disclose the secret value. It cannot widen tenant scope, Client context or Vault authority merely to make a failing policy pass.

```text
POLICY EXCEPTION != SECRET DISCLOSURE AUTHORITY
POLICY EXCEPTION != TENANT DELEGATION
POLICY EXCEPTION != CLIENT CONTEXT SWITCH
SECRETREF != SECRET VALUE
```

A stale/restored Workspace session must requalify exception visibility/use under current Client/Workspace/Environment context.

## Finding 13 — findings and conformance preserve accepted deviation explicitly

A policy finding covered by a current waiver should not disappear. Candidate dispositions:

```text
PASS
FAIL_BLOCKING
FAIL_OVERRIDEABLE
EXEMPT_WAIVER_CURRENT
EXEMPT_MITIGATED_CURRENT
EXCEPTION_STALE
EXCEPTION_EXPIRED
EXCEPTION_REVOKED
MITIGATION_EVIDENCE_UNKNOWN
UNKNOWN
```

`ACCEPTED_EXCEPTION` is a lifecycle/projection state, not proof that the predicate passed. Aggregation must preserve minority-critical failures and expired exceptions.

## Finding 14 — exception lifecycle is audit lineage, not mutable annotation

Candidate lifecycle:

```text
DRAFT
 -> REQUESTED
 -> QUALIFYING
 -> APPROVED | REJECTED
APPROVED
 -> ACTIVE
 -> EXPIRED | REVOKED | SUPERSEDED | STALE_BASIS
```

Historical exception identity and uses remain attributable after expiry/revocation. Renewal is a successor decision, not silent date extension when material scope/policy/currentness changed.

```text
RENEWED != ORIGINAL NEVER EXPIRED
REVOKED != HISTORICAL USE ERASED
SUPERSEDED != PREDECESSOR REWRITTEN
```

## Cross-application semantic reconciliation

The Web Desktop surfaces one exception lineage without collapsing ownership:

- Builder Home/Client establishes tenant context and delegation boundary;
- Workspace/Desktop projects current context but cannot create exception authority;
- Application Manager shows management mode/authority separately from policy exception state;
- Control Center owns the unified governance projection/change planning, not application setting semantics;
- application-specific advanced settings remain authoritative specialized configuration surfaces where declared;
- declarative deployment consumes qualified policy/admission evidence but does not own policy;
- Vault binding remains reference/credential lifecycle, never exception authority;
- Desktop Observatory/Pinned Monitoring project compliance/currentness/effect state but do not mutate them;
- Window/View lifecycle never changes exception/effect lifecycle;
- external tools participate only through qualified contracts/adapters.

3D remains an optional future projection/application and gains no special authority.

## Required adversarials reconciled

1. **Tenant leak:** Client A exception cannot be visible/usable in Client B through restored workspace or global search.
2. **Stale client context:** recovered window showing an exception must requalify current Client/Workspace/Environment before use.
3. **Hidden secret exposure:** exception justification/diff never expands `SecretRef` to secret value.
4. **Discovered but unverified app:** discovery cannot use an exception to become verified/registered/managed.
5. **Externally managed silent upgrade:** policy exception cannot grant upgrade authority.
6. **Global setting restart:** exception expiry may create remediation findings but cannot silently restart applications.
7. **Shared infrastructure:** shared placement does not imply shared policy exception, data or authority.
8. **Provider artifact canonicalization:** provider exemption/manifest does not become canonical G4 policy truth.
9. **UI close stops runtime:** closing exception/control windows has no runtime/effect consequence.
10. **Adapter fabricated equivalence:** provider waiver and SB waiver remain distinct absent qualified semantic mapping.
11. **Placement identity:** migration does not change service identity or silently migrate exception authority.
12. **App-specific conflict:** Control Center cannot erase application-owned setting or provider-specific exception semantics.
13. **Automatic hidden binding:** automatic exception applicability/binding must expose rule, scope, authority, horizon and consequence.

## Proof obligations PO-85..PO-104

- **PO-85:** every exception binds an immutable policy/predicate identity or revision-qualified semantic reference.
- **PO-86:** exception scope declares Client and every material target/operation/environment dimension; navigation hierarchy cannot widen it implicitly.
- **PO-87:** exception authority is distinct from configuration ownership, management authority, deployment authority and secret access.
- **PO-88:** waiver, mitigation and break-glass dispositions remain distinct in storage, evaluation and UI.
- **PO-89:** exception issuance and exception use are separately attributable; use binds the concrete policy evaluation and operation identity.
- **PO-90:** expiry/revocation blocks or requalifies future admission according to policy without rewriting historical use or claiming prior effects were undone.
- **PO-91:** continuation of already-admitted/in-flight work after expiry is explicitly governed; no implicit cancel/rollback is inferred.
- **PO-92:** already-effective external state after expiry remains separately classified from current policy compliance.
- **PO-93:** exception inheritance requires a declared applicability law; configuration inheritance or resource nesting cannot manufacture it.
- **PO-94:** policy revision, predicate revision, target-selector revision and authority-basis changes requalify exception currentness where material.
- **PO-95:** mitigation exceptions require independently current evidence for compensating controls; the exception record cannot self-prove mitigation.
- **PO-96:** broad exception expiry/revocation uses conservative affected-set proof and does not itself authorize target mutation/restart/redeploy.
- **PO-97:** externally/co-managed targets preserve provider/SB exception identities and management authority independently.
- **PO-98:** adapters may map exception semantics only within a declared guarantee scope; unsupported differences degrade to conflict/UNKNOWN.
- **PO-99:** `SecretRef` remains redacted/reference-only throughout exception search, diff, audit and change planning.
- **PO-100:** restored Workspace/Desktop state never restores stale exception authority/currentness by implication.
- **PO-101:** compliance/findings UX preserves waived/mitigated/stale/expired/revoked/unknown distinctions rather than flattening them to green/red.
- **PO-102:** exception renewal/supersession creates explicit lineage and does not mutate historical policy/effect evidence.
- **PO-103:** exception applicability and effect evidence remain tenant-, environment-, policy-, authority- and currentness-scoped.
- **PO-104:** automatic exception matching remains inspectable: matched rule, scope, policy/predicate, authority, validity horizon and resulting admission consequence are explainable.

## Contradictions / trade-offs

### Broad inherited exemptions improve operations but enlarge failure radius

Azure-style hierarchy exemptions show that broad scope can be operationally useful. For G4, however, broad inheritance must be explicit and auditable because a single waiver can otherwise suppress controls across many applications. Default research posture: narrowest practical semantic scope, with broader scope requiring explicit authority and affected-set visibility.

### Run-scoped override is safer but can create repetitive approval burden

Sentinel/HCP Terraform demonstrates the value of per-run override attribution. Long-lived G4 exceptions may be justified for maintenance windows or known external constraints, but they require explicit validity/currentness and cannot silently become perpetual run-independent permission.

### Expiry automation improves hygiene but cannot safely imply remediation

Deleting/disabling an exception at expiry is straightforward; undoing the state admitted under it is not. G4 therefore separates exception lifecycle automation from configuration/deployment remediation.

### Provider-native exceptions improve enforcement locality but risk semantic split

A provider-native waiver may be necessary for target-side enforcement, but the SB exception and provider exception cannot be assumed identical. Qualified mapping, lineage and observation are required; otherwise the relation remains partial/UNKNOWN.

## Saturation by domain

- Exception identity/scope/provenance: `ADVANCED_EMERGING`.
- Waiver vs mitigation vs break-glass semantics: `ADVANCED_EMERGING`.
- Expiry/revocation/history separation: `ADVANCED_EMERGING`.
- Exception inheritance and config-inheritance separation: `MATERIAL / NOT_SATURATED`.
- Cross-application expiry affected-set planning: `MATERIAL / NOT_SATURATED`.
- External/provider exception mapping: `EARLY_MATERIAL`.
- Alternative-control evidence lifecycle: `MATERIAL / NOT_SATURATED`.
- Exception UX/findings aggregation: `MATERIAL / NOT_SATURATED`.

Overall: `ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

## Open gaps

Highest-value next gap: **policy exception renewal/revocation under in-flight cross-application change sets**. Research should determine what happens when a waiver expires or is revoked after a multi-target plan is admitted but only partially effective: which targets may continue, which must stop before admission/effect boundaries, how predecessor exception/effect lineage survives retry, and how a successor waiver can authorize future work without laundering already-ambiguous operations into a new policy basis.

Secondary gaps:

- proof of semantic equivalence between SB and provider-native exception models;
- delegated exception authority and four-eyes/dual-control requirements for high-risk scopes;
- cardinality/performance of exception applicability over large target sets;
- privacy/retention rules for exception justifications and supporting evidence;
- policy exception interaction with offline/degraded operation and security floors.

## Source classes consulted

- Microsoft Azure Policy official documentation: policy exemption structure, scope, expiration, waiver/mitigated categories and resource selectors.
- HashiCorp Sentinel/HCP Terraform official documentation: advisory/soft-mandatory/hard-mandatory enforcement, override authority and run-scoped policy override behavior.
- Kyverno official policy documentation: PolicyException and temporary-expiration patterns.
- Existing G4 repository research cited above.

No external product is adopted by this research.