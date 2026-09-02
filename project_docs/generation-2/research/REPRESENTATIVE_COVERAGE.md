# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2
All 25 active capabilities completed cycle 2. Every pass produced material findings; no capability was SATURATED at cycle close.

## Revisit cycle 3
All 25 active capabilities completed cycle 3. Every capability produced material new findings; no capability satisfied saturation at cycle close.

## Revisit cycle 4
Cycle 4 is open with 21/25 capabilities revisited.

### Universal Capability Architecture through Governance / Compliance / Audit
The first 17 cycle-4 revisits remain authoritative in their capability dossiers and prior ledger revisions. Every pass produced material findings and remains NOT SATURATED.

### Secrets / Configuration / Environment Portability — revisit 3
HashiCorp Vault dynamic-secret leases/renewal/revocation/mount migration and irrevocable-lease failure semantics: `DEEP`; SPIFFE/SPIRE workload identity/SVID/registration: `DEEP`; Kubernetes Secrets/security/external-store projection/bound service-account guidance: `DEEP`; Vault Proxy persistent-cache freshness boundary: `DEEP`. Findings `G2-FINDING-SCEP-23..29`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: semantic reference vs credential/provider realization; workload identity as credential-elimination realization; rotation/revocation postconditions; stale local material; non-amplifying Enterprise→Station→Role→Person overlays; governed provider transition; qualified local secret/config recovery closure.

### Provider / Binding / Capability Negotiation — revisit 3
Kubernetes Dynamic Resource Allocation v1.35 DeviceClass/ResourceClaim/ResourceSlice/prioritized alternatives/adminAccess: `DEEP`; OpenTofu provider requirements/configuration/aliases/provider meta-argument/dependency lock: `DEEP`; Terraform provider requirements/lock behavior: `DEEP`; Backstage backend services/extension points/modules: `DEEP`; SPIFFE Workload API/federated trust bundles: `DEEP`. Findings `G2-FINDING-PBCN-23..30`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: negotiated effective profile, discovery→compatibility→admission→delegated exposure→effective satisfaction gates, governed fallback/cutover, non-provider credential identity, qualified local binding closure, explicit multi-provider selection scope and capability-owned extension surfaces.

### Standards / Interoperability / API Contracts — revisit 3
Protocol Buffers Editions/schema evolution: `DEEP`; Buf breaking-change categories/baselines: `DEEP`; HTTP Semantics RFC 9110 content negotiation: `DEEP`; Kubernetes API deprecation/versioning/round-trip policy: `DEEP`; GraphQL September 2025 deprecation/introspection: `DEEP`; OpenAPI 3.2.0 version/description semantics: `DEEP`. Findings `G2-FINDING-SIAC-23..29`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: multi-class compatibility evidence; wire versus source/semantic compatibility; semantic non-weakening negotiation; coexistence read/write/storage/exposure roles; conformance versus provider claim; deprecation-usage evidence; qualified local compatibility/conformance closure; AGWS provider-independent semantic-operation consumption.

### Lifecycle / Versioning / Evolution / Migration — revisit 3
Kubernetes API deprecation/version-skew/round-trip policy: `DEEP`; Kubernetes v1.37 Storage Version Migration GA and stale stored-version closure: `DEEP`; Temporal Worker Versioning GA/current-ramping-pinned-draining lifecycle: `DEEP`; Terraform refactoring/state mover/provider replacement: `DEEP`; Flyway migration/undo/history: `DEEP`; RFC 9745/8594 deprecation/sunset: `DEEP`; Ajmani & Shrira distributed-upgrade mixed-version research plus Zhang et al. empirical upgrade-failure study: `DEEP`. Findings `G2-FINDING-LVEM-23..29`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: lifecycle revision vectors, contextual migration-success freshness, role-aware coexistence, persisted-state normalization, dual rollback/recovery semantics, usage/drainage evidence for withdrawal and qualified transition-readiness evidence. Scientific literature was used as an explicit evidence class and triangulated with production/standards evidence.

## Historical authority
All representatives/findings from prior capability sections and earlier revisions remain authoritative in their dossiers/state history. Compacting this ledger does not revoke coverage.