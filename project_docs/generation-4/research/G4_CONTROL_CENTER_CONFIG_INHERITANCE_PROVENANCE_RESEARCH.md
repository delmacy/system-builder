# G4 — Control Center Configuration Inheritance & Provenance Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Web Desktop & Application Environment — Control Center / Application Manager / declarative deployment / environment bindings / external and co-managed applications

## Purpose

Continuation of `G4_CONTROL_CENTER_CROSS_APPLICATION_CHANGESET_RESEARCH.md` for its highest-value open gap: how Client, Workspace, Environment, Application and Service scopes contribute defaults, constraints and owned settings without turning Control Center into a canonical global settings store or silently stealing application ownership.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or product changes.

## Repository inputs reconciled

- Constitutional boundaries remain `Builder != Runtime`, published runtime autonomy, compatibility before replacement, replaceable suite modules and explicit bounded-context contracts.
- Cross-application change-set research established that Control Center coordinates but does not own target semantics; affected-set exclusion requires proof; plan/currentness and target-local authority remain independent.
- Recent :00 command-input/dialog research established that defaults and derived values require provenance, recovered/remembered values are not current by implication, and confirmation binds a frozen intent snapshot.
- Recent :10 effect-verification/conformance research established claim-specific evidence authority, explicit contradiction states, revision-pinned observation mappings and the rule that observation/conformance does not become mutation authority.

## External evidence and portable lessons

### Terraform/HCP Terraform variable precedence

Terraform documents an explicit precedence order among CLI/HCP values, auto tfvars, tfvars, environment variables and declared defaults. HCP Terraform additionally supports scoped variable sets and priority sets; notably, a priority global set may outrank a more specific scope. Portable lesson: precedence is a declared policy, not safely inferable from geometric scope specificity or last-write time. A value source also does not guarantee that target configuration actually consumes that variable.

### Kubernetes Server-Side Apply field management

Kubernetes field management tracks managers and conflicts at field granularity. Portable lesson: two configuration surfaces can address one object without sharing unrestricted write ownership; conflicts should remain explicit instead of being hidden by last-writer-wins normalization.

### AWS AppConfig

AWS AppConfig separates applications, environments, configuration profiles, validators and deployment strategies. Deployment is a distinct operation with monitoring/rollback behavior. Portable lesson: configuration identity, target environment, validation and rollout/effect are separate dimensions; stored/configured data is not automatically effective consumer state.

These are pattern sources only; no provider adoption is implied.

## Core finding — scope contribution is not a universal inheritance chain

The convenient hierarchy:

`Client -> Workspace -> Environment -> Application -> Service`

is useful for navigation and candidate configuration scope, but must not become a universal semantic inheritance law.

Different setting contracts may use different applicable scopes and precedence laws. Workspace may be presentation-only for one setting, Environment authoritative for another, Application owner for another, and policy may deliberately outrank a more specific configuration.

```text
SCOPE NESTING != CONFIG PRECEDENCE
MORE SPECIFIC != ALWAYS STRONGER
PARENT VALUE PRESENT != CHILD VALUE INHERITED
CONTROL CENTER PATH != SEMANTIC OWNER
```

Candidate:

```text
SettingContract
  settingSemanticId
  ownerDomain
  valueType/schema
  applicableScopes[]
  contributionKinds[]
  resolutionLaw
  conflictLaw
  unsetSemantics
  policyConstraintRefs[]
  secretDisposition?
  apply/effectContractRef
  externalAdapterContractRef?
```

## Configuration contributions need identity and provenance

Candidate:

```text
ConfigContribution
  contributionId
  settingSemanticId
  scopeRef
  sourceOwnerRef
  contributionKind
    DEFAULT
    EXPLICIT_VALUE
    EXPLICIT_UNSET
    INHERIT_DIRECTIVE
    POLICY_CONSTRAINT
    EXTERNAL_OBSERVED_VALUE
    PROVIDER_DERIVED
    COMPUTED_SUGGESTION
  valueOrSecretRef?
  sourceRevision
  authorityEvidenceRef?
  validFrom/currentness?
  provenanceRefs[]
```

A resolved value is a projection over contributions under a declared resolution law.

```text
ResolvedSetting
  settingSemanticId
  targetRef
  resolutionLawRef
  contributingRefs[]
  winning/combinedContributionRefs[]
  shadowedRefs[]
  conflicts[]
  effectiveValueOrSecretRef
  resolutionEvidence
  basisCurrentness
```

