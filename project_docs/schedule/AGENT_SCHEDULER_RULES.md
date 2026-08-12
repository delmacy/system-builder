# Agent Scheduler Rules

Future AgentFactory scheduler should:

1. read machine-readable WPs/DAG;
2. evaluate predecessor gates;
3. produce READY set;
4. exclude BLOCKED/PLANNED/RESEARCH nodes;
5. rank READY work by milestone value, critical path, risk reduction and integration benefit;
6. respect coding, review, CI and integration capacity;
7. create sprint candidate rather than silently committing it;
8. pin contracts/context supplied to executor;
9. after execution, ingest evidence and recompute successor readiness;
10. periodically trigger integration/debt review according to policy.

The scheduler must never infer missing architecture to make a blocked item look ready.
