# Current Risks

Date: 2026-10-11 UTC

Horizon note: older Station review/closure gate narratives are historical evidence; the WP7 disposition below controls the bounded Station horizon after validated closure integration. R1–R12 retain older P13 risk evidence; their task/sprint directives are historical context and do not select current work. No old risk/debt closure is implied. NEXT_WORK is the sole execution pointer.

This register tracks risks that are materially current for the integrated repository horizon. Historical bootstrap/AgentFactory risks belong in historical evidence, not in this current-state document.

## R1 — Authentication/authorization boundary collapse

P13 Package 02 introduces Runtime identity/auth/session execution before authorization execution. A successful authentication must never be interpreted as authorization. Mitigation: keep Construction A limited to WBS 13.2.1, fail closed, and require explicit later authorization semantics/proof.

## R2 — Identity or auth binding fails open

Unknown/disabled identity, malformed identity state, missing/incompatible provider binding, or invalid/expired session could accidentally produce an actor context. Mitigation: deterministic negative-path tests and fail-closed activation/request behavior.

## R3 — Secret/value leakage into durable evidence

Provider credentials, resolved values, session secrets/tokens or resolved endpoints could leak into Compiler artifacts, release/deploy evidence, logs or immutable records. Mitigation: preserve reference-only EnvironmentProfile/SecretResolver boundaries and test durable artifacts for absence of resolved sensitive values.

## R4 — Authentication contract expands beyond bounded L3 authority

TASK-231 authorizes only the minimum additive backward-compatible SystemDefinition identity/auth-provider/session semantics. A second shared-contract family, mandatory provider-specific IAM topology or ownership change would exceed that authority. Mitigation: stop and use explicit change control; L4 changes require ADR.

## R5 — Runtime autonomy regression

Identity/session work could reintroduce ordinary Runtime dependence on Builder or Observe. Mitigation: preserve Runtime autonomous operation and architecture dependency gates; external bindings must remain deployment/runtime concerns within accepted boundaries.

## R6 — Forecast scope pulled into committed construction

Authorization, roles/permissions/policies, generated views/forms, Construction C, package review/closure or P13-PACKAGE-03 could be absorbed prematurely into Construction A. Mitigation: execute only committed TASK-231..239 and revalidate fresh `main` before promoting successors.

## R7 — Carried Runtime debt obscured by new package work

`TD-P13-01..04` remain real debt from P13 Package 01, including job overlap/retry/idempotency, HTTP bounds, file hardening and generated Runtime maintainability. Mitigation: preserve explicit debt traceability and do not silently claim it closed or absorb it without WBS/dependency authority.

## R8 — Documentation/state authority drift

Historical bootstrap ledgers, handoffs or hosted-automation documents can contradict current repository memory and local-first execution policy. Mitigation: classify historical documents explicitly, keep `docs/current` limited to current truth, and resolve contradictory authority before execution.

## R9 — Documentation without enforcement

Narrative rules alone can drift from implementation. Mitigation: encode enforceable architecture/security/scope rules in deterministic checks where practical and require exact-head CI/review evidence at integration boundaries.

## R10 — Architecture overdesign and lock-in regression

Suite vision or convenient provider coupling could expand P13 beyond the next integrated proof or reintroduce lock-in. Mitigation: architecture only expensive-to-change boundaries, prefer additive/provider-neutral contracts, and implement only approved WBS/Work Package scope.

## R11 — Provider economics and operational observability remain incomplete

Provider cost/usage and some production-hardening signals may remain unavailable or nullable. Mitigation: record only authoritative observations; do not estimate facts or convert missing telemetry into false guarantees.

## R12 — Narrative repository memory can lag a just-completed gate

Repository-memory documents are intentionally reconciled at defined Sprint/package transitions rather than rewritten by every low-level action. Mitigation: after accepted integration, reconstruct fresh `main` and reconcile `PROJECT_STATE`, `CURRENT_MILESTONE` and `NEXT_WORK` before successor materialization/execution when policy requires it.

