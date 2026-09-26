# Contract Increment Documentation Model

Status: CANONICAL ORGANIZATION POLICY
Date introduced: 2026-09-26

## Intent

Organize requested scope by chronological scope increments rather than by sprint, Work Package, milestone, technology, or topic.

The model mirrors a professional engineering/software contract:

- the original accepted project scope is the BASE CONTRACT;
- each later accepted scope addition is an ADDENDUM;
- execution units such as milestones, Work Packages, sprints and TASKs implement a contract/addendum but do not define why the scope exists;
- durable project directives are the concatenated effective result of the base contract plus accepted addenda, subject to explicit supersession.

This gives a traceable answer to: what was requested, when it entered scope, what it changed, and which execution work implements it.

## Canonical shape

```text
docs/contracts/
  README.md
  CONTRACT_INDEX.md
  000-base/
    SCOPE.md
    DIRECTIVES.md
    TRACEABILITY.md
  001-<scope-addition>/
    ADDENDUM.md
    DIRECTIVES.md
    TRACEABILITY.md
  002-<scope-addition>/
    ...
```

Numbers are chronological admission order, not priority and not milestone numbers.

## Increment rules

Every material new scope request admitted to repository authority receives one immutable increment directory.

Each increment records:

1. admission date and provenance;
2. requested outcome and bounded scope;
3. explicit exclusions/boundaries;
4. directives introduced, changed, or superseded;
5. dependencies on previous increments;
6. mapping to ADRs/contracts/specs and execution units;
7. final implementation/closure evidence when available.

Do not rewrite an older increment to make history look current. Later changes are represented by a new addendum that explicitly supersedes or extends earlier clauses.

## Contract versus execution

Contract increments answer **WHY / WHAT WAS REQUESTED / WHEN DID IT ENTER SCOPE**.

Milestones, Work Packages, sprints and TASKs answer **HOW / IN WHAT ORDER / WHAT IS EXECUTING NOW**.

Therefore execution artifacts may point to one or more contract increments, while contract increments may map to many execution artifacts.

A Work Package or milestone must never silently become new product scope merely because it contains exploratory text. Scope enters through the base contract or an accepted addendum.

## Effective directives

The effective directive set is logically concatenated in chronological order:

`BASE + ADDENDUM-001 + ADDENDUM-002 + ...`

with explicit supersession taking precedence over older clauses.

`CONTRACT_INDEX.md` is the compact registry of increments and their current effect. It is not a scheduler. `docs/current/NEXT_WORK.md` remains the single live execution pointer.

## Migration policy

Existing historical documents are not mass-moved or rewritten. Git history and existing evidence remain valid.

Migration is incremental:

- classify major already-admitted scope families into contract increments;
- add traceability pointers to their existing source documents;
- move/copy only when doing so clearly reduces ambiguity;
- never fabricate a historical request date that repository evidence cannot establish;
- mark uncertain provenance explicitly as reconstructed.

New scope admitted after adoption of this policy should use this structure by default.
