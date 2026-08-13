# ADR-0010 — Durable human approval for solo governance

Status: Accepted

## Context

The hardened AgentFactory lifecycle requires a GitHub `APPROVED` review for architecture and high-risk work. That is appropriate for team operation, but GitHub does not permit a pull-request author to approve their own PR. In legitimate solo operation the accountable human can review the exact PR and accept its risk, yet the lifecycle cannot observe that decision. Treating merge, a comment, repository ownership or an unsigned JSON document as approval would let an executor sharing the maintainer environment impersonate that authority.

## Options considered

| Option | Result |
| --- | --- |
| GitHub approval only | Strong in teams, but permanently blocks legitimate solo operation. |
| Unsigned owner attestation in Git or GitHub | Rejected: shared credentials do not separate a coding executor from the human authority. |
| Signed durable human approval | Selected: explicit, PR/SHA-bound, append-only and independently verifiable without weakening CI. |

## Decision

Introduce a versioned `HumanApprovalReceipt` verified with an authorized Ed25519 public key. The private key remains outside the repository and outside the coding executor's accessible environment. The signed payload binds repository, task, risk, architecture impact, PR number, base/head refs, head SHA, decision, rationale, timestamp, approver/key identity and governance policy version. The approval identifier is content-derived and the signature is excluded from the canonical signed payload.

Approval policy is explicit and fail-closed:

- `TEAM_INDEPENDENT` (default): an independent GitHub `APPROVED` review is required; durable solo approval cannot satisfy the gate.
- `SOLO_DURABLE`: either GitHub `APPROVED` or a valid signed approval from a configured authority may satisfy the human-review gate.
- unknown modes, identities, keys, policies, malformed signatures, stale timestamps, future timestamps, mismatched task/PR/ref/SHA/repository, or `REJECTED` decisions block.

Required validation and named CI checks remain mandatory in every mode. Merge is never approval. Historical merged PRs remain unapproved unless the accountable human makes and signs a new explicit decision for their exact immutable identity. Executors and planner/LLM components may read and validate receipts but have no signing API and may not receive the private key.

Receipts are append-only evidence. Corrections produce a new linked decision; history is not rewritten. Multi-reviewer policies may later require multiple signatures through another accepted contract revision, but `TEAM_INDEPENDENT` remains available and conservative.

## Consequences

- Solo operation gains a legitimate observable approval authority without fabricating GitHub review state.
- Human key custody becomes an operational security responsibility; key compromise requires policy rotation and explicit revocation handling.
- A human action is required to generate each signed decision. Automation must stop when no valid receipt exists.
- The lifecycle receipt must identify which approval channel satisfied review while preserving the raw GitHub review observation.

## Rollback

Set policy to `TEAM_INDEPENDENT` or remove the authorized key. Existing signed receipts remain historical evidence but no longer satisfy new evaluations. Do not delete or rewrite them.
