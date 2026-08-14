# Package-scoped Additive Test Authorization Proof — TASK-042

Assessed: **2026-08-14**
Baseline: `275a19d7a7ac937efd388ff4acdb4e2f5bc6788f`

## Result

ADR-0014 is implemented within the bounded package authorization runtime. Full
repository verification passes 263/263 tests in 27 suites, 43 task specs,
architecture gates and build.

## Proven behavior

- Independent validation remains `REVIEW_REQUIRED` with the exact sole reason
  `EVALUATOR_CHANGED`; the package evaluator does not rewrite it to `PASS`.
- A version-2 implementation PUSE records `REVIEW_REQUIRED`, the exact additive
  classification, package baseline/head commits, test paths, Git blob OIDs and
  SHA-256 content digests. Historical version-1 PUSE receipts remain accepted,
  byte-addressed and unchanged.
- The stored classifier reads the complete test bytes with Git from the signed
  package baseline and exact PR head. It accepts only an exact new test path or
  a strict byte-prefix append whose head is longer than the baseline.
- Dirty working-tree content cannot influence classification. The classifier
  also binds the independent receipt's changed-file list to the exact
  `source_commit..head_sha` Git diff.
- A descriptor and task must both enumerate each evaluator as a literal path.
  Globs, protected/production evaluator paths, case ambiguity, non-blob objects,
  mutation, truncation, deletion, rename/missing evaluator, inconsistent
  receipt identity and blob-read failure stop without authority.
- Validation commands must all pass with exit code zero; missing evaluators,
  content mutation, extra reason codes and failed/missing named checks remain
  blocking.
- The runtime loads and schema-validates the immutable independent validation
  receipt before package evaluation. Malformed receipt content is not forwarded.
- A valid v2 implementation PUSE can causally precede the existing exact state
  PUSE. State closure remains impossible without the accepted implementation
  use, and predecessor/budget/expiry/revocation/suspension rules are unchanged.

## Focused evidence

`package-authorization.test.ts` proves deterministic v2 issuance, unchanged
`REVIEW_REQUIRED`, v1/v2 chain compatibility, state use after implementation,
new-file and prefix-append Git derivation, working-tree independence and
mutation/rename failure. `orchestrator.test.ts` proves that only a strict
`ValidationGateReceipt` is loaded for runtime propagation.

## Scope guard

The change is limited to `package-authorization.ts`, `orchestrator-runtime.ts`,
their two declared test files and this proof. `validation-engine.ts`, GitHub
lifecycle, durable approval, Supervisor, policies, contracts, CI, ADRs,
applications and product tasks are unchanged. No package was created, signed,
reinterpreted or activated, and TASK-004/I3 were not executed.

## Next boundary

After TASK-042 is integrated and state-closed through the exact evaluator gate,
the replacement package must be regenerated from that new `main`, with literal
test paths and no completed PWD-AF-003 history. The next fresh proof task is to
be executed by OpenCode under that signed package; Codex remains planner,
reviewer and gate authority.
