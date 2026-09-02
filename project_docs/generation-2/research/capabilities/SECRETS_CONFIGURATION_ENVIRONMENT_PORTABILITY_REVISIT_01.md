# Generation 2 Research — Secrets / Configuration / Environment Portability — Revisit 01

Status: REVISIT_CYCLE_2_PASS_1_COMPLETE / NOT_SATURATED

## Research question

Which universal primitives preserve secret/config semantic identity, effective runtime binding, freshness, recovery and provider replaceability without leaking provider locators or secret material into portable definitions, releases or audit evidence?

## Representatives

| Representative | Coverage | Revisit contribution |
|---|---|---|
| HashiCorp Vault | DEEP | Lease identity, renew/revoke, response wrapping, single-use bootstrap handoff, agent auto-auth/materialization. |
| Kubernetes Secrets + External Secrets Operator | DEEP | Declared external reference versus reconciled target, refresh/freshness evidence, immutable target semantics, ownership/deletion and source-change detection. |
| AWS Secrets Manager | DEEP | Version/stage identity, asynchronous multi-step rotation, pending/current/previous lineage and incomplete-rotation failure semantics. |
| SOPS | DEEP | Encrypted configuration artifact identity versus decrypting identity/key-provider availability; online/offline recipient portability and disaster-recovery path. |
| Twelve-Factor Config | DEEP | Deploy-varying configuration remains outside code; environment transport is useful but not secret lifecycle authority. |

## Evidence/source ledger

- Vault lease documentation: every dynamic secret/service token has lease metadata, TTL, renewability and revocation; expiry means a consumer can no longer assume validity. Lease ID is lifecycle identity, not the semantic secret requirement.
- Vault response wrapping: a response can be replaced by a short-lived single-use wrapping token; lookup/creation-path validation and unwrap are distinct steps. This is evidence that bootstrap/handoff authority may be deliberately narrower than disclosure authority and has its own TTL/consumption lifecycle.
- Vault Agent auto-auth: runtime authentication and sink/materialization can be separated, including wrapped or encrypted sinks. Runtime bootstrap therefore has a distinct realized-authentication/materialization path.
- External Secrets Operator: `ExternalSecret` declares remote refs and target transformation; `refreshPolicy` may be CreatedOnce, Periodic or OnChange. `status.refreshTime` and `syncedResourceVersion` record observed synchronization state. Provider-side deletion/change is not observed until a reconciliation mode actually checks it.
- Kubernetes Secrets: immutable Secrets cannot have `data` mutated after immutability is enabled. Immutability constrains the materialized target but does not prove current source freshness.
- AWS Secrets Manager: rotation is asynchronous and staged. `AWSPENDING`, `AWSCURRENT` and `AWSPREVIOUS` label versions; test and finish are distinct lifecycle steps, and incomplete pending state can block subsequent rotation.
- SOPS: encrypted configuration can use offline identities (age/PGP) or online key systems/KMS/Vault. The encrypted document survives provider variation only if at least one authorized decrypting identity/key path remains usable.
- Twelve-Factor: deploy-varying config should remain outside code. This supports separation but does not define lease, rotation, reconciliation, bootstrap or provider continuity semantics.

## Source of truth and identity

Portable definition owns logical `ConfigRequirementIdentity` / `SecretReferenceIdentity`, sensitivity/type and required capability/freshness semantics. Environment/deployment binding owns provider selection/locator and binding revision. Provider owns provider object/version/lease. Materializer/runtime owns a concrete realization attempt/result. Bootstrap transport owns any one-time handoff credential/token used to establish runtime authority.

Required distinct identities after this revisit:

1. logical config/secret requirement;
2. provider binding revision;
3. provider object/version/lease;
4. resolution attempt/result;
5. materialization/synchronization attempt/result;
6. runtime-consumption observation when proof is required;
7. bootstrap/handoff token or initial credential;
8. key/decrypting trust-context revision for encrypted config.

## Lifecycle and versioning

`declare -> bind -> authenticate/bootstrap -> resolve -> materialize/synchronize -> consume -> observe freshness -> renew/rotate/rebind -> revoke/expire/supersede -> retire`

Provider version change is not equivalent to effective runtime change. A new AWS `AWSCURRENT`, new Vault lease, or changed remote secret may exist while a runtime still holds stale material. Binding revision, provider version, reconciliation revision/time and observed runtime-consumption revision are independent axes.

## Failure semantics

In addition to prior failures, this revisit makes explicit:

