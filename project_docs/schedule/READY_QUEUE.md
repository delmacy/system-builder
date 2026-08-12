# READY Queue

The READY queue is the set of tasks whose parent WP and all blocking gates are satisfied. It is the source pool for sprint generation.

A task can be READY yet intentionally unscheduled because capacity is sequential, another task has higher criticality/value, or integration WIP is capped.

Statuses: PLANNED -> BLOCKED/READY -> COMMITTED -> ACTIVE -> VALIDATING -> DONE. Corrective/rework items are new traceable items; historical DONE status is not rewritten to hide rework.
