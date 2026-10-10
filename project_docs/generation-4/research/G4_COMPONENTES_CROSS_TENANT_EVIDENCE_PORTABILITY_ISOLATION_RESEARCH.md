# G4 Componentes — Cross-Client Evidence Portability, Tenant Isolation & Delegated Access Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## 1. Research question

When may conformance evidence for the same component/application artifact be reused across System Builder Clients and Workspaces without collapsing tenant isolation, trust domains, confidentiality, authority or currentness?

This extends the imported-evidence/trust-gating and evidence-provenance research. It is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or changes to G2/G3.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not the navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`.
- `Client != Workspace != Desktop != Application != Window`.
- `Cross-client visibility != cross-client authority`.
- `Delegated access != trust-domain collapse`.
- `Same artifact != same tenant context`.
- `Same digest != same composition`.
- `Evidence reuse != evidence disclosure`.
- `Evidence portability != fixture portability`.
- `Shared catalog != shared tenant data plane`.
- `STALE != CURRENT`; `UNKNOWN != SUCCESS`.
- `Research candidate != implementation authority`.

## 3. External interaction grammars reviewed

External systems are evidence for interaction/security grammar, not provider commitments.

### 3.1 AWS SaaS tenant isolation

AWS SaaS architecture guidance distinguishes authentication/authorization from tenant isolation: a user may be authenticated and functionally authorized while isolation still requires tenant context to constrain which tenant resources are reachable. Pooled, bridge and silo patterns trade operational cost against isolation strength. This supports making tenant scope an explicit evidence-access and reuse dimension rather than assuming ordinary RBAC is sufficient.

### 3.2 OWASP multi-tenant security

OWASP recommends classifying shared values as global, tenant-scoped or user-scoped, including tenant identity in cache keys whenever results vary by tenant, explicitly documenting intentionally shared global entries, authorizing before protected cache reads, and carrying verified tenant context through asynchronous work. This is directly applicable to evidence caches, indexes, search and background requalification.

### 3.3 Azure multitenancy/isolation

Azure architecture guidance treats isolation as a spectrum: some components may be pooled while others are dedicated, depending on security, compliance and performance requirements. This supports evidence-layer classification rather than one universal storage topology.

### 3.4 NIST zero-trust direction

NIST zero-trust work rejects implicit trust based only on location, affiliation or ownership and emphasizes identity- and policy-based authorization. For SB this supports requalifying delegated operator identity, Client membership, Workspace context and evidence-access policy rather than trusting a Builder/Fleet location or previously opened surface.

Extracted grammar:

`verified actor -> explicit client context -> workspace context -> evidence classification -> disclosure policy -> trust qualification -> semantic applicability -> currentness -> local claim/gate consumption`

Not extracted: AWS, Azure, Kubernetes, a database partitioning model, RLS implementation, identity provider or storage provider choice.

## 4. Primary finding — evidence has portability classes

Evidence should not be treated as simply `global` or `tenant-local`.

Candidate classification:

```text
GLOBAL_ARTIFACT_EVIDENCE
  proves properties of an immutable artifact independent of tenant data/configuration

PROFILE_PORTABLE_EVIDENCE
  portable only when a declared execution/normative/browser-AT/profile equivalence holds

CONFIGURATION_BOUND_EVIDENCE
  depends on settings, feature flags, policy, bindings or deployment shape

COMPOSITION_BOUND_EVIDENCE
  depends on parent/child composition or shell/workspace interaction

TENANT_CONTEXT_BOUND_EVIDENCE
  depends on Client-specific roles, data, policies, integrations, secrets or organizational context

WORKSPACE_CONTEXT_BOUND_EVIDENCE
  depends on system/revision/environment/organizational scope captured by a Workspace

CONFIDENTIAL_TENANT_EVIDENCE
  contains tenant-identifying or sensitive fixture/result material and is not cross-tenant disclosable

NON_PORTABLE_EVIDENCE
  portability cannot be safely established
