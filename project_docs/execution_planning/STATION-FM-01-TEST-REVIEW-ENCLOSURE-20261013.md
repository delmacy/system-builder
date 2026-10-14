# FM-01 — Test Review and Documentation & Enclosure decision

Date: 2026-10-13
Status: CANDIDATE — CI gates pending, WP NOT CLOSED
PR: #1202

## Integrated increment contents

- Construction A: real Station Playwright characterization of local folder creation, entering/exiting, grid/list and Inspector controls, plus serialization invariance for presentation-only operations.
- Construction B: opt-in shared `NavigationTree` preview backed by actual `ArtifactWorkspace.folders` and stable folder IDs, controlled selection via existing `navigate`; original tree still default and storage codec unchanged.
- Browser check for preview navigation, selected state, breadcrumb/up interaction and persistence invariance.

## Retained compatibility and risks

The shared tree owns disclosure state locally. Selected descendant may be hidden until its ancestors are expanded; this is a *prototype*, not final navigation replacement. The File Manager remains usable with its old tree; FM-02 owns final adoption/controlled expansion, complete keyboard and WAI-ARIA subtree behavior. No file data migration or Core authority change.

## Verification / gate matrix

| Gate | Required proof | Result |
| --- | --- | --- |
| Functional journey | WP11 product and Station browser suites, including added FM-01 assertions | PENDING final exact-head CI |
| Workspace integrity | UI-only changes do not mutate local serialized workspace; invalid storage preserved | Assertions committed, execution pending |
| Visual and responsive | Actual 390px, desktop, focused keyboard path for both trees | UNPROVEN; carry into FM-02, never silently promote |
| Architecture | Shared tree consumer uses folder-ref identity and no duplicate source | Source reviewed |
| CI | All workflow checks relevant to final head successful | PENDING; no merge before proven |
| Documentation | Planning, Constructions A/B, Test Review, residuals linked | Candidate in this document |

## Closure condition

Do not assert M1 or FM-01 closed until all required checks have succeeded and PR merged. The explicit FM-02 entry contract is to make navigation expansion/focus controlled and show real 390px/desktop proof, preserving the original File Manager workflow.
