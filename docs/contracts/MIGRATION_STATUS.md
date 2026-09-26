# Contract provenance migration status

Date: 2026-09-26
Status: IN PROGRESS

This is migration bookkeeping, not an execution pointer. `docs/current/NEXT_WORK.md` remains the single live work pointer.

## Completed in current normalization pass

- documentation authority/lifecycle policy exists and defines a single live execution pointer;
- contract increment registry exists;
- `000-base` reconstructed conservatively from accepted repository authority;
- base provenance separated from contract prose;
- remaining `001+` reconstruction method and quarantine rules recorded;
- current handoff reconciled from stale `TASK-626 NEXT` to repository truth `TASK-626 RUNNING` after PR #943 integration.

## Remaining historical migration

- establish chronology and accepted provenance for post-base material scope families;
- materialize numbered addenda one at a time only when evidence is sufficient;
- classify implementation detail that does not represent a distinct scope admission;
- keep Generation 3/4 research non-authoritative unless explicitly promoted;
- reconcile any stale high-confusion documentation discovered during each provenance pass.

## Merge coordination

Documentation normalization may proceed on its branch while M2 product work runs. Do not advance `main` with this documentation branch while a product merge-candidate is queued/in-progress or ready for integration if doing so would invalidate that candidate. Rebase/reconcile from fresh main before eventual documentation integration.
