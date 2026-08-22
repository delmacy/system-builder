# Review and Replanning Loop

## Every Construction Sprint
Validate Sprint Goal, acceptance criteria, tests, integration, evidence, incremental documentation and dependency gates unlocked by completed work.

## Package Integration & Review
For newly planned Work Packages, the default review occurs after two required Construction Sprints and an optional third only when fresh-main revalidation proves it necessary.

Inspect cross-module integration, contract drift, architecture fitness, regressions, security, CI health, documentation consistency, technical debt, unresolved risks, dependency accuracy and actual-vs-forecast effort.

The review may replan future work but must not silently absorb missing feature scope. A missing product capability required by the Package Goal returns to explicit construction/change control.

## Documentation & Closure
After package review passes, reconcile repository memory before closure. Current-state documents, Work Package/Sprint reports, WBS/DAG/readiness, risks/lessons and affected module/public/operations documentation must agree with integrated truth.

Documentation & Closure is not the first documentation point; it consolidates and reconciles documentation already maintained during construction. It cannot introduce new product behavior.

## Replanning rule
Review may change forecast and future Sprint/Work Package candidates. It must not silently mutate the Scope Baseline. New scope requires change control; better decomposition or scheduling within approved scope updates planning artifacts and DAG.

## Dependent successor handling
Do not keep a completed Sprint permanently open because later work depends on it. Close it when its Goal/DoD is met. Residual/new work becomes explicit backlog/corrective/successor work under the correct Work Package.

A successor may be forecast early but becomes `COMMITTED` only after its predecessor is integrated and fresh repository truth is revalidated.

## Legacy packages
Packages already materially executed under the former cadence may finish through their explicitly recorded grandfathered review path. Their historical sequence is preserved, but final repository memory must still be reconciled before declaring them closed.
