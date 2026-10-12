# Shared Studios foundation — builder operations
Bounded STUDIOS-WP01, two installed areas: Process Context and Workflow. References and technical candidate meaning retain their existing owners.
## Open
Update the repository and installed dependencies normally, then run `npm run station:dev`. Open `http://localhost:3000/` and choose **Studios** in the applications launcher, or use `http://localhost:3000/studios`.
Standalone existing routes /process-context and /workflow-studio remain available.
## Navigate and inspect
Use Process Context or Workflow buttons (keyboard Tab then Enter/Space). The inactive area stays mounted; applied draft, selection, pending fields, history and existing connection remain owned by that area. Shared Inspector displays only the active area's qualified artifact/version/context/selection and draft summary. All rows are read-only.
Process Context uses canonical process/revision references; Workflow uses a local technical process ID inside SystemDefinition. Switching never asserts that these identities are equal or rewrites a domain document.
Use existing model creator/import/retained revision and Save/Export controls. A referenced composition opens through the existing guarded Composition Editor, either a Station window or embedded standalone handoff.
## Owner journey
Workflow's **Design owner connection** remains explicit. Start the previously qualified WP16 local Design profile, supply configured endpoint/session/context/actor and ephemeral credential in the panel. The actual owner independently authorizes the action. Connect, send a clean candidate, require verified exact readback; exact revision open still uses dirty Cancel/Discard. Denied/unknown/disconnected never certifies retention/publication; use existing result recovery/identical retry as appropriate.
A registry/Inspector/connected label never grants access. No business approval or publication is added. Process Context's semantic owner remains unavailable in this bounded reference-only area.
## Failure and lifecycle
Switch areas or minimize/restore: draft and pending forms remain in memory. Owner outage: draft remains, deliberate reconnect/readback when owner returns.
Explicit window close or page reload unmounts the workbench; unsaved recovery is not promised. Reopen previously retained local/owner revisions explicitly using each model's existing controls. Keep required work with existing Save/Export before closing.
Malformed/unknown/foreign/stale shared snapshots never mutate the owning draft. Over512-unit summary strings produce **Shared snapshot unavailable**; inspect the original workbench rather than treating an older summary as current.
## Qualified limits and evidence
Two installed areas, presentation-only shared summary, memory retained while navigating. Credentials stay in existing owner connection session and never enter shared snapshots/Inspector/localStorage/artifacts.
107 actual Chromium journeys (103 predecessor+4WP01),111 heavy tests/0skipped,4 foundation product tests; required Windows/Ubuntu builds/frontend/exacthead/currentbase proof. Bounded390pxkeyboard proof; no universalbrowser/a11y/scale/productionIAM certificate. Inherited domain/history/storage/file limits and WP16localtechnicalauth/upstreamunresolved remain.
Other suite Studios require their own Planning/public owner readiness; no plugin/code loading, collaboration, new lifecycle/authorization or generic backend is admitted.
