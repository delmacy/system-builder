# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2–4
All 25 active capabilities completed cycles 2, 3 and 4. Every pass produced material findings; no capability was SATURATED at cycle close. Historical representative detail remains authoritative in capability dossiers and prior ledger revisions.

## Revisit cycle 5
All prior cycle-5 coverage through Build / Dependency Graph / Reproducibility remains authoritative in capability dossiers and prior ledger revisions.

### Artifact / Release / SBOM / Provenance — revisit 4
SLSA v1.2 Build + Verification Summary Attestation: `DEEP`; Sigstore/Cosign verification, bundles, Rekor transparency and TUF-distributed trust: `DEEP`; in-toto attestation verification/policy: `DEEP`; OCI descriptor/index/tag/referrer model: `DEEP` carried forward; CycloneDX/SPDX SBOM identity/lifecycle: `DEEP` carried forward; Build cycle-5 handoff/reproducibility evidence: `DEEP`. Findings `G2-FINDING-ARSP-30..37`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: publication/evidence/verification/release/promotion/distribution state separation; policy/trust/time-qualified verification; partial/ambiguous publication; multi-platform coverage; rollback eligibility; provider migration; local release closure; non-amplifying release/signing/promotion authority.

### Deployment / Environment / Runtime — revisit 4
Kubernetes Deployment rollout/revision/readiness: `DEEP`; Kubernetes StatefulSet ordered rollout/forced rollback hazard: `DEEP`; Kubernetes ConfigMap/Secret realization modes and immutability: `DEEP`; Argo Rollouts canary/traffic/analysis/promotion/abort/rollback window: `DEEP`; HashiCorp Nomad canary/health/promotion/auto-revert/multi-region deployment: `DEEP`. Findings `G2-FINDING-DER-30..37`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: admission/actuation/effective realization/traffic/readiness/postcondition separation; ambiguous provider acknowledgement; dependency-qualified readiness freshness; progressive coexistence; routing rollback versus persisted-state recovery; provider dual-run/cutover; build-once/replicate-many; non-amplifying deployment/traffic/recovery authority; qualified local runtime closure.

### Observability / Operations / Incident — revisit 4
OpenTelemetry Collector internal telemetry + resiliency: `DEEP`; OpenTelemetry Resource and semantic conventions: `DEEP`; Prometheus recording/alerting evaluation semantics: `DEEP`; Google SRE multiwindow/multi-burn-rate SLO alerting: `DEEP`; Grafana Mimir HA deduplication: `DEEP`; Grafana Loki multi-tenancy/isolation: `DEEP`; PagerDuty incident response, SRE Agent and Runbook Automation: `DEEP`. Findings `G2-FINDING-OOI-31..38`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: telemetry-pipeline qualification, semantic subject/cohort identity, derived-evaluation freshness, partial rollout/multi-Station coverage, incident closure versus recovery postcondition, faceted remediation authority, provider continuity and qualified local/offline closure.

## Historical authority
All omitted representative/capability cells remain authoritative in prior ledger revisions and capability dossiers.