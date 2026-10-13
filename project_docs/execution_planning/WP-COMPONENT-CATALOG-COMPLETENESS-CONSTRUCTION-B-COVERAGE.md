# WP-COMPONENT-CATALOG-COMPLETENESS — Construction B coverage review

Date: 2026-10-13
Authority: `project_docs/execution_planning/WP-COMPONENT-CATALOG-COMPLETENESS-PLAN.md` and contract 021.
Status: REVIEW / INCREMENTAL — no blanket editor-ready or Construction B closure claim.

## Source and integration truth
| Item / family | Repository implementation | Integration state at review | Component Lab | Editor-ready? |
|---|---|---|---|---|
| Label, Textarea, Checkbox, RadioGroup, Switch, Slider, NumberField, FieldDescription/Message | `packages/ui-core/primitives.tsx` | In main (WP-UI-FOUNDATION-01) | Primitives | UNPROVEN for general arbitrary insertion |
| Alert, Progress, Skeleton, Card anatomy | `packages/ui-core/primitives.tsx` | In main | Primitives | UNPROVEN |
| DateTimeField (date/time/datetime-local), FileField (selection only) | `packages/ui-core/input-extensions.tsx` | merged PR #1151 | Primitives | UNPROVEN |
| Combobox local filtering + controlled selection | `packages/ui-core/combobox.tsx` | merged PR #1152 | Primitives | UNPROVEN, requires expanded ARIA/a11y review |
| InputGroup (leading/control/trailing slots) | `packages/ui-core/input-group.tsx` | merged PR #1154 | Primitives | UNPROVEN |
| Spinner | `packages/ui-core/primitives.tsx` | merged PR #1156 | Primitives | UNPROVEN |
| PasswordField | `packages/ui-core/password-field.tsx` | PR #1159 pending exact-head checks (supersedes #1157) | Primitives in PR | UNPROVEN |
| Avatar | `packages/ui-core/avatar.tsx` | PR #1158 pending exact-head checks | Collections in PR | UNPROVEN |
| EmptyState, Pagination | `packages/ui-core/catalog-capabilities.tsx` | merged PR #1150 | Collections | UNPROVEN |

## Remaining Construction B exit gaps
1. Audit ComboBox listbox keyboard and focus against accessibility spec; current bounded local behavior is not provider-level parity; no assert of full keyboard screen-reader qualification.
2. Confirm scope boundaries of FileField (no upload service) and date input locale/native browser differences. Complex calendar picker requires separate admission and cannot be implied by DateTimeField.
3. Add evidence for disabled/invalid, controlled/uncontrolled, narrow/desktop, light/dark and responsive appearance where not already inherited from matching contracts.
4. Identify whether form validation presentation, InputGroup prefix/suffix keyboard behavior and sensitive-field autocomplete policies require further targeted tests.
5. Close open PRs and verify exact-head CI. No automatic promotion to Editor-ready; Construction G separately owns descriptor registration, Inspector schema and save/reopen.
6. Do not add components just to match the shadcn upstream index. Prefer concrete Station use and explicit deferrals.

## Next sequencing
- Construction B Review/Hardening: complete CI integration and targeted a11y negative tests; mark PROVEN per property, not per marketing category.
- Construction C: navigation/command surfaces (Command palette, sidebar navigation, stepper) using existing overlay, tabs and icon APIs. Reuse existing authority and keyboard behavior; no duplicated menu engine.
- Keep `docs/current/NEXT_WORK.md` unchanged until coordinated ownership handoff.

Evidence: `tests/browser/station-ui-primitives.spec.ts`, `tests/browser/station-ui-collections.spec.ts`, local production build logs and exact-head PR workflow checks; review values above do not imply full accessibility certification.
