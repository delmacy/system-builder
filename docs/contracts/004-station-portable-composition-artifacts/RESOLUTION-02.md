# Station composition files and local retention — resolution 02

Date: 2026-10-10
State: owner-authorized bounded Construction B after validated Construction A #1046
Authority: Addendum 004, RESOLUTION-01, explicit owner authorization to complete WP3

## Provider and trust boundary
Admit origin-local browser storage as a replaceable adapter for one fully validated encoded composition artifact per installed catalog entry. Keys use a separate `station:composition-artifact:v1:` namespace and the source composition identity. Never store artifacts in StationPresentationState/window preferences. No server, Core or cross-device authority. No automatic load/save: Save locally and Open saved are explicit user actions. Closing/reloading starts the existing fresh session until Open saved is requested. Browser storage may be cleared, quota-denied or origin-specific; portable downloaded files provide the user-controlled copy.

The provider interface is getItem/setItem only; store the entire validated public envelope in one setItem. Failure preserves prior stored text and editing session. Existing content must match the expected text from the last explicit Open saved/Save locally before replacement, or return conflict and require reopening. This detects stale reads but is not a cross-tab transactional compare-and-swap; multi-tab concurrent writers are an explicit limitation, not proven synchronization.

## Explicit file workflow
Save As file creates a new caller-supplied UUID URI/version 1.0.0/provenance and requests a JSON download with `.composition.json` suffix. It includes the current applied draft, not unapplied text fields; downloading does not clean the editor draft or prove a disk-save receipt. Open file uses File.size before reading, then the proven codec and installed registry. Failed reads/size/version/schema/identity/revision/source validation never replace a session or saved artifact. Filename/MIME do not confer trust.

Dirty replacement by Open file or Open saved requires explicit Cancel or Discard changes and open file. Cancellation preserves draft, selection and fields and returns focus to the initiating control. Successful replacement initializes the real editor session atomically from validated data, preserving a valid current selection only when its node exists in the same composition; otherwise selection clears. Pending replacement is re-confirmed against current draft state, and out-of-order file reads cannot replace a newer session.

## Identity and revisions
Saving an unchanged accepted artifact preserves its identity/version/provenance and inert extensions. Saving changed graph meaning under that artifact increments SemVer patch in the caller workflow, records a predecessor identity in provenance inputs and supplies new UTC operation time. The codec remains pure. Save As creates independent artifact identity. Catalog baseRevision remains the installed numeric revision and is not the file version. No hidden migrations.

## Exit proof and limits
Extend the existing real Chromium suite through edit -> Save locally -> reload -> Open saved; actual download -> Open file in a fresh context; edit/re-save/re-open with version/extension retention; dirty cancel/confirm, corrupt input, storage denial/quota, stale local content, oversize/read failure and independent catalog keys. Keep all twelve WP2 tests. No network upload, automatic saving, structural authoring, File Manager, .process, multi-tab transaction, filesystem receipt or deployment is claimed.
