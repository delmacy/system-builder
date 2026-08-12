# DAG Validation Rules

A future automated validator should fail planning when:

- a blocking predecessor id does not exist;
- a node depends directly/indirectly on itself;
- a DATA_REQUIRES edge has no named data/schema output;
- a CONTRACT_REQUIRES edge has no versioned public contract/test gate;
- a RUNTIME_REQUIRES edge has no health/execution evidence gate;
- a VALIDATION_REQUIRES edge has no named evidence;
- a task is scheduled while parent WP is BLOCKED/PLANNED;
- two nodes claim incompatible ownership of the same authoritative contract/schema;
- a successor duplicates predecessor responsibility rather than consuming its output.

Warnings, not failures: excessive fan-in/fan-out, long serial chains that could be contract-split, high-risk zero-float nodes, and too much WIP relative to review/integration capacity.
