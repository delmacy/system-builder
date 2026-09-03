# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`. Historical coverage remains authoritative in prior dossiers/state history; this compact ledger records current/recent revisits without superseding it.

## Revisit cycle 2–5
All 25 active capabilities completed cycles 2, 3, 4 and 5. Every cycle-5 pass produced material architectural findings; no capability was SATURATED at cycle close. Historical representative detail remains authoritative in capability dossiers and prior ledger revisions.

## Revisit cycle 6
Universal Capability Architecture through Notifications / Events / Messaging completed revisit 5 with material findings and remain NOT SATURATED. Their detailed representative coverage remains authoritative in their cycle-6 dossiers and prior ledger revisions.

### Build / Dependency Graph / Reproducibility — revisit 5
Bazel remote cache/remote execution/action-key diagnostics: `DEEP`; Nix sandbox/store/derivation closure and content-addressing: `DEEP`; Gradle dependency locking/dependency cache/build cache: `DEEP`; SLSA Build v1.2 isolation/provenance/cache-poisoning/reproducibility boundaries: `DEEP`; GitHub Actions dependency-cache trust and write-scope restrictions: `DEEP`. Findings `G2-FINDING-BDGR-37..44`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: typed build identities, multi-axis reproducibility evidence, dependency-material identity beyond coordinates, cache reuse versus independent rebuild, cache read/write trust separation, ambiguous remote-runner reconciliation, provider/toolchain substitution qualification, historical rebuild closure and non-amplifying Station/AI/AGWS authority.

### Artifact / Release / SBOM / Provenance — revisit 5
SLSA v1.2 Provenance + VSA: `DEEP`; Sigstore/Cosign bundles + trusted-root/TUF integration: `DEEP`; OCI artifact/distribution digest-vs-tag/referrer model: `DEEP`; CycloneDX 1.7 composition/dependency completeness semantics: `DEEP`; Build cycle-6 handoff evidence: `DEEP`. Findings `G2-FINDING-ARSP-38..45`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: typed artifact/evidence/release/distribution identities, multi-axis release qualification, explicit SBOM completeness/unknown semantics, authenticity versus semantic conformance, historical verification horizon, expected-base fencing for mutable channels, ambiguous publication/promotion reconciliation, registry cutover residual-distribution and consumer-uptake disposition, offline closure and non-amplifying Station/AI/AGWS authority.

### Deployment / Environment / Runtime — revisit 5
Kubernetes Deployment + Pod readiness gates: `DEEP`; Argo Rollouts canary/HPA/rollback-window semantics: `DEEP`; Google Cloud Run revisions/traffic/autoscaling: `DEEP`; HashiCorp Nomad canary + multi-region barrier semantics: `DEEP`; Amazon ECS deployment circuit-breaker/rollback lifecycle: `DEEP`. Findings `G2-FINDING-DER-38..45`; material new findings; consecutive-no-material = 0; NOT SATURATED. Focus: typed deployment/runtime/routing/readiness identities, multi-axis qualification, stale positive-condition interpretation, state-scoped transition clocks, realization-versus-routing-versus-capacity separation, aggregate region/Station barriers, dynamic rollback eligibility, expected-base routing fencing, qualified local runtime closure and non-amplifying Station/AI/AGWS authority.

## Historical authority
All omitted representative/capability cells remain authoritative in prior ledger revisions and capability dossiers.