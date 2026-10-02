# Station S3 — Process Artifact Save / Projection Model 01

Date: 2026-09-28  
Base: `main@d76a5a38abb7158c1b2577fddee391fd24843361`  
Status: RESEARCH EVIDENCE — NOT PRODUCT AUTHORITY

## Purpose

Evaluate a process-centered canonical work-artifact model for Station in which a business/process artifact is opened as the primary document/context, while Studio views act as projections/editors over that same canonical identity.

This research does not authorize persistence, publish, filesystem, Studio construction, Core authority changes, or a new storage topology.

## Core hypothesis

The user works on one canonical process context, analogous to opening a PSD/project document, while multiple dimensions remain internally compatible because they reference the same process identity.

```text
Process Artifact
├─ Workflow projection
├─ Data projection
├─ Security projection
├─ QA / Proof projection
├─ Observability projection
├─ Audit projection
├─ Deployment projection
└─ UI projection
```

Visual components remain owned by UI/component tooling and are not direct children of the semantic process model.

```text
Process
  ↓
Capability
  ↓
View / UI Projection
  ↓
Pattern / Composition
  ↓
Component
```

## Canonical identity

The process artifact is the root work-context identity, not necessarily one monolithic physical file.

It may reference independently versioned canonical artifacts:

```text
DocumentApproval.process
├─ Document.entity
├─ ApproveDocument.capability
├─ ApprovalWorkflow.workflow
├─ ApprovalView.view
├─ ApprovalPolicy.policy
└─ ApprovalProof.proof
```

The Station must not duplicate Core/business authority or reinterpret canonical process/revision identity already established elsewhere.

## Save model questions

Research must distinguish at least:

- in-memory edit state;
- local draft;
- validated draft;
- immutable revision identity;
- save/checkpoint;
- publish/admission;
- discard/reset;
- recovery after crash/reload;
- current vs stale projection state;
- external referenced artifact revision drift.

A preliminary lifecycle for analysis only:

```text
OPEN
  ↓ edit
DIRTY
  ↓ save draft
DRAFT
  ↓ validate
VALIDATED
  ↓ human/authority gate
PUBLISHED REVISION
```

This is not yet a product state machine.

## Projection rule

Layers, Inspector, Graph, source/YAML and rendered Studio views must remain projections/editors of one canonical artifact/revision truth.

A projection must carry enough identity/currentness metadata to detect stale edits rather than silently overwrite newer canonical state.

Candidate metadata:

```text
artifactRef
baseRevisionRef
projectionKind
projectionRevision
loadedAt
dirty
validationState
```

Exact schemas remain research-only.

## Required proof questions

Any later materialization should define proof obligations for at least:

1. identity preservation across save/load;
2. deterministic round-trip where promised;
3. stale-write/conflicting-revision rejection;
4. no silent authority transfer from projection/YAML/UI into Core truth;
5. referenced-artifact integrity;
6. dirty-state accuracy;
7. crash/reload recovery semantics;
8. discard restoring the correct base revision;
9. publish producing a distinct immutable revision where the canonical process-version contract requires it;
10. projection synchronization without false PASS when one projection is stale.

Coverage vocabulary remains:
`proven | failed | unproven-gap | not-applicable`.

## UX direction

Opening a process should feel like opening a work document/project:

```text
Title: Document Approval

Explorer
└─ Document Approval
   ├─ Overview
   ├─ Workflow
   ├─ Data
   ├─ Security
   ├─ QA
   ├─ Observability
   ├─ Audit
   └─ UI
```

Only applicable projections should be shown.

Component Library / Component Editor remains a separate tool surface. Process semantic navigation must not mix primitive visual components into the process tree.

## R5/R6/R7 placement

- **R5**: canonical artifact vs Template/View instance, source round-trip/currentness, draft/dirty semantics and save/readback proof questions.
- **R6**: determine which Tool Families share document/project lifecycle primitives such as open/save/dirty/history/inspector/explorer.
- **R7**: determine Studio-level cross-projection coordination and perform Core Contract Reuse & Station Projection Census before new cross-boundary contracts.
- **Synthesis/materialization**: decide whether a reusable Process Work Context / Artifact Workspace contract is justified and which owner holds persistence authority.

## Explicit non-goals

This research does not:
- create a new process-version identity;
- make Station canonical business authority;
- choose filesystem/database/storage topology;
- implement save/publish;
- create a new Artifact Repository;
- create specialized Studios;
- make YAML/source a competing authority;
- authorize product mutation.

## Exit question

Promote a shared save/work-context contract only if R5-R7 evidence shows multiple Tool/Studio families require the same identity, draft/currentness, save/readback, history and recovery semantics and those semantics cannot be expressed by already-existing contracts without duplication.
