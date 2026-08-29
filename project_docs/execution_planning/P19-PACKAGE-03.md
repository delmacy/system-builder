# P19-PACKAGE-03 — Dogfood Validation & Pre-Alpha Release

Status: FORECAST / NOT MATERIALIZED
Milestone: M19 Pre-Alpha Productization
WBS coverage: 19.3.1–19.3.3
Predecessor: P19-PACKAGE-02 canonically CLOSED

## Package Goal
Prove the factory against one real maintainer-owned process/system, exercise one bounded process evolution through a successor release, classify every pre-alpha blocker explicitly and issue the first immutable System Builder pre-alpha candidate only when the declared acceptance gate passes.

## Forecast Construction A — `P19-DOGFOOD-REFERENCE-SYSTEM-01`
Select one bounded real process, represent it through canonical approved/versioned business inputs and build/deploy it through the integrated factory path. Defects or missing capabilities become explicit evidence; bypassing the factory to make the demo pass is forbidden.

## Forecast Construction B — `P19-DOGFOOD-EVOLUTION-ACCEPTANCE-01`
Operate with Builder unavailable, restore Builder, introduce one approved process revision, regenerate/publish a successor release and prove upgrade/rollback with process->system->release->deployment lineage preserved.

## Optional Construction C
Promote only for bounded blockers discovered by real dogfood that are necessary for the declared pre-alpha gate and remain within existing architecture. New architecture or broad feature expansion requires separate authority/ADR.

## Pre-Alpha Package Integration & Review gate
Must evaluate at minimum:
- clean bootstrap from documented prerequisites;
- `npm run verify` plus applicable Heavy Product Tests;
- complete real reference journey with no hidden fixture bypass;
- runtime autonomy with Builder unavailable;
- successor process/release evolution and rollback;
- Release/Deploy integrity and provenance;
- security/trust and secret/config boundaries;
- known blocker/limitation classification;
- operator documentation and reproducibility.

## Documentation & Closure / release evidence
If and only if the package review is GO, reconcile repository memory and create immutable pre-alpha version/tag/release evidence tied to the exact reviewed commit/artifacts and known limitations. If the gate is NO-GO, no pre-alpha claim is made; blockers return to explicit corrective/construction work.

## M19 completion proof
A maintainer can reproduce one real system from canonical business inputs, deploy and operate it autonomously, evolve it through a traceable successor release and point to a reviewed immutable pre-alpha candidate with explicit limitations.

## Non-goals
Public beta, production SLA, commercial onboarding, billing, marketplace, broad UX polish, second unrelated client-system acceptance, additional deployment topologies and unrelated technical-debt cleanup.