- `BOOTSTRAP_HANDOFF_EXPIRED_OR_CONSUMED` — one-time/TTL bootstrap authority cannot establish runtime identity.
- `SOURCE_CHANGED_TARGET_NOT_REFRESHED` — provider truth changed but configured reconciliation has not materialized it.
- `MATERIALIZED_BUT_NOT_OBSERVED_CONSUMED` — delivery succeeded but no evidence establishes current runtime use.
- `DECRYPTION_TRUST_UNAVAILABLE` — encrypted config exists but no authorized/current key path can decrypt it.
- `REBIND_CONTINUITY_UNPROVEN` — replacement provider/binding exists but continuity of required semantic secret/config capability has not been proven.
- `ROTATION_PROPAGATION_INCOMPLETE` — provider rotation completed while one or more required materialization/consumer scopes remain stale.

Fail-open/fail-closed remains explicit use-case policy, not an adapter default.

## Extensibility and provider boundaries

Provider adapters declare only real capabilities: static version lookup, moving alias/stage, dynamic issuance, lease renewal/revocation, rotation, metadata inspection, wrapping/bootstrap, encrypted-document key unwrap, reconciliation/materialization and freshness observation. Missing capabilities remain missing.

The universal plane must not standardize ARN/Vault path/Kubernetes Secret/SOPS recipient syntax. It standardizes requirement, binding, capability claim, freshness/expiry expectation, materialization mode, evidence identity and failure semantics.

## Governance, observability and disclosure boundary

Authority to *use* a secret without exposing plaintext is not necessarily authority to *read/disclose* it. Agent/proxy/sink/injection mechanisms can preserve this distinction. Governance should model binding authority, bootstrap authority, runtime-use authority, disclosure authority, rotation/revocation authority and exception authority separately where the provider/runtime can enforce them.

Telemetry/audit is metadata-first: logical ref, binding revision, provider class, safe version/lease identifier, operation, outcome, freshness timestamp, actor/runtime identity and redaction lineage. No plaintext or reversibly derived secret payload belongs in ordinary evidence.

## Portability, lock-in and recovery

Provider replacement is not proven by changing a locator. It must re-establish authentication/bootstrap, required provider capabilities, key/decryption reachability, version/freshness semantics, materialization mode and consumer continuity. SOPS shows a useful complementary pattern: an encrypted document may be portable across online and offline key paths, but availability of the ciphertext alone is not recoverability; decryption trust must remain available.

Generated-runtime autonomy means ordinary restart/renew/refresh can proceed with deployment-local/provider-local authorities after Builder loss. If a runtime needs the Builder to mint bootstrap authority on every restart, autonomy is not achieved.

## Product-specific mechanisms versus universal primitives

Product-specific: Vault wrapping token and lease ID; AWS stages; ExternalSecret refresh/target policy; Kubernetes Secret immutability; SOPS recipient/key-group configuration; env-var names.

Universal: logical requirement; binding revision; bootstrap/handoff identity; provider capability claim; provider version/lease; resolution/materialization attempt/result; freshness/propagation evidence; disclosure-safe audit; decrypting trust context; rebind continuity proof.

## Convergent and divergent patterns

Convergent: logical requirement survives provider/material change; provider-side validity and runtime-side effective use are not the same fact; bootstrap has narrower and often shorter-lived authority; freshness needs an observation boundary; audit can avoid plaintext; provider replacement requires capability continuity.

Divergent: static versus leased secrets; pull versus push/materialization; one-time versus periodic/on-change refresh; online vault/KMS versus encrypted file/offline recipients; disclosure-capable clients versus use-without-disclosure injection; mutable target versus immutable replacement.

## Subcapabilities

- Logical secret/config requirements.
- Environment/deployment provider binding.
- Runtime bootstrap / secret-zero handoff.
- Resolution and materialization evidence.
- End-to-end rotation/freshness propagation.
- Lease/renew/revoke.
- Disclosure-versus-use authority.
- Encryption/decryption trust-context continuity.
- Provider rebind continuity/recovery proof.
- Sensitive telemetry redaction lineage.

## Bounded comparison with fresh `main`

Fresh `main` `.env.example` explicitly keeps real credentials out of Git and exposes environment-specific PostgreSQL URLs. This is evidence for externalized deploy configuration, not evidence of typed logical secret references, provider binding, lease/rotation, freshness or bootstrap contracts. The file also embeds concrete transport variable names and connection-URL shapes, so repository archaeology must later determine whether these are merely current deploy mechanisms or leak into portable/generated contracts.

No absence claim is made from search misses. Later `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION` must inspect runtime/deploy contracts and tests systematically.

## Reconciliation hypotheses

- **KEEP** — secrets/config remain outside immutable product/release content.
- **HARDEN** — distinguish provider truth, materialization truth and runtime-effective freshness evidence.
- **GENERALIZE** — model logical requirements, bootstrap handoff and rebind continuity separately from provider syntax.
- **PROVIDERIZE** — Vault/AWS/Kubernetes/SOPS/key systems remain external provider mechanisms with explicit capability negotiation.
- **INTEGRATE** — binding revision and effective-materialization evidence attach to Environment/Deployment without transferring deployment authority to Secrets.
- **DEFER** — centralized enterprise rotation orchestration UI until archaeology/product proof demonstrates necessity.
- **DO_NOT_BUILD** — proprietary vault/KMS or universal cryptographic key service.

## Repo-validation questions

- Do runtime/deploy contracts distinguish logical requirement, environment binding, provider locator and materialization result?
- Can a generated runtime restart after Builder loss without acquiring new Builder-minted bootstrap authority?
- Is there evidence of which secret/config revision a running runtime actually consumed?
- Are environment variables the only materialization mechanism or one provider-specific path?
- Are provider/key locators present in portable SystemDefinition/IR or only deployment-local state?
- Can logs, deployment evidence or artifact metadata accidentally contain full connection strings/secret values?
- How would a provider swap preserve logical requirement identity while proving rotation/freshness continuity?

## Symbiotic Proof

One portable runtime declares `primary-database-credential`. Environment A uses Vault dynamic credentials; a short-lived bootstrap identity establishes Vault access, a lease is issued and renewed, and evidence records lease/materialization metadata without plaintext. Environment B binds the same logical requirement to AWS Secrets Manager; rotation moves `AWSCURRENT`, but acceptance is withheld until deployment-local synchronization and runtime-consumption freshness are evidenced. Environment C stores encrypted configuration with SOPS and has both an online KMS recipient and an offline recovery identity. The Builder can disappear after deployment; each runtime can restart/refresh using provider-local/deployment-local authority. Replacing A with another provider changes binding/trust/materialization lineage but not the logical requirement or portable definition.

## Stable findings

- **G2-FINDING-SCEP-11 — Declared Binding, Provider Resolution, Materialization and Effective Runtime Consumption Are Distinct Evidence.** A valid binding or successful source read does not prove the runtime currently holds/uses the intended revision.
- **G2-FINDING-SCEP-12 — Secret Disclosure Authority and Use-Without-Disclosure Authority Are Distinct.** Injection/agent/sink mechanisms can allow a runtime to use material without granting operators/intermediaries equivalent plaintext-read authority.
- **G2-FINDING-SCEP-13 — Secret-Zero / Bootstrap Handoff Has Its Own Identity, TTL and Consumption Lifecycle.** One-time wrapping/bootstrap credentials are not the secret being bootstrapped and must not become a permanent control-plane dependency.
- **G2-FINDING-SCEP-14 — Rotation Success Is Not End-to-End Freshness; Propagation to Materializers and Consumers Is a Separate Proof Obligation.** Provider `current` state may advance while runtime material remains stale.
- **G2-FINDING-SCEP-15 — Encrypted Configuration Availability and Decryptability/Recovery Are Separate Proofs.** Retaining ciphertext does not prove that an authorized, current trust/key path can recover it offline or during provider outage.
- **G2-FINDING-SCEP-16 — Provider Replacement Requires Rebind Continuity Proof, Not Locator Substitution.** Authentication/bootstrap, capability, key/trust, version/freshness and materialization semantics must be re-established while logical requirement identity remains stable.

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-EFFECTIVE-SECRET-CONSUMPTION-FRESHNESS-EVIDENCE` — CROSS_CUTTING. Connect provider version/binding/materialization to observed runtime-effective revision without disclosing material.
- `G2-CAPABILITY-CANDIDATE-RUNTIME-BOOTSTRAP-HANDOFF-LIFECYCLE` — CROSS_CUTTING. One-time/TTL bootstrap authority appears structurally separate from steady-state secret authority and intersects Identity/Deployment/Runtime autonomy.
- `G2-CAPABILITY-CANDIDATE-SECRET-PROVIDER-REBIND-CONTINUITY-PROOF` — CROSS_CUTTING. Provider replacement needs explicit semantic continuity across auth, trust, freshness and materialization; synthesis must determine whether this is a generic provider-replacement primitive.

## Value / risk / priority / next question

Value: VERY_HIGH. Risk: VERY_HIGH if source truth is conflated with effective runtime state or Builder-owned bootstrap becomes a restart dependency. Priority: FOUNDATION/CROSS_CUTTING.

Next question: during the next revisit, test whether effective-consumption/freshness proof can be represented generically across secret pull, sidecar/agent, file/env injection and externally reconciled targets without requiring secret-value observation.
