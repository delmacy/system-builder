# G4 Editor Research — Organizational Authority Succession and Client Sovereignty

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption is authorized by this artifact.

## 1. Research question

This round studies the layer below emergency trust recovery: what happens when the *human/legal/organizational owner itself* is unavailable, disputed, reorganized, merged, split, dissolved, transferred between jurisdictions, or represented by conflicting authorities.

The target remains the Generation-4 proprietary-editor family — Workflow Designer, Component Editor, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation/Requirements, Preview/Sandbox and Revision/Diff — and the shared editor foundation they should reuse.

The problem is deliberately not reduced to IAM administration. The architectural question is how an autonomous Client can preserve locally owned authority without turning Factory into a permanent sovereign root, while still supporting qualified organizational succession and emergency recovery.

## 2. External evidence and extracted primitives

### 2.1 NIST digital identity guidance

NIST SP 800-63-4 / 800-63A-4 treats identity proofing, enrollment, authorization to act, lifecycle changes and evidence quality as separate concerns. For enterprise use, organizational processes can establish that a person is entitled to act in a role, but authentication of that person is not itself proof of unlimited organizational authority.

Extracted primitive: **subject identity, representative capacity, authority scope and currentness must remain distinct**.

### 2.2 GLEIF / LEI relationship and legal-entity-event model

GLEIF's LEI ecosystem models legal entities and relationship/event information rather than treating a name string as immutable identity. Legal-entity events such as mergers, acquisitions, changes and successor relationships are useful evidence that organizational continuity is event- and provenance-dependent.

Extracted primitive: **organizational continuity is a qualified relationship between entity epochs, not `same name == same owner`**.

### 2.3 W3C DID Core

DID Core separates a DID subject from its controller and verification methods. A controller can be an entity authorized to make changes to a DID document; control metadata is therefore not identical to the identity of the subject.

Extracted primitive: **identity != controller != verification method**. This maps cleanly to Client identity, organizational authority and cryptographic credentials without requiring DID adoption.

### 2.4 TUF root rotation

The Update Framework uses threshold roles, offline root keys and predecessor/successor validation for root rotation. The relevant primitive is continuity evidence across authority generations rather than a mutable singleton root.

Extracted primitive: **successor authority should be proven through an explicit transition or declared re-bootstrap; possession of a newer credential does not by itself prove organizational succession**.

## 3. Core model candidates

### 3.1 OrganizationalAuthorityEpoch

Candidate fields/concepts:

- `organizationSemanticId`;
- `authorityEpochId`;
- legal/organizational identity evidence references;
- predecessor/successor relations;
- authority-set revision;
- jurisdiction/policy context where material;
- effective interval and observation/currentness metadata;
- delegated scopes;
- dispute/hold state;
- trust/evidence references;
- transition or re-bootstrap basis.

Invariants:

`Organization identity != current authority set`

`Human identity != representative capacity`

`Representative capacity != authority for every operation`

`Credential possession != organizational ownership`

`Factory account ownership != Client sovereignty`

`Legal succession != cryptographic continuity`

`Cryptographic continuity != legal succession`

### 3.2 OrganizationalSuccessionEvidence

A succession event should be capable of representing at least:

- `CONTINUATION` — same organization, authority set changes;
- `DELEGATION_CHANGE` — authority is delegated/revoked without ownership change;
- `MERGER_SUCCESSOR` — multiple predecessors contribute to a successor;
- `SPLIT_SUCCESSORS` — one predecessor divides into multiple successors/scopes;
- `ASSET_OR_BUSINESS_TRANSFER` — selected Client/workspace/assets transfer without universal succession;
- `DISSOLUTION_WITH_CUSTODIAN` — active business authority ends while historical/custodial authority survives;
- `JURISDICTIONAL_REORGANIZATION` — authority basis changes under a different legal/governance context;
- `DISPUTED_SUCCESSION` — competing claims cannot yet be qualified;
- `UNPROVABLE_CONTINUITY_REBOOTSTRAP_REQUIRED` — continuity cannot safely be demonstrated.

