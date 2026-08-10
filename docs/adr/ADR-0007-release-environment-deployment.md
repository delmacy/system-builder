# ADR-0007 — Separate Release, Environment and Deployment

Status: Accepted

## Decision

A Release describes what the system is. An Environment provides infrastructure/runtime configuration and secrets. A Deployment binds a specific release to a specific environment.

`Release + Environment = Deployment`.

## Consequences

- Build once, deploy many.
- Secrets are never embedded in release artifacts or committed manifests.
- Capabilities can declare environment contracts.
- Deployment validation blocks missing required variables/secrets without leaking values.
- Release provenance remains reproducible across environments.
