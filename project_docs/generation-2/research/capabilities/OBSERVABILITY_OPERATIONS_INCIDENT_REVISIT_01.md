# Observability / Operations / Incident — Revisit 01

## Research question
Which observability/operations primitives remain portable across telemetry backends and incident systems while preserving explicit identity, freshness, governance, remediation-authority and failure boundaries?

## Representatives and evidence/source ledger
1. OpenTelemetry — resource/telemetry identity and Collector pipeline/export boundaries. Source of truth: upstream OpenTelemetry specifications/documentation.
2. Prometheus + Alertmanager — alert evaluation, grouping, deduplication, routing, inhibition and silence lifecycle. Source of truth: prometheus.io documentation.
3. Grafana SLO — SLI/SLO windows, error-budget calculation and maintenance-window semantics. Source of truth: Grafana documentation.
4. PagerDuty — event, alert and incident identities; dedup/grouping/suppression; incident lifecycle and remediation orchestration. Source of truth: PagerDuty documentation.

## Identity
Telemetry signal identity is not exporter/delivery-attempt identity. Alert identity is not incident identity: PagerDuty explicitly permits multiple alerts to aggregate into one incident and allows alerts to move between incidents. Resource/service/runtime correlation therefore needs stable semantic identity independent of backend-specific record IDs.

## Lifecycle and versioning
Telemetry collection/export, alert evaluation, alert notification and incident response are separate lifecycles. Alertmanager grouping, inhibition and silences alter notification behavior without redefining the underlying alert. PagerDuty suppression/dedup/grouping similarly transforms operational handling while preserving distinctions between incoming events, alerts and incidents. SLO evidence is window-bound and must retain the objective/SLI revision used to calculate it.

## Failure semantics
Exporter failure or delayed observation is not evidence that the underlying runtime operation failed. Conversely, successful telemetry export does not prove business health. Alert suppression, silence or grouping is not incident resolution. A remediation automation attempt has its own outcome and cannot inherit success from the alert/incident transition that triggered it.

## Extensibility and provider boundaries
Portable primitives should cover semantic resource identity, signal observation, evidence freshness, alert/detection, incident, grouping/suppression disposition and remediation authorization. Query languages, storage schemas, cardinality controls, routing DSLs and backend-specific incident orchestration remain provider mechanisms.

## Governance, observability of observability, portability and lock-in
Retention, redaction, tenant scope and high-cardinality policy must be explicit governance inputs. Provider replacement must preserve semantic resource/signal/incident linkage while creating new ingestion/export/storage lineage. Offline/self-hosted operation requires that generated runtimes can emit/retain sufficient portable evidence without depending on the System Builder control plane or one SaaS backend.

## Product-specific mechanism vs universal primitive
Universal: resource/service/runtime identity; observation timestamp and freshness; signal kind; alert/detection identity; incident identity; grouping/suppression disposition; SLO window/objective revision; remediation authority/attempt/result; tenant/redaction scope. Provider-specific: PromQL/Alertmanager routing tree, Grafana-generated recording rules, PagerDuty Event Orchestration rules, backend storage/index/cardinality implementation.

## Convergent/divergent patterns
Convergent: observation is evidence, not truth of business acceptance; alerting transforms observations into operational decisions; incident response is a governed lifecycle; suppression/grouping reduce notification noise without erasing source evidence. Divergent: grouping/dedup keys, incident state machines, SLO calculation engines, retention/cardinality enforcement and remediation integrations.

## Subcapabilities
Telemetry identity/correlation; collection/export lineage; retention/cardinality governance; alert/detection lifecycle; SLO/error-budget evidence; incident lifecycle; remediation authority; evidence redaction/tenant scope; backend replacement; offline/self-hosted evidence continuity.

## SB comparison
Deferred to repository-validation questions unless fresh-main evidence is inspected. Research branch is not product truth.

## Reconciliation hypotheses
- HARDEN semantic resource/service/runtime identity and observation freshness.
- GENERALIZE alert/detection and incident as distinct evidence identities.
- PROVIDERIZE backend query/storage/routing/cardinality mechanisms.
- INTEGRATE remediation attempts only through explicit delegated authority and outcome evidence.
- DO_NOT_BUILD a universal telemetry backend or universal incident-management engine.

## Repository-validation questions
Does fresh main distinguish observation time from occurrence time? Are telemetry export attempts represented separately from semantic signals? Are alert/detection and incident identities distinct? Is SLO evidence revision/window/freshness bound? Can remediation authority be constrained and audited? Are redaction and tenant scopes explicit? Can generated runtimes remain observable without SB/control-plane availability?

## Symbiotic Proof
A generated runtime should emit portable correlated evidence to a native/self-hosted backend, replace that backend without changing semantic resource identity, retain source evidence through grouping/suppression, derive a freshness-bound SLO/alert, open an independently identified incident, and execute remediation only under explicit authority while preserving attempt/result lineage.

## Stable findings
- `G2-FINDING-OOI-11` — Telemetry signal identity and observation/export-attempt identity are distinct; backend delivery cannot redefine the observed semantic event.
- `G2-FINDING-OOI-12` — Alert/detection identity and incident identity are distinct; grouping, deduplication and reassignment are operational correlation decisions, not identity equivalence.
- `G2-FINDING-OOI-13` — Silence, inhibition, suppression and grouping alter notification/disposition, not underlying evidence truth or incident resolution.
- `G2-FINDING-OOI-14` — SLO/error-budget evidence is objective-revision, evaluation-window and observation-freshness scoped; health/readiness is not business/SLO acceptance.
- `G2-FINDING-OOI-15` — Remediation authority, remediation attempt and remediation result are separate from alert/incident state transitions and require explicit governed lineage.
- `G2-FINDING-OOI-16` — Observability backend replacement must preserve semantic resource/signal correlation while creating new ingestion/export/storage lineage and re-proving retention, redaction and freshness properties.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-OBSERVATION-FRESHNESS-EVIDENCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-INCIDENT-CORRELATION-DISPOSITION-EVIDENCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-REMEDIATION-AUTHORITY-ATTEMPT-LINEAGE` — CROSS_CUTTING.

## Value / risk / priority / next question
Value: high, because product proofs need to distinguish observed state, operational decision and corrective effect. Risk: high if backend-specific semantics leak into portable definitions or if remediation is implicitly authorized by detection. Priority: high. Next question: Extension / Plugin / Marketplace Architecture should test extension identity, install/activation authority, compatibility and trust boundaries without making extensions own core capability authority.
