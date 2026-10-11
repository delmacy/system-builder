# Addendum013 — Station portable process context
Date: 2026-10-11 UTC
Status: ACCEPTED via Planning#1096; bounded WP13 CLOSED effective on validated TASK706 integration.
Admission: owner explicitly requests execution of Station WP13 after WP12 closure #1095.

## Bounded outcome and ownership
Admit a data-only portable process-context manifest, not a replacement business model.
Its process anchor uses normalizeProcessRevisionIdentity from the existing process-versioning
owner. Context identity uses ADR0009; the context artifact is distinct from process identity.
A title and up to16 unique named composition references are Station presentation metadata.
Each composition reference pins the complete artifactType/artifactId/artifactVersion tuple.
No embedded business rules, actions, graph, provider locator or automatically followed URI.
BusinessRecipe != SystemDefinition; semantic owners and Station/Core boundaries unchanged.
New L3 context contract is explicitly reviewed through this Planning; no L4/ADR change necessary.
The manifest references independently versioned parts, rather than merging every Studio payload.
It does not establish a universal .process bundle, business codec or new domain authority.

## Portable format and trust
ADR0009 envelope type urn:system-builder:station:process-context, schema URI of same namespace
with :payload suffix, payload schema1.0.0. payload={processRevision,title,views}; each view
={ref,title,composition:{artifactType,artifactId,artifactVersion}}. Inert optional compatible
envelope/provenance/extensions preserved, required unknown semantics rejected. Strict payload.
Explicit .process.json import/export and replaceable origin-local getItem/setItem retention
under station:process-context:v1, entirely separate from the unchanged WP11 workspace schema/key.
One context retained; no hidden overwrite: expected raw-text re-read before explicit save.
Limits1MiB UTF-8/32 JSON nesting/16views/ref256/title80 code points, safe JSON keys/data only.
Process reference resolved only through an explicit owner adapter. This package has no live
business service; unavailable stays unavailable, never fabricated as available from well-formed IDs.
Local composition adapter decodes real WP12 retained files and matches exact logical tuples;
missing, stale (same type/id but another version), conflicting duplicate tuples, invalid/corrupt,
unavailable and available are distinct. Never select latest silently or execute a reference.
A context may open with unresolved references and explicit status; only available exact composition
references may request ordinary editor handoff through existing dirty/unapplied guards.
Semantic anchor is read-only; changing layout cannot mutate it. No process-rule authoring here.

## Construction and proofs
A: strict manifest codec, canonical process identity reuse, bounded origin retention and deterministic
resolution/projections using real predecessor workspace/codec. No product UI in Planning.
B: ordinary singleton Process Context window plus standalone route; explicit import/export/save/open,
read-only anchor and reference list, guarded available composition opening. Create a context from
explicit process revision fields and selected retained compositions; this records a reference, not
business validation. Invalid import/read/save/corrupt/quota/stale cases preserve existing context.
Browser proof: actual editor -> WP12 retained revisions -> context references -> portable download ->
fresh import -> exact revision projection -> ordinary editor; missing/stale/owner-unavailable explicit.
Regress all75 predecessor Chromium journeys; keyboard/narrow-layout and lifecycle checks.
WBS21.1.1/21.1.2/21.3.1/21.3.2 bounded reference/projection portions only.
No live business service, semantic model editor, generic multi-Studio framework (WP14), C10/Studio,
server/Core/host/filesystem, collaboration/CAS, auto-merge, deploy or whole WBS/H3/S4 completion.

## Accepted delivery and limits
Planning#1096/A#1097/B#1098/Review#1099 integrated. Separate strict context codec/store, ordinary
Process Context app and /process-context route, creation/import/export/local reopen, read-only
anchor/status and guarded pinned composition opening proven.82 actual Chromium journeys (75 inherited
+7 new), seven construction workflows and independent five Review gates;193 direct Review tests PASS.
Same retained context type/id/version cannot acquire different canonical content; identical re-save
allowed, distinct new identity explicit replacement allowed. Corrupt storage never silently repaired.
No live semantic service connected; portable parts separately retained. One origin slot, best-effort
reread detection, caps unchanged; WP13-L1/L2/L3/D1 and inherited debt retained. No CAS, latency or
universal browser/accessibility promise. Closure own gates mandatory; no whole WBS/H3/S4 promotion.