`RESOLVED VALUE != SOURCE VALUE` and `PROVENANCE != COMMENTARY`.

## Inherit, absent, unset and override are distinct

A portable model must not collapse the following:

- `ABSENT`: this scope contributes nothing;
- `INHERIT`: explicitly defer according to the declared resolution law;
- `EXPLICIT_VALUE`: this scope contributes a value;
- `EXPLICIT_UNSET`: intentionally remove/disable where the setting contract defines a meaningful unset;
- `RESET_TO_DEFAULT`: discard a local contribution and resolve from the contract/default basis;
- `UNKNOWN`: source/adapter/currentness is insufficient to know the contribution.

```text
ABSENT != INHERIT
UNSET != NULL != EMPTY != DEFAULT
RESET != WRITE PARENT VALUE INTO CHILD
INHERIT != MATERIALIZED COPY
UNKNOWN != ABSENT
```

This distinction prevents a parent change from being missed because a child merely contains an old copied value that visually resembles inheritance.

## Inheritance is live dependency; materialization is a snapshot

A child that inherits from a parent remains dependency-linked to the parent contribution. A child that materializes/copies the current parent value owns a new contribution snapshot unless its contract explicitly preserves live linkage.

```text
INHERITED VALUE -> parent change may affect child
MATERIALIZED COPY -> parent change does not automatically mutate child
SAME BYTES != SAME PROVENANCE
```

Therefore blast-radius analysis follows provenance/dependency edges, not value equality.

## Policy constrains configuration without becoming configuration

A policy contribution may define allowed ranges, required predicates, forbidden states, minimum floors or exception requirements. It need not provide the setting value.

```text
POLICY != CONFIGURATION
POLICY PRECEDENCE != CONFIG VALUE PRECEDENCE
POLICY COMPLIANT != CONFIG EFFECTIVE
POLICY EXCEPTION != CONFIG OVERRIDE
```

Candidate resolution separates:

```text
1. resolve configuration contributions
2. evaluate policy constraints over resolved candidate
3. qualify authority/currentness
4. plan application/effects
5. observe/verify effective state
```

A priority policy may intentionally constrain a more specific application setting without becoming that application's semantic owner.

## Ownership and precedence are independent dimensions

A source can have precedence without owning the target field semantically; conversely, an application can own a setting while a policy constrains its admissible values.

For co-managed/external systems, candidate field dispositions remain explicit:

```text
SB_OWNED
EXTERNAL_OWNED
SHARED_WITH_MERGE_LAW
OBSERVED_ONLY
POLICY_CONSTRAINED
PROVIDER_DERIVED
UNKNOWN_OWNER
```

```text
HIGHER PRECEDENCE != OWNERSHIP TRANSFER
CAN RENDER != CAN WRITE
CAN WRITE != CAN OVERRIDE POLICY
CO_MANAGED != LAST WRITER WINS
```

Control Center may render and edit through an application/provider adapter only within declared authority.

## Conflict is first-class

Candidate conflict classes:

```text
VALUE_CONFLICT
OWNERSHIP_CONFLICT
POLICY_VIOLATION
AMBIGUOUS_PRECEDENCE
TYPE/SCHEMA_CONFLICT
EXTERNAL_DRIFT
STALE_BASIS
UNRESOLVED_SECRET_BINDING
ADAPTER_SEMANTIC_MISMATCH
```

A conflict cannot be normalized away merely to produce one display value.

```text
TWO SOURCES PRESENT != ONE MUST SILENTLY WIN
LAST WRITE != SEMANTIC RESOLUTION
ADAPTER NORMALIZATION != FABRICATED EQUIVALENCE
```

For ambiguous or unsupported provider semantics, disposition remains conflict/unknown and application-specific advanced settings remain available as the authoritative specialized surface where declared.

## Parent-scope changes require provenance-aware affected-set proof

A Client/Environment change affects a target only when a material dependency path exists under the target setting contract.

Candidate proof path:

```text
ParentContributionRevision
 -> SettingContract
 -> ResolutionLaw
 -> TargetContributionSet
 -> ResolvedCandidateDelta
 -> PolicyQualification
 -> ApplyConsequence
```

Targets with explicit local overrides may be `PROVEN_NON_MATERIAL` for value effect while still material for policy, provenance, restart or compliance evidence. Targets with incomplete external configuration visibility remain `UNKNOWN`.

```text
PARENT CHANGED != EVERY DESCENDANT CHANGED
LOCAL OVERRIDE PRESENT != TARGET UNAFFECTED FOR EVERY CLAIM
VALUE UNCHANGED != PROVENANCE/POLICY UNCHANGED
NOT VISIBLE THROUGH ADAPTER != NOT AFFECTED
```

This refines the cross-application blast-radius model without creating a global dependency transaction.

## Desired, configured, applied, observed and effective remain separate

For every resolved setting:

```text
Contribution/Desired Resolution
 -> Qualified Candidate
 -> Applied/Submitted
 -> Provider/Application ACK
 -> Observed Consumer State
 -> Effective For Declared Contract
```

A parent contribution may resolve correctly while an external application ignores, delays or transforms it.

```text
CONFIGURED != APPLIED != EFFECTIVE
DESIRED != OBSERVED != EFFECTIVE
ADAPTER ACK != CONSUMER EFFECT
```

AWS AppConfig's separation of configuration profile, environment and deployment reinforces this distinction; provider deployment status remains evidence, not universal business-effect authority.

## Secret references participate in resolution without exposing values

A contribution may contain `SecretRef`, never a secret value in Control Center provenance/diff artifacts. Resolution may select which secret reference/binding applies while preserving sensitivity boundaries.

```text
SECRETREF != SECRET VALUE
SECRET SOURCE SELECTED != SECRET DELIVERED
SECRET DELIVERED != CONSUMER USING IT
AUTOMATIC BINDING != HIDDEN DEPENDENCY
```

A child override from one `SecretRef` to another is visible as dependency/provenance change without disclosing either value.

## UI projection requirements

Control Center global search/diff should be able to answer:

- where a resolved value came from;
- which contributions were shadowed;
- whether the value is inherited, explicit, unset, materialized or unknown;
- which policy constraints apply;
- who owns/may mutate the setting;
- whether application-specific advanced settings exist;
- what restart/reload/redeploy/rotation consequence is expected;
- whether observed/effective state matches the current resolution basis.

Application-specific settings and Control Center are complementary projections over shared references/adapter contracts, not competing canonical stores.

```text
UNIFIED UI != ONE SEMANTIC OWNER/STORE
APP-SPECIFIC SURFACE != BYPASS BY DEFAULT
CONTROL CENTER EDIT != OWNERSHIP TRANSFER
```

## Mandatory adversarial reconciliation

1. Tenant leak: contribution, resolution and evidence identities are Client/environment scoped; no cross-client inheritance.
2. Stale client context: restored UI cannot reuse resolution/authority evidence after Client/Workspace/Environment context changes.
3. Hidden secret exposure: provenance/diff carries `SecretRef` and redacted metadata only.
4. App discovered but unverified: discovery can add a candidate target but cannot contribute authoritative config or mutation rights.
5. Externally managed app silently upgraded: config resolution cannot imply upgrade authority.
6. Global setting triggers unexpected restart: restart/reload/redeploy consequence is part of target planning before admission where knowable.
7. Shared infrastructure mistaken for shared data/authority: placement co-residency creates no inheritance edge.
8. Provider artifact becomes canonical truth: raw manifest/provider config is compiled/observed projection, not canonical setting intent.
9. UI close stops runtime: window/session lifecycle never alters service/config effect lifecycle.
10. Adapter fabricates semantic equivalence: unsupported unset/default/merge semantics remain explicit mismatch/unknown.
11. Placement migration changes semantic identity: placement revision can change resolution inputs but not Service identity.
12. App-specific settings conflict with Control Center: ownership/provenance/conflict law decides; UI location does not.
13. Automatic binding hides critical dependency: source, selection rule, target, authority and consequence remain inspectable.
14. Child stores a copied parent value: it must not be presented as live inheritance without lineage proof.
15. Parent value changes but child override yields same bytes: non-impact for value does not imply non-impact for policy/provenance/currentness.
16. External adapter cannot distinguish unset from default: it must degrade to unsupported/unknown rather than invent equivalence.

## Proof obligations

PO-69. Every resolved setting identifies its `SettingContract`, resolution law, contributing provenance and basis currentness.

