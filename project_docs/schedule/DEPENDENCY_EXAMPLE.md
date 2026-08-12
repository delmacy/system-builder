# Dependency Scheduling Example

Suppose Identity/Auth needs five units of sprint-sized execution before an authorization-dependent feature can run, while Capability Registry is independent.

```text
Identity model -> credentials -> session/auth -> authorization context -> integration proof -> protected feature

Capability Registry -> catalog contract -> capability consumer
```

The scheduler does not say 'Sprint 6 must happen before Sprint 8'. It says the protected feature is BLOCKED until its predecessor gate passes, while Capability Registry tasks may be READY throughout that period.

If execution is intentionally sequential, READY Capability Registry work waits by capacity choice, not by false dependency. If parallel capacity is enabled later, it can run immediately without redesigning the plan.
