# Next Work — Execute P4-CAPABILITY-RUNTIME-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Execute only `P4-CAPABILITY-RUNTIME-01` on `sprint/P4-CAPABILITY-RUNTIME-01`.

Dependency order:
1. TASK-079;
2. TASK-080 after TASK-079 validation;
3. TASK-081 after TASK-080 validation.

For every TASK, read its full `context_paths`, confirm allowed/forbidden paths, max_files, dependency and validation commands before editing.

## Exit

Run final `npm run verify`, produce `P4-CAPABILITY-RUNTIME-01.report.md`, open one PR to main and stop at Sprint Review.

Do not begin P4 Integration & Technical Debt Review without a new explicit instruction after this Sprint merges.
