# WP8 Construction A — TASK678
Planning#1071 integrated at168ef31af8e5d637a47f92880a58cf2f06a530ba; five workflows passed.
Implemented strict typed button properties, set/reset, private deep immutable copies, owning
projections and v4/minimum-version codec. No UI yet; no action/Core/architecture change.
Eight new API cases cover real catalog/projections/roundtrip, mixed history, no-ops/reset,
invalid/hostile/stale/foreign inputs, alias isolation, versions, forged history and checkpoints.
Legacy unknown-version assertions now use v5 under declared change control; v4 omission proven.
Local editor regression106/106 PASS. Lint/typecheck/build/task/architecture/docs pass.
Full npm run verify attempted; tsx IPC EPERM remains environmental; CI supplies observed full
verification. All triggered checks including inherited44 Chromium journeys required before merge.
Residual: workbench/retention equality/browser proof belongs to forecast B, not hidden in review.
