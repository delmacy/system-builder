# G4 Editor Research — Succession of Exclusive Rights and Live Obligations

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: documentary P&D only. No implementation, WBS, Work Package, Sprint, TASK, migration or provider adoption is authorized by this artifact.

## 1. Research question

This round extends organizational-authority succession into the harder operational case: during a merger, split, transfer, dissolution or disputed succession, how do non-duplicable rights and already-live obligations move without double-spend, double-effect, silent orphaning, or Factory sovereignty?

The target remains the proprietary-editor family — Workflow Designer, Component Editor, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation/Requirements, Preview/Sandbox and Revision/Diff — and the shared editor foundation they should reuse.

The core distinction is:

`organizational succession != duplication of live authority`.

A successor may be organizationally legitimate while still lacking a qualified allocation of a particular quota, reservation, approval right, workflow obligation, pending effect, evidence-custody duty or exclusive operating mandate.

## 2. External evidence and extracted primitives

### 2.1 Escrow / bounded counters

Balegas et al., *Extending Eventually Consistent Cloud Databases for Enforcing Numeric Invariants* (2015), adapts escrow transactions into a bounded replicated counter. The important primitive is that an invariant-bounded quantity can be partitioned into local rights so replicas act independently only within allocated rights; reconciliation does not mint additional capacity.

Extracted primitive: **availability can coexist with a conservation invariant when authority is preallocated and transfer is explicit**. This does not imply every business right is numeric or fungible.

Shapiro et al., *Just-Right Consistency* (2018), reinforces that not all operations require the same synchronization: coordination follows the invariant being protected. Extracted primitive: **succession barriers should be right/obligation-specific, not one global freeze when independent invariants can safely advance separately**.

### 2.2 Camunda process-instance migration

Camunda 8 process-instance migration requires explicit mapping of active elements; active jobs, variables and task state have preservation/migration rules, and the documentation warns that unsafe mappings can create unreachable or semantically unintended states. Some user-task migrations preserve candidate users/groups, dates and form references, while implementation changes can alter assignee behavior.

Extracted primitive: **a live workflow occurrence is not recreated merely because its definition or organizational owner changed**. Migration needs explicit mapping and occurrence lineage; definition succession is distinct from active-obligation succession.

### 2.3 AWS Organizations account migration

AWS documents account migration between organizations as an explicit handshake: the destination organization invites and the account accepts. AWS also documents that organization-level policies/benefits/quotas have their own scopes; an account can belong to only one organization at a time. In adjacent program guidance, some Microsoft tenant entitlements explicitly cannot be merged or duplicated across tenants.

Extracted primitive: **container/account movement, policy inheritance, quotas and entitlements have distinct transfer laws; merger does not imply entitlement union or duplication**.

These sources are benchmarks for primitives/trade-offs only; they do not bind G4 to any provider or engine.

## 3. Core model candidates

### 3.1 SuccessionAllocationPlan

A qualified plan references:

- predecessor/successor organizational authority epochs;
- exact right/obligation populations;
- allocation law per class;
- source frontier/snapshot and currentness;
- residue/dispute set;
- fence/cutover evidence where exclusivity matters;
- active-occurrence mappings;
- pending/unknown external-effect dispositions;
- evidence/retention custody allocation;
- offline runtime horizons;
- proof/findings and authorization basis.

A plan is evidence/intent until its required fences, transfers and acknowledgements are qualified.

`allocation plan approved != exclusive right transferred`.

### 3.2 SuccessionItemDisposition

Candidate dispositions:

- `TRANSFERRED_EXCLUSIVE`;
- `PARTITIONED`;
- `SHARED_CUSTODY`;
- `CONTINUES_WITH_PREDECESSOR_CUSTODIAN`;
- `MIGRATED_LIVE_OBLIGATION`;
- `SETTLED_BEFORE_CUTOVER`;
- `FROZEN_PENDING_DISPUTE`;
- `ORPHANED_REQUIRES_REMEDIATION`;
- `BELOW_FLOOR_UNRESOLVABLE`;
- `UNKNOWN`.

The disposition is typed by item class. `SHARED_CUSTODY` may be valid for retained evidence but invalid for an exclusive spend right.

### 3.3 RightAllocation / RightTransferOccurrence