## Station S4 WP3 — current scoped dispositions

WP3 bounded delivery is CLOSED through #1049 after integrated codec/file/local-store/review proof #1046/#1047/#1048. No bounded goal blocker observed. Browser-native origin storage can be denied, quota-limited or cleared (WP3-L1); explicit portable files are the independent retained copy. Expected stored text prevents stale replacement but is not a cross-tab transaction (WP3-L2). Requested download is not proof of a filesystem receipt (WP3-L3).

Nonblocking backlog WP3-D1: corrupted/existing local slots are conservatively preserved; export current applied draft to a portable file when local recovery cannot open valid data. WP3-D2: synchronous bounded codec/storage/provenance growth needs quantitative proof before larger catalogs; 1 MiB/depth/node/token gates reject safely and no latency guarantee is claimed. Inherited minimized-mounted editor memory lifetime is unchanged. Structural authoring/File Manager/.process/Core/server/sync/deploy remain future admitted scope, not current defects or automatic successors. Detailed classifications: project_docs/execution_planning/STATION-S4-WP3-INTEGRATION-REVIEW-01.report.md.

## Station S4 WP4 bounded edit-history review — 2026-10-10
WP4-L1: ephemeral 50-entry history resets on successful checkpoint/open/reload/close; keep portable files for retention. WP4-L2: native text undo remains separate and unapplied fields/pending replacement block graph history without dropping input. Accepted product limits, not persistence promises.
WP4-D1: generated Playwright report JavaScript can pollute a later local repository lint scan; clean only disposable outputs. Ignored-output configuration improvement is a nonblocking backlog item outside this package's allowed paths. WP4-D2: whole-graph snapshot/validation cost is bounded for installed three-node examples; measure/revalidate before future structural or large-graph scope. No latency/universal accessibility certification.
A #1051 and B #1052 passed seven workflows, Windows/Ubuntu and actual Chromium proof (21 and 29 cases respectively). Optional C not necessary. WP3 residuals and unrelated historical debts remain unchanged; Package Review/Closure gates still control declaration.

## WP4 closure disposition
A/B/review integrated and bounded goal proven; WP4 closes only when Documentation & Closure validates/integrates. All WP4-L1/L2/D1/D2 and WP3 dispositions above remain explicit nonblocking limits/backlog. No active WP4 work remains after validated closure merge; no successor scope is inferred from historical tokens.

## Station S4 WP5 package review — 2026-10-11 UTC
Construction A/B integrated through #1056/#1057; B has seven passing workflows and 37 actual browser journeys. No bounded-goal blocker observed; optional C is not promoted. WP5-L1: installed catalog, typed slots, fixed root and sibling-only reorder with existing caps. WP5-L2: changed structural topology/order emits composition payload v2 and requires a v2 reader; original source topology v1 remains supported. WP5-D1: max-bound whole-snapshot validation cost was measured (undo approximately 133–236 ms across the sampled 256-node shapes) and remains optimization debt before wider catalogs, without latency guarantee. WP4-D2 gains measurement evidence, not a claim of optimization. All other inherited WP3/WP4 and historical debt remains. Review/closure exact-head gates control package closure; local execution is offline on resumption and CI provides observed full verification.

## WP5 closure disposition
Review #1058 integrated with five passing workflows and 37 actual Chromium cases; bounded goal has no observed blocker. TASK-666 reconciles delivery metadata/operations/WBS/current pointer and closes WP5 only upon its independently validated merge. WP5-L1/L2/D1, other WP3/WP4 limits and unrelated historical debt remain nonblocking and explicit; no latency/accessibility certification or wider catalog claim. No active WP5 work or committed successor remains after validated closure. Future optimization and wider-authoring scope require fresh planning/admission.

