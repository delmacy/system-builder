# Change & Configuration Management Plan

## Configuration items
ADRs, public contracts, WBS baseline, WP Dictionary, schemas, capability manifests, compiler/runtime versions, release artifacts and environment profiles.

## Change classes
- C0 editorial/non-semantic
- C1 implementation internal/no public contract impact
- C2 public contract/WP scope impact
- C3 architecture/scope baseline/breaking change

## Governance
C0/C1: normal PR/review. C2: impact analysis + dependent consumer review. C3: change request, architecture decision when applicable, baseline/version update and migration plan.

## Branch policy
Feature/docs branches are temporary integration vehicles. Durable project truth must converge to main through reviewed PRs. Parallel branches must branch from an up-to-date integration point and must not be treated as independent truth.
