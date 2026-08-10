# ADR-0002 — Builder/Runtime separation and autonomous releases

Status: Accepted

## Context

A factory should not be required for a manufactured product to continue operating. Mandatory platform runtime dependence conflicts with portability and anti-lock-in goals.

## Decision

System Builder is the Control Plane/factory. Generated client systems execute in an autonomous Runtime/Execution Plane. Ordinary runtime operations must not call System Builder.

## Consequences

- Builder and client products live in separate application/repository boundaries.
- Release artifacts contain what runtime needs, excluding secrets.
- Builder outage must not break client login, APIs, workflows, jobs, data or integrations.
- Telemetry may flow to Builder/Observe, but runtime cannot require Observe availability.