The transition is scope-aware. A merger may transfer some operational rights while litigation, regulated records, IP, employment data or particular business units remain under different authority.

`Successor for scope A != successor for scope B`.

### 3.3 AuthorityClaim

Candidate dimensions:

- subject/organization;
- claimant;
- representative capacity;
- operation class;
- resource/client/workspace scope;
- temporal interval;
- jurisdiction/policy basis;
- evidence set;
- currentness;
- conflicts/holds;
- disposition: `QUALIFIED | LIMITED | DISPUTED | STALE | REVOKED | UNKNOWN | NOT_APPLICABLE`.

A single global `isOwner=true` is insufficient for this problem class.

## 4. Findings

### F204 — Organizational identity must not collapse into organizational authority
A Client can preserve semantic identity across changes of directors, administrators, custodians and signers. Conversely, the same humans/credentials can act for different organizations. Editor and trust infrastructure therefore need explicit authority references rather than inferring ownership from account identity.

### F205 — Client sovereignty must be locally anchored, not Factory-granted by default
Factory may provision, coordinate, distribute qualified packages and expose fleet-level projections. It must not become the mandatory online oracle that decides who owns a Client. A published/autonomous Client must be able to evaluate locally sufficient authority evidence within declared currentness/security horizons.

`Factory unavailable != Client ownership undefined`.

### F206 — Factory transport or administration is not organizational succession
Moving a Client between Factory accounts, organizations or hosting arrangements cannot silently transfer business authority.

`Factory tenancy move != ownership transfer`.

### F207 — Succession is many-to-many and scope-qualified
Mergers and splits defeat a simple predecessor pointer. One successor can inherit from several predecessors; one predecessor can produce several successors. Rights, records and obligations can partition by scope.

### F208 — Legal continuity and technical continuity are independent evidence dimensions
A legally valid successor may have no surviving cryptographic credentials. A technically continuous key may be controlled by an actor that no longer has legal/organizational authority. Qualification requires the dimensions relevant to the operation rather than choosing one as universal truth.

### F209 — Dispute is a first-class authority state
Two plausible claimants do not justify choosing the newest credential, loudest administrator or latest timestamp. Material disputes produce operation-scoped `BLOCKED/UNKNOWN` for authority-sensitive actions while historical read/verification may remain available.

### F210 — Organizational succession must not rewrite historical authorship
If Organization A authorized a workflow publication in epoch E1 and Organization B later succeeds A, the historical occurrence remains attributed to A/E1. B may acquire authority to continue, supersede or remediate; it does not become the historical actor.

### F211 — Dissolution separates operational authority from custodial authority
An organization can cease operating while records still require retention, audit, disclosure or legal custody. `DISSOLVED` therefore cannot mean `delete Client` or `all authority vanished`.

### F212 — Delegation must be narrower than ownership
Consultants, MSPs, auditors, administrators and Factory operators may receive bounded delegated authority without becoming owner/successor. Delegation requires explicit scope, currentness, revocation and non-transitivity unless separately qualified.

### F213 — Delegation chains need bounded depth/semantics, not implicit transitivity
`A delegates X to B` and `B delegates Y to C` does not imply C has X. Subdelegation must be explicitly admissible for the exact scope and operation.

### F214 — Split succession requires partition evidence and unresolved-residue handling
When a Client/business splits, objects cannot be silently duplicated into two sovereign successors. The system needs qualified allocation, shared-custody or unresolved residue states for artifacts/obligations that cannot yet be partitioned.

### F215 — Merger does not imply permission union
If predecessor A can perform X and predecessor B can perform Y, the merged successor does not automatically receive `X ∪ Y` unless the succession/governance policy qualifies that result.

### F216 — Jurisdiction changes can alter admissibility without changing semantic identity
A Client/organization can remain semantically continuous while retention, disclosure, representative authority or regulated-operation constraints change. Jurisdiction/policy context is therefore a qualification dimension, not an identity rewrite.

### F217 — Human unavailability is different from authority extinction
Death, incapacity, employment termination or loss of a custodian can remove one representative while organizational authority continues through qualified succession mechanisms. Recovery must not depend on an immortal named human.

