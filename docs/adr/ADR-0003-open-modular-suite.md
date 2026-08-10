# ADR-0003 — Open modular and replaceable suite

Status: Accepted

## Context

The platform is a suite of specialist tools, and users may need only part of the production pipeline or prefer existing market tools for other stages.

## Decision

Mirror, Recipe, Analysis, Design, Catalog, Assembly, Validation, Compiler, Release, Deploy, Observe and Support are independent bounded product modules behind contracts. The complete System Builder suite is the reference implementation; consuming every module is not mandatory where interoperable replacement is possible.

## Consequences

- Contracts are first-class products.
- No artificial internal protocol should make another SB module the only possible implementation.
- Modularity does not require microservices; initial implementation remains a modular monorepo.
