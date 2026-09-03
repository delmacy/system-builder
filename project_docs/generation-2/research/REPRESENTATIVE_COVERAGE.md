# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Historical coverage in prior revisions, capability dossiers and state history remains authoritative; this compact ledger does not revoke omitted cells.

## Cycle authority
Cycles 2–6 completed for all 25 active capabilities. Every cycle-6 pass produced material findings; none was saturated.

## Revisit cycle 7
Completed so far: Universal Capability Architecture; Process & Application Modeling; UI / Generated Experience / Low-code Builder; Adaptive Governed Work Surfaces; Workflow & Durable Execution; Integration & Automation; Identity / Authentication / Federation; Authorization / Policy / Organization / Multitenancy; Data / Schema / Migrations; Storage / Documents / Media; Notifications / Events / Messaging; Build / Dependency Graph / Reproducibility; Artifact / Release / SBOM / Provenance; Deployment / Environment / Runtime.

### Deployment / Environment / Runtime — revisit 6
Kubernetes Deployment + Pod readiness/observedGeneration: `DEEP`; Argo Rollouts traffic/analysis/rollback-window semantics: `DEEP`; Google Cloud Run revision/traffic migration: `DEEP`; HashiCorp Nomad update/canary/blue-green semantics: `DEEP`; Amazon ECS circuit-breaker/failure-detection/rollback eligibility: `DEEP`. Findings `G2-FINDING-DER-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped deployment/runtime qualification, typed admission/attempt/realization/traffic/readiness identities, revision-qualified readiness, evidence replay horizons, mixed provider support vectors, ambiguous rollout reconciliation, residual replica/session/cache/consumer drainage, qualified local Station closure and AGWS/AI non-amplification.

### Artifact / Release / SBOM / Provenance — revisit 6
SLSA v1.2 Provenance + Verification Summary Attestation: `DEEP`; Sigstore/Cosign bundles + signed timestamps: `DEEP`; OCI Distribution Specification digest/tag/referrers/native-vs-fallback discovery/conditional mutation: `DEEP`; CycloneDX composition completeness: `DEEP`; The Update Framework roles/version/expiration/anti-rollback: `DEEP`; in-toto layouts/link metadata/authorized functionaries: `DEEP`. Findings `G2-FINDING-ARSP-46..53`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped release qualification, typed artifact/evidence/release/channel/consumer identity, signing-time versus current trust, composition-scoped SBOM uncertainty, delegated verification, registry evidence-discovery semantics, consumer-relative freshness/anti-rollback, residual alias/referrer/cache/consumer drainage, qualified offline closure and AGWS/AI non-amplification.

### Build / Dependency Graph / Reproducibility — revisit 6
Bazel remote cache/remote execution + prior hermeticity evidence: `DEEP`; Nix sandboxing/store-closure + prior reproducibility evidence: `DEEP`; Gradle dependency locking/verification/cache: `DEEP`; SLSA Build v1.2 isolation/ephemeral/cache-poisoning/provenance boundaries: `DEEP`; GitHub Actions dependency cache trust/scopes/eviction: `DEEP`. Findings `G2-FINDING-BDGR-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped build claims, typed source/resolution/material/build/evidence lineage, byte-vs-semantic-vs-isolation-vs-hermeticity claims, dependency/cache evidence horizons, mixed support vectors, ambiguity reconciliation, provider/toolchain cutover with residual cohorts, offline Station closure and AGWS/AI non-amplification.

### Notifications / Events / Messaging — revisit 6
Apache Kafka delivery semantics/idempotent+transactional producer/consumer offsets/Kafka Streams exactly-once scope: `DEEP`; Amazon SQS FIFO deduplication/visibility timeout/DLQ+redrive: `DEEP`; RabbitMQ quorum queues/publisher confirms/consumer acknowledgements/dead-lettering: `DEEP`; Google Cloud Pub/Sub ordering/redelivery/dead-letter behavior: `DEEP`; prior Generation-2 event research: `DEEP`. Findings `G2-FINDING-NEM-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: applicability-scoped event/delivery/effect claims, typed lineage, atomic-domain-relative exactly-once, reconcile-before-retry, evidence replay horizons, mixed provider support vectors, residual message/checkpoint/consumer drainage, qualified offline Station closure and AGWS/AI non-amplification.

### Identity / Authentication / Federation — revisit 6
NIST SP 800-63B-4 session management/AAL/reauthentication/federation session boundaries: `DEEP`; SPIFFE Trust Domain and Bundle/Federation/Workload API: `DEEP`; NIST syncable-authenticator guidance: `DEEP`; Keycloak offline-session/offline-token semantics: `DEEP`; prior CAEP/OIDC Federation/Logout/Token Exchange Generation-2 identity research: `DEEP`. Findings `G2-FINDING-IAF-45..52`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Authorization / Policy / Organization / Multitenancy — revisit 6
OpenFGA immutable-model pinning/contextual tuples/model migration: `DEEP`; OPA bundles/status/decision logs/discovery: `DEEP`; Kubernetes RBAC escalation/bind/impersonation and good practices: `DEEP`; Cedar permit/forbid/default-deny plus schema validation/evolution: `DEEP`; SpiceDB ZedToken consistency/exact-snapshot expiry/expiring relationships: `DEEP`. Findings `G2-FINDING-APOM-45..52`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Data / Schema / Migrations — revisit 6
PostgreSQL logical decoding/replication slots/replica identity/DDL replication restrictions: `DEEP`; CockroachDB staged online schema changes/schema-version leases/convergence: `DEEP`; Google Cloud Spanner long-running schema updates/multiple internal schema versions/backfill/retention pressure: `DEEP`; Debezium offsets/schema history/incremental snapshot checkpoints: `DEEP`; Confluent Schema Registry directional/transitive compatibility: `DEEP`. Findings `G2-FINDING-DSM-45..52`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Storage / Documents / Media — revisit 6
Amazon S3 Object Lock/Versioning/Lifecycle/delete-marker semantics: `DEEP`; Google Cloud Storage soft delete/Object Versioning/Lifecycle/bucket+object restore: `DEEP`; prior Azure Blob versioning/immutability/object replication/leases: `DEEP`; prior MinIO object lock/versioning: `DEEP`. Findings `G2-FINDING-SDM-45..52`; eight material new findings; consecutive-no-material = 0; NOT SATURATED.

## Historical authority
Detailed representative coverage for all other capabilities remains authoritative in their dossiers, earlier ledger revisions and `RESEARCH_PIPELINE_STATE.json` history.