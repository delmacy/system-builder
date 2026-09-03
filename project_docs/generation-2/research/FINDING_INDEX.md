# Generation 2 — Finding Index

Prior stable findings remain authoritative in their capability dossiers, earlier index revisions and pipeline history. Compacting this index does not revoke them.

## Cycle 7 — Notifications / Events / Messaging revisit 6
- **G2-FINDING-NEM-45** — Effective event/delivery/effect guarantees are applicability-scoped claims over semantic contract/envelope, provider realization, topology/ordering scope, subscription/filter, consumer cohort, checkpoint epoch, dedup horizon, policy/trust and evidence horizon; no broker status is globally authoritative.
- **G2-FINDING-NEM-46** — Occurrence, envelope, publication attempt, broker acceptance/persistence, delivery attempt, acknowledgement/checkpoint and consumer effect are distinct identities and lifecycle facts; acknowledgement at one boundary cannot prove downstream effect.
- **G2-FINDING-NEM-47** — Delivery/effect conformance is revision-qualified and atomic-domain-relative; broker or stream exactly-once semantics cannot be extended to arbitrary external side effects without shared transactional/idempotent coordination.
- **G2-FINDING-NEM-48** — Ambiguous publish/ack/effect outcomes require reconcile-before-retry; bounded deduplication and visibility/ack windows make blind retries capable of duplicating work.
- **G2-FINDING-NEM-49** — Messaging evidence has independent replay horizons across retained log/message, dedup state, checkpoint/offset, acknowledgement and DLQ/redrive lineage; expiry makes exact later proof unavailable without invalidating historical facts.
- **G2-FINDING-NEM-50** — Messaging provider portability is a mixed support vector across durability, ordering, replay, retention, deduplication, transactional coupling, acknowledgement, DLQ/redrive, filtering, partitioning, offline behavior and evidence; binary compatibility is unsafe.
- **G2-FINDING-NEM-51** — Provider cutover closes only after residual message, subscription, checkpoint, retry/DLQ and consumer cohorts from the source realization are drained or explicitly dispositioned; destination delivery success alone is insufficient.
- **G2-FINDING-NEM-52** — Qualified local/offline Station messaging and AGWS/AI composition are non-amplifying: local closure may permit only explicitly delegated event classes/actions, and reconnect must requalify policy/trust/provider/checkpoint state before privileged continuation.

## Cycle 7 — Identity / Authentication / Federation revisit 6
- **G2-FINDING-IAF-45** — Authentication claims require explicit applicability across relying party/Station, purpose, assurance, authenticator/session class, federation/trust, provider, policy and evidence horizon.
- **G2-FINDING-IAF-46** — Authentication assurance is a revision-qualified relation; credential validity or historical login cannot self-prove current assurance.
- **G2-FINDING-IAF-47** — Federated IdP and RP sessions are independent lifecycle identities; upstream session termination cannot be treated as downstream closure proof.
- **G2-FINDING-IAF-48** — Trust-bundle possession is necessary evidence, not perpetual trust; trust-domain association and currentness qualify validation.
- **G2-FINDING-IAF-49** — Identity stability/support is a mixed vector across mapping, authenticator, assurance, session, revocation, federation/trust, offline and evidence semantics.
- **G2-FINDING-IAF-50** — Provider/authenticator substitution requires residual session, credential, mapping and trust cohort drainage; destination login success does not close migration.
- **G2-FINDING-IAF-51** — Qualified offline authentication continuity does not imply current privileged authority; stale revocation/trust/policy/assurance requires reconnect requalification.
- **G2-FINDING-IAF-52** — Identity context is provenance and cannot amplify AGWS/AI authority into authorization, provider administration, account linking or canonical mutation.

## Historical authority
Detailed findings for all other capabilities remain authoritative in their dossiers, earlier index revisions and pipeline history.