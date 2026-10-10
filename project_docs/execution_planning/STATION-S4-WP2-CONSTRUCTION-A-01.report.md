# Station S4 WP2 Construction A Evidence 01

Date: 2026-10-10
Base: main@07482ac1cdeba16b10c594b35a57a74905ddfb57
Branch: sprint/station-s4-wp2-construction-a
TASK order: TASK-646 -> TASK-647
State: TASK-646 IMPLEMENTED and PROVEN on branch / TASK-647 IMPLEMENTED, verification pending / Sprint not INTEGRATED

## TASK-646 implementation and proof obligations

Source-owned catalog retains the WP1 example graph and admits a Station ButtonGroup with BUTTON_GROUP_DESCRIPTOR's actual slots and one-row child constraints. Frozen source graph/labels and fresh registry per resolved lookup feed public editor initialization; unknown references and invalid session identity reject without replacing a prior session. Structural validation checks descriptors, graph compatibility, labels matching every actual node and editor session initialization before acceptance. The exported typed validator is app-local; no arbitrary external import endpoint.

Pure product tests cover two real definitions, projection convergence, slot incompatibility, row bounds, unknown/malformed definitions, immutability and recovery. No existing UI/package/workflow is changed by TASK-646. TASK-646 exact-head verify run 38060839846 PASS; merge-candidate 38060839837 PASS; Station browser 38060839873 PASS; builds Ubuntu and Windows 38060839835 PASS; heavy 38060839851 PASS; frontend browser/component 38060839847 PASS; handoff 38060839884 PASS. Branch-only code is PROVEN by these checks, not yet integrated.

## TASK-647 and final Sprint gates

After TASK-646 proof, build catalog switching into workbench and expand actual browser suite while preserving all seven WP1 journeys. Run final npm run verify, Station build and Playwright, require exact-head/current merge-candidate/heavy/handoff/frontend/build/browser checks and retained artifacts. Merge must preserve two distinct TASK commits. Construction B stays forecast; do not claim desktop launcher/window lifetime in A.

## TASK-647 implementation checkpoint

The workbench uses the admitted catalog as its only graph/registry source. It switches clean sessions directly and requires explicit Cancel or Discard-and-open on a dirty draft. Cancel keeps revision, selection and unapplied input and restores catalog focus; descriptor constraints drive Inspector guidance; canonical preview and Layers use the admitted graph hierarchy. Added three Chromium journeys for ButtonGroup positive/negative/edit/save/discard, dirty cancellation and explicit switch, clean switching and keyboard, in addition to seven WP1 regressions. Final exact-head Actions, screenshot artifact and integration pending.
