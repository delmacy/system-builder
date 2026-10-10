# Station S4 WP2 Construction A Evidence 01

Date: 2026-10-10
Base: main@07482ac1cdeba16b10c594b35a57a74905ddfb57
Branch: sprint/station-s4-wp2-construction-a
TASK order: TASK-646 -> TASK-647
State: TASK-646 IMPLEMENTED on branch / validation pending; TASK-647 not implemented / Sprint not integrated

## TASK-646 implementation and proof obligations

Source-owned catalog retains the WP1 example graph and admits a Station ButtonGroup with BUTTON_GROUP_DESCRIPTOR's actual slots and one-row child constraints. Frozen source graph/labels and fresh registry per resolved lookup feed public editor initialization; unknown references and invalid session identity reject without replacing a prior session. Structural validation checks descriptors, graph compatibility, labels matching every actual node and editor session initialization before acceptance. The exported typed validator is app-local; no arbitrary external import endpoint.

Pure product tests cover two real definitions, projection convergence, slot incompatibility, row bounds, unknown/malformed definitions, immutability and recovery. No existing UI/package/workflow is changed by TASK-646. npm run verify and npm run station:build must pass on the TASK-646 head before TASK-647 advances; record actual run IDs and errors without treating branch-only code as integrated.

## TASK-647 and final Sprint gates

After TASK-646 proof, build catalog switching into workbench and expand actual browser suite while preserving all seven WP1 journeys. Run final npm run verify, Station build and Playwright, require exact-head/current merge-candidate/heavy/handoff/frontend/build/browser checks and retained artifacts. Merge must preserve two distinct TASK commits. Construction B stays forecast; do not claim desktop launcher/window lifetime in A.
