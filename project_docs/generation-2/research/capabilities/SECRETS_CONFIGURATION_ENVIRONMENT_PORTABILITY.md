# Generation 2 Research — Secrets / Configuration / Environment Portability

Status: FIRST_DEEP_PASS_COMPLETE / NOT_SATURATED

## Research question

What universal primitives let a generated System Builder runtime consume configuration and secrets across environments without embedding provider locators or secret material into portable definitions/releases, while preserving explicit version, rotation, expiry, audit, failure, replacement and autonomy semantics?

## Representatives

| Representative | Coverage | Contribution |
|---|---|---|
| HashiCorp Vault | DEEP | Dynamic secrets, leases, renew/revoke, static-vs-dynamic distinction, agent materialization and explicit runtime resolution. |
| Kubernetes Secrets + External Secrets Operator | DEEP | Native materialized Secret, immutable target semantics, provider-backed logical references, reconciliation/refresh policies, ownership/deletion behavior. |
| AWS Secrets Manager | DEEP | Versioned secret values, staged rotation, scheduled rotation, idempotent rotation token/version identity and provider-managed lifecycle. |
| SOPS | PARTIAL | Encrypted configuration as portable version-controlled ciphertext; key-provider boundary is distinct from document identity. |
| Twelve-Factor Config | DEEP | Separation of deploy-varying config from code and orthogonal per-deploy configuration, with environment variables as a portability mechanism rather than a secret authority. |

## Evidence/source ledger

- Vault lease model: dynamic secrets and service tokens receive lease identity, TTL, renewability and revocation semantics; expiry invalidates the assumption that material remains valid. Source of truth: HashiCorp Vault documentation, `Lease, Renew, and Revoke`.
- Vault database secrets engine: generated credentials are instances associated with a `lease_id`, duration and renewability, showing logical role/configuration distinct from issued credential material. Source of truth: HashiCorp Vault database secrets engine docs.
- Kubernetes Secrets: native Secrets can be immutable; immutability prevents data mutation but does not itself provide external-provider resolution, rotation or portable logical identity. Source of truth: Kubernetes documentation.
- External Secrets Operator: `ExternalSecret` separates `secretStoreRef`, remote data reference, target Secret and refresh policy; synchronization may be CreatedOnce, Periodic or OnChange and status records refresh/resource-version evidence. Source of truth: External Secrets Operator API/docs.
- AWS Secrets Manager: rotation has explicit schedule/window; custom rotation uses `SecretId`, unique request/version token and staged create/set/test/finish lifecycle. Source of truth: AWS Secrets Manager docs/API.
- Twelve-Factor Config: deploy-varying configuration is separated from code and should be independently managed per deploy; environment variables are language/OS-agnostic transport, not a provider-neutral secret lifecycle model. Source of truth: 12factor.net config factor.
- SOPS: retained as PARTIAL in this pass; its architectural contribution is encrypted-at-rest configuration with external key recipients/providers. A revisit must deepen recipient/key-group rotation, MAC/integrity and recovery semantics before DEEP classification.

## Source of truth

The portable definition should own **logical configuration requirements and secret references**, not plaintext values and not provider-specific locators. A deployment/environment binding owns the resolution from logical requirement to a provider binding. A secret/config provider owns provider-side material and provider-specific lifecycle. The generated runtime owns only the minimum runtime-resolvable binding/materialization contract necessary to remain autonomous.

No single representative is universal authority: Vault is strong on leased credentials, External Secrets on reconciliation, AWS on staged managed rotation, SOPS on encrypted configuration artifacts, and Twelve-Factor on deploy-time separation.

## Identity

At minimum distinguish:

1. `ConfigRequirementIdentity` — logical named runtime configuration requirement.
2. `SecretReferenceIdentity` — logical secret requirement, provider-neutral.
3. `ProviderBindingIdentity` — environment/deployment-specific resolution binding.
4. `SecretProviderObjectIdentity` — provider-specific secret/container identity.
5. `SecretVersionIdentity` — immutable or provider-qualified version of stored material.
6. `CredentialLeaseIdentity` — issued ephemeral credential/lease instance when applicable.
7. `MaterializationIdentity` — a concrete injection/render/sync instance delivered to a runtime.