## Station S4 WP6 package review — 2026-10-11 UTC
A #1061/B #1062 integrated with 89 editor tests and actual 37-journey regression; A has seven passing workflows/Windows-Ubuntu/frontend quality, B five. Paired same-environment 30-sample/three-batch max-bound warm Undo median improved 29.86–38.13x and Redo 18.99–21.85x; full comparison/p95/allocation observations in B report. WP5-D1 is mitigated for tested trusted warm histories, without broader catalog readiness or portable latency guarantee.
WP6-L1: mutable/caller histories, custom/changed registry contexts and initial source/current graph retain full validation cost; cold max-bound copies still approximately 129–231 ms. WP6-L2: unchanged ephemeral 50-entry/256-node/data caps and no cross-session/persistent validation authority. WP6-D1: wider catalog/token-heavy/long-session/cold-path and retained-memory profiling remains a nonblocking future requirement; heap allocation deltas are not leak/retention certification. All inherited limits/debts remain. Review and closure own exact-head gates still govern declaration; no WP7/new scope is promoted.

## WP6 closure disposition — current horizon
Review #1063 integrated with five passing workflows and 37 actual Chromium cases; admitted maintenance goal met. TASK-671 reconciles operational/WBS/contract-delivery/report/current-pointer evidence and closes WP6 only on its independently validated merge. No active WP6 work or committed successor remains after that integration.
WP5-D1 mitigated for tested warm installed/max-bound histories; current/caller data still receives full proof. WP6-L1/L2/D1 remain explicit nonblocking limits/future profiling: cold/custom/mutable context work, unchanged caps/lifecycle and wider-token/catalog/long-session retained-memory measurement. Existing WP3/WP4/WP5 and unrelated historical debt remains. No portable performance/retained-memory/accessibility certification, larger catalog or WP7 promotion.

## Station S4 WP7 bounded text review — 2026-10-11 UTC
Planning#1065/A#1066/B#1067 integrated; B seven workflows PASS,44 actual Chromium cases39.8s,98 editor tests. Bounded text goal met; optional C not necessary. WP7-L1: only two installed button identities, non-root plain display text1–256 Unicode code points; fixed-grid preview uses ellipsis with full title/accessible name. WP7-L2: text exports payloadv3; old readers reject it explicitly, current readers preservev1/v2/v3. Existing history/caps/local retention limits remain. WP7-D1: broader property/catalog design and inherited token-heavy/retained-memory/long-session profiling require new planning; no latency/universal accessibility certification. All inherited WP3–WP6 and unrelated historical debt remains. Review/Closure own final-head gates still govern closure; no successor promoted.

## WP7 closure disposition — current bounded horizon
Review#1068 integrated with five passing workflows and44 Chromium cases34.1s; admitted text goal met. TASK-676 reconciles12 exact documentation paths and closes WP7 only on independent passing integration. No active WP7 task or committed successor remains after that integration. WP7-L1/L2/D1 and all inherited WP3–WP6/unrelated historical debt remain nonblocking limits/future planning; old readers rejectv3, no broad editor/catalog/retained-memory/latency/accessibility certification. NEXT_WORK remains the sole scheduler.

## Station WP8 bounded properties residuals — 2026-10-11 UTC
- WP8-L1: only two properties of installed buttons; general schema/property/catalog authoring remains future admitted scope.
- WP8-L2: Chromium keyboard/focus/narrow/shell proof does not establish universal screen-reader or cross-browser certification.
- WP8-D1: nested immutable copies preserve history safety; long-session memory/broad-catalog cost unprofiled, inherited WP6 debt retained.
- B procedure helper/import failure briefly preceded durable manifest creation; reconciled before publication, no extra scope. Use fail-closed dependent commands.

WP8 closure disposition: no blocker within admitted two-field goal; WP8-L1/L2/D1 and all inherited debt retained. No automatic WP9 or broader scope.

## WP9 bounded reusable catalog review — 2026-10-11 UTC
WP9-L1: exactly three installed compositions, two new layouts and source-copy installation.
Template subtree insertion, user/remote catalog authoring and reparenting remain separately gated.
WP9-L2:55 Chromium journeys, keyboard/narrow/window and frontend quality proof are bounded;
no universal cross-browser/screen-reader/accessibility or broad catalogue certification.
WP9-D1: five-node source probe passes; wider catalogs/cold/max-bound/token-heavy/long-session
retained-memory profiling remains future work. Existing WP6/WP8 debt and data/history limits remain.
No blocker within Addendum009 goal; optional C not promoted. Closure still independently gated.

