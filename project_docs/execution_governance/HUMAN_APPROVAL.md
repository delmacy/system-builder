# Durable Human Approval

ADR-0010 permits a signed owner decision only when `HUMAN_APPROVAL.json` explicitly selects `SOLO_DURABLE`. `TEAM_INDEPENDENT` requires GitHub `APPROVED`. The repository currently authorizes the `delmacy` public key in solo mode.

## Trust boundary

Generate an Ed25519 key outside the repository and outside any environment accessible to coding executors. Commit only the public key and authorized identity. There is intentionally no signing command in the harness. The human signs the exact UTF-8 output of `humanApprovalSigningPayload`; `approval_id` is `humanApprovalId` of that same semantic payload. Set `SYSTEM_BUILDER_HUMAN_APPROVAL_DIR` to an absolute external directory and store the signed receipt append-only as:

`TASK-ID-PR-NUMBER-HEADSHA.json`

The external store avoids circular self-authorization. The decision may occur after a historical merge, but its `approved_at` records the actual new decision time. It never changes GitHub review history.

## Mandatory properties

The receipt must bind repository, task/risk, architecture flag, PR, base/head refs, head SHA, approver/key, policy version, decision, rationale and timestamp. Invalid/missing/stale/future signatures fail closed. CI and validation remain mandatory. Rotation changes policy version and authorized public keys; historical receipts remain immutable.

## Bounded package authorization

ADR-0013 accepts a future package channel for 20–50 immutable task descriptors.
One owner signature binds the canonical package plan; deterministic conformance
then binds each rolling-wave task and exact PR/state identity to one unused
descriptor. Package-use receipts are audit evidence, not signatures.

The package channel is not active until its downstream schemas, evaluator,
external-store adapter, lifecycle integration and proof are integrated. Until
then, ADR-0010 exact `SOLO_DURABLE` or independent GitHub approval remains
mandatory.

Even after activation, a package never overrides failed CI/validation,
identity/evidence mismatch or scope/DAG drift. ADR/public-contract acceptance,
security/evaluator policy, destructive data/release actions and waivers require
an exact exception or independent review. Expired, revoked, suspended or
exhausted packages fail closed.
