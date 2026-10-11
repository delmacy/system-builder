# WP6 Construction A Report 01 — TASK-668
Date: 2026-10-11 UTC
Base: main@0fbd63a3966230924f20191ef7ed90bba55ae9d6, Planning #1060
State: implemented on Sprint branch; exact-head validation and integration required
Owner explicitly authorizes WP6 through closure. Four exact TASK paths, separate materialization and one authoritative TASK commit.

## Delivered
Private weak ownership sets identify history wrappers and only graph snapshots normalized by successful internal edit/restore APIs. Input createEditorHistory graphs, copied wrappers and arbitrary caller snapshots never receive ownership merely through freezing or identity. Cache stores at most one validation context per owned graph using weak keys; no public shape/serialization field changes or strong global snapshot collection.
Current session/current graph still receive full draft/strict codec validation on every call. Retained owned snapshots reuse a successful full verdict only within an owned wrapper and matching source/base/baseline/session/registry content and revision-limit context. Registry membership/descriptor content is inspected; exact registry prototype/methods required. Mutable/accessor/symbol-bearing or non-plain authority data, custom registries/subclasses/method replacements bypass reuse. Deep immutable data checked without freezing caller data. Full legacy validation remains fallback.
No schema/envelope/public API/dependency/caps/lifecycle change. Unknown fields validated before normalization can drop them. Initial source snapshots remain on full validation; internally generated snapshot ownership alone never creates a certificate without full validation.

## Observed local evidence
83/83 editor product tests passed including eight new warm convergence, caller-copy mutation, unknown string/symbol, accessor/nested mutation, method-replaced past-only component, stateful registry, frozen-registry private membership and session/context/overflow trust cases. All 75 predecessor editor tests retained.
Station production build passed (/ and /component-editor). npm run verify passed lint/typecheck then stopped at environmental tsx IPC listen EPERM; not a full pass. Direct task validation (661 specs), architecture and docs passed. Build output moved to a temporary directory before lint, preserving generated proof without polluting source scans. Local browser not run.
All triggered exact-head/current-base/heavy/handoff/browser/Windows-Ubuntu/frontend-quality checks and actual 37 Chromium predecessor journeys must pass before merge. No timing gain claimed yet: B must check in the reproducible protocol and compare paired max-bound runs.

## Successor/risk
B remains forecast until A validates/integrates and fresh main is reconstructed. It must prove max-bound lifecycle/authority recovery and measure cold/warm undo/redo/changed/rejected/checkpoint behavior against pre-optimization main on the same runtime/machine. Private weak caches are an optimization, never new admission authority. No goal/scope expansion or full editor claim.

## Validated integration
Head c4232c481e53689de547b6cc5c338e71cb4482a0 integrated through #1061 at dc4e7b80fa1c1f0514fc052a0176d045ce0388e0. All seven workflows passed: deterministic 38105739415, merge candidate 38105739437, heavy 38105739475, handoff 38105739524, browser 38105739440, cross-platform 38105739424, frontend quality 38105739452. Actual Chromium 37/37 in 34.7 s. B only now promoted; quantitative improvement remains unclaimed until its observed proof.
