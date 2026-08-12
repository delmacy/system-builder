# Model Routing Policy

Choose models by accepted-delivery economics and risk, not by prestige or token price alone.

## Tiers

### T0 — Deterministic/no LLM
Use code for DAG validation, readiness calculation, schema checks, formatting and other deterministic operations.

### T1 — Cheap executor
Bounded mechanical implementation with stable contracts, narrow allowed paths, strong tests and low architectural risk.

### T2 — Standard reasoning/review
Moderate ambiguity, multi-file integration, decomposition assistance, independent review of T1 output, or repeated T1 failure.

### T3 — Strong architecture/reasoning
Architecture, public contract design, high-impact migration planning, difficult cross-domain analysis, repeated lower-tier failure.

### HUMAN_GATE
Irreversible/high-risk business scope, destructive data action, material trust/security boundary, production approval or policy-defined exception.

## Escalation triggers
Escalate on repeated failure/retry, architecture ambiguity, high/critical risk, public contract change, evaluator change, destructive migration, security-sensitive work, unexpected scope or low-confidence dependency.

## Economic metric
Track `accepted_delivery_cost`, including generation/provider cost, retries, CI, reviewer burden and corrective rework. A cheap model that repeatedly fails is not cheap.

## Anti-pattern
Do not ask an LLM to perform deterministic scheduler logic merely because an LLM is available.
