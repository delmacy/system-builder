# P13-RUNTIME-SERVICES-BINDINGS-01 — Construction B

Status: COMMITTED / MATERIALIZED
Work Package: P13-PACKAGE-01
Milestone: M13
WBS: 13.1.2 + remaining 13.1.3 breadth
Materialization base: `8e9e7f1e3c86588ec0edbca0344a48f398332c7c`
Base tree: `62e871d54a522a1e9faa9ccb854e04aba9bced63`
Intended execution branch: `sprint/P13-RUNTIME-SERVICES-BINDINGS-01`

## Sprint goal
Extend the already-generated autonomous Runtime with explicit, bounded and backward-compatible execution of representative jobs, events, files/storage and integrations, using only the L3 authority accepted in `P13-PACKAGE-01.construction-b-l3-change-control.md` and preserving external reference-only configuration, fail-closed behavior, no-value-leak and Builder != Runtime.

## Fresh-main predecessor gate
SATISFIED for materialization:
- Construction A TASK-212..220 is integrated;
- repository-memory gate PR #238 is integrated;
- bounded L3 change control PR #239 is integrated after Deterministic CI #563 PASS;
- reviewed change-control head -> merge-main has zero file drift;
- current SystemDefinition/EnvironmentProfile/runtime-projection gaps match the accepted L3 envelope;
- no required L4 boundary, new bounded context, release-model change, suite topology or production topology was identified.

## Concrete L3 semantics committed for this Sprint
The following are the only public semantic deltas authorized for TASK-221/222:
- optional `SystemDefinition.jobs[]`: explicit interval trigger (`kind: interval`, positive `intervalSeconds`) plus explicit target (`actionRef`, `recordId`);
- optional `SystemDefinition.events[]`: explicit source (`kind: runtime-http`) plus explicit `actionRef`; Runtime event invocation supplies `recordId` and payload explicitly;
- optional `SystemDefinition.files[]`: explicit allowed operations (`put|get|delete`) plus `bindingRef` naming an `environmentRequirements` storage requirement;
- existing `SystemDefinition.integrations[]`: optional explicit HTTP invocation descriptor (`method`, relative `path`) plus `bindingRef` naming an `external-service` requirement;
- optional `EnvironmentProfile.bindings[].requirementKind` classification matching the existing SystemDefinition environment requirement kinds; historical bindings remain valid when the new B surfaces do not require classification.

No behavior may be inferred from names, order, integration direction, provider names or environment requirement kinds alone.

## Committed tasks and dependency order
1. TASK-221 — bounded SystemDefinition jobs/events/files/integration execution descriptors
2. TASK-222 — EnvironmentProfile binding compatibility metadata
3. TASK-223 — deterministic Compiler projection for B descriptors and references
4. TASK-224 — generated Runtime service model/materialization for B descriptors
5. TASK-225 — generated interval job execution through declared action target
6. TASK-226 — generated runtime-http event dispatch through declared action target
7. TASK-227 — generated file/storage put/get/delete through classified storage binding
8. TASK-228 — generated HTTP integration invocation through classified external-service binding
9. TASK-229 — missing/incompatible binding + no-value-leak regression across B surfaces
10. TASK-230 — full predecessor-integrated Construction B growing proof and Sprint Report

Execute in numeric order. TASK-222 may proceed after TASK-221; TASK-223 depends on 221-222; TASK-224 depends on 223; TASK-225..228 depend on 224 and execute in numeric order to keep the generated runtime proof cumulative; TASK-229 depends on 225-228; TASK-230 depends on all predecessors.

## Growing integration proof
Extend Construction A's real chain:

`SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler runtime projection/model -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy + external EnvironmentProfile/SecretResolver -> autonomous Runtime -> entity/action/workflow -> interval job -> runtime-http event -> file/storage -> HTTP integration`

Proof requirements:
- actual predecessor modules/APIs are invoked; no downstream hand-authored stand-ins where executable predecessors exist;
- one real interval job invokes an explicitly declared action target;
- one real runtime-http event dispatch invokes an explicitly declared action target;
- file put/get/delete operates only inside the externally supplied storage-root binding and rejects traversal/unknown operation;
- one HTTP integration uses an externally supplied base-url binding plus declared method/relative path;
- missing or incompatible required bindings fail closed with deterministic diagnostics;
- Builder and Observe remain unavailable during ordinary Runtime behavior;
- resolved endpoint/storage/config/secret values remain absent from immutable/durable evidence and asserted diagnostics.

## Final validation
`npm run verify`

TASK-230 also runs `npm run test:product:heavy` when the declared process/HTTP/storage proof requires the repository heavy lane.

## Stop / escalation conditions
- any required L4 architecture change, new bounded context, Builder/Runtime relation, release model, suite topology or production topology;
- any public contract change outside the accepted Construction B L3 envelope above;
- need for vendor-specific scheduler, broker, object-store or integration provider to satisfy the Sprint Goal;
- exactly-once/distributed scheduler/broker semantics becoming necessary;
- resolved secret/config/endpoint/storage values entering durable artifacts/evidence;
- required `.github/**` or repository-setting change;
- need to enter P13-PACKAGE-02 or P13-PACKAGE-03 scope;
- validation cannot be made green inside committed scope.

## Successor state
Construction C remains FORECAST / CONDITIONAL. Package Integration & Review, Documentation & Closure, P13-PACKAGE-02 and P13-PACKAGE-03 remain FORECAST/not started. Completing this Sprint does not authorize them automatically.