## WP9 closure disposition
Admitted goal reviewed with no blocker; five sprints, C unnecessary. TASK686 closure remains
conditional on own complete CI and merge. WP9-L1/L2/D1 and inherited WP3–WP8/unrelated debt retained.
No active WP9 task or committed successor remains after validated closure. WP10 requires fresh
Planning/admission for reparenting; it is not admitted by this closure or general EAP forecast.

## WP10 bounded compatible movement review — 2026-10-11 UTC
WP10-L1: existing installed composition only, existing compatible containers/slots, fixed source
root and graph array order. No cross-composition copy, free drag or template insertion.
WP10-L2: responsive fixed-span nested preview can clip undersized children; full labels remain in
Inspector/Layers/title. This inherited geometry constraint is not a new resizing/layout promise.
WP10-D1: whole-graph admission and bounded50-entry snapshots reuse existing caps/costs; broader
catalog/token-heavy/cold/max-bound/long-session retained-memory profiling remains unproven.
61 actual Chromium journeys include keyboard/narrow/window/retention and a real short recording;
no universal cross-browser/screen-reader or production latency certification. All WP3–WP9 and
unrelated debt retained. Review own gates control GO Closure. No bounded-goal blocker observed.
A testing finding: depth32 limits JSON nesting, not flat graph ancestor count; node cap256 governs
graph size and full validation rejects cycles. Closure reconciles misleading operational wording.
Unmerged B trial had two inherited fixed20-Tab helper failures; six new journeys passed. Final B
uses DOM-bounded real traversal and all61 pass, with no skip/timeout/workflow weakening.

## WP10 closure disposition
Review#1084 independently passed and integrated; no blocker inside admitted compatible movement
goal. Five sprints match forecast, C unnecessary. Closure becomes effective only on TASK691's own
complete CI/merge. WP10-L1/L2/D1 and all inherited WP3–WP9/unrelated limits/debt remain explicit.
No active WP10 work or committed successor after that merge. Future WP11 planning must admit its
own scope and retention/ownership contracts; no remote catalog/File Manager/Core/server promotion.

## WP11 bounded workspace review — 2026-10-11 UTC
WP11-L1: browser-origin retention can be cleared/denied/quota-limited. Workspace16 folders/48 files/
8 folder levels/4MiB remains bounded; each composition retains existing codec/node/token limits.
Named files append independent copies; rename/move/delete/overwrite and Git-like history unimplemented.
WP11-L2: native setItem is atomic with best-effort expected text/re-read detection, not cross-tab CAS.
Save copy preserves current draft/history; explicit editor opening still uses Cancel/Discard protection.
Window layout may restore File Manager and read workspace metadata; no graph opens without user action.
WP11-D1: whole workspace admission invokes actual codec for each file; max-bound/cold/long-session/
retained-memory and wider browser/accessibility profiling remains unproven. No latency/certification.
Corrupted workspace remains untouched; failed refresh preserves previous visible snapshot and blocks
mutation/open until valid refresh. Portable files provide independent retention, no automatic recovery.
All WP3–WP10/unrelated residuals retained. No bounded-goal blocker after integrated actual browser proof.

## WP11 closure disposition
WP11-L1/L2/D1 remain accepted limitations, not resolved by documentation. Validated closure
adds no new product behavior, storage guarantee, profiling or generic provider certification.
Inherited window restoration may read File Manager metadata, but graph opening remains explicit.
No bounded-goal blocker after actual68 journeys and independent Review; own closure gated.

