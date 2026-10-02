# Station S3 R7B — Provider / Tenant Portability Matrix 04

Date: 2026-09-30
Truth base: `main@d2cd9b404501781de90564b2029277efdfcb023f`
Status: research evidence only — non-authoritative
Predecessors: R7B Matrix 01–03

## Scope

Blocker-first falsification of the Matrix 01 Producer Independence Profile. This tranche asks whether portability can be represented without collapsing build-time, runtime, management-plane, data/config, provider substitution, and exit/rebuild into a single boolean. It does not introduce provider catalogs, infrastructure authority, tenancy authority, deployment authority, or Construction product behavior.

## Evidence matrix

| Evidence | Mature-system pressure | S3 disposition | Boundary |
|---|---|---|---|
| OpenTofu providers are separately released/versioned and declared as requirements | producer implementation and consumer configuration have independent identities/lifecycles | adopt-pattern | do not copy HCL/provider SDK |
| OpenTofu provider configuration contains provider-specific endpoint/region/settings and recommends keeping credentials outside version-controlled configuration | portable intent and provider binding/secrets are separable concerns | adopt-pattern | Station must not become secrets or infrastructure authority |
| OpenTofu provider registry protocol permits alternate registries | distribution origin is a separate portability axis from runtime provider semantics | adapt | no registry implementation implied |
| OpenTofu `state replace-provider` rewrites provider association in state and requires backup | provider substitution is an explicit migration with state consequences, not a presentation toggle | adopt-pattern | no claim that arbitrary providers are semantically interchangeable |
| Crossplane Providers install APIs/controllers mapping managed resources to external APIs | management-plane adapter can be packaged separately from external resource identity | adapt | do not import CRD/controller architecture |
| Crossplane warns that removing a Provider before managed resources can abandon external resources | provider removal/exit has lifecycle consequences distinct from uninstalling UI/configuration | adopt-pattern | exit must prove resource/state disposition |

## Census delta

No new C0→C10 level and no new primitive is justified. Producer independence remains a semantic/profile concern above component primitives.

The boolean `portable=true` is falsified as insufficient. Candidate evidence profile:

`ProducerIndependenceProfile = { build, runtime, managementPlane, dataConfig, substitution, exitRebuild }`

Each axis needs evidence independently. Independence on one axis must not imply another.

### Build-time

Can the canonical artifact/configuration be built or validated without a single proprietary producer? Provider package/version requirements are dependencies, not component identity.

### Runtime

Can the resulting workload/artifact execute without the authoring producer being present? This remains distinct from whether an external service/provider is required.

### Management plane

Can lifecycle operations be performed through a replaceable adapter/control plane, or is continued operation coupled to one manager? Crossplane demonstrates that controller/provider machinery is itself a dependency and therefore must not be hidden by a generic "portable" label.

### Data/config portability

Can canonical configuration/state required for reconstruction be exported, versioned, and interpreted independently of presentation? Secrets and provider bindings remain separate from portable intent.

### Provider substitution

Substitution is an admitted migration, not UI rebinding. It may require state transformation, compatibility checks, consequence analysis, backup, and rollback.

### Exit/rebuild

Removal of the producer/provider must define what happens to external resources, canonical state, generated artifacts, credentials/bindings, and projections. "Uninstall succeeds" is not Exit Proof.

## Classification

- **own** — existing S3 separation of identity / placement / presentation / action; canonical authority outside Station; one-authority/many-projections.
- **adopt-pattern** — multi-axis independence profile; explicit provider substitution; explicit exit lifecycle; provider binding separate from portable intent.
- **adapt** — versioned producer requirements, alternate distribution origin, adapter/package boundary, reconstruction evidence.
- **defer/reference-only** — OpenTofu language/state implementation, provider SDK/protocol implementation, Crossplane CRDs/controllers/reconciliation, cloud-provider catalogs, tenant control planes, secrets authority.

## Deduplicated proof debt

1. **Build Independence Proof** — artifact/config can be built/validated under declared producer dependencies without silently binding component identity to a vendor.
2. **Runtime Independence Proof** — runtime requirements are explicit and do not inherit build/authoring assumptions.
3. **Management-Plane Independence Proof** — lifecycle management dependency is named and substitution boundaries are explicit.
4. **Data/Config Portability Proof** — reconstruction inputs and provider-specific bindings are distinguishable and exportable where promised.
5. **Provider Substitution Proof** — compatibility, state migration, consequences, backup/rollback, and post-migration convergence are demonstrated.
6. **Exit/Rebuild Proof** — provider/producer removal has an explicit resource/state disposition and a tested reconstruction path.

These refine Matrix 01 Producer Independence Profile; they do not duplicate projection convergence, stale protection, structural mutation admission, or Matrix 03 action-currentness proofs.

## Falsification result

Mature provider systems do not support a single portability flag. They support the S3 direction only if independence is represented as evidence across distinct lifecycle axes. Provider identity must not become component identity; changing provider must not be modeled as placement/presentation; and provider-specific operational semantics must not be smuggled into Station authority.

No C11. No provider catalog. No tenant model. No Core/business authority. No Construction mutation.

## Sources

Primary documentation reviewed 2026-09-30:
- OpenTofu — Providers: https://opentofu.org/docs/v1.11/language/providers/
- OpenTofu — Provider Configuration: https://opentofu.org/docs/language/providers/configuration/
- OpenTofu — Provider Registry Protocol: https://opentofu.org/docs/v1.9/internals/provider-registry-protocol/
- OpenTofu — state replace-provider: https://opentofu.org/docs/cli/commands/state/replace-provider/
- Crossplane — Providers: https://docs.crossplane.io/master/packages/providers/
- Crossplane — Managed Resources: https://docs.crossplane.io/latest/managed-resources/managed-resources/

## Next blocker-first lot

Test tenant/workspace/export-import boundaries only where they add non-duplicative evidence to Data/Config Portability and Exit/Rebuild. Do not equate tenant isolation with component hierarchy or Station authority. If no new falsification is produced, stop expanding this axis and prepare R7B closure evidence for synthesis/Decision Graph eligibility.
