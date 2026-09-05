# Generation 2 — Architecture Reconciliation as a Capability — Full Pass 5 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 5
Disposition: research-only; no remediation, Work Package, TASK, Construction or product-code authority.

## Authority and baseline

`RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `ADVERSARIAL_SATURATION_STATE.json`, `SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md` and the Full-Pass-4 Architecture Reconciliation revisit were re-read before acting. Immediately before persistence, the authoritative state was re-read and still required Architecture Reconciliation as the 28th/final capability of Full Pass 5.

Full Pass 5 entered this revisit at **27/28 capabilities + 12/12 mandatory clusters**, with **284 material edge scenarios + 123 reusable ConflictPatterns = 407 material findings**. Architecture Reconciliation already had local no-material streak **2** and therefore must not be inflated.

Canonical distinctions remain: `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; desired/declared/model truth != observed/effective/runtime truth; model soundness != execution conformance != journal integrity != external-effect evidence; `semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != fleet aggregate != control authority`.

## Techniques materially different from prior Architecture Reconciliation revisit

1. **Counterfactual evidence-source disagreement** — hold each evidence source internally valid while making model snapshot, local journal, provider receipt, deployment metadata and Fleet projection disagree, then test whether reconciliation arbitrarily promotes one source to canonical truth.
2. **Partial-order uncertainty mutation** — preserve the same causally valid execution while deleting/coarsening timestamps and introducing concurrency, then test whether a reconciler invents a total order and reports false deviation or false conformance.
3. **Verifier-strength monotonicity challenge** — verify an old proof under a newer verifier/profile and test whether acceptance is silently interpreted as a stronger historical claim than the original profile established.
4. **Model/revision alias substitution** — keep semantically similar workflow models valid but swap workflow/build/deployment revision identifiers to test whether proof or conformance is accepted against the wrong reference model.
5. **Evidence-horizon fracture** — retain correct autonomous local execution while local journal retention, exporter loss, delayed Fleet arrival or stale policy/trust evidence creates unequal evidence windows.
6. **Deviation-acceptance authority transposition** — make a deviation technically explainable but vary who is authorized to classify it as accepted risk, approved exception, superseded behavior or defect.
7. **Federated proof asymmetry** — let producer and consumer systems each possess locally valid evidence while correlation/effect/contract revision differs across the inter-system edge.
8. **Cross-tenant observer contamination** — use a shared telemetry/analysis plane with valid per-tenant data but erase tenant/build/deployment dimensions during reconciliation.
9. **Resource-bounded diagnosis mutation** — truncate high-cardinality traces, top-N graphs, proof paths or journal scans while preserving a valid partial result, then test whether bounded analysis is reported as complete.
10. **AI reconciliation overclaim braid** — let AI/low-code infer missing events, align traces, summarize conflicting sources or propose model changes, then test whether inferred/analytical output is promoted to observed fact, semantic ownership or mutation authority.

## Typed Semantic Graph / federation / proof reconciliation

The strongest candidates did not survive duplicate-screening as distinct reusable conflict families:

- **Partially ordered or incomplete journals** can make multiple total-order explanations compatible with the same evidence. Treating one inferred order as observed truth reduces to temporal/order uncertainty + evidence coverage/currentness + proof-claim conflation. A conformance signal remains a `Signal`, not a `ConfirmedConflict`.
- **A newer verifier accepting an older proof** does not retroactively establish claims that the historical verifier/profile never made. This reduces to compatibility-direction + proof-claim-conflation + certificate-composition + supersession/currentness.
- **A valid proof bound to the wrong model/build/deployment revision** reduces to revision-vector qualification, effective identity and reconciliation ownership rather than a new family.
- **Conflicting but individually valid evidence sources** require owner/currentness/provenance-qualified reconciliation; arbitrary freshness or majority choice would reduce to semantic ownership + evidence qualification + authority non-amplification.
- **Federated producer/consumer evidence asymmetry** remains covered by `G2-CONFLICT-PATTERN-FEDERATED-CONTINUITY-001` plus effect-disposition/currentness/contract-revision patterns.
- **Inferred missing events or AI-generated alignments** remain analytical results, not observations. Promoting them to factual execution history is covered by `G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001` plus proof-claim conflation.

No `ConflictInstance` is claimed. No hypothetical pattern is converted into implementation work.

## Priority hypothesis — Autonomous Builds × Fleet Observability/Capacity

### HIPÓTESE DE ARQUITETURA / EM PESQUISA

The candidate architecture remains viable, but this pass sharpens the reconciliation boundary:

- autonomous client systems keep sufficient local runtime state/journal/diagnostic evidence to continue correct operation when System Builder, Observe or Fleet is unavailable;
- Fleet receives exported evidence and computes qualified analysis/rollups, but a Fleet aggregate is not runtime truth and is not control authority by default;
- reconciliation should preserve the operational lineage `CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt` so one execution can be explained by build/deployment while compatible capability uses can still be aggregated semantically;
- semantic capability aggregation is permitted only inside an explicit comparison domain that qualifies contract/revision/provider/runtime-topology/instrumentation semantics; otherwise analysis stays build/release/deployment scoped;
- local journal/evidence, exported telemetry and Fleet aggregate require explicit completeness/currentness dimensions; exporter loss, sampling, late arrival, duplicate export, clock skew or offline periods produce evidence uncertainty, not automatic runtime failure;
- conformance/reconciliation must distinguish `OBSERVED`, `INFERRED`, `PARTIAL`, `INCONCLUSIVE`, `UNKNOWN`, `CONFIRMED_DEVIATION` and `AUTHORIZED_EXCEPTION`-like semantics rather than silently converting analytical alignment into fact;
- shared infrastructure may host multiple tenants, but `Shared infrastructure != shared truth/authority`; tenant/client/workspace/build/deployment attribution must survive into reconciliation and capacity rollups;
- any future global action from Fleet would require explicit client context, current authority, approval/SoD where applicable, exact version/build/deployment targeting, compatible operation contract and safe rollback/recovery qualification;
- observability/capacity recommendations may inform placement/provider selection only within already-authorized semantic/contract choices; they do not rewrite workflow semantics.

Candidate alternatives remain open for Planning C comparison only after saturation: direct client-to-Fleet export; local collector/agent with bounded persistent queue; client-owned observability backend with optional federation; shared gateway versus dedicated per-client gateway; shared runtime/database/schema versus database-per-client/dedicated. No target architecture is selected here.

## Evidence refresh

- Process-mining research on partial-order resolution shows that conformance checking can become inaccurate when timestamps are coarse, missing or only establish a partial order; uncertainty may require considering multiple compatible total orders rather than assuming a single chronology. This supports classifying uncertain ordering as evidence uncertainty, not automatically as a confirmed deviation.
- OpenTelemetry Collector resiliency guidance states that sending queues and persistent WAL can improve export resilience but still admit loss through queue overflow, retry expiry, disk failure/exhaustion or prolonged endpoint outage. This supports `local runtime truth != exported telemetry completeness != Fleet aggregate`.
- SLSA provenance separates `buildDefinition` from `runDetails` and identifies a particular build invocation independently of the build template/platform identity. This supports preserving build/run identity in reconciliation rather than inferring runtime equivalence from semantic labels alone.
- RFC 9162 consistency proofs establish append-only consistency between committed Merkle tree states, while inclusion proofs establish inclusion. They do not establish workflow semantic correctness or external business effect. This supports keeping journal integrity separate from execution-conformance/effect claims.

## Conflict-family coverage

The revisit explicitly challenged structural graph; state-transition; semantic ownership; rule/formula/condition; temporal/ordering; resource/capacity; authority/responsibility/SoD; policy/compliance; data/consistency; provider/integration; version/migration/coexistence; exception/compensation/recovery; human-procedure/instruction; cross-process; objective/optimization; and AI/low-code composition.

For every surviving candidate, the existing catalogue already provides activation conditions, incompatible claims/actions/states, detection candidates, owners, severity, confidence, detectability, blast radius, reversibility, time-to-harm, misuse likelihood, evidence currentness, false-positive risk and future remediation disposition. Research disposition remains `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## Duplicate-screen against 123 reusable ConflictPatterns

**Result: 0 new local edge scenarios, 0 new cross-capability scenarios, 0 new reusable ConflictPatterns and 0 new preventive invariants.**

No new `G2-CONFLICT-PATTERN-*` ID is justified. `EDGE_CASE_INDEX.md` and `CROSS_CAPABILITY_EDGE_CASE_MATRIX.md` therefore require no artificial entry for this revisit.

## Saturation disposition

- Architecture Reconciliation local no-material streak: remains **2**; no inflation.
- Mandatory-cluster streaks: remain capped at **2**; no incidental increment.
- Material totals remain **284 edges + 123 ConflictPatterns = 407**.
- HIGH/CRITICAL without owner/proof/detection route: **0**.
- Full Pass 5 capability coverage becomes **28/28**; mandatory clusters remain **12/12**.
- Full Pass 5 therefore completes and completed adversarial full passes become **5/8 minimum**.
- The next active pass is **Full Pass 6**, starting at 0/28 capabilities and 0/12 mandatory clusters.
- Saturation remains `NOT_SATURATED`; minimum full passes are not met and final negative-space review remains `NOT_STARTED`.
- `PLANNING_C_TARGET_ARCHITECTURE` remains blocked.

## Next action candidate

Advance only within `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION` to **Full Pass 6**, beginning with **Adaptive Governed Work Surfaces**, using techniques materially different from Passes 1–5 and duplicate-screening all 123 patterns. Carry Typed Semantic Graph/Federation/Workflow formal assurance and Autonomous Builds/Fleet as cross-cutting lenses. AGWS already has local streak 2 and must not be inflated. Preserve Fleet non-authority and GraphDB optionality. Do not enter Planning C.