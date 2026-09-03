# Generation 2 — Finding Index

Prior stable findings remain authoritative in their capability dossiers, earlier index revisions and pipeline history. Compacting this index does not revoke them.

## Cycle 7 — Build / Dependency Graph / Reproducibility revisit 6
- **G2-FINDING-BDGR-45** — Effective build/reproducibility is an applicability-scoped claim across source, build definition, dependency graph/material, toolchain/platform, hermeticity/network profile, provider/cache trust, conformance policy and evidence horizon; no job status, source revision or output digest is globally authoritative.
- **G2-FINDING-BDGR-46** — Source revision, dependency intent, resolution attempt, graph/lock snapshot, dependency material, toolchain, build attempt, cache entry, output and build evidence are distinct typed identities; lifecycle facts at one boundary cannot stand in for another.
- **G2-FINDING-BDGR-47** — Reproducibility/conformance is revision-qualified and profile-relative: byte identity, semantic conformance, isolation and hermeticity are independent claims, and SLSA isolation must not be interpreted as hermeticity.
- **G2-FINDING-BDGR-48** — Dependency locking and material integrity have separate evidence horizons; stable coordinates/lock state cannot prove stable bytes, while expired repositories, verification metadata or trust roots can make later rebuild proof `INCONCLUSIVE/UNAVAILABLE` without rewriting historical truth.
- **G2-FINDING-BDGR-49** — Cache state is trust- and retention-qualified evidence, not reproducibility truth: restored cache content may be untrusted, cache read/write authorities differ, cache hit does not prove independent rebuild, and eviction limits future replay/rebuild evidence.
- **G2-FINDING-BDGR-50** — Build portability is a mixed support vector across dependency/resolution/verification semantics, hermeticity/network controls, toolchain/platform, remote execution, cache trust, byte determinism, semantic-conformance hooks, provenance, offline behavior and evidence retention; binary provider compatibility is unsafe.
- **G2-FINDING-BDGR-51** — Build-provider/toolchain cutover closes only after representability and comparison proof plus explicit drainage/disposition of residual workers, cache scopes, queued/running attempts, resolver state and build cohorts; destination success alone is insufficient.
- **G2-FINDING-BDGR-52** — Qualified local/offline Station builds and AGWS/AI composition are non-amplifying: local closure is limited to delegated material/toolchain/proof profiles, reconnect must requalify policy/trust/material state, and build invocation cannot silently grant dependency/toolchain/cache-write/attestation/release authority.

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