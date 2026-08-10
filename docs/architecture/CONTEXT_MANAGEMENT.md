# Context and Project Memory

## Rule

**Chat is temporary. Repository is memory.**

A model must be able to resume work without access to previous conversations.

## Three memory layers

### Constitution — stable

Product vision, architectural principles, non-negotiables and accepted ADRs.

### Contracts — versioned interfaces

ProcessMirror, BusinessRecipe, SystemAnalysis, SystemDefinition, AssemblyPlan, release/environment contracts and package APIs.

### Current state — volatile

`docs/current/*`, active milestone, risks, next work and task status.

## Context Builder target

A future command such as:

`npm run task:prepare -- SB-02-014`

should assemble only what the executor needs:

- relevant constitutional excerpts;
- task spec;
- current milestone;
- module README;
- relevant ADRs;
- input/output contracts;
- relevant source files/tests;
- validation commands.

It must not dump the entire repository or months of conversation into every task.

## Context budgets

Tasks may declare a context budget and context paths. Context selection should be deterministic first; semantic retrieval may be added only if proven necessary.

## Durable-decision rule

When a conversation produces a durable decision, the task is incomplete until the decision is recorded as one or more of:

- ADR;
- architecture/product documentation;
- contract/schema;
- task/milestone spec;
- automated test/gate.

## Drift prevention

Architecture rules that can be checked mechanically must become tests/linters. Documentation explains intent; automation prevents accidental violation.
