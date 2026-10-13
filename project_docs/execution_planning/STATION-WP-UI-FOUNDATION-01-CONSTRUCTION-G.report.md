# Construction G — partial File Manager adoption
Status: IMPLEMENTED_ON_SPRINT_BRANCH, unqualified/unmerged; F remains partial separately.
## Scope
Owner-requested independent main-based slice: public Input/Select replace inline fields; PaneHeader/ToolbarGroup provide shared structure; ToolbarButton plus existing AccessibleTooltip renders icon-only view commands with full accessible names/pressed state and scoped window portal. All workspace/storage/import/export/open/revision/cancellation callbacks are retained. Native Tab/Enter/Space navigation, no composite roving toolbar claim. File/folder item names remain visible.
## Validation
Local lint/typecheck/docs/748 task specs/architecture and Station production build PASS after correcting PaneHeader's existing HTML title/string API use.13 focused artifact-workspace/revision contracts PASS. Local npm run verify blocked at tsx IPC EPERM; actual local Playwright blocked before browser start by absent Chromium executable. Neither is a full pass. Actions must supply exact-head full verification and Chromium.
## Browser proof / visual status
New actual journey creates a real folder, retains pending name/storage through view switches, exercises hover/keyboard tooltip/Escape, pressed state, disabled root navigation and390px geometry, and attaches wide/narrow screenshots. Existing workspace import/export/open/conflict/revision/window journeys remain included. These are authored tests, not observed passes yet. Before/after comparison and visual inspection remain pending; no G acceptance from screenshots alone.
## Residuals / integration
F1144 untouched/unmerged/partial. Other representative shell/Editor/Studio consumers require bounded tasks and fresh ownership reconciliation. Whole G/F/ICON/WP02/package remain open. Require all exact-head/current-base Actions and browser evidence before integration; further visual acceptance remains separate.