PO-70. Scope nesting cannot by itself determine precedence; precedence/resolution is declared per setting contract or qualified profile.

PO-71. `ABSENT`, `INHERIT`, `EXPLICIT_UNSET`, `RESET_TO_DEFAULT`, explicit value and `UNKNOWN` remain distinguishable where material.

PO-72. Inheritance preserves a live dependency edge; materialization/copy cannot masquerade as inheritance.

PO-73. Parent-scope affected-set exclusion requires qualified non-impact evidence under the relevant setting/policy/effect claim.

PO-74. Policy constraints cannot silently become owned configuration values or mutation authority.

PO-75. Precedence does not transfer semantic ownership; ownership/authority remains separately evidenced.

PO-76. Co-managed conflicts are resolved only by declared field ownership/merge law; last-writer-wins is not assumed.

PO-77. External/adapter inability to represent unset/default/inheritance semantics remains visible as mismatch/unknown.

PO-78. Secret provenance uses references/redacted evidence; resolution never requires Control Center artifacts to disclose secret values.

PO-79. A resolved desired value cannot be reported effective solely from configuration storage or provider ACK.

PO-80. Application-specific advanced settings retain declared ownership/provenance when projected or edited through Control Center.

PO-81. Placement/shared infrastructure cannot manufacture configuration inheritance, shared data or shared authority.

PO-82. Restored Workspace/Desktop state requalifies configuration basis, authority and currentness before mutation.

PO-83. Same resulting bytes from different provenance cannot be treated as equivalent for every policy/currentness/blast-radius claim.

PO-84. Automatic binding exposes dependency identity, selection rule, authority and operational consequence even when no manual step is required.

## Contradictions / trade-offs

### Simple "most-specific wins" UX vs real governance

A fixed most-specific-wins rule is easy to explain but fails for mandatory organizational policy, priority variable sets and external ownership. Resolution: simple defaults may exist as a profile, but the setting contract exposes the actual law and conflicts.

### Live inheritance vs reproducibility

Live inheritance makes parent changes convenient but can cause broad implicit change. Materialization improves reproducibility but stops automatic propagation. Resolution: both are explicit dispositions with provenance; neither is silently inferred from equal values.

### Unified editing vs bounded ownership

One Control Center is convenient, but direct ownership centralization violates replaceability and external/co-managed systems. Resolution: federated adapters/projections plus explicit authority/ownership and application-specific advanced surfaces.

### Complete provenance vs external opacity

External tools may not expose their full precedence/default model. Resolution: represent partial provenance and `UNKNOWN`; do not normalize opacity into false equivalence.

### Policy enforcement vs configuration autonomy

Strong policy may intentionally constrain application choices. Resolution: policy can reject/qualify candidates without pretending to own the application setting itself; exception/waiver remains a separate governed object.

## Maturity / saturation

`CONTROL_CENTER_CONFIG_INHERITANCE_PROVENANCE = ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

Materially mature principles:

- scope hierarchy and precedence are distinct;
- inheritance, materialization, absence, unset, reset and unknown are distinct;
- provenance is part of resolution evidence, not UI commentary;
- policy constraints and configuration values remain separate;
- ownership and precedence are independent;
- co-managed conflict needs explicit ownership/merge law;
- parent-scope blast radius follows typed provenance/dependency edges;
- application-specific and Control Center surfaces are complementary projections;
- secret values remain outside configuration provenance artifacts;
- configured/applied/effective remain distinct.

Not saturated:

1. portable merge algebra for structured/map/list settings across heterogeneous applications;
2. policy exception/waiver lifecycle and inheritance without creating a global bypass;
3. provenance compaction/history retention for long-lived configuration trees;
4. external tools whose defaults are dynamic/provider-version-dependent;
5. cross-environment promotion when inherited parents differ;
6. configuration cycles/derived-value dependency loops;
7. currentness/requalification when parent, policy and external observed state change concurrently.

## Next highest-value gap

**Policy exception/waiver scope, inheritance and expiry across cross-application configuration**: formalize how a bounded exception can relax one policy predicate for a named target/scope/horizon without becoming a generic override, how descendant inheritance is proven or prohibited, how expiry/currentness affects already-applied configuration, and how external/co-managed applications expose compliance/effect evidence without transferring policy or configuration ownership.
