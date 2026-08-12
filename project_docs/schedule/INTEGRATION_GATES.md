# Integration Gates

A predecessor being code-complete is insufficient when a successor consumes it. Gates can require contract tests, schema migration proof, runtime health, artifact validation, or end-to-end evidence.

Examples:
- Identity -> Authentication: Subject identity/schema contract test.
- Authentication -> protected runtime: session/authentication integration evidence.
- Catalog -> Assembly: capability manifest/version resolution test.
- Assembly -> Validation: deterministic assembly artifact available.
- Validation -> Compiler: validation gate passes.
- Compiler -> Release: autonomous artifact/reproducibility evidence.
- Release -> Deploy: signed/versioned release artifact and environment contract.

These gates are attached to DAG edges and later become machine-checkable where possible.