For conserved or exclusive rights, candidate fields include semantic right identity/class, invariant scope, quantity or exclusivity semantics, holder epoch, transferable fraction, predecessor/successor allocation, fence generation, transfer occurrence, acknowledgements, expiry/currentness and unresolved residue.

`right copied != right transferred`.

`destination acknowledged != source fenced`.

### 3.4 LiveObligationMigration

A live obligation keeps occurrence identity and lineage while its responsible authority may change. Candidate dimensions include source occurrence/task/effect identity, source authority, target authority, semantic mapping, input/form/schema bindings, deadlines, already-produced evidence, external-effect state, migration authorization and post-migration qualification.

`definition migrated != occurrence migrated`.

`assignee changed != obligation settled`.

### 3.5 CustodyAllocation

Evidence/records may require custody after operational authority ends. Custody can be exclusive, replicated under policy, partitioned by subject/scope, or retained by an independent custodian. Custody does not create effect authority.

`evidence custody != command authority`.

## 4. Findings

### F224 — Succession needs item-class-specific transfer laws
Ownership change is insufficient to determine treatment of quotas, reservations, licenses, pending approvals, active workflow tasks, retained evidence and irreversible effects. Each class declares whether it is conserved, exclusive, partitionable, shareable, migratable, settle-before-transfer, or non-transferable.

### F225 — Conserved rights cannot be duplicated across split successors
If predecessor A has capacity/right R=100, successors B and C cannot each inherit R=100 unless an external authority explicitly creates additional capacity. Allocation must conserve the protected invariant.

`sum(successor allocated rights) <= qualified transferable predecessor rights` where the right is numeric/conserved.

### F226 — Non-numeric exclusivity needs fencing, not arithmetic
A sole authority to approve, publish, provision or operate may be non-fungible. Its transfer requires evidence that the predecessor can no longer exercise the conflicting right, or an explicit overlap law that makes coexistence safe.

### F227 — Organizational legitimacy does not imply immediate effect authority
A legally qualified successor may still be blocked from `NEW_EFFECT` until exclusive rights, security/currentness and effect-side fences are established.

### F228 — Allocation intent and effective cutover are separate states
A signed split agreement can define future ownership while runtimes still operate under the old authority. UI must expose `PLANNED`, `FENCING`, `PARTIALLY_EFFECTIVE`, `EFFECTIVE`, `DISPUTED`, `UNKNOWN` rather than one `migrated` boolean.

### F229 — Active workflow occurrences survive organizational succession by lineage
A running occurrence is not deleted/recreated merely because organization or definition changes. Migration maps responsibility and compatible active state while preserving occurrence identity, completed history and evidence.

### F230 — Pending Human Tasks require explicit responsibility disposition
A task can remain semantically pending while its assignee/role authority becomes stale. Succession must decide requalification, reassignment, shared review, settlement, freeze or remediation; it must not silently mark completion.

### F231 — Form binding and task responsibility migrate independently
A workflow activity may still require the same form while submit/approve authority changes. Conversely a schema/form migration can be necessary while organizational responsibility remains unchanged.

`workflow activity requiring form != authority to submit form`.

### F232 — In-flight external effects cannot be reassigned by metadata alone
A payment/message/provisioning attempt started by predecessor A may be pending when successor B takes over. B cannot safely retry merely because it is now owner. Stable effect identity, provider/effect-side evidence and retry/fencing rules determine continuation.

### F233 — `UNKNOWN` effect disposition consumes safety margin
An unknown predecessor effect cannot be treated as unused quota/right. Until settled or bounded by stronger evidence, it remains a potential consumption/obligation.

### F234 — Split residue is first-class
Not every object or obligation will have an immediately provable successor. `UNALLOCATED_RESIDUE`/`FROZEN_PENDING_DISPUTE` is safer than cloning or guessing ownership.

### F235 — Merger does not union incompatible rights or quotas
Two predecessor organizations may each possess provider-scoped, contractual or policy-scoped entitlements that cannot legally or technically combine. Successor qualification must follow the entitlement's own transfer law.

### F236 — Evidence can be replicated without duplicating business authority
Where retention/disclosure policy permits, evidence may have multiple custodial copies. This does not duplicate the authority that produced the historical effect or grant either custodian new command rights.

### F237 — Custody succession and operational succession may diverge
A dissolved predecessor can transfer active operations to B while records remain with trustee C. Editors need separate refs for owner/operator/custodian/disclosure authority.

