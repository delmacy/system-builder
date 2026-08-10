# Repository Strategy

## Decision

The System Builder suite begins as one modular monorepo.

```text
system-builder/          factory + engineering harness

gestaotecnica/          client system #1
system-trading/          client system #2
future-client/           client systems
```

The factory and the products it creates are separate repositories. The twelve SB suite modules remain packages/bounded contexts in `system-builder` until separation has an operational benefit.

## Why not one repository per suite module now

Premature polyrepo separation adds cross-repository version coordination, CI/release complexity and context switching without proving independent lifecycle needs.

## Extraction criteria

A module may earn its own repository when at least one is materially true:

- independent team/community ownership;
- significantly independent release cadence;
- different technology stack;
- hard security/isolation boundary;
- substantial standalone external adoption;
- monorepo CI becomes a real bottleneck;
- independent governance/product lifecycle.

## Capabilities/connectors

Capabilities and connectors may initially live in the monorepo and later be extracted as independently published packages/repositories while preserving contracts.

## Client repositories

Generated/published client systems must not import System Builder authoring internals. A client repository contains/consumes release/runtime artifacts, client definition/adaptation as appropriate, deployment configuration and client-specific code/data ownership.
