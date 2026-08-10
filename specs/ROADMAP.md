# Executable Roadmap

The roadmap prioritizes one thin vertical proof. Milestones are sequential unless an accepted ADR and dependency graph make limited parallelism safe.

| Milestone | Proof | Main outputs |
|---|---|---|
| M0 Bootstrap | fresh agent can prepare, verify and close bounded work | local harness, gates, audit, task queue |
| M1 Contract Spine | synthetic artifacts traverse Mirror through release boundary | versioned schemas, fixtures, traceability |
| M2 Deterministic Factory Slice | SystemDefinition resolves and builds a minimal reproducible artifact | catalog resolution, AssemblyPlan validation, minimal compiler |
| M3 Autonomous Reference Runtime | built artifact operates with Builder offline | runtime-core, release/environment separation, autonomy test |
| M4 Gestão Técnica Strangler Pilot | one selected real process coexists with legacy | client-side adapter, integration contract, rollback evidence |
| M5 Second Client Proof | unrelated client uses the same factory without cloning GT | reuse metrics, portability and replaceability evidence |

M2-M5 tasks will be decomposed only when M1 outputs remove architectural ambiguity. This avoids speculative packages and false parallelism.