### F218 — Human/legal dispute must not be solved by cryptographic majority alone
Threshold signatures can prove that a configured threshold approved something; they do not decide corporate ownership, probate, insolvency, court disputes or statutory authority.

`quorum satisfied != organizational legitimacy proven`.

### F219 — Court/regulator/administrator orders are external authority evidence, not universal super-roots
Where applicable, an external legal authority can affect a bounded scope. The system should record provenance, jurisdiction, scope, effective interval and conflict rather than implement a global `courtOverride=true` primitive.

### F220 — Re-bootstrap is explicit when continuity cannot be demonstrated
If predecessor authority is unavailable/compromised and no independent qualified succession path survives, a new organizational authority epoch may need explicit re-bootstrap. It must not pretend cryptographic or governance continuity with the old epoch.

### F221 — Organizational authority changes create impact findings across editor artifacts
A permission/authority succession can invalidate publish authorization, workflow human-task assignees, form access, component visibility, command execution, evidence disclosure and approval chains without changing the visual artifact itself. Reverse-impact indexing is therefore a shared primitive.

### F222 — Preview must pin an authority scenario
Preview/Sandbox may simulate `director`, `auditor`, `successor`, `disputed claimant` or other authority scenarios, but it must state the authority epoch/policy fixture used.

`previewed authority != effective authority`.

### F223 — Revision/Diff needs authority-semantic facets
Textual changes are inadequate. Diff needs facets for organization epoch, representative set, delegation, succession relation, scope, jurisdiction/policy context, dispute/hold, currentness and affected operations.

## 5. Shared editor foundation consequences

### Shared primitives

1. `SemanticRef` / immutable revision references.
2. `AuthorityClaimRef` and `OrganizationalAuthorityEpochRef`.
3. Selection and multi-selection with semantic identity independent of mounted UI.
4. Outliner/tree and virtualized result lists.
5. Inspector facets for authority, scope, currentness, provenance and conflicts.
6. Command Registry with operation-class qualification.
7. Undo/redo for editor mutations only; authority/effect history is not undone by UI history.
8. Dirty/autosave/offline draft/reconcile with authority-currentness requalification before publish/effect.
9. Findings/root-cause grouping and reverse-impact sets.
10. Revision/Diff with semantic facets rather than text-only diff.
11. Evidence browser and lineage browser.
12. Compatibility/prerequisite filtering.
13. Non-spatial keyboard-accessible alternatives for every graph/drag operation.
14. Preview fixture pinning and visible non-effective status.

### New reusable projections

**Organizational Authority Review** — organization/epoch, representatives, delegations, succession evidence, dispute state, currentness and affected operations.

**Succession Graph** — many-to-many predecessor/successor relationships with scope-labelled edges; always paired with list/tree representation.

**Authority Impact Browser** — reverse references into Workflow, Form, View, Component, Command/Action, Permission, Domain State and Evidence.

**Authority Semantic Diff** — separates identity, controller/representative, credential, delegation, legal/governance basis and effective-operation changes.

These are shared editor infrastructure; they do not own organization/business semantics.

## 6. Findings by proprietary editor

### Workflow Designer
Human tasks and authorization gates reference authority claims/roles, not named UI users as canonical ownership. Succession can make an assignee stale while the workflow state remains valid. Reassignment/continuation is a governance operation, not a visual transition.

### Component Editor / Componentes
Component visibility, disabled/read-only/permission-denied states may project authority/permission results, but a component event never creates representative capacity or command authority. Variants should expose `READ_ONLY`, `DISABLED`, `BLOCKED`, `PERMISSION_DENIED`, `PENDING`, `EFFECTIVE` where applicable without collapsing their causes.

### View/Page Builder
A view can become inaccessible or partially redacted after an authority change without changing layout. Binding/currentness findings must distinguish view composition from effective authorization.

### Form Builder
A workflow activity may require a form, but form access/submission authority remains separately qualified. Organizational succession can invalidate submit/approve rights without making the form schema invalid.

