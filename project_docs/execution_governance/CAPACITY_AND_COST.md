# Capacity and Cost Management

## Capacity dimensions
Project throughput is bounded by the narrowest relevant resource:
- executor concurrency;
- architecture/review bandwidth;
- CI minutes/concurrency;
- integration capacity;
- test/environment availability;
- human approval capacity.

Initial mode remains sequential-first: one primary construction item plus bounded review/corrective work. Parallelism is enabled only for independent READY paths and available integration capacity.

## Metrics
Capture per task/type/model:
- queue/block time;
- execution duration;
- attempts/retries;
- CI duration/failures;
- review duration;
- rework/corrective effort;
- provider/token cost where available;
- first-pass acceptance;
- accepted-delivery cost.

## Estimation
Start with ranges/relative estimates. Replace assumptions with empirical distributions after sufficient completed tasks. Separate generation effort from validation/integration burden.

## WIP
A READY item does not need to become ACTIVE. Keep WIP below review/integration capacity. More cheap agents without verification capacity increase inventory and risk rather than throughput.
