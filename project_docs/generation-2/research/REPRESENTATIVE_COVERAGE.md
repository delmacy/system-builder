# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2
All 25 active capabilities completed cycle 2. Every pass produced material findings; no capability was SATURATED at cycle close.

## Revisit cycle 3
All 25 active capabilities completed cycle 3. Every capability produced material new findings; no capability satisfied saturation at cycle close.

## Revisit cycle 4
Cycle 4 is open with 23/25 capabilities revisited.

### Universal Capability Architecture through Governance / Compliance / Audit
The first 17 cycle-4 revisits remain authoritative in their capability dossiers and prior ledger revisions. Every pass produced material findings and remains NOT SATURATED.

### Secrets / Configuration / Environment Portability — revisit 3
HashiCorp Vault dynamic-secret leases/renewal/revocation/mount migration and irrevocable-lease failure semantics: `DEEP`; SPIFFE/SPIRE workload identity/SVID/registration: `DEEP`; Kubernetes Secrets/security/external-store projection/bound service-account guidance: `DEEP`; Vault Proxy persistent-cache freshness boundary: `DEEP`. Findings `G2-FINDING-SCEP-23..29`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Provider / Binding / Capability Negotiation — revisit 3
Kubernetes Dynamic Resource Allocation: `DEEP`; OpenTofu/Terraform provider requirements/configuration/lock: `DEEP`; Backstage backend services/extension points/modules: `DEEP`; SPIFFE Workload API/federated trust bundles: `DEEP`. Findings `G2-FINDING-PBCN-23..30`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Standards / Interoperability / API Contracts — revisit 3
Protocol Buffers/Buf: `DEEP`; HTTP RFC 9110: `DEEP`; Kubernetes API versioning/deprecation: `DEEP`; GraphQL September 2025: `DEEP`; OpenAPI 3.2.0: `DEEP`. Findings `G2-FINDING-SIAC-23..29`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Lifecycle / Versioning / Evolution / Migration — revisit 3
Kubernetes API/version migration: `DEEP`; Temporal Worker Versioning: `DEEP`; Terraform state/provider movement: `DEEP`; Flyway: `DEEP`; RFC 9745/8594: `DEEP`; distributed-upgrade literature: `DEEP`. Findings `G2-FINDING-LVEM-23..29`; material new findings; consecutive-no-material = 0; NOT SATURATED.

### Security / Resilience / Failure Recovery — revisit 3
AWS Well-Architected Reliability recovery objectives/testing/automation: `DEEP`; Azure reliability patterns (retry/circuit breaker/bulkhead/failover/degradation): `DEEP`; Linux GFS/USENIX fencing and generation-qualified recovery: `DEEP`; distributed-consensus reliability literature: `DEEP`; MySQL automatic-failover split-brain incident evidence: `DEEP`. Findings `G2-FINDING-SRFR-23..30`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: availability versus semantic recovery, failover/rollback/restore/forward-fix separation, fencing/exclusive-writer evidence, incident invalidation of transition readiness, RTO/RPO versus semantic conformance, non-amplifying degraded authority, persisted-state versus in-flight recovery and qualified local recovery closure.

### AI-native Engineering / Agents / Approvals — revisit 3
OpenAI Codex/Agents SDK sandboxing, approvals, guardrails and telemetry: `DEEP`; Anthropic Claude Code sandboxing/auto-mode/prompt-injection probes and delegation checks: `DEEP`; GitHub Copilot Agentic Workflows/tool permissions/safe outputs/approval semantics: `DEEP`; MCP tool annotations as non-enforcing risk metadata: `DEEP`; CaMeL capability/control-vs-data-flow research: `DEEP`; adaptive indirect-prompt-injection research: `DEEP`; NetInjectBench execution-time policy-gate evidence: `DEEP`. Findings `G2-FINDING-AIN-23..30`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: untrusted-context provenance, stale-on-material-change approval/validation, hard enforcement outside probabilistic models, non-amplifying delegation, deterministic-validator separation, provider-substitution lineage, non-actuating incident/recovery assistance and qualified local agent closure.

## Historical authority
All representatives/findings from prior capability sections and earlier revisions remain authoritative in their dossiers/state history. Compacting this ledger does not revoke coverage.