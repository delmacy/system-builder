# P19-REFERENCE-PRODUCT-PROCESS-01 — Construction 7

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P19-PACKAGE-01 — Consolidated Pre-Alpha Productization`
Planning base: `7f1d1656006b58d9f4745490e21de1f46b219e11`
WBS: 19.3.1
Predecessor: `P19-AUTONOMOUS-RUNTIME-CONTINUITY-01` / WBS 19.2.3 integrated by Sprint Review PR #536 as fresh main `7f1d1656006b58d9f4745490e21de1f46b219e11` from exact reviewed head `90c4dd565a3702880d2a656995b1b4004027da0b` after Deterministic CI #1329 and Heavy Product Tests #799 PASS.

## Sprint goal
Prove one representative supported product journey end-to-end through the already integrated P19 owners: canonical payload/process input -> generated project/artifact -> publish -> deploy -> runtime state -> observe, then same-host compatible update and exact rollback while preserving Builder-off steady-state autonomy, immutable lineage and last-known-good semantics.

## Revalidated authority
- `project_docs/19-pre-alpha-productization/WBS.md` assigns WBS 19.3.1 to Construction 7 and requires one standard journey `payload -> project -> publish -> deploy -> runtime state -> observe`, same-host automated deploy/update/rollback, Builder off in steady state and correlated identifiers across Publish/Deploy/Observe.
- `EXTENDED_PACKAGE_POLICY.md` freezes C7 after integrated C6 and permits materialization of only the next package slice. WBS 19.3.2+ remains forecast-only.
- C5/C6 already provide canonical factory/bootstrap, Compiler payload verification, immutable Release/Deployment identity, local-process Deploy/startup/health, Builder-off autonomy, local observation, successor preparation and A -> B -> A continuity. C7 composes these owners into a single representative product journey; it does not create replacements.
- ADR-0002 and ADR-0007 remain authoritative: Runtime ordinary operation does not depend on Builder; Release artifacts remain immutable and EnvironmentProfile/secrets remain external.
- No new public contract, messaging semantics, identity scheme, Decision Boundary, deployment topology, supervisor/control plane or Runtime->Builder dependency is authorized.

## Reference-process rule
The reference process is a deterministic representative input exercised through existing supported factory/compiler APIs and test fixtures. This Sprint does not select a customer/domain dogfood process, add business-specific authority, or invent a parallel recipe/schema. Any need for new business semantics or a public contract is an escalation, not implicit scope.

## TASK chain
`TASK-450 -> TASK-451 -> TASK-452 -> TASK-453 -> TASK-454 -> TASK-455 -> TASK-456`

- TASK-450 — freeze the representative supported input and its canonical process/project identity baseline without introducing business-specific authority.
- TASK-451 — prove payload/process -> generated project -> publish using existing factory/Compiler/Release owners with exact hashes/refs and deterministic ordering.
- TASK-452 — prove published release -> existing deployment handoff -> actual runtime state/health with external EnvironmentProfile/secrets and Builder-off steady state.
- TASK-453 — correlate the same process/release/artifact/deployment/runtime identities into local/optional Observe evidence while preserving fail-open telemetry semantics.
- TASK-454 — prepare and activate one compatible same-host successor through existing factory/Release/Deploy authority, preserving predecessor provenance and last-known-good on rejected candidates.
- TASK-455 — restore the exact retained predecessor through existing rollback/reconstruction authority and prove idempotent/repeated rollback safety without synthetic identity stitching.
- TASK-456 — growing product proof and bounded operator documentation for the complete reference journey, including representative adversarial failures and regression of prior P19 gates.

## Growing proof at exit
Starting from one deterministic representative process payload, run the canonical factory/compiler path to a generated project and exact published ReleaseArtifact, deploy it through the existing local-process handoff, prove actual runtime health/state while Builder-side capability is unavailable, correlate the same immutable identities into local/optional Observe evidence, restore Builder capability without disturbing Runtime authority, generate a compatible successor from the same supported process lineage, activate it through existing same-host Deploy authority, reject stale/incompatible candidates without losing last-known-good, and restore the exact predecessor artifact. Every transition must remain auditable by canonical identifiers/hashes/refs rather than test-local aliases.

## Required negative/adversarial coverage
Substituted/stale process or release identity; artifact hash/ref mismatch; unverifiable payload; runtime/environment mismatch; protected-value leakage; migration/secret/startup/health/state failure; unavailable optional Observe publication; stale successor predecessor; repeated update/rollback; partial-success evidence. Failures stop before the next unsafe side effect and preserve last-known-good where existing authority promises it.

## Boundaries / non-goals
No WBS 19.3.2+; no unified CLI expansion; no production/fleet/HA/remote orchestration; no persistent control plane/supervisor; no customer/domain dogfood selection; no new business process semantics; no new identity scheme; no public-contract expansion; no Decision Boundary change; no generalized migration framework; no secret backend; no unrelated TD/findings; no inferred L4.

## Sprint gates
Each TASK runs its declared focused/core/heavy verification. Sprint completion requires exact-head Deterministic CI and Heavy Product Tests plus Sprint Review over the full reference-process interfaces. Review must confirm canonical identity correlation across Publish/Deploy/Observe, Builder-off steady-state autonomy, external secrets/config, existing Release/Deploy/Observe ownership, deterministic behavior and absence of parallel lifecycle authority. WBS 19.3.2+ remains forecast until C7 is reviewed/integrated and fresh `main` is revalidated.
