# TASK-652 — Station S4 WP3: Portable Composition Codec Readiness

State: PLANNED (not implemented)
Predecessor: WP2 closed at main@9768c06e; WP3 planning merged at main@864692c4.
Scope: proposed Construction A, bounded preparation only.

## Goal
Define and then implement a safe, versioned, portable **composition artifact** codec using existing Station composition graph/descriptor contracts, without writing to Station window preferences or Core. WP3's broader local persistence phase is not covered by this task.

## Readiness gate
- Inventory repository-wide resource/file extension, composition graph and serialization contracts before selecting extension or format.
- Distinguish source-defined catalog descriptors from user-supplied serialized graphs; never trust an imported descriptor or arbitrary executable component.
- State explicit file size/node count bounds, schema version migration policy, app/composition identity and revision policy.
- Record immutable validation and recovery rules, without replacing the current session on failure.
- Approve an Addendum governing external input and local storage before product code. Any change to shared contracts requires separate architecture review.

## Construction A test targets
- Valid deterministic round trip of existing admitted example and ButtonGroup graphs.
- Reject unknown schema versions, malformed/truncated JSON, oversized files, duplicate/unknown node references, illegal slots/span bounds, forged application identity, unexpected fields and unsafe object keys.
- Reject stale incompatible revision without overwriting a valid editor session.
- Test that the exported artifact does not contain UI preferences, session focus or provider secrets.
- Maintain WP2 browser regression and exact-head/current merge candidate CI.

## Delivery gates
Planning approval -> separately bounded codec implementation commit -> unit tests -> Chromium proof where relevant -> review/merge. Do not advertise durable Save/Open until an independent WP3 Construction B explicitly implements and proves it.