```

Invariants:

```text
SAME_ARTIFACT_DIGEST != SAME_EVIDENCE_SCOPE
PORTABLE_CLAIM != PORTABLE_RAW_ARTIFACT
PORTABLE_PROVENANCE != PORTABLE_FIXTURE
GLOBAL_IMPLEMENTATION != GLOBAL_CONFIGURATION
GLOBAL_COMPONENT_PASS != TENANT_COMPOSITION_PASS
```

## 5. Evidence portability is a qualified relation

Portability is not a property of the source tenant and not an ACL shortcut. It is a claim between an evidence record and a destination context.

Candidate model:

```text
EvidencePortabilityQualification
  sourceEvidenceId
  sourceClassification
  destinationClientId
  destinationWorkspaceId?
  destinationTrustDomainId
  proofClass
  subjectIdentity
  subjectDigest
  requiredProfileRefs[]
  configurationEquivalenceRefs[]
  compositionEquivalenceRefs[]
  confidentialityDisposition
  disclosureDisposition
  currentnessDisposition
  trustDisposition
  portabilityDisposition
  rationaleRefs[]
```

Candidate dispositions:

```text
PORTABLE_AS_IS
PORTABLE_CLAIM_ONLY
PORTABLE_WITH_REDACTION
PORTABLE_WITH_LOCAL_CORROBORATION
PORTABLE_IF_PROFILE_EQUIVALENT
DESTINATION_REQUALIFICATION_REQUIRED
NOT_PORTABLE_CONFIDENTIAL
NOT_PORTABLE_CONTEXT_BOUND
UNKNOWN
```

`UNKNOWN` must not be converted into reuse for convenience.

## 6. Claim reuse and disclosure are separate decisions

A destination Client may be allowed to consume the fact that a globally immutable component passed a structural proof without being allowed to inspect another Client's fixture, screenshot, DOM snapshot, trace or operator identity.

Therefore:

```text
CAN_CONSUME_CLAIM != CAN_VIEW_RAW_EVIDENCE
CAN_VERIFY_DIGEST != CAN_VIEW_FIXTURE
CAN_VIEW_PROVENANCE != CAN_VIEW_TENANT_IDENTITY
CAN_REUSE_RESULT != CAN_EXPORT_ARTIFACT
```

Candidate disclosure layers:

```text
PUBLIC_OR_PRODUCT_GLOBAL
SHARED_SANITIZED
DESTINATION_VISIBLE_CLAIM_ONLY
SOURCE_TENANT_ONLY
RESTRICTED_SUPPORT
SECRET_OR_NON_DISCLOSABLE
```

The active catalog may expose a sanitized global claim ledger while raw artifacts remain tenant-scoped.

## 7. Tenant-local evidence boundary

The following are tenant-local by default unless explicit evidence proves otherwise:

- customer data or realistic tenant-derived fixtures;
- screenshots/recordings containing tenant names, records, topology, users or identifiers;
- DOM/accessibility snapshots containing tenant content;
- network traces, endpoints, hostnames, internal addresses or deployment topology;
- logs containing tenant IDs, user IDs, request IDs or business data;
- secret values, credentials and secret-derived outputs;
- tenant policy/role assignments and delegated-access membership;
- tenant-specific performance results when workload/data shape is material;
- integration results involving tenant-owned external systems;
- Workspace-specific revision/environment/currentness observations.

A digest of confidential evidence can itself be sensitive when it enables membership inference or cross-tenant correlation. `HASHED != NON_SENSITIVE`.

## 8. Shared catalog without a cross-tenant side channel

A shared Componentes catalog may know that a component artifact has qualified global evidence, but search/index/counts must not reveal confidential tenant activity.

Potential side channels include:

- autocomplete revealing a customer-specific component or integration name;
- global counts revealing how many Clients use a feature;
- timing differences indicating whether another tenant has cached evidence;
- error messages revealing existence of inaccessible evidence;
- evidence IDs/digests enabling correlation across tenants;
- requalification queue/status revealing another tenant's activity;
- cross-tenant recommendation/ranking derived from confidential usage;
- raw screenshot thumbnails or trace metadata leaking context.

Hard rules:

```text
NOT_AUTHORIZED != CONFIRM_RESOURCE_EXISTS
SHARED_INDEX != SHARED_VISIBILITY
CACHE_HIT_TIMING != TENANT_DISCLOSURE_PERMISSION
GLOBAL_COUNT != SAFE_TO_DISCLOSE
REDACTED_LABEL != REDACTED_METADATA
```

The UI should prefer non-enumerating responses where existence itself is protected.

## 9. Delegated client access — visibility is not portability or trust

A Builder operator or external collaborator may be delegated access to Client A. That delegation grants only the named Client/Workspace actions and does not make evidence from Client B available, trusted or portable.

Candidate delegated session context:

```text
DelegatedClientSession
  actorIdentity
  delegationId
  clientId
  workspaceScope?
  allowedActions[]
  evidenceVisibilityClasses[]
  supportElevationState?
  validFrom
  expiresAt
  revocation/currentness refs
