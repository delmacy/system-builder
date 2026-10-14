# FM-01 — Construction B: shared folder tree integration prototype

Date: 2026-10-13
Status: IMPLEMENTED / NOT YET TEST-REVIEWED
Predecessor: FM-01 Construction A in PR #1202

## Delivered

The real File Manager now offers an opt-in **Preview shared folder tree** toggle in its toolbar. When enabled, the folder sidebar projects actual workspace folders into the existing `NavigationTree` UI-core component, using canonical folder refs as IDs and passing the current File Manager folder as controlled selection. Selection calls the same existing `navigate` procedure that the original sidebar and breadcrumbs use.

The original sidebar remains the default and is available immediately when the toggle is switched off. Both modes consume the *same* `view.workspace` and have no additional persisted folder source. No edits were made to the workspace codec, storage key, revision semantics, or Core. This is a compatibility experiment, not the final navigation migration.

## Known behavior and follow-up

- `NavigationTree` currently owns its expansion set locally. Its tree is initially collapsed; expansion may not mirror the legacy sidebar or preserve expanded ancestors after navigation/breadcrumb switches. FM-02 must qualify or extend controlled expansion before replacing the original sidebar.
- The shared UI uses the existing NavigationTree's keyboard semantics and icon tokens. Complete nested treegroup semantics and keyboard-focus retention remain separate qualifications.
- The new control is a presentation-only test affordance. Do not present it as a production-ready alternate file system.

## End-of-WP acceptance, deferred as requested

FM-01 Test Review will execute the full product and browser suite together, covering both navigation modes, selected folder identity, up/breadcrumb actions, no workspace mutation from view changes, keyboard and 390px behavior. Only after corrections and exact-head CI may FM-01 be enclosed. Incremental commits are permitted before the integrated test review.
