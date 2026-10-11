# Station S4 WP6 — Package Integration & Review Report 01
Date: 2026-10-11 UTC
Sprint: STATION-S4-WP6-INTEGRATION-REVIEW-01
Authoritative task: TASK-670
Base: 9d0221e54b043b1ad928d7797fc1d7ca26a1f76c (validated B #1062)
State: review complete on Sprint branch; closure GO effective only after this review's passing checks and integration.

## Outcome and actual-versus-forecast
The bounded maintenance goal is met: repeated retained-snapshot work is reduced while public behavior and fail-closed caller/context validation remain. Planning #1060, A #1061 and B #1062 integrated in dependency order. Optional C is not promoted: every paired max-bound warm Undo/Redo median exceeds the 2x target; no missing admitted feature/trust proof was found. Standard five-Sprint cadence remains Planning/A/B/Review/Closure; no effort-hour estimate or broader catalog promotion.
Closure GO, conditional on this review's own exact-head/current-base/heavy/handoff/browser gates and validated merge. No WP7 or new scope is authorized by this review.

## Trust/ownership audit
Private weak ownership marks only module-produced history wrappers and graphs normalized by successful internal edit/restore paths. createEditorHistory input graphs are not certified merely by caller identity/freezing. Ownership alone is not a verdict: original snapshot receives strict codec and draft-boundary validation before a context certificate can be stored.
Current session and graph are fully validated on every operation. Shape and combined 50-entry bound checks precede reuse. An owned immutable snapshot can reuse its successful verdict only inside an owned wrapper under identical registry object/membership/descriptor content, source/baseline/base identity and serialized session context including revision-limit state.
Only exact default registry prototype and captured methods qualify; custom/stateful/subclass/replaced methods take full validation. Deep immutable plain data descriptors are checked without invoking accessors or freezing input. Mutable authority data, caller wrapper copies, symbols/accessors/unknown fields never manufacture a reusable verdict. Context changes invalidate or bypass it.
Weak keys and one certificate per owned graph avoid a strong global snapshot collection; no public fields or serialized authority added. Heap deltas in the benchmark are allocations with possible GC, not retained-memory/leak proof. Future memory profiling remains explicit; no memory improvement claim.
Tests cover warmed past-only descriptors under method/prototype replacement and successful recovery, oldest non-target snapshot mutation, frozen caller objects, mutable nested/session data, registry membership changes and full-budget lifecycle. No loosened codec/admission/budget assertion or hidden product correction found.

## Architecture/compatibility/dependencies
Compared pre-optimization main 0fbd63a3 with integrated A: identical blob hashes for ADR-0009, public envelope schema, package.json/lock, EditorSession, draft boundary, codec, structural commands, artifact store and registry. B changes only benchmark/proof/report/task. No L3/L4 or addendum replacement, new dependency, provider/Core/server authority, public shape, artifact version or persistence mutation.
v1/v2 structural compatibility, source/root/slot/cardinality/byte/token/depth bounds, baseline dirty/revision semantics, native text undo and checkpoint/window selection lifecycle remain existing Addendum 006 behavior. No general ComponentEditor/WBS21 completion.

## Observed regression and CI
Planning #1060 head ff9784f6399f0901bbf9f862908aff32a76664af, merge 0fbd63a3966230924f20191ef7ed90bba55ae9d6: five workflows and actual 37 Chromium cases in 37.1 s.
A #1061 head c4232c481e53689de547b6cc5c338e71cb4482a0, merge dc4e7b80fa1c1f0514fc052a0176d045ce0388e0: seven workflows PASS — deterministic 38105739415, merge candidate 38105739437, heavy 38105739475, handoff 38105739524, browser 38105739440, cross-platform 38105739424, frontend quality 38105739452. Windows/Ubuntu production proof and actual Chromium 37/37 in 34.7 s, job 114370780009. Local editor tests 83/83 including eight trust cases.
B #1062 head 7b84e4bc95c4db3fb1389e0c6ea2a3fad1770042, merge 9d0221e54b043b1ad928d7797fc1d7ca26a1f76c: five workflows PASS — deterministic 38106506621, merge candidate 38106506628, heavy 38106506651, handoff 38106506615, browser 38106506641. Actual Chromium 37/37 in 34.5 s, job 114373066973. Local editor tests 89/89, six additional bound/authority/checkpoint/codec cases; production build and lint/types/direct task/architecture/docs passed.
All 75 predecessor editor product tests and 37 browser journeys retained. UI unchanged; predecessor functional keyboard/selection/window/file/history proof applies, without universal accessibility certification.
Local full npm run verify remains blocked after passing lint/types by environmental tsx IPC listen EPERM; direct workers and connected full CI are separately observed. No local browser, manual screenshot review or unobserved full local pass claimed. Review must independently pass triggered workflows before merge.

## Paired performance assessment
Versioned benchmark, same Linux x64/Node v24.19.0/AMD EPYC 9V74 environment, sequential baseline/optimized processes; five warmups, 30 samples per operation in each of three batches. Same fixture SHA-256/protocol/count fields matched across twelve paired rows. Actual APIs build 50 snapshots; setup/copy creation excluded, assertions included, nearest-rank median/p95. Baseline algorithm from pre-optimization main with imports directed to unchanged predecessor modules.
Max 256 nodes: undo median 125.364–229.787 ms -> 4.091–6.166 ms (29.86–38.13x); redo 125.244–228.868 ms -> 6.379–10.478 ms (18.99–21.85x). Repeatable target achieved in every batch; both actual three-node installed compositions also improved. Complete 72 operation rows, p95 and heap observations are retained in B report; no cherry-picked single timing.
Cold caller-copy max-bound undo remains approximately 129–231 ms, comparable to baseline 130–237 ms; checkpoints essentially unchanged. These unchanged full-validation paths are intentional trust behavior. Results are this measured environment/workload, not browser-event latency or a portable production guarantee.

## Residuals and decision
WP5-D1 mitigated for tested trusted warm installed/max-bound histories, not broad-catalog readiness.
WP6-L1: caller histories, mutable data and non-default/changing registries deliberately retain full validation cost; first source snapshots/current graph still require full proof.
WP6-L2: ephemeral 50-entry/256-node and existing data caps remain; no persistent/cross-session certificate/history or public latency promise.
WP6-D1: larger catalog/token-heavy/long-session cold-path and retained-memory profiling must be revalidated before wider scope. Allocation deltas alone cannot close it.
Inherited WP3 origin/quota/stale-write/download-receipt and WP4 native text/ephemeral history limits, WP5 fixed-root/typed-slot/sibling/v2-reader limits and unrelated debt remain.
No bounded-goal blocker or authority weakening found. GO for Documentation & Closure after this review validates/integrates; documentation only, no implicit feature/optimization successor.

## Validated review integration
TASK-670 head f6299b7988accad12aa12434454e967ce130c783 integrated via #1063 at 640dec55ec3eab7e624b7d71e534ded6e1690607. Five exact-head workflows PASS: handoff 38106843012, heavy 38106842990, browser 38106843049, merge candidate 38106842996, deterministic 38106843018. Actual Chromium 37/37 in 33.8 s, job 114374061905. Closure GO now effective; only TASK-671 promoted after fresh-main revalidation. All residual limits above remain.
