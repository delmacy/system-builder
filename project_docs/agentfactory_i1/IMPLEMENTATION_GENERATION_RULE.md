# I1 Implementation Task Generation Rule

Generate detailed implementation tasks progressively from the approved WP DAG.

1. Materialize the smallest predecessor contracts first.
2. Do not generate downstream tasks whose interface would still require architectural invention.
3. After each accepted predecessor, refine downstream task contract against the actual public output.
4. Preserve broad I1 WP scope and DAG while progressively elaborating task-level detail.
5. The coding executor receives a frozen task contract; discoveries outside it become follow-up/change items.

This is deliberate rolling-wave planning at task resolution, not incomplete project scope.
