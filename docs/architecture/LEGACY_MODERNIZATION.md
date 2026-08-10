# Legacy Modernization — Strangler-first

System Builder supports incremental modernization using the Strangler Fig pattern.

## Rule

Do not redesign or replace an entire legacy estate merely to improve one process.

Example:

```text
Existing ERP
  finance      legacy
  purchasing   legacy
  inventory    legacy
  maintenance  -> new SB-built system
  HR           legacy
```

The new system integrates with legacy boundaries. Later, another process can move if justified.

## Modernization map concept

Future Mirror/Analysis capabilities may represent each process as `LEGACY`, `HYBRID`, or `SB/NEW`, map dependencies and estimate the lowest-risk next modernization target.

## Safety

- never write directly to undocumented legacy internals when a supported API/event/import boundary exists;
- preserve rollback and coexistence;
- model data ownership explicitly;
- do not duplicate source-of-truth ownership accidentally;
- treat migration as a business/process change with validation, not only data movement.