### F238 — Offline runtimes require preallocated rights or bounded freeze
A disconnected runtime that has not observed succession may continue only within rights/currentness horizons that were valid before disconnection. It cannot infer new successor authority. Conflicting rights require fencing or explicit exhaustion/expiry before safe reallocation.

### F239 — Reconnection does not retroactively make dual effects valid
If old and new organizational branches both acted during partition, reconciliation preserves both occurrences and applies invariant/effect-specific remediation. `new owner wins` cannot erase an external effect.

### F240 — Succession can be partial across independent invariants
Evidence custody, read access and non-conflicting workflow work may migrate before an exclusive payment/provisioning right. One global cutover barrier is unnecessary when invariants are independent; conversely UI convenience cannot split an invariant that requires joint fencing.

### F241 — Bulk succession needs query-backed qualified sets, not stale visible selection
At scale, a split may affect millions of objects. The plan must bind a qualified population/snapshot/query and cardinality/exactness evidence; virtualized UI selection cannot define canonical transfer scope.

### F242 — Reverse-impact must include live occurrences, not only definitions
Authority/schema/component indexes must locate active tasks, pending commands/effects, reservations, evidence custody and offline authority grants affected by succession.

### F243 — Preview must simulate allocation without minting rights
Sandbox can show hypothetical successor allocations and UI states, but simulation cannot consume, transfer, fence or duplicate effective rights.

### F244 — Revision/Diff needs conservation and obligation facets
Diff should expose right population, allocated amount/set, residue, fences, live obligations, pending effects, custody and offline horizons. A visually tiny ownership change may have large effect authority impact.

### F245 — Autosave/offline reconcile must not resurrect predecessor authority
An offline draft may retain references to old owners/roles. Reconcile preserves draft content but requalifies authority bindings before publish/effect; stale drafts cannot restore a revoked exclusive right.

## 5. Shared editor foundation consequences

### Shared primitives

1. `SuccessionAllocationPlanRef` and immutable revision refs.
2. Typed `SuccessionItemDisposition`.
3. `RightAllocation` / `RightTransferOccurrence` projections.
4. `LiveObligationMigration` lineage.
5. `CustodyAllocation` and disclosure-purpose refs.
6. Virtualized Outliner/Binding/Impact browsers with semantic selection identity.
7. Command Registry with operation-class qualification and explicit preconditions.
8. Findings/root-cause grouping with minority-critical preservation.
9. Dirty/autosave/offline reconcile that requalifies current authority.
10. History/Revision/Diff with conservation, fencing, obligation and custody facets.
11. Preview fixture pinning and non-effective banner.
12. Evidence/proof lineage.
13. Keyboard/list/tree equivalents for all allocation graph/drag operations.
14. Drag/drop semantic validation: target compatibility, transferability, conservation, currentness and prerequisite fences.

### Reusable editor infrastructure

**Succession Allocation Workbench** — source/successor scopes, item classes, allocation rules, residue and qualification state.

**Rights & Obligations Ledger Projection** — conserved/exclusive rights, live obligations, pending effects and their dispositions. It is a projection/index, not canonical business ownership.

**Live Obligation Migration Review** — source/target responsibility, occurrence lineage, forms/bindings, deadlines, evidence and effect state.

**Succession Impact Browser** — reverse references across definitions and live occurrences.

**Conservation/Fencing Findings** — detects duplicated exclusive rights, over-allocation, unfenced predecessor authority, unknown effect consumption and orphan obligations.

## 6. Findings by proprietary editor

### Workflow Designer
Shows live-occurrence impact separately from definition diff. Human Task responsibility can migrate without pretending the workflow state changed. Active mappings need compatibility checks, unresolved residue and evidence.

### Component Editor / Componentes
Components project `READ_ONLY`, `DISABLED`, `BLOCKED`, `PERMISSION_DENIED`, `PENDING` and `EFFECTIVE` according to qualified operation state. A button/event cannot transfer a conserved right merely by rebinding an action.

### View/Page Builder
Views may remain structurally identical while ownership/custody/permission projections change. Bindings browser should surface stale predecessor refs and successor ambiguity.

### Form Builder
Schema validity, form availability, submit authority and pending-task responsibility remain separate. A form can be valid while submission is blocked during succession.

### Rules/Decision Editor
Expressions can reference typed allocation/authority facts, but rule truth is not transfer authority. State-matrix tooling should expose `planned/effective/disputed/unknown` succession states.

### System/Module Designer
Projects ownership boundaries, exclusive effect rights, custody and live-obligation placement. Moving a module visually or between Workspaces does not transfer authority.

### Elicitation/Requirements
Captures transferability, exclusivity, conservation, custody, deadlines and settlement obligations as requirements/evidence. Requirement approval is not itself effect-side fencing.

### Preview/Sandbox
Can simulate merger/split allocations, offline branches and pending effects with pinned fixtures. `preview allocation != effective allocation`.

### Revision/Diff
Adds facets for rights/conservation, predecessor fencing, live obligations, pending/unknown effects, custody, residue and offline horizons. Diff distinguishes planned allocation from effective cutover.

## 7. Semantic bridge

`Organization/Authority Epoch`
→ `SuccessionAllocationPlan`
→ `Right/Obligation/Custody disposition`
→ `Permission/Policy qualification`
→ `Command intent`
→ `Workflow/View/Form/Component projection`
→ `Authorized Action admission`
→ `Domain State / external Effect`
→ `Evidence`
→ `Settlement/Reconciliation`

Preserved boundaries:

- `View != Workflow Activity`;
- `Form != Workflow State`;
- `Button != Domain Command`;
- `Component event != authorized action`;
- `visual transition != business transition`;
- `organizational succession != right duplication`;
- `allocation intent != effective transfer`;
- `right transfer ACK != predecessor fenced`;
- `definition migration != live occurrence migration`;
- `custody != effect authority`;
- `Factory administration != Client sovereignty`;
- `preview != effective runtime`.

## 8. Declarative + guided UX

Valid composition should be easier than invalid composition through:

- target filtering by transferability and item class;
- conservation meter with exact/unknown cardinality status;
- prerequisite fences before exclusive transfer can become effective;
- missing successor/orphan obligation findings;
- duplicate-exclusive-right and over-allocation blocking findings;
- pending/unknown effect consumption surfaced before reallocation;
- typed responsibility/custody bindings;
- source/target side-by-side mapping for live tasks;
- bulk plans bound to qualified query snapshots;
- explicit residue bucket rather than forced allocation;
- publish/authorize requalification against current authority/effect state;
- list/tree/keyboard alternatives to graph and drag/drop.

## 9. Adversarial scenarios

1. A splits into B/C and both inherit the same exclusive publish key/right.
2. A has quota 100; B and C each receive 100 by naïve copy.
3. 60 units are allocated but 50 may already have been consumed by an offline predecessor runtime.
4. A payment is `UNKNOWN`; successor retries under a new organizational identity and double-pays.
5. A Human Task remains assigned to a director whose authority ended during merger.
6. Workflow definition migrates but the active occurrence is silently recreated, losing evidence/history.
7. Form schema remains valid but submit authority belongs to unresolved residue.
8. B receives operations while C is lawful records custodian; B attempts to erase retained evidence.
9. Evidence is replicated to B/C and UI incorrectly displays both as historical authorizer.
10. A provider entitlement is non-transferable but merger UI unions it into successor rights.
11. Offline runtime A continues spending a pre-split right after B has been allocated the same capacity.
12. New successor is legally valid but effect-side provider still accepts predecessor credentials.
13. Predecessor is fenced in Builder but not at the external effect endpoint.
14. A visual drag moves an exclusive right between successors without transfer qualification.
15. Bulk allocation uses only currently rendered virtualized rows and silently omits objects.
16. Query-backed bulk set changes between review and authorization without snapshot/currentness evidence.
17. Minority-critical orphan obligation is hidden inside an aggregate of thousands of successful transfers.
18. Succession plan allocates all visible records but omits a retained legal-hold attachment.
19. Two successors share custody legitimately; a generic duplicate detector incorrectly treats it as double ownership.
20. Disputed residue is forced to the latest claimant by timestamp.
21. Autosaved draft created pre-split republishes a revoked predecessor command binding.
22. Preview simulation accidentally invokes an effective transfer command.
23. A merger unions permissions from A and B although their policies are mutually exclusive.
24. Factory account migration is mistaken for Client ownership/right transfer.