## Station S4 WP12 bounded revision review — 2026-10-11 UTC
WP12-L1: revisions consume unchanged48-file/4MiB origin-local workspace and existing1MiB/per-file
codec caps; browser quota/denial/clearing and provenance growth remain. Export independent files.
WP12-L2: retention head follows same-ID/type snapshot order, not greatest SemVer/publication. Imports
can select older versions; stable patch allocation and duplicate-tuple rejection require explicit
refresh/reselection. No rename/delete/overwrite/publication/branch semantics.
WP12-L3: expected snapshot/head/re-read is best-effort, not cross-tab CAS. Conflict preserves draft
and history; refreshed deliberate retry may retain the user's whole applied graph after explicit
comparison. Both prior records stay immutable; no auto-merge or synchronization guarantee.
WP12-D1: whole-workspace codec and full-envelope diff with512-path cap bound data/output but do not
prove max-bound/cold/long-session/retained-memory/latency or universal browser/accessibility quality.
All inherited WP3–WP11/unrelated residuals retained; WP11 independent copies now have an explicitly
admitted optional revision operation, without resolving its storage/ownership limitations.
No bounded-goal blocker after integrated75 actual Chromium journeys/seven construction workflows.
C unnecessary, Review own gates control GO Closure; no WP13 or whole WBS/H2/S4 promotion.

## WP12 closure disposition
Independent Review#1094 integrated with five PASS workflows and75 actual Chromium journeys1.7m.
No blocker inside admitted revision/diff/explicit-conflict goal; five sprints, optional C unnecessary.
TASK701 reconciles11 exact documentation paths, adds no behavior, and closes bounded WP12 only on
its own complete CI/merge. After integration no active WP12 work or committed successor remains.
WP12-L1/L2/L3/D1 and all inherited storage/history/performance/accessibility/unrelated residuals
remain explicit nonblocking limits/debt. Older imported retention heads can block duplicate patch
allocation; explicit copy/export is available, no silent version jump/rebase. No larger capacities,
CAS/auto-merge/provider/latency or whole WBS/H2/S4 certification. WP13 requires fresh Planning,
semantic owners/contracts and admission; outside current package execution authorization.

## Station S4 WP13 bounded process context review — 2026-10-11 UTC
WP13-L1: process reference syntax is canonical identity, not semantic availability. No live process
owner service is connected; unavailable is explicit. Available responses must match the full anchor.
Manifest portability requires separately retained pinned composition parts; no monolithic .process,
semantic business authoring, generic multiview Studio or whole WBS/H3/S4 certification.
WP13-L2: one origin-local context slot;1MiB/depth32/16views/ref256/title80 caps. Storage may clear,
deny or exhaust quota. Expected text/re-read is best-effort detection, not transactional cross-tab CAS.
Same identity/version with different content rejects; a distinct new identity permits explicit replacement.
WP13-L3: missing/stale/invalid/unavailable projections never silently choose the newest revision.
Explicit opening re-resolves the exact tuple and uses existing Cancel/Discard editor protection.
WP13-D1: bounded codec/deep-copy and full workspace admission repeat per view. Max-bound/cold/
long-session retained-memory/latency and universal browser/accessibility profiling remain unproven.
Small duplicated inert-envelope admission helpers remain scoped; no shared-contract refactor implied.
All inherited WP3–WP12/unrelated residuals retained. No bounded-goal blocker after B's seven PASS
workflows and82 actual Chromium journeys. C unnecessary; own Review gates control GO Closure.

## WP13 closure disposition
Independent Review#1099 integrated with five PASS workflows and82 actual Chromium journeys1.7m.
No blocker inside admitted reference-context goal; five sprints, C unnecessary. TASK706 reconciles
ten exact documentation paths and adds no behavior. Closure effective only on its own complete CI/merge.
WP13-L1/L2/L3/D1 and all inherited residuals remain explicit accepted limits/debt. No live semantic
service, monolithic process bundle, broader Studio/Core authority or storage/performance certification.
After validated integration no active WP13 or committed successor. WP14 needs fresh Planning and
projection/capability/selection contracts; remaining WP14–WP16 forecast does not authorize execution.
