# Addendum 021 — Station UI Foundation Backfill

Status: ACCEPTED BY OWNER 2026-10-12; effective for construction after qualified admission PR integration
Predecessors: ADR-0017; contract 001 grammar; contract 002 visual factory; contract 018 Studio suite.
Related independent work: WP-ICON-01 (shared semantic icon inventory).

## Problem and decision
The current ui-core exports an M1-sized primitive set; the installed editor catalog offers few actual insertable types. Upper-level editor/Studio work currently exceeds the reusable lower-level visual inventory. Research taxonomy does not imply implemented UI. Admit a source-owned visual foundation backlog C0-C4 and its Component Editor exposure, followed by bounded adoption in existing Station workbenches.

shadcn/ui is an open-code SOURCE/DESIGN baseline, not runtime authority or a requirement to install every available upstream component. Retain SB semantic tokens, theme, registries, contracts and dependency/provider substitution. Favor Base UI for proven advanced headless behavior where appropriate; Radix is qualified alternative. Pin versions; audit licenses, keyboard and behavior; no mass unreviewed imports.

## Scope
- C0 visual token/density/themes and semantic state proof.
- C1 reusable accessible controls and feedback primitives.
- C2 common forms/fields, toolbars, split/action groups, property and navigation compounds.
- C3 menu/tree/list/table/datagrid collection contracts, interaction and presentation.
- C4 shared focus, selection, keyboard, sorting/filtering, validation, command binding, responsive overflow and state semantics.
- Registry descriptors, insertability, Inspector schema, properties/variants/slots, preview, save/readback and recovered version compatibility.
- Integrate shared components into representative existing Station shell, File Manager, Component Editor and Studio workbench surfaces; no wholesale rebuild.

## Explicit boundaries
Do not create a second editor engine, alter canonical process/owner semantics, import arbitrary third-party JS into a composition, introduce an opaque runtime shadcn authority, replace existing Core/business SDK contracts, conflate ComponentRegistry and AppManifest, conflate WindowGeometry and composition grid, or assume C5-C10 implementation from this foundation WP. Drag/drop/freeform geometry, arbitrary CSS/HTML editing, a universal DataGrid backend, and full remote publishing remain separate admissions. WP-ICON-01 provides icons and semantic mapping; this WP consumes its accepted API but does not replicate it.

## Admission / QA
This document is a proposed scope increment awaiting normal repository admission/integration; the branch/PR and planning do not themselves authorize uncontrolled implementation. Each promoted component requires inventory/provenance, typed contract and ownership, visual test surface, accessibility/keyboard/state profile, composition eligibility, save/readback evidence, and a status of PROVEN/FAILED/UNPROVEN/NOT-APPLICABLE. Tests green for other paths are not evidence for missing UI coverage.

Do not alter docs/current/NEXT_WORK.md or displace in-flight Studios WP02 until a coordinated dependency handoff. Plan implementation after admission, gated by fresh-main checks and unrelated workers' locks.

## Execution authorization and coordinated admission
Owner explicitly authorized all eleven named sprints, implementation, commits and qualified intermediate PR integration on 2026-10-12. This is an explicit cadence exception to the default five/six-sprint policy, not eleven automatically committed sprints. Only P and first eligible A are materialized. B–Z remain forecasts. UI Foundation receives increment 021 because integrated WP-ICON-01 owns 020. C0 construction has independent ownership of ui-core tokens, global theme CSS and dedicated tests; it may proceed alongside icon A under PARALLELISM_POLICY. Icon-dependent commands and artifact schema work wait for coordinated fresh-main materialization. Preserve ICON as primary live pointer; the same NEXT_WORK records this bounded independent lane.
