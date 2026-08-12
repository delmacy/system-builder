# Sequential-first Execution

Initial operating preference is one primary construction stream at a time. The DAG still records every independent READY branch.

Selection rule for the next sequential item: unblock critical successors first, then reduce architectural/risk uncertainty, then maximize integrated milestone value, while respecting review/CI capacity.

Because independence is encoded, moving to multiple agents later requires capacity configuration rather than redesigning the project dependency model.
