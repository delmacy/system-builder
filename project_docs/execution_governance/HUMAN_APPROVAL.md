# Human Approval

The repository supports three explicit lifecycle authority modes:

- `DEVELOPMENT_TRUSTED` — current pre-V1 mode for low/medium-risk tasks with `architecture_impact: false`.
- `SOLO_DURABLE` — signed owner decision through the external Ed25519 receipt store.
- `TEAM_INDEPENDENT` — independent GitHub `APPROVED` review.

The active policy is committed in `tooling/agent-harness/policies/HUMAN_APPROVAL.json`. Switching modes changes future lifecycle evaluation only; historical receipts keep their recorded authority channel.

## Development-trusted phase

During pre-V1 development, routine work may proceed without a GitHub review, owner signature or package authorization when all deterministic controls pass. The lifecycle receipt records `approval_channel: DEVELOPMENT_TRUSTED`; it must never pretend that a human approval occurred.

Development trust is available only when:

- task risk is `low` or `medium`;
- `architecture_impact` is `false`;
- PR identity matches the recorded task/state identity;
- all named required checks succeed;
- validation is not `FAIL`;
- the PR observation is known;
- no review has requested changes.

High-risk or architecture-impact work does not receive development trust and continues to require an existing explicit authority channel. CI, validation, scope, DAG/dependency checks, evidence, ledger, readiness and state closure remain mandatory in every mode.

`DEVELOPMENT_TRUSTED` is intentionally a delivery-phase policy, not a production release policy. Before V1 hardening/release, switch the repository back to `SOLO_DURABLE` or `TEAM_INDEPENDENT` and reassess which operations require stronger approval.

## Durable Human Approval

ADR-0010 permits a signed owner decision only when `HUMAN_APPROVAL.json` explicitly selects `SOLO_DURABLE`. `TEAM_INDEPENDENT` requires GitHub `APPROVED`. The repository keeps the `delmacy` public key configured so durable mode can be reactivated without recreating the trust identity.

### Trust boundary

Generate an Ed25519 key outside the repository and outside any environment accessible to coding executors. Commit only the public key and authorized identity. There is intentionally no signing command in the harness. The human signs the exact UTF-8 output of `humanApprovalSigningPayload`; `approval_id` is `humanApprovalId` of that same semantic payload. Set `SYSTEM_BUILDER_HUMAN_APPROVAL_DIR` to an absolute external directory and store the signed receipt append-only as:

`TASK-ID-PR-NUMBER-HEADSHA.json`

The external store avoids circular self-authorization. The decision may occur after a historical merge, but its `approved_at` records the actual new decision time. It never changes GitHub review history.

### Mandatory durable properties

The receipt must bind repository, task/risk, architecture flag, PR, base/head refs, head SHA, approver/key, policy version, decision, rationale and timestamp. Invalid/missing/stale/future signatures fail closed. CI and validation remain mandatory. Rotation changes policy version and authorized public keys; historical receipts remain immutable.

## Bounded package authorization

ADR-0013 keeps a package channel for immutable task descriptors. One owner signature can bind a canonical package plan; deterministic conformance then binds each rolling-wave task and exact PR/state identity to one unused descriptor. Package-use receipts are audit evidence, not signatures.

Package authority never overrides failed CI/validation, identity/evidence mismatch or scope/DAG drift. ADR/public-contract acceptance, security/evaluator policy, destructive data/release actions and waivers can still be classified as explicit exceptions when stronger governance is re-enabled.

### Implemented external layout

TASK-038 implements package evaluation. Its signed artifacts use the existing external store:

```text
packages/<PACKAGE-ID>/<PLAN-HASH>/plan.json
packages/<PACKAGE-ID>/<PLAN-HASH>/approval.json
packages/<PACKAGE-ID>/<PLAN-HASH>/revocations/*.json
```

Content-derived `PackageUseReceipt` audit records are written append-only under ignored `.agent/package-uses/<PACKAGE-ID>/`; they are evidence, not signing authority. Reobservation of the same exact PR/action is idempotent. A different PR cannot reuse that descriptor action, and state use requires the accepted implementation use in its causal chain.

Lifecycle authority remains explicit in the receipt: independent GitHub review, exact ADR-0010 durable approval, valid package authority, or the bounded pre-V1 `DEVELOPMENT_TRUSTED` channel. No mode may override deterministic validation or identity failures.
