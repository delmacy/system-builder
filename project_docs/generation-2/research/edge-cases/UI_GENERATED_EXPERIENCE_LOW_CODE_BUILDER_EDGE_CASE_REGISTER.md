# Generation 2 — UI / Generated Experience / Low-code Builder Edge-Case Register

Status: ACTIVE — Full Pass 1 local challenge complete / MATERIAL FINDINGS
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: UI / Generated Experience / Low-code Builder
Authority: `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, Planning A/B UI boundaries/current-state reconciliation.

Research only. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. Findings below catalogue/classify/detect/route future remediation; they do not authorize implementation.

## Preserved boundaries

- UI owns governed semantic projection and experience composition, not process/data/policy/workflow truth.
- canonical experience identity is distinct from renderer/framework/provider identity.
- hidden/disabled/rendered state is not authorization.
- `StoredFact != DerivedValue`; rendering a value does not authorize materialization.
- `UNKNOWN` mutating effect requires reconciliation before unsafe retry.
- AI/low-code/AGWS cannot amplify authority; `Enterprise → Station → Role → Person` remains bounded.

## Material local edge cases

### G2-EDGE-UI-001 — stale semantic projection permits mutation against incompatible owner revisions
**Scenario / activation:** an experience generated against schema/process/policy/formula revisions remains open or cached while one or more semantic owners advance incompatibly; the user submits using the stale projection.
**Expected safe behavior:** requalify material owner revisions before mutation; reject or explicitly route stale-base conflict; preserve the producing experience revision and attempted intent.
**Forbidden:** treating successful rendering or client freshness as proof that owner revisions remain compatible; blind last-write-wins.
**Effect/failure disposition:** pre-effect rejection where detectable; otherwise `UNKNOWN/PARTIAL` until owner reconciliation.
**Owners:** UI projection + affected Process/Data/Authorization/Formula owner + Lifecycle for coexistence.
**Evidence/currentness:** experience revision, material revision vector, current owner qualification and submit-time authority evidence.
**Recovery/reconciliation:** reload/rebase or owner-qualified migration of intent; never silently reinterpret stale input under new semantics.
**Blast radius:** record → workflow/process; **severity:** HIGH; **misuse likelihood:** plausible/accidental; **evidence:** current Planning-A/B boundary, adversarial inference.
**Proof obligation:** prove stale generated surfaces cannot commit under an incompatible material revision vector without explicit requalification.
**Saturation:** MATERIAL / local streak reset to 0.

### G2-EDGE-UI-002 — presentation state is mistaken for authority or mandatory-governance state
**Scenario / activation:** hidden/disabled controls, client-side route guards, personalization, responsive layout or stale policy signals are treated as authorization/enforcement; conversely a visible control is assumed permitted.
**Expected safe behavior:** protected mutation crosses authoritative policy/AGWS enforcement at actuation time; presentation remains non-authoritative.
**Forbidden:** authorization by visibility, DOM state, component omission, provider support or local cached permission alone.
**Disposition:** deny/inconclusive before effect when authority cannot be qualified.
**Owners:** Authorization/Policy and AGWS for effective surface; UI for projection correctness.
**Evidence/currentness:** current subject/Station/Role/Person scope, policy revision and delegated authority envelope.
**Recovery:** refresh/requalify surface; preserve denied intent only as non-authoritative evidence.
**Blast radius:** task → station/system; **severity:** CRITICAL; **misuse:** likely accidental, adversarially exploitable; **evidence:** strong current boundary.
**Proof obligation:** prove every protected UI action is independently authority-gated and UI state cannot widen effective authority.
**Saturation:** MATERIAL / streak 0.

### G2-EDGE-UI-003 — optimistic UI converts ambiguous external mutation into false success and unsafe retry
**Scenario / activation:** UI optimistically marks a mutation complete; transport/provider times out or returns ambiguous acknowledgement; user retries from a surface that presents success/failure too strongly.
**Expected safe behavior:** retain attempted/accepted/applied/converged distinction; show qualified pending/unknown state and reconcile before non-idempotent retry.
**Forbidden:** timeout ⇒ `NOT_APPLIED`, optimistic display ⇒ canonical success, or automatic retry without qualified idempotency.
**Disposition:** `UNKNOWN` until reconciliation; correction/supersession preserves lineage.
**Owners:** effect semantic owner + Workflow/Integration/Provider; UI owns faithful projection of disposition.
**Evidence/currentness:** operation identity, idempotency scope, provider receipt and reconciliation evidence.
**Recovery:** reconcile effect then permit retry/compensation according to owner contract.
**Blast radius:** record → external party/financial effect; **severity:** CRITICAL; **misuse:** plausible; **evidence:** strong universal effect semantics.
**Proof obligation:** prove UI cannot collapse ambiguous mutation into success/failure or trigger unsafe retry.
**Saturation:** MATERIAL / streak 0.

### G2-EDGE-UI-004 — malformed/localized/accessibility-invalid representation changes semantic input
**Scenario / activation:** locale decimal/date/unit/timezone, bidi/encoding, empty-vs-null, truncated label/value, inaccessible control relation, focus/order or alternate-input path changes what the operator perceives or submits.
**Expected safe behavior:** typed semantic values remain independent of display formatting; invalid/ambiguous parse is rejected/inconclusive; accessibility variants preserve equivalent interaction intent and required information.
**Forbidden:** locale-dependent silent coercion, inaccessible alternate path producing different semantics, or visual truncation becoming stored truth.
**Disposition:** validation failure / `INCONCLUSIVE`; no canonical mutation from ambiguous representation.
**Owners:** UI for representation/accessibility; Data/Math/domain owner for typed semantics.
**Evidence/currentness:** locale/profile, component-contract revision, typed input contract and accessibility qualification.
**Recovery:** explicit correction/re-entry under qualified representation.
**Blast radius:** field → process/financial calculation; **severity:** HIGH; **misuse:** accidental likely; **evidence:** current Planning-A accessibility/semantic-projection obligation.
**Proof obligation:** property/boundary tests across locale, null/empty, units, timezone and accessibility interaction alternatives.
**Saturation:** MATERIAL / streak 0.

### G2-EDGE-UI-005 — concurrent drafts and stale-base generated edits overwrite or compose incompatible intent
**Scenario / activation:** two users/AI agents edit the same experience/process-facing draft from one base; one publishes while the other saves/publishes without detecting changed semantic/component/policy dependencies.
**Expected safe behavior:** retain base revision, detect conflict across material dependencies and require explicit merge/rebase/owner routing.
**Forbidden:** silent last-write-wins or merging syntactically compatible fragments whose semantic postconditions conflict.
**Disposition:** conflict signal, not confirmed conflict until activation evidence; block publication where incompatibility is material.
**Owners:** UI experience owner + semantic owners referenced by changed bindings; Lifecycle for coexistence.
**Evidence/currentness:** base/head revision vectors, authorship/authority, dependency diff.
**Recovery:** governed merge/rebase with lineage.
**Blast radius:** experience → process/system; **severity:** HIGH; **misuse:** accidental plausible; **evidence:** supported by revision-vector/concurrency research.
**Proof obligation:** prove stale-base publication is detectable beyond a single UI revision number.
**Saturation:** MATERIAL / streak 0.

### G2-EDGE-UI-006 — low-code graph/resource explosion is valid locally but operationally unsafe
**Scenario / activation:** deeply nested components, recursive visibility/derived conditions, fan-out actions, huge option/data sets or cyclic dependencies are individually valid but cause render/evaluation/event/resource explosion.
**Expected safe behavior:** qualified complexity/resource budgets and cycle/termination checks yield bounded degradation/rejection without changing semantic meaning.
**Forbidden:** unbounded recursion, retry/render loops, silent dropping of mandatory controls/data, or cost-driven simplification that violates owner semantics.
**Disposition:** explicit unsupported/resource-exhausted/inconclusive; no partial canonical mutation unless operation contract permits it.
**Owners:** UI composition owner + Runtime/Provider/FinOps for realization limits; semantic owners retain meaning.
**Evidence/currentness:** graph closure, evaluation profile, support/capacity vector and runtime evidence.
**Recovery:** reduce/split composition or select qualified realization; preserve canonical definition/lineage.
**Blast radius:** client → runtime/system; **severity:** HIGH; **misuse:** accidental/low-code likely; **evidence:** adversarial scale family + Planning-A provider support vector.
**Proof obligation:** bound graph/evaluation/resource behavior and prove degradation cannot remove mandatory semantics silently.
**Saturation:** MATERIAL / streak 0.

### G2-EDGE-UI-007 — DerivedValue is rendered or submitted as StoredFact without declared materialization semantics
**Scenario / activation:** a calculated/default/prefilled value is visually indistinguishable from authoritative stored input and a save path persists it after FormulaRevision/input/currentness changes.
**Expected safe behavior:** preserve value provenance, FormulaRevision/input snapshot and explicit materialization/adoption transition when owner semantics permit persistence.
**Forbidden:** display/default/prefill ⇒ canonical fact; live recomputation silently rewriting historical fact; stale derived value persisted as current truth.
**Disposition:** reject/inconclusive or explicit owner-authorized materialization.
**Owners:** formula/domain/data owner; UI only projects and collects intent.
**Evidence/currentness:** FormulaRevision, producing inputs/snapshot, calculation result identity, owner materialization policy.
**Recovery:** recompute/requalify or preserve historical snapshot according to owner semantics.
**Blast radius:** record → billing/operations/reporting; **severity:** CRITICAL; **misuse:** plausible; **evidence:** closed math research + canonical `StoredFact != DerivedValue`.
**Proof obligation:** prove generated forms cannot silently persist DerivedValue as StoredFact and historical results retain producing revision/snapshot.
**Saturation:** MATERIAL / streak 0.

## Processual / semantic ConflictPatterns

### G2-CONFLICT-PATTERN-PROJECTION-SEMANTICS-001 — individually valid projection and owner contract imply incompatible mutation
- **Activation conditions:** UI projection/binding is valid for its producing revision; current process/data/policy/formula owner revision is also valid; their composed interpretation differs materially.
- **Incompatible claims/actions/states:** rendered field/action meaning versus current owner mutation/postcondition.
- **Why local validation misses it:** renderer validates its own component/binding contract; owner validates current mutation; neither alone compares the producing cross-owner revision vector.
- **Detection candidate/stage:** static dependency closure + pre-execution material revision compatibility + runtime stale-base signal.
- **Owner set:** UI + affected semantic owner + Lifecycle/Reconciliation.
- **Assessment:** HIGH; confidence strongly supported; detectability pre-execution/runtime; blast process/system; reversibility migration/re-entry may be required; time-to-harm immediate; misuse accidental plausible; evidence current; false-positive risk medium where owner declares backward compatibility.
- **Diagnostic expectation:** classify incompatibility; do not infer which owner should silently win.
- **Future remediation disposition:** route to rebase/migration/owner-qualified compatibility policy. No implementation authorized here.
- **Proof obligation:** later architecture must preserve enough revision/applicability evidence to distinguish compatible from incompatible stale projections.

### G2-CONFLICT-PATTERN-PRESENTATION-AUTHORITY-001 — presentation and authority claims diverge
- **Activation:** a rendered/hidden/disabled/personalized state and current authoritative policy/AGWS decision disagree.
- **Incompatible claims:** “user can/cannot act” implied by UI versus policy-qualified effective authority.
- **Local-validation gap:** UI can be internally correct for stale/cached context while authority has changed.
- **Detection:** pre-execution authority re-evaluation; runtime denied-action telemetry; audit comparison of rendered qualification versus actuation authority.
- **Owners:** Authorization/Policy, AGWS, UI projection.
- **Assessment:** CRITICAL; confidence strongly supported; detectability pre-execution/runtime; blast station/system; reversibility bounded before effect, potentially irreversible after unauthorized effect; immediate; misuse likely/adversarial; evidence current; false-positive risk low when authoritative decision is scoped/current.
- **Future remediation:** authoritative enforcement plus diagnostic surface refresh; pattern only, not a claimed current defect.
- **Proof obligation:** presentation can never be the sole enforcement boundary.

### G2-CONFLICT-PATTERN-HUMAN-INSTRUCTION-001 — individually valid rendered instructions are jointly incompatible with current work state
- **Activation:** generated help/instruction, workflow task text, policy notice or data-dependent guidance each remains locally valid but revisions/order/context make their prescribed actions mutually incompatible or impossible.
- **Incompatible claims/actions:** operator is told both to perform and not perform an action, to use an obsolete prerequisite, or to follow an order inconsistent with current process/policy/data state.
- **Local-validation gap:** each instruction can pass content/template validation independently; conflict emerges only after composition with current state and other instructions.
- **Detection:** static instruction dependency/condition analysis where possible; pre-execution current-state qualification; runtime conflict signal/operator escalation; post-effect audit.
- **Owners:** instruction semantic owner(s), Process/Workflow/Policy as applicable; UI owns faithful rendering only.
- **Assessment:** HIGH; confidence supported; detectability mixed; blast task→process; reversibility usually bounded before action, potentially migration/compensation after action; immediate/delayed; misuse accidental likely; evidence current adversarial inference; false-positive risk medium because alternative instructions may be intentionally conditional.
- **Future remediation:** route to owning process/policy/instruction set for precedence/context correction; never arbitrary UI ordering.
- **Proof obligation:** preserve instruction applicability/owner/revision/context so contradictory active instructions can be signalled without declaring every alternative a conflict.

### G2-CONFLICT-PATTERN-LOWCODE-MATERIALIZATION-001 — safe primitives compose into unauthorized semantic materialization
- **Activation:** low-code/AI composition combines valid fields, derived values, rules/conditions and actions so that projection becomes a write, promotion or domain invariant outside delegated authority.
- **Incompatible claims:** each primitive is allowed; the composition asserts new StoredFact/process/policy meaning or wider authority not owned by UI/composer.
- **Local-validation gap:** component and syntax checks validate primitives, not cumulative semantic authority/effect.
- **Detection:** design-time composition authority analysis + semantic-owner check + pre-execution authority/materialization qualification.
- **Owners:** UI/low-code proposal owner plus Data/Process/Formula/Authorization owner of the resulting semantic effect.
- **Assessment:** CRITICAL; confidence strongly supported; detectability static/pre-execution; blast system/enterprise; reversibility potentially migration-required; immediate/cumulative; misuse plausible/adversarial; evidence current; false-positive risk medium because explicitly delegated materialization can be legitimate.
- **Future remediation:** explicit proposal/adoption/materialization route under semantic owner; do not prohibit legitimate delegated composition globally.
- **Proof obligation:** prove cumulative composition cannot amplify authority or silently convert projection/DerivedValue into canonical truth.

## Cross-capability linkage

No new mandatory cluster is added. These findings deepen existing clusters:

- `Identity × Authorization × Station × AGWS × AI`: UI-002 and `PRESENTATION-AUTHORITY-001`.
- `Mathematical Expressions × Workflow × Data × UI/Form × Commercial/FinOps`: UI-007 and `LOWCODE-MATERIALIZATION-001`.
- `Process/Application × Workflow × Data/Schema`: UI-001/UI-005 and `PROJECTION-SEMANTICS-001`.
- `Workflow × Integration × Messaging × external mutation`: UI-003.
- Provider/Binding external realizations: UI-004/UI-006 provider/support qualification.

Because these are new material local/conflict findings during Full Pass 1, UI local streak is **0**. Existing mandatory-cluster streaks remain **0**; this visit does not count a new full pass.

## Exit status for this visit

- Local edge scenarios: **7** (`G2-EDGE-UI-001..007`).
- New reusable ConflictPatterns: **4**.
- New mandatory cluster: **none**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- UI local no-material streak: **0**.
- Full Pass 1 remains incomplete until all 28 canonical capabilities have been challenged.