A URI, ARN, Vault path, Kubernetes Secret name or environment-variable name may participate in a binding, but none should become the universal logical secret identity.

## Lifecycle

Portable requirement lifecycle and secret-material lifecycle are separate.

`declare requirement -> bind per environment -> validate binding -> resolve/materialize -> consume -> refresh/renew/rotate -> supersede/revoke/expire -> remove binding`

Provider-side states vary. Vault may issue and revoke leased credentials; AWS can stage a new version through create/set/test/finish; External Secrets may reconcile periodically or only on change; an immutable Kubernetes Secret requires replacement rather than in-place mutation.

## Versioning

Config schema/revision, provider binding revision, secret value version and credential lease are independent axes. A runtime may stay on the same logical `database.password` requirement while its provider, provider object, version and issued material all change.

Rotation must therefore not mutate the logical requirement identity. Consumers that require pinning must be able to state an explicit version selector; consumers that follow a moving alias/stage must acknowledge that mutability in evidence.

## Failure semantics

Failures must be explicit and scoped:

- BINDING_MISSING — no environment-specific binding exists.
- BINDING_INVALID — provider/configuration cannot satisfy the declared requirement.
- RESOLUTION_UNAVAILABLE — provider cannot currently resolve material.
- MATERIALIZATION_FAILED — resolution succeeded or was attempted but injection/render/sync failed.
- SECRET_EXPIRED_OR_REVOKED — material is no longer valid.
- RENEWAL_FAILED — renewable leased material cannot be renewed.
- ROTATION_INCOMPLETE — a new version exists but activation/finish did not complete safely.
- STALE_MATERIAL — runtime has material older than declared freshness/refresh policy.
- ACCESS_DENIED — caller/runtime identity lacks resolution authority.

Fail-open versus fail-closed is capability/use-case policy and must never be hidden in a provider adapter.

## Extensibility

Provider adapters should implement bounded contracts such as capabilities for static versioned secret retrieval, dynamic credential issuance, lease renewal/revocation, rotation, metadata-only inspection and audit evidence. A provider that lacks a capability must declare that fact; adapters must not emulate stronger guarantees invisibly.

Configuration transforms/templates belong in a bounded materialization layer. They must not grant the transform engine authority to discover arbitrary provider secrets.

## Provider boundaries

Universal plane: logical requirement, sensitivity classification, optional type/schema, version/freshness constraint, materialization mode and evidence contract.

Binding plane: provider selection, provider locator, environment scope, runtime identity/authority reference and provider capability negotiation.

Provider plane: actual material, encryption/key implementation, secret versions, lease engines, provider ACLs and provider-native rotation.

Runtime plane: resolution/materialization client or already-materialized value as authorized for the deployment. Runtime must not need the System Builder control plane for ordinary secret resolution.

## Governance

Governance should cover who may create/change bindings, who may resolve values, which environments can bind which providers, allowed materialization modes, rotation/freshness policy, exception lifecycle and audit evidence.

Auditing should record references and metadata, not disclose secret values. Evidence should favor logical secret reference, binding revision, provider class, version/lease identifiers when safe, actor/runtime identity, operation, outcome and timestamps.

## Observability

Observe resolution success/failure, age/freshness, renewal/rotation status, materialization status and provider health without emitting plaintext. Telemetry must support redaction-by-construction: values and derived sensitive payloads are not ordinary attributes.

## Portability

Portability means a portable definition can preserve its logical config/secret requirements while an environment replaces Vault with AWS Secrets Manager, a cloud manager with External Secrets, or a direct materialization strategy with runtime resolution, subject to declared capability compatibility.

Environment variables are a useful materialization transport but do not supply versioning, lease, rotation, audit or provider replacement semantics by themselves.

## Lock-in

Lock-in appears when provider locators, provider ACL models, key identifiers, rotation stages or runtime SDK calls leak into the portable application definition. Provider-native features are allowed behind explicit bindings/capability negotiation; they must not silently redefine the universal primitive.

## Product-specific mechanism vs universal primitive

Product-specific mechanisms: Vault path/mount/namespace, AWS ARN and version stages, Kubernetes Secret/SecretStore names, ExternalSecret reconciliation fields, environment-variable names, SOPS recipient/key configuration.

Universal primitives: logical requirement/reference, sensitivity/type metadata, binding, version selector/freshness policy, materialization mode, provider capability, lifecycle evidence, failure semantics and runtime-autonomy requirement.

## Convergent patterns

- Secret/config requirement is distinct from concrete material.
- Runtime/deploy-varying values should not be baked into product code or immutable releases.
- Rotation/reconciliation creates new material state without changing the logical consumer requirement.
- Provider resolution requires independent authorization.
- Freshness/expiry/lease semantics must survive abstraction when materially relevant.
- Audit can prove operations without exposing values.

## Divergent patterns

- Static versioned values versus dynamic leased credentials.
- Pull/runtime resolution versus push/materialized injection.
- Mutable provider alias/stage versus immutable pinned version.
- Scheduled/provider-managed rotation versus externally reconciled synchronization.
- Plain deploy config versus sensitive secret material.
- Encrypted configuration artifact (SOPS) versus online secret authority (Vault/AWS).

## Subcapabilities

- Logical config/secret requirement modeling.
- Environment-scoped provider binding.
- Provider capability negotiation.
- Version/freshness/selector semantics.
- Dynamic lease issuance and renewal/revocation.
- Rotation orchestration/evidence.
- Materialization/injection/rendering.
- Encryption/key-recipient boundary.
- Sensitive telemetry/audit redaction.
- Binding/provider replacement and migration.

## Bounded comparison with fresh `main`

Fresh `main` evidence is deliberately limited. `.env.example` explicitly keeps deploy-specific database URLs outside committed code and warns that real credentials must never be committed. It currently exposes concrete PostgreSQL URLs for test/dev/prod environments, which proves environment-based configuration transport but not a universal secret/config capability.

ADR-0002 requires autonomous runtimes, states that release artifacts exclude secrets, and requires ordinary runtime operations to survive Builder outage. That is strong constitutional alignment with runtime-resolvable or deployment-materialized secret bindings, but it does **not** prove that a secret-provider abstraction, rotation engine, lease model or portable configuration schema already exists.

Repository-validation questions for the later current-state reconciliation phase:

- Which runtime/deploy contracts currently describe environment bindings and whether any may contain sensitive values?
- Are provider locators already separated from portable SystemDefinition/IR for all runtime dependencies?
- Are secrets only transported through process environment today, or are there typed refs/bindings elsewhere?
- Are credentials ever persisted in release/deployment/artifact evidence or logs?
- What runtime identity is used to resolve external providers, and is it generated-system-owned rather than Builder-owned?
- Can generated runtimes boot/restart after Builder loss using only deployment-local/provider-local authorities?

## Reconciliation hypotheses

- **KEEP** — ADR-0002 separation: releases exclude secrets and runtimes must remain autonomous.
- **KEEP + HARDEN** — current environment-based deploy configuration as one bounded materialization mechanism.
- **GENERALIZE** — represent logical config/secret requirements independently from concrete environment-variable or provider locator names.
- **PROVIDERIZE** — external secret authorities and key systems behind explicit bindings and declared capabilities.
- **INTEGRATE** — bind secret/config requirements into the existing Release + Environment -> Deployment model rather than creating an independent deployment authority.
- **DEFER** — rich enterprise secret-governance UI/central rotation orchestration until repository archaeology proves product need.
- **DO_NOT_BUILD** — a proprietary universal secret vault/cryptographic key manager when established providers can satisfy the provider plane.

## Symbiotic Proof

A portable generated system declares a logical `primary-database-credential` requirement without storing its value or provider locator. Environment A binds it to Vault dynamic database credentials and supplies a renewable lease; Environment B binds the same requirement to AWS Secrets Manager with a version/stage policy; Environment C materializes from an ExternalSecret into a runtime-local Kubernetes Secret. The generated runtime can start, resolve/use the credential, report metadata-only evidence, survive Builder outage, and replace provider binding without recompiling the portable definition. Provider-specific lease/rotation capabilities remain explicit rather than falsely normalized.

## Stable findings

- **G2-FINDING-SCEP-01 — Logical Secret/Config Requirement and Concrete Material Are Distinct Identities.** A portable consumer requirement must survive rotation, rematerialization and provider replacement.
- **G2-FINDING-SCEP-02 — Logical Reference and Provider Locator Must Be Separate.** ARN, Vault path, Kubernetes Secret name and similar locators belong to environment/provider bindings, not portable definition identity.
- **G2-FINDING-SCEP-03 — Secret Version, Credential Lease and Materialization Are Distinct Lifecycle Objects.** Static versioning, ephemeral issuance and delivery to a runtime carry different validity and recovery semantics.
- **G2-FINDING-SCEP-04 — Rotation Is a Multi-Step State Transition, Not an In-Place Value Mutation.** Create/test/activate/finish or equivalent provider semantics require evidence and failure handling.
- **G2-FINDING-SCEP-05 — Expiry, Revocation, Renewal and Freshness Must Remain Qualified Capabilities.** Abstraction must not flatten leased/dynamic credentials into timeless key/value secrets.
- **G2-FINDING-SCEP-06 — Materialization Transport Is Not Secret Authority.** Environment variables, mounted files and Kubernetes Secrets may deliver material but do not by themselves define its origin, version, rotation or authorization semantics.
- **G2-FINDING-SCEP-07 — Encryption at Rest Is Separate from Secret Lifecycle Authority.** Encrypted configuration artifacts and key recipients protect stored material but do not imply online resolution, lease or rotation semantics.
- **G2-FINDING-SCEP-08 — Audit and Observability Must Be Metadata-First and Disclosure-Safe.** Values must be excluded by construction while reference/binding/version/lease/operation evidence remains available.
- **G2-FINDING-SCEP-09 — Environment Portability Requires Binding Replacement Without Portable-Definition Mutation.** Provider swap should change environment/deployment binding where capability compatibility holds.
- **G2-FINDING-SCEP-10 — Runtime Autonomy Requires Runtime-Resolvable or Deployment-Local Secret Authority Independent of Builder Availability.** A generated system must not call the System Builder to obtain ordinary runtime credentials after deployment.

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-SECRET-MATERIALIZATION-EVIDENCE` — CROSS_CUTTING. Evidence that connects logical reference, binding revision, provider version/lease and concrete materialization without disclosing values.
- `G2-CAPABILITY-CANDIDATE-DYNAMIC-CREDENTIAL-LEASE` — CORE. Explicit lease/renew/revoke semantics recur in strong secret systems but must be proven broadly useful rather than provider-specific before promotion.
- `G2-CAPABILITY-CANDIDATE-SENSITIVE-TELEMETRY-REDACTION-CONTRACT` — CROSS_CUTTING. Redaction-by-construction for secrets/config evidence may warrant a reusable contract across audit, observability and provenance.

## Value / risk / priority / next question

Value: VERY_HIGH — this capability is constitutional to anti-lock-in and generated-runtime autonomy.

Risk: VERY_HIGH if logical refs, provider locators and secret values collapse into one model; that would bake providers into generated systems or make Builder availability a runtime dependency.

Priority: FOUNDATION before provider-binding synthesis and target runtime architecture.

Next question: after the remaining first-pass capabilities, revisit SOPS/key-recipient recovery plus cross-provider rotation/failure semantics and test whether dynamic credential lease deserves promotion or remains an optional provider capability.