```

Invariants:

```text
DELEGATED_TO_CLIENT_A != MEMBER_OF_CLIENT_A
DELEGATED_TO_A != VISIBLE_IN_B
CAN_VIEW_EVIDENCE != CAN_REUSE_EVIDENCE
CAN_REUSE_EVIDENCE != CAN_PROMOTE_RELEASE
BUILDER_FLEET_ROLE != CLIENT_MUTATION_AUTHORITY
SUPPORT_ELEVATION != TRUST_QUALIFICATION
```

Client/workspace switching must re-evaluate evidence visibility and clear tenant-sensitive projections/caches from the previous context.

## 10. Workspace semantics and evidence

Workspace preserves system/revision/environment/organizational context. Evidence bound to any of these dimensions is not automatically portable to another Workspace even inside the same Client.

Examples:

- structural component proof may be Client- and Workspace-independent;
- a form's keyboard interaction proof may be portable across Workspaces if artifact/profile dependencies match;
- a workflow integration proof may bind to environment endpoints and therefore be Workspace/environment-specific;
- a performance proof may depend on data volume and deployment profile;
- permission/read-only behavior depends on current authority policy and cannot be imported solely from another Workspace.

```text
SAME_CLIENT != SAME_WORKSPACE_EVIDENCE_CONTEXT
SAME_SYSTEM != SAME_REVISION
SAME_REVISION != SAME_ENVIRONMENT
SAME_ENVIRONMENT_NAME != SAME_ENVIRONMENT_PROFILE
```

## 11. Portability pipeline

Candidate documentary lifecycle:

```text
SOURCE_EVIDENCE_CURRENT
→ CLASSIFY_PORTABILITY
→ CLASSIFY_CONFIDENTIALITY
→ RESOLVE_DESTINATION_CONTEXT
→ VERIFY_SUBJECT/DIGEST
→ QUALIFY_PROFILE/CONFIG/COMPOSITION EQUIVALENCE
→ QUALIFY_DESTINATION_TRUST
→ AUTHORIZE_DISCLOSURE
→ PRODUCE SANITIZED CLAIM VIEW OR LOCAL REFERENCE
→ DESTINATION CONSUMPTION
→ CONTINUOUS INVALIDATION / REVOCATION
```

Portability should preferably reference immutable evidence rather than physically copying it. If materialization/copy is necessary, the destination copy retains source lineage and independent disclosure/retention policy.

`COPIED != REQUALIFIED`.

## 12. Invalidation across Clients

Global artifact evidence can fan out to many Clients. A source evidence revocation or normative-profile change may affect all consumers, but tenant-local policy changes must not trigger unrelated cross-tenant invalidation.

Candidate rules:

```text
GLOBAL_EVIDENCE_INVALIDATED -> all material consumers re-evaluate
TENANT_A_POLICY_CHANGED -/-> TENANT_B_EVIDENCE_INVALIDATED
SOURCE_TENANT_ACCESS_REVOKED != GLOBAL_CLAIM_AUTOMATICALLY_FALSE
RAW_ARTIFACT_DELETED != PORTABLE_CLAIM_CURRENT
```

If a portable claim was derived from confidential source evidence, deletion/retention changes may degrade reproducibility without necessarily changing semantic currentness. The destination must expose that distinction.

## 13. Cross-tenant caches and asynchronous work

Every evidence cache/index/job must declare scope:

```text
GLOBAL_SAFE
TRUST_DOMAIN_SCOPED
CLIENT_SCOPED
WORKSPACE_SCOPED
USER_SESSION_SCOPED
```

Keys include every material context dimension. A global cache is admissible only when the result is demonstrably tenant-independent.

```text
CACHEABLE != GLOBALLY_CACHEABLE
SAME_QUERY != SAME_TENANT_RESULT
TENANT_KEY_PRESENT != AUTHORIZATION_PROVEN
BACKGROUND_JOB != CONTEXT_FREE
```

Asynchronous requalification carries verified Client/Workspace context and re-establishes authorization/currentness at consumption time.

## 14. Componentization impact

### primitive / atomic

- `EvidencePortabilityIndicator`
- `TenantScopeIndicator`
- `DisclosureDispositionIndicator`
- `ConfidentialityIndicator`
- `DelegationCurrentnessIndicator`
- `CrossTenantReuseIndicator`

### compound

- `PortableEvidenceSummary`
- `DestinationQualificationSummary`
- `EvidenceDisclosureSummary`
- `DelegatedEvidenceAccessSummary`
- `CrossTenantImpactSummary`

### module component

- `EvidencePortabilityPanel`
- `TenantEvidenceBoundaryPanel`
- `EvidenceRedactionPanel`
- `DelegatedEvidenceAccessPanel`

### tool

- `EvidencePortabilityInspector`
- `CrossTenantReuseQualifier`
- `EvidenceDisclosureInspector`
- `TenantLeakageInspector`
- `DelegatedAccessEvidenceInspector`
- `CrossTenantInvalidationExplorer`

### application -> window -> desktop -> workspace -> system view

Higher levels consume the same evidence lineage but must preserve Client/Workspace scope in every projection. A fleet/system view may aggregate global-safe claims and authorized tenant summaries; it must not silently widen raw evidence visibility.

Shared behavior: subject/digest binding, provenance, proof-class semantics, keyboard inspection, currentness, typed invalidation.

Specialized behavior: tenant policy, confidentiality, delegated access, environment binding, regulatory residency, customer-specific fixtures and external integration ownership.

## 15. State/lifecycle findings

Portability qualification lifecycle:

```text
UNASSESSED
→ CLASSIFYING
→ DESTINATION_QUALIFYING
→ PORTABLE_AS_IS
  | PORTABLE_CLAIM_ONLY
  | PORTABLE_WITH_REDACTION
  | LOCAL_CORROBORATION_REQUIRED
  | NOT_PORTABLE
  | UNKNOWN
→ CONSUMED
→ STALE | REVOKED | SUPERSEDED
```

Delegation lifecycle remains independent:

```text
DELEGATION_VALID
→ EXPIRING
→ EXPIRED | REVOKED | SUSPENDED
```

A valid portability decision cannot outlive a material destination trust/profile/currentness horizon merely because the source claim remains current.

## 16. Accessibility and responsive/small-screen behavior

Portability, tenant scope, redaction and blocked disclosure must never be color-only. Evidence rows should expose textual Client/Workspace scope, portability disposition, disclosure level and reason.

Keyboard users must be able to inspect source lineage, destination qualification and redaction reasons without drag or graph interaction. Cross-tenant lineage graphs require a table/tree alternative that suppresses unauthorized nodes rather than rendering placeholders that disclose their existence.

On small screens, collapsing columns must not hide tenant scope or turn `PORTABLE_CLAIM_ONLY` into an unlabeled PASS badge. The minimum compact row includes subject, proof class, destination scope, currentness, portability and disclosure disposition.

## 17. Performance and scale

Expected stress shapes include:

- one global component evidence record consumed by thousands of Clients;
- one Client with thousands of Workspace-bound evidence records;
- trust/profile revocation affecting a high-fanout global claim;
- delegated operator switching rapidly between Clients;
- large shared catalog where only a small authorized subset is tenant-visible.

Use indexing, typed fanout references, aggregation and virtualization. Never prefetch unauthorized raw tenant evidence merely to make switching faster.

```text
PREFETCH_OPTIMIZATION != DISCLOSURE_AUTHORITY
AGGREGATED_COUNT != SAFE_GLOBAL_METADATA
HIGH_FANOUT != SILENT_TRUNCATION
```

Performance measurements themselves can be tenant-sensitive when they reveal workload size or topology.

## 18. Failure/recovery

Failure classes:

- destination trust policy unavailable;
- delegated membership/currentness cannot be revalidated;
- source evidence current but confidentiality policy unknown;
- redaction transform fails;
- source raw artifact deleted after claim portability;
- global evidence revocation arrives during Client switch;
- cache contains result under obsolete tenant context;
- asynchronous job resumes under expired delegation;
- destination Workspace revision changes during qualification;
- evidence search/index temporarily loses tenant filtering guarantees.

Fail-closed rule for disclosure: inability to establish visibility must not reveal protected evidence. Semantic claim consumption may separately become `UNKNOWN`/`BLOCKED`; do not relabel it `FAIL` unless the claim itself failed.

## 19. Adversarial scenarios

1. Identical component digest exists in Client A and Client B, but A's evidence used customer-derived fixture data.
2. Global structural PASS is reusable, while screenshot evidence is Client A-only.
3. Delegated support user can view A but switches to B with stale A cache entries in memory.
4. Autocomplete/search reveals an inaccessible customer-specific integration name.
5. Response timing reveals that another tenant already generated evidence for an artifact.
6. Same application version runs under materially different feature flags.
7. Same Workspace name exists in two Clients.
8. Global claim is revoked while 10,000 Clients consume it.
9. Client A deletes raw evidence under retention policy; destination B retained only a claim reference.
10. Browser/AT profile matches but destination normative profile does not.
11. A performance proof from a large tenant is reused for a small tenant and vice versa without workload equivalence.
12. Delegation expires while Evidence Inspector is open.
13. Background requalification started under Client A resumes after UI switched to Client B.
14. Redaction removes visible customer name but leaves hostname/request ID metadata.
15. Fleet aggregate count exposes adoption of a confidential feature by one tenant.
16. Tenant-local FAIL conflicts with a portable global PASS because composition differs.
17. Destination policy requires local corroboration but imported evidence is current and signed.
18. Small-screen projection hides the source/destination tenant-scope column.

## 20. Proof obligations

1. Prove same artifact digest cannot by itself authorize cross-tenant evidence reuse.
2. Prove claim reuse and raw evidence disclosure are independently authorized.
3. Prove confidential fixtures/results never enter a global-safe cache/index without explicit sanitization proof.
4. Prove delegated access to Client A cannot reveal existence/content of Client B evidence.
5. Prove Client switch invalidates or rekeys tenant-sensitive projections and caches.
6. Prove background jobs carry and revalidate tenant/delegation context.
7. Prove Workspace-bound evidence is not reused solely because Client/system names match.
8. Prove global evidence invalidation reaches every material consumer without making tenant-local policy globally authoritative.
9. Prove redaction removes sensitive metadata as well as visible labels.
10. Prove non-enumerating behavior where evidence existence is protected.
11. Prove accessibility of portability/disclosure inspection without graph or drag interaction.
12. Prove small-screen views retain tenant scope, portability and disclosure dispositions.
13. Prove high-fanout aggregation preserves exact affected counts/drill-down for authorized users without leaking unauthorized tenant identities.
14. Prove tenant-local composition FAIL is not overridden by portable child/global PASS.
15. Prove destination trust/currentness is reevaluated independently of source currentness.
16. Prove `UNKNOWN` confidentiality/visibility fails closed for disclosure but does not fabricate semantic FAIL.
17. Prove performance evidence reuse requires workload/environment equivalence appropriate to the proof class.
18. Prove fleet/support roles do not become implicit client mutation or evidence-export authority.

## 21. Maturity and saturation

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

This slice materially closes the immediate gap around cross-Client/Workspace evidence portability, tenant isolation, delegated visibility and side-channel resistance. It does not freeze storage topology, identity provider, database isolation model, encryption model, cache provider, redaction technology or policy language.

## 22. Remaining gaps / next vector

Highest-value next vector:

**promotion-policy evolution and historical replay** — preserve why a historical release/gate decision was valid under policy P1 while evaluating the same artifact under P2 without rewriting history, including waiver lineage, changed mandatory dimensions, imported-evidence trust changes and reproducible counterfactual evaluation.

Secondary vector:

**tenant-safe evidence-derived analytics/recommendations** — determine when aggregate catalog learnings can improve component guidance without leaking adoption, failure, topology or workload information across Clients, including minimum cohort/privacy thresholds and explicit opt-in/contractual boundaries.

## 23. Research-only conclusion

Cross-tenant evidence reuse is safe only when portability, disclosure, trust, semantic applicability and currentness are independently qualified. The durable rule is:

> share tenant-independent proof claims when justified; never let a shared catalog become a shared confidentiality or authority boundary.

`Research candidate != implementation authority` remains in force.