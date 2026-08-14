# ADR-0014 — Package-scoped test evaluator authorization

Status: Accepted

## Context

ADR-0013 permits one owner-signed package to authorize routine tasks, including
tests explicitly bounded by a descriptor. The implemented evaluator, however,
accepts package authority only when independent validation returns `PASS`.
`validation-engine.ts` classifies every `**/tests/**`, `**/*.test.*` and
`**/*.spec.*` change as `EVALUATOR_CHANGED`, so an otherwise successful task
returns `REVIEW_REQUIRED` and package evaluation returns `VALIDATION_FAILED`.

TASK-040 exposed the contradiction prospectively. PWD-AF-003 named its three
test paths, stayed within scope, passed 260/260 tests and green named CI, but
implementation PR #115 required exact durable approval and emitted no
`PackageUseReceipt`. Its state action consequently reported
`STATE_WITHOUT_IMPLEMENTATION`. The next descriptor, PWD-AF-004, could not cite
an accepted PWD-AF-003 implementation use and its task-spec materializer stopped
with `DEPENDENCY_DRIFT`. Reissuing the same descriptors would reproduce the
failure.

The evaluator is correct to treat changed tests as a technical fact requiring
additional scrutiny. Package authority must not permit an executor to delete,
rewrite or weaken the tests that judge its own work, nor to change validation
policy. The problem is narrower: a signed descriptor cannot currently authorize
new regression coverage or provably additive coverage that it names exactly.

## Options considered

| Option | Result |
| --- | --- |
| Keep exact approval for every test-changing task | Safe, but defeats the accepted 20–50 task package operating model because the remaining descriptors require tests. |
| Treat any descriptor test path as package-authorized | Rejected. An executor could delete or rewrite existing assertions inside a signed path. |
| Use assertion counts, test names or semantic LLM review | Rejected. Counts/names are gameable and semantic inference is not deterministic authority. |
| Require an additional unsigned reviewer receipt | Rejected. It would either be forgeable by the executor or recreate an interactive authority gate without a distinct trusted signer. |
| Permit only exact-path new tests or byte-prefix-preserving additions | Selected. It is deterministic, auditable and cannot mutate or delete baseline evaluator content. |

## Decision

### Preserve the validation fact

Independent validation continues to classify every test change as
`EVALUATOR_CHANGED` and to emit `REVIEW_REQUIRED`. This ADR does not turn that
receipt into `PASS`, remove an evaluator pattern, change required commands or
allow package authority to resolve any other validation reason.

Package authorization may satisfy the human work-authorization channel for a
`REVIEW_REQUIRED` receipt only when every reason code is exactly
`EVALUATOR_CHANGED` and every changed evaluator is a package-scoped additive
test as defined below. The package evaluation records this distinct technical
class; it must not falsify the original validation receipt.

### Package-scoped additive test

A changed evaluator is package-scoped additive only if all conditions hold:

1. The path is an explicit repository-relative file path in the signed
   descriptor's `allowed_paths`. A glob, directory, inferred test neighbor or
   package-wide allowed path does not grant evaluator authority.
2. The path matches a test evaluator pattern, but does not match a production
   evaluator, validation engine, architecture/governance policy, workflow,
   package manifest/configuration or protected path.
3. At the signed package baseline, either the file did not exist and the task
   creates it, or the file existed and its baseline bytes are an exact prefix of
   the proposed bytes. Existing bytes cannot be deleted, reordered, normalized,
   reformatted or modified. Appending zero bytes is not a test change.
4. Git observes a regular repository file. Deletes, renames, copies replacing a
   baseline path, symlink/submodule changes and case-identity ambiguity fail.
5. The task, package, descriptor, source/base/head and changed-file identities
   conform at every package evaluation point; the package baseline is an
   ancestor and protected-input checks still pass.
6. Independent validation is content-stable, has no missing evaluators, every
   declared command passes, named CI checks succeed and no validation reason
   other than `EVALUATOR_CHANGED` exists.

The comparison uses Git blob bytes from the signed `baseline_commit`, not the
working tree and not platform-normalized text. For a new file, absence must be
proved at that commit. This intentionally rejects harmless-looking edits to an
existing line: such work remains an exact exception because deterministic
machinery cannot prove semantic non-weakening.

### Authority and audit result

For a conforming routine task whose only evaluator changes meet the rule above,
the package evaluator may return `VALID` for the exact implementation PR and
emit its normal implementation `PackageUseReceipt`. The receipt schema must
preserve that the underlying validation decision was `REVIEW_REQUIRED` and bind
the additive-test classification, baseline commit/blob identities, exact test
paths and resulting head blobs. It may not serialize validation as `PASS`.

The exact state PR may then use the same descriptor only after the accepted
implementation PUSE exists, preserving the existing two-action chain. The state
PUSE remains bound to the exact closure manifest, checks and synchronized
repository identity. Descriptor consumption, predecessor satisfaction,
attempt/action budgets, expiry, revocation, suspension, one-action execution
and append-only/divergence rules are unchanged.

### Package versus exact exception boundary

| Change or condition | Package authority |
| --- | --- |
| New test file named exactly in the signed descriptor | Eligible if all technical gates pass. |
| Bytes appended to an exactly named baseline test file | Eligible only when the baseline blob is an exact byte prefix. |
| Edit, deletion, rename, truncation or replacement of existing test bytes | Insufficient; exact exception required. |
| Test path authorized only by a glob/directory | Insufficient; exact exception or reissued descriptor required. |
| `validation-engine.ts`, evaluator classification/policy, workflow, config or protected input | Insufficient; exact exception required. |
| Architecture, public contract, security, data, release, waiver or exit-gate decision | Insufficient under ADR-0013. |
| Failed/timed-out command, failed/missing check, missing evaluator, content mutation, identity/scope/DAG drift | Never sufficient; block. |

### Migration

The signed `PKG-AF-I2-I5-001` authority and all TASK-040 approvals/evidence are
immutable. They are not reinterpreted and PWD-AF-003 is not backfilled with a
package use.

After the downstream runtime is integrated and state-closed through an exact
architecture/evaluator approval, issue a new owner-signed package at that new
`main` baseline. Its descriptors must enumerate every package-scoped test file
literally and classify any task needing existing-line test edits or policy work
as an exact exception. Completed work is represented as an integrated task
predecessor, not as a fabricated consumed descriptor. The fresh authority proof
uses a new task ID and descriptor under the reissued package.

## Threat model

The rule prevents an executor with repository and GitHub credentials from using
a broad descriptor to change its judge, rewriting an existing assertion while
preserving test counts, normalizing away a byte difference, hiding a deletion,
or converting failed validation into approval. It also prevents retroactive use
of the old package. It does not prove that newly appended tests are useful; the
signed descriptor, deterministic commands, full CI and later review/exit gates
remain the quality controls. Owner-key compromise remains governed by ADR-0013
revocation and rotation.

## Consequences

- Routine tasks can add frozen regression coverage without requesting a new
  signature per PR.
- Any mutation to existing evaluator bytes remains deliberately interactive.
- Descriptors become more precise because evaluator paths cannot rely on globs.
- `PackageUseReceipt` must evolve so audit data never claims the underlying
  `REVIEW_REQUIRED` validation was `PASS`.
- A new package signature is required once after the runtime correction; the
  current package cannot resume PWD-AF-004.

## Required downstream implementation boundary

The next rolling-wave task must implement a versioned additive-test
classification in package authorization, Git-baseline blob comparison, evolved
PUSE validation/audit fields and focused positive/negative proofs. It may change
only the package authorization/lifecycle integration and their tests/docs. It
must preserve `validation-engine.ts` classification and receipt semantics,
ADR-0010 fallback channels, CI, authority closure, Supervisor scheduling and
all exact exception classes. It must not sign/reissue a package, execute the
fresh proof, TASK-004 or I3.

## Rollback

Disable package authorization for `REVIEW_REQUIRED` receipts. New work returns
to independent GitHub review or exact durable approval. Preserve every package,
PUSE and exact approval as append-only history; never reinterpret or delete it.
