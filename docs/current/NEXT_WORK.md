# Next Work — STATION Composition Construction A

Date: 2026-09-24
Materialization base: `main@1804c2e5b5eacd677ed3a2c2808e383fb42e2144`
Execution branch: `sprint/STATION-COMPOSITION-CONSTRUCTION-A-01`
Status: COMMITTED / READY TO CONSTRUCT

## Authority
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`
- `project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-A-01.md`
- ADR-0017 / Station frontend foundation

## Active chain

```text
TASK-606  Component inventory + taxonomy
   ↓
TASK-607  Composition contracts + Component Registry
   ↓
TASK-608  Grid/span + nested-slot validation
   ↓
TASK-609  ButtonGroup composite
   ↓
TASK-610  Component Lab cumulative proof
```

TASK-606 is the next eligible task.

## Construction target

Prove the smallest executable LEGO-style composition substrate before building the editors.

The package must establish:
- standardized component families;
- stable composition contracts;
- deterministic registry;
- proportional span constraints;
- named compatible slots;
- nested local micro-layout;
- one real reusable composite;
- visible Component Lab proof.

## Primitive-phase constraints
- one canonical theme;
- one centrally controlled font family/type scale;
- emphasis through bounded semantic weights;
- no arbitrary CSS authoring;
- no canonical pixel resize;
- no XS/S/M/L sizing contract;
- no editor application yet;
- no Core/business truth.

## Succession after this package

If Construction A closes green, the next planning/materialization slice may move into:
Inspector/Layers Tree → Composition Graph/Validator → transactions/save/draft/preview → shared Composition Editor Engine → Component Editor.

Do not jump directly to Window/View Editor or File Manager.
