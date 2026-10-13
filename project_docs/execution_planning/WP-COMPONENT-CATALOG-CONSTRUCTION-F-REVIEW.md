# Construction F — editors and media qualification

Date: 2026-10-13
Status: ACTIVE, incremental acceptance

## Proven or candidate components
- ColorField: controlled six-digit sRGB hex color, native palette, no arbitrary CSS string evaluation. PR #1185.
- PropertyPicker: closed-list selection, explicit disabled values, caller-owned mutation authority. PR #1185.
- DocumentTextField: bounded plain-text textarea with length counter, rows, disabled and readOnly; no HTML interpretation or rich-text runtime. PR #1186.

## Exclusions and next gates
- **Not a rich text/document engine**: no markdown rendering, HTML ingestion, attachments, collaborative editing or canonical persistence.
- Do not claim sanitization for downstream HTML rendering; consumers must escape or sanitize at their own output boundary.
- Charting and graph adapters remain DEFERRED pending an actual Studio-backed data contract; do not add a fake chart provider.
- Editor eligibility, Inspector mutations and artifact save/reopen remain Construction G.
- Before F enclosure, test keyboard/disabled/readOnly states, paste at length limits, invalid colors/options, dark/compact/390px, TypeScript, lint, architecture, production build, and exact-head CI.
