# Construction G — Registry + Editor compatibility

Date: 2026-10-13
Status: ACTIVE / G-A candidate

## Authority boundary
Use the existing `ComponentRegistry` and composition graph validator. The source-owned components ColorField, PropertyPicker and DocumentTextField are proposed as atomic descriptor candidates with bounded grid spans, no children and no slots. They remain `SOURCE_ONLY` / `LAB_PROVEN`, **not EDITOR_READY**.

## Work remaining
- G-B: eligible insertion through actual Editor command / mutation path, including disabled or unrecognized component rejection.
- G-C: typed Inspector property edits rather than arbitrary JSON or CSS, with variant/slot constraints.
- G-D: canonical artifact serialization, reopen and revision proof, including unknown component and malformed input rejection.
- G-E: real Editor UI integration, keyboard, preview and browser round-trip.
- G-F: tests, documentation, enclosure only after exact-head CI.

## Gates
No promotion to EDITOR_READY until an actual component is inserted, edited, saved and reopened with the same descriptor and typed properties. No second registry or fake artifact store.
