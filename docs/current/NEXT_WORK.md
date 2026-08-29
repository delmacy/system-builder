# Next Work — P18-PACKAGE-03 Construction A

`P18-PACKAGE-03 — Process-to-System Version Lineage & Historical Traceability` / WBS 18.3.1–18.3.3 is the current active Work Package, selected by fresh-main Planning & Materialization from `5a3612d20f30307ac2c0a2e70ca70dff034476d8`.

## Current gate
Execute only the committed Construction A Sprint:

`P18-PROCESS-SYSTEM-LINEAGE-CONTRACT-01` — COMMITTED / MATERIALIZED / NOT EXECUTED

Dependency-safe order:
`TASK-409 -> TASK-410 -> TASK-411 -> TASK-412 -> TASK-413`.

Before each TASK, re-read its context, confirm allowed/forbidden paths, max_files and validations. Construction A may extend `packages/contracts/process-versioning/**` additively/backward-compatibly and product tests as declared. Do not modify Release/Deploy/Runtime/Compiler/Decision Boundary surfaces unless a later fresh-main materialization explicitly authorizes them.

After TASK-413 and Sprint-wide verification, produce the Sprint Report, open the Sprint PR, obtain exact-head Deterministic CI + Heavy Product Tests and complete Sprint Review/integration under the user's explicit Work Package authorization. Then reconstruct fresh main before deciding whether Construction B may be promoted.

Construction B, optional Construction C, Package Integration & Review and Documentation & Closure remain FORECAST / NOT MATERIALIZED until their predecessor gates permit promotion.

Preserve canonical M15 `human-decision` authority. Do not use Git/PR/model/classification/ADR evidence as business version or approval authority, infer L4, change Builder/Runtime topology, introduce deployment execution authority, redesign storage, or absorb unrelated findings/TDs.