# Station S4 WP3 Construction A Report 01

Date: 2026-10-10
TASK: TASK-653
Base: eaad7ef32a9eca4388b8efee9d6e51f236793d2b
State: IMPLEMENTED / PROVEN / INTEGRATED via #1046 at 1c39ee81

## Outcome
Pure existing station-editor package codec and app-local catalog adapter implement the ADR-0009 public envelope, strict payload/source compatibility, bounded UTF-8 bytes/nodes/depth/tokens, graph connectivity/cycles/single-slot occupancy, safe JSON copying and deterministic immutable re-emission. Optional inert metadata survives round-trip; unknown required extensions reject. No browser controls or persistence. Seven TASK-653 allowed paths only; no shared schema/ADR/settings/composition/workflow changes.

## Observed proof
node --import tsx --test tests/product/station-editor-artifact-codec.test.ts passed 8/8 on the final code, including invalid calendar timestamp rejection. Both installed catalog proofs call actual initializeEditorSession/applyEditorSessionMutation and reopen decoded graph. Synthetic source fixtures isolate node/token ceilings without claiming the installed three-node catalog supports structural authoring. Typecheck and lint passed in local execution before final docs/timestamp changes.

Declared npm run verify was invoked locally and reached test:unit, where tsx CLI failed with environment EPERM binding /tmp/tsx IPC socket; this is not reported as a passing verify. Focused tests use node --import tsx without CLI IPC. Station build completed successfully (compile/types/static generation/routes), before the bounded timestamp hardening; exact-head build Actions remain required for final integration. Local browser attempts did not establish proof: the initial run preceded build completion; the retry could not launch Chromium. CI browser proof remains mandatory. Full declared verify/build/browser evidence must be observed from exact-head Actions before merge. No local browser pass claimed.

## Review and successor
Validate all triggered exact-head/current-base CI, Windows/Ubuntu Station builds and Chromium regression. Keep this TASK commit authoritative; bounded fixes stay within declared paths. After validated A merge reconstruct fresh main and promote only Construction B with explicit file workflow/storage choice. Package Review and Closure remain forecast; WP3 is not closed.

## Integrated checkpoint
All seven A head workflows succeeded: browser 38075361958, handoff 38075361914, merge-candidate 38075361969, heavy 38075361941, frontend 38075361928, Windows/Ubuntu builds 38075361915 and exact-head verify 38075361994. Construction B #1047 now integrates the file/local journey. Original pending/successor instructions above describe the historical branch checkpoint, not current execution.