## 10. Proof/test obligations for future qualification

Research candidates only; not executable TASKs:

1. conserved-right allocation never exceeds qualified transferable source capacity;
2. exclusive-right transfer cannot become `EFFECTIVE` while a conflicting predecessor right remains unfenced unless overlap is explicitly safe;
3. unknown effect consumption is never counted as definitely free capacity;
4. live occurrence identity/history survives responsibility migration;
5. completed workflow/effect evidence is never rewritten to the successor actor;
6. stale Human Task authority is detected before completion/approval;
7. form/schema migration cannot fabricate submit authority;
8. retry after succession preserves stable effect lineage and obeys effect-specific retry/fencing rules;
9. shared evidence custody never implies duplicated business/effect authority;
10. unresolved residue remains visible and blocks only operation classes whose invariant depends on it;
11. independent invariants may migrate independently without weakening shared invariants;
12. offline runtime cannot acquire successor authority it has not qualified;
13. reconnection preserves dual historical effects and requires explicit remediation where conflicting;
14. bulk allocation is bound to a qualified set/snapshot and reports exactness/cardinality;
15. aggregation never hides blocking/minority-critical/UNKNOWN dispositions;
16. preview cannot produce effective transfer/fence/effect occurrences;
17. undo/redo cannot undo external transfer/effect history as if it were editor state;
18. keyboard/non-spatial paths can perform every review/allocation operation available by drag/graph;
19. stale autosave/offline drafts cannot resurrect revoked predecessor rights;
20. Factory tenancy/account movement cannot satisfy Client succession proof by itself.

## 11. Componentization complexity / dependency hotspots

- **P0 LOW/MEDIUM** — typed refs, dispositions, currentness badges, residue status, preview banners.
- **P1 MEDIUM/HIGH** — allocation tables, mapping UI, impact browser, findings, semantic drag validation, virtualized ledgers.
- **P2 HIGH/VERY HIGH** — Workflow live-occurrence mapping, Form/authority cross-validation, custody projections, semantic Revision/Diff, offline reconciliation projections.
- **P3 EXTREME** — conservation/fencing across organizational epochs and offline runtimes; unknown external-effect settlement; bulk exactness at scale; provider-local entitlement transfer; split/merger of mixed exclusive, conserved, live and custodial obligations.

Primary hotspot:

`authority epoch × item class × invariant scope × right allocation × live occurrence × effect disposition × custody × offline frontier × currentness × successor branch × provider fence`.

## 12. Maturity / saturation / gaps

Assessment: `ADVANCED_EMERGING / MATERIAL_DELTA`.

The shared-editor hypothesis is increasingly stable: selection/outliner/Inspector/Command Registry/history/findings/bindings/preview/evidence/diff are reusable infrastructure, while each proprietary app contributes a semantic adapter and never absorbs ownership of another domain.

Material gaps remaining:

1. mixed fungible/non-fungible right decomposition inside one business capability;
2. leases/reservations that expire during succession and whether expiry itself safely releases authority;
3. settlement protocols for external providers that cannot expose fencing/currentness evidence;
4. privacy/minimization of succession ledgers containing commercial/legal allocations;
5. benchmark-scale impact and migration UX for `10^5–10^6` live obligations;
6. temporal obligations/deadlines/SLA clocks during freezes and disputed succession.

## 13. Next vector

Research **temporal obligations during succession/freeze/dispute**: deadlines, leases, reservations, SLA clocks, escalation timers and time-based permissions when authority is temporarily `BLOCKED/UNKNOWN`. The central question is whether time continues, pauses, transfers or expires per obligation class without silently granting rights or penalizing actors for governance freezes.

## 14. Sources

- Balegas et al. (2015), *Extending Eventually Consistent Cloud Databases for Enforcing Numeric Invariants*, arXiv:1503.09052.
- Shapiro et al. (2018), *Just-Right Consistency: reconciling availability and safety*, arXiv:1801.06340.
- Camunda 8 documentation, *Process instance migration* (current docs consulted 2026-09-23).
- AWS Organizations documentation, *Migrate an account to another organization with AWS Organizations* and Organizations FAQ (consulted 2026-09-23).
- Microsoft Learn, *Tenant modification — Microsoft for Nonprofits* (consulted 2026-09-23), used only as an entitlement-transfer counterexample.
