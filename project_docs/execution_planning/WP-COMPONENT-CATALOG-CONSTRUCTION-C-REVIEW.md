# Construction C — navigation and commands qualification review

Date: 2026-10-13
Status: ACTIVE / REVIEW (not enclosed)

## Source-backed increments
- Stepper — PR #1162, merged: controlled visual process steps, disabled states; not canonical workflow execution.
- CommandPalette — PR #1164, merged: local command filter and dialog-driven dismissal; no global shortcut binding or authorization delegation.
- NavigationTree — PR #1166, merged: hierarchical disclosure and controlled selection.
- NavigationTree keyboard — PR #1168, merged: skip disabled, Enter/Space, keyboard traversals.
- NavigationTree compact semantic icons — PR #1170, merged: icon tokens via public @system-builder/ui-icons, compact accessible names.

## Tested evidence
- `tests/browser/station-ui-overlays.spec.ts`: command search, keyboard and Escape dismissal, tree expansion/selection and compact icon identity.
- `tests/browser/station-editor.playwright.config.ts`: browser runner; local Station build/lint/TypeScript and GitHub exact-head workflows.
- PR #1170 head `6a07e8b9` passed all seven GitHub workflows before squash merge `2393345c`.

## Remaining navigation qualifications (not implied by Lab)
1. Tree WAI-ARIA: nested group semantics, level/posinset/setsize, correct roving tabIndex, Right/Left parent/child behavior, focus retention after collapsing, duplicate instance IDs, disabled focus traversal edge cases.
2. Compact controls: keyboard-accessible tooltip (current title is mouse-native), strong 390px/density/theme assertions, disclosure/single-icon geometry and localization/long labels.
3. Command palette: stable option identity and active descendant, skip disabled, empty state keyboard behavior, global shortcut arbitration only if admitted by shell command authority.
4. Responsive navigation and overflow in real shell/Studio consumers, not merely Component Lab demos.
5. No EDITOR_READY promotion until Construction G proves descriptor, insertion, Inspector and artifact save/reopen.

## Next incremental priority
Harden NavigationTree ARIA focus/parent disclosure and responsive examples; then bounded command palette keyboard semantics. Continue Construction C until tests explicitly close these gaps.

## Consolidated qualification batch (2026-10-13)
- NavigationTree sibling ARIA position and set size; remove duplicate static DOM IDs from tree items.
- NavigationTree roving tab stop, retaining accessible compact names and arrow navigation.
- CommandPalette per-instance list/option identity and `aria-activedescendant` for enabled active options.
- Browser regressions for roving focus, active option identity and compact navigation at 390px.
- Local aggregate gate on branch `ui/construction-c-final-integration-20261013`: architecture, TypeScript, ESLint, production build and **14/14** Overlays Playwright tests passed.
- This batch does not yet prove real File Manager/Studio consumer integration, complete nested treegroup semantics, application-wide shortcuts or Component Editor round-trips. Keep those as explicit follow-up requirements rather than calling the entire Construction C closed.
