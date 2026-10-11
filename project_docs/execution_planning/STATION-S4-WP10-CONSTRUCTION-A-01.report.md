# WP10 Construction A — TASK688
Base82d8036dab89262ac633df2a860e4e2b1a8cfbdd; Planning#1081 all five gates PASS.
Implemented strict reparent-node in existing owning structure API; only selected placement changes,
array order/subtree/identity/spans/text/properties preserved. Existing full codec validation admits
candidate before mutation; history no-op/branch/checkpoint/lifecycle reused, no public payload change.
121 editor cases PASS (114 inherited plus seven new risk-focused integration tests), production
build PASS. Tasks681/architecture/docs/diff PASS; final verify lint/typecheck PASS then known tsx
IPC EPERM. Own exact-head full connected/platform/frontend/browser proof required before merge.
Test-authoring finding: inherited depth32 cap governs JSON nesting, not graph ancestor count.
Initial boundary assertion was corrected to preserve deeper flat-graph compatibility and prove
actual compatible descendant-cycle rejection; no new graph-depth policy silently introduced.
Strict tuple annotation corrected before publication. No failing test/gate waived; no UI change.
Six allowed paths, one authoritative TASK commit. B/C/Review/Closure remain forecast.
