# Shared Station icons

Use `StationIcon` and semantic `IconToken` from `@system-builder/ui-icons`; consumers never import provider internals. `SUITE_STUDIO_ICONS` contains visual identifiers for all twelve Suite areas; entries do not install or authorize future Studios. Current Process Context and Workflow also have specific tokens.

Keep visible labels for ordinary actions. Decorative icons beside labels omit `label` and are hidden from assistive technology. An icon-only control needs its own accessible button name and tooltip; `label` is for independently meaningful images, not a replacement for a button name. SVG inherits `currentColor`; size16–20 for controls and32–48 for file cards. Theme tokens (`text-primary`, `bg-primary/10`) provide color without a separate palette. No icon font/CDN/raster dependency.

Vocabulary: workspace folders/open/new-folder; artifact composition/document; grid/list views; refresh/import/export/parent navigation; process/workflow/catalog/analysis/assembly/release/observe; existing shell/settings/window/status icons stay stable. Reuse the same token for the same meaning across Studios and app manifests. Add new tokens only with bounded provider geometry and THIRD_PARTY notice, complete registry coverage and accessibility proof.
