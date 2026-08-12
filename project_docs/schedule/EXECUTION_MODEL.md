# Execution Model

Preferred operating mode starts sequential for supervision and cost control, while retaining a DAG capable of parallel scheduling.

A work stream follows: select READY increment -> generate sprint candidate -> commit sprint -> implement/review/test -> integrate -> capture evidence -> close sprint -> update DAG/readiness -> select next READY increment.

After the configured construction cadence, run the system integration/technical-debt review before continuing normal construction.

This is iterative and incremental, but not scope-chaotic: project scope remains baselined while near-term execution is progressively elaborated.
