# Station S4 WP15 — technical Workflow Studio
Date: 2026-10-11 UTC
Fresh main: d0f777fac47fd46cc70114026b9064a58551cbbc; WP14 closed via #1105.
Authority: Addendum015, ADR0009/0017 and Sprint policies.
Goal: a complete bounded local technical workflow authoring/revision/reopen journey.
WBS: selected states/edges/panels21.1.1, semantic/layout separation21.1.2, deterministic render21.1.3,
schema-aware authorship21.2.1/21.2.2, local validation21.2.3 and lossless revision/reopen21.3.1–21.3.3.
These are slices, not whole-item certification.

## Readiness and dependency graph
WP14 -> validated WP15 Planning -> explicitly authorized A -> fresh-main B -> Review -> Closure.
SystemDefinition schema exposes processes/states/initialState/transitions/actionRef; schema exports
are public but no full authoring engine or live owner API exists. Compiler normalizer is execution-only.
A supplies local draft adapter; it does not create a canonical Design/Core owner.
WP16 requires a separately verified owner command/query/currentness API, real transport and
browser -> API -> data -> response proof. Its absence does not block local WP15, and local success
must never be represented as Core integration or published/effective workflow.

## Sprint forecast
| Sprint | Outcome | Exit gate |
|---|---|---|
| Planning TASK712 | Addendum015, readiness/proof/risk contract, prepared A | Own complete CI and merge; no product edits |
| A TASK713 prepared/draft | Full envelope codec, local draft commands/history/currentness/materialization | Planning integrated plus explicit construction authorization; actual positive/negative predecessor proof |
| B forecast | Shared Explorer/diagram-table/Inspector, launcher/window, local retention and portable reopen | Actual A API; growing Chromium chain including all88 predecessors |
| C conditional | Only an indispensable admitted gap after fresh B evidence | Skip if package goal met |
| Integration and Review forecast | Independent regression, bounded C10 audit, trust/debt/readiness | Own full gates; no concealed missing features |
| Documentation and Closure forecast | Operations/contracts/WBS/risks/traceability/live pointer reconciled | Own full CI and merge; bounded closure only |

Five normal sprints; sixth only when C necessary. No future task IDs beyond prepared first A.
Only Planning committed. Preparing WP15 is not product construction authorization.

## Growing proof
Use actual full-envelope codec -> actual state/transition commands from two Tools -> immutable draft
history -> actual candidate materialization -> actual store/export/import -> fresh session -> same
workflow and unchanged unrelated fields/extensions/references -> revision comparison.
A covers create/import/add-process, duplicate IDs/states, dangling/unknown action refs, stale revision,
initial/referenced/last-state deletion, malformed/inert input, size/history bounds, cycles/self-loops,
failed validation/storage and no-op atomicity. B proves selection/Inspector/diagram convergence,
keyboard/narrow layout, dirty Cancel/Discard, history, rejected edits, save/reload/file round-trip,
unresolved upstream truth and visible disconnected/local state. Preserve all88 Chromium cases.
A cannot claim UI/C10 exit; B cannot claim real owner/Core integration.

## Risks and dispositions
R1 second truth: immutable one-session owner and one command path.
R2 metadata loss: validate complete schema/envelope; preserve all nonedited fields and order;
never serialize compiler projection. R3 semantic ownership: explicit unpublished candidate labels.
R4 stale writes: expected session revision and immutable retained tuples; no distributed CAS claim.
R5 forged references/extensions: inert strict compatibility admission; unresolved remains explicit.
R6 broad Studio claim: bounded evidence checklist at Review, research not authority.
R7 memory/render/history: declared caps, inclusive/max/overflow proofs and measured limits recorded.
Inherited WP14-L1/L2/L3/D1/D2 remain; no remote owner availability or universal quality promise.

## Validation and execution
Each TASK runs npm run verify. Construction also station:build, Windows/Ubuntu/frontend and growing
actual Chromium proof. Every triggered exact-head/current-base/heavy/handoff/browser workflow must
PASS before merge; no workflow/test weakening or unobserved local PASS.
One sprint branch, one authoritative commit/TASK, one PR/sprint; NEXT_WORK sole scheduler.
Unexpected L3 outside Addendum015, L4, required forbidden paths or unresolved failures stop construction.

## Authorized integrated execution update
Owner subsequently authorizes complete WP15 including eligible Review/Closure. A#1107 merged06accc2a55ba73dbabff2fe83c31953985d87aa8;
B#1108 mergedc5916b77d0eef611a3adf8872f435ad3ee93dcfa, each seven independent PASS workflows; B95 actual Chromium journeys1.7m.
B14th-path before-edit correction preserves larger unrelated workflows read-only while selected edit caps
remain. Existing schema/ADR/Core authority unchanged. TASK715 Review COMMITTED on six docs paths;
C unnecessary. Independent own gates control GO Closure. WP15 limits/debt explicit; WP16 forecast.

## Final package disposition
Review#1109 head00ae2e0a5b510d683924b7e669d29356479490fd merged0260f84350fbf3d9629ebb9bced910a1f382fa41 after five
independent PASS workflows and95 actual Chromium journeys2.1m; GO Documentation and Closure.
TASK716 COMMITTED on10 documentation paths; no new product behavior. Five standard sprints;
optional C unnecessary. Bounded WP15 CLOSED effective only on validated TASK716 integration.
WP15-L1/L2/L3/L4/D1/D2/D3 and inherited limits/debt remain; local unpublished Studio proof only.
No active WP15 or committed successor after closure; WP16 remains separately gated forecast.
