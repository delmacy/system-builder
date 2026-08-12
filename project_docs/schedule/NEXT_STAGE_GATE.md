# Gate Before Sprint Generation

Before generating actual sprints:

1. Materialize detailed WBS Dictionaries for the first NOW Work Packages.
2. Decompose those WPs into estimable activities/tasks.
3. Encode their dependency edges in the machine-readable DAG representation.
4. Validate acyclicity and topological order.
5. Estimate effort/duration and integration overhead.
6. Identify critical path/float for the planning horizon.
7. Select the next milestone/increment goal.
8. Query READY tasks and load only within real execution/review capacity.

Passing this gate means the project is ready to instantiate its first sprint package. It does not require every future sprint to be frozen.