### Rules/Decision Editor
Rules may reference organizational roles/capacities. The expression editor needs typed references and findings for stale/missing/ambiguous authority claims. A rule evaluating `true` is not itself authorization.

### System/Module Designer
This is the natural place to project ownership/delegation boundaries and impact, but not to create universal ownership semantics. Module ownership, deployment administration and Client sovereignty remain distinct.

### Elicitation/Requirements
Requirements can record stakeholders, accountable organizations, legal/governance constraints and evidence, but stakeholder mention is not authority. Traceability should distinguish `requested by`, `approved by`, `owned by`, `operated by`, `audited by` and `affected by`.

### Preview/Sandbox
Preview pins a hypothetical authority epoch and permission fixture. It can demonstrate expected UI/workflow consequences but cannot establish real organizational authority or effective publication.

### Revision/Diff
Authority-semantic diff is mandatory for high-risk changes. A one-line delegation or threshold change may dominate a large visual diff. Diff must also show affected artifact sets and whether the comparison is historical, current or hypothetical.

## 7. Semantic bridge

The candidate bridge remains explicit and non-collapsing:

`Organization/Authority Epoch`
→ `Representative/Delegation Claim`
→ `Permission/Policy qualification`
→ `Domain Command intent`
→ `Workflow/View/Form/Component projection`
→ `Authorized Action admission`
→ `Domain State / external Effect`
→ `Evidence`
→ `Revision/Impact/Incident`
→ `Succession or Re-bootstrap`

Preserved invariants:

- `View != Workflow Activity`;
- `Form != Workflow State`;
- `Button != Domain Command`;
- `Component event != authorized action`;
- `visual transition != business transition`;
- `identity != representative capacity`;
- `representative capacity != permission`;
- `permission != command occurrence`;
- `Factory administration != Client sovereignty`;
- `organizational succession != historical rewrite`;
- `legal continuity != cryptographic continuity`;
- `re-bootstrap != proven succession`.

## 8. Declarative + guided UX

The editor should make valid composition easier than invalid composition through:

- compatibility filtering by operation/scope/currentness;
- authority prerequisites shown before binding;
- missing/stale/disputed authority findings at authoring time;
- reverse-impact previews before delegation/succession changes;
- typed role/capacity references instead of free-text identity strings;
- orphan representative/delegation detection;
- permission mismatch detection;
- explicit `UNKNOWN`/`DISPUTED` states rather than optimistic fallback;
- preview banners identifying hypothetical authority context;
- publish gates that requalify current authority instead of trusting old editor state;
- non-drag list/tree/command-palette equivalents for succession and delegation editing.

## 9. Adversarial scenarios

1. A sole director leaves while their authentication credential remains valid.
2. A new director is legally appointed but has no predecessor cryptographic credential.
3. Factory administrator moves the Client to another Factory tenant and claims ownership transferred.
4. Organization A merges with B; A's permission X and B's permission Y conflict.
5. Organization A splits into B and C; both claim the same regulated record set.
6. Two boards claim to be the lawful authority during litigation.
7. A court-appointed administrator has bounded authority over assets but not unrelated business operations.
8. A delegated MSP attempts to subdelegate privileges that were non-delegable.
9. A dissolved company must retain audit/evidence records but may no longer initiate business effects.
10. A successor organization has valid legal evidence but predecessor signing keys are lost.
11. Predecessor keys remain usable after the legal representative's authority ended.
12. Offline runtime reconnects after an organizational succession it has not observed.
13. Offline draft created under old authority is published after authority revocation.
14. Workflow human task references a named employee who has left; workflow state itself remains valid.
15. Permission change makes a View partially inaccessible while its layout revision is unchanged.
16. Form schema remains valid but submitter authority is disputed.
17. UI control remains visible from stale cache after command authority is revoked.
18. Preview uses old authority fixture and appears successful while effective runtime would block.
19. Revision conflict combines an old delegation set with a new permission policy.
20. Merger successor attempts to reinterpret predecessor historical approvals as its own actions.
21. Split successors both attempt irreversible effects from the same pre-split authority grant.
22. Legal succession differs by jurisdiction for different assets/data classes.
23. Recovery quorum is cryptographically valid but composed of persons no longer authorized by the organization.
24. All continuity evidence is unavailable and an administrator attempts silent `latest wins` re-bootstrap.

## 10. Proof/test obligations for later qualification

These are research obligations, not implementation tasks:

1. No Factory account/tenant mutation alone transfers Client sovereignty.
2. Authentication success never implies representative capacity without qualified evidence.
3. Representative capacity never implies unrestricted operation authority.
4. Revoked/stale delegation cannot become current through offline cache replay.
5. `DISPUTED/UNKNOWN` cannot be widened into permission.
6. Merger does not silently union predecessor permissions.
7. Split does not silently duplicate exclusive rights/effect authority.
8. Historical authorship remains bound to the authority epoch at occurrence time.
9. Dissolution does not silently delete retention/custody obligations.
10. Legal and cryptographic continuity can disagree without either being relabelled as the other.
11. Preview cannot satisfy effective authorization/publish proof.
12. Revision/Diff exposes authority-semantic changes even when text/visual changes are small.
13. Offline drafts are requalified against current authority before publish/effect.
14. Reverse-impact findings include Workflow/Form/View/Component/Command/Permission/Evidence dependencies.
15. Delegation/subdelegation respects exact scope and non-transitivity.
16. Re-bootstrap creates a visible new authority/trust epoch when continuity is unprovable.
17. Accessibility-equivalent paths exist without drag/spatial manipulation.
18. Cached/derived/indexed projections cannot resurrect revoked authority.
19. Organizational succession never erases already-observed external effects.
20. Cross-jurisdiction conflict remains explicit rather than resolved by timestamp or Factory preference.

## 11. Complexity/dependency hotspots

Research-only componentization estimate:

- **P0 LOW/MEDIUM** — refs, status/disposition vocabulary, currentness badges, provenance links.
- **P1 MEDIUM/HIGH** — Authority Inspector, Succession Graph/List, semantic diff facets, impact browser, compatibility filtering.
- **P2 HIGH/VERY HIGH** — editor adapters, offline authority-currentness UX, guided succession/review flows, scoped disclosure projections.
- **P3 EXTREME** — many-to-many scoped succession, disputed authority, legal-vs-cryptographic continuity, split exclusive rights, cross-jurisdiction qualification, re-bootstrap and interaction with effect lineage/trust epochs.

Primary hotspot:

`organization epoch × representative capacity × delegation × operation class × resource scope × jurisdiction/policy basis × currentness × dispute state × trust epoch × offline observation × effect disposition`.

This reinforces the shared-foundation thesis: duplicating these semantics independently in nine editors would be both expensive and unsafe.

## 12. Maturity / saturation

Result: `ADVANCED_EMERGING / MATERIAL_DELTA`.

The shared-editor primitive space is increasingly saturated. The remaining uncertainty is concentrated less in selection/canvas/inspector mechanics and more in authority/evidence boundaries that determine whether editor actions may become effective.

## 13. Next vector

Highest-value next research vector:

**succession of exclusive/non-duplicable rights and live obligations during organizational split/merger**, including how reservations, quotas, effect authority, pending Workflow human tasks, retained Evidence and offline runtimes are partitioned without double-spend/double-effect or global Factory sovereignty.

Secondary vector: model **authority-currentness/dispute UX under long offline intervals**, including what remains editable/readable/simulatable versus what must be blocked pending requalification.

## 14. Source register

Primary sources consulted this round:

- NIST SP 800-63-4 / SP 800-63A-4 — Digital Identity Guidelines / Identity Proofing and Enrollment.
- GLEIF — LEI reference data, relationship data and Legal Entity Events model/documentation.
- W3C — Decentralized Identifiers (DID) v1.0, especially separation of DID subject, controller and verification methods.
- The Update Framework — specification/security model for threshold root authority and root rotation.

These sources contribute primitives and trade-offs only; they do not imply adoption of DID, LEI, TUF or any provider/technology binding.