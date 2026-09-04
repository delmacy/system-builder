# Generation 2 — Provider / Binding / Capability Negotiation Edge-Case Register

Status: MATERIAL FINDINGS / FULL PASS 1
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Canonical capability: Provider / Binding / Capability Negotiation
Research disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

This register is adversarial research, not remediation and not target architecture. Preserve `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, provider/native IDs as non-canonical, `Enterprise → Station → Role → Person`, AI/AGWS non-amplification, and `UNKNOWN → reconcile-before-retry`.

## Evidence frame

Planning A separates `discovered != advertised != qualified != admitted != bound != effective` and requires multidimensional support vectors, revision/currentness evidence, explicit `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`, qualified fallback and residual-cohort drainage. Planning B shows only a bounded AI adapter seam today, with provider-neutral envelopes and capability/limit descriptors but no generalized qualification/admission/binding/substitution lifecycle.

External mature-system evidence reinforces the distinction between protocol compatibility and semantic suitability:

- CSI exposes explicit plugin/controller/node capabilities, permits unsupported RPCs, and separately validates volume capabilities; protocol implementation alone does not imply every storage semantic is supported: https://github.com/container-storage-interface/spec/blob/master/spec.md
- Kubernetes distinguishes storage access modes whose labels have materially different concurrency semantics and version/sidecar prerequisites: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
- Terraform separately versions provider protocol, provider source/version selection, provider/resource schemas and diagnostics; protocol handshake compatibility does not prove a provider resource satisfies a consumer's domain requirement: https://developer.hashicorp.com/terraform/plugin/terraform-plugin-protocol and https://developer.hashicorp.com/terraform/language/providers/requirements
- Crossplane explicitly separates managed-resource identity from external-provider identity and documents leaked-resource risk when remote creation succeeds but the external identity cannot be persisted: https://docs.crossplane.io/v2.3/managed-resources/managed-resources/

These are evidence sources for failure classes only; no product-specific mechanism is promoted into universal architecture here.

## Local edge scenarios

### G2-EDGE-PROVIDER-001 — Advertised feature label masks semantic mismatch

- Scenario: two providers advertise the same capability name while differing on consistency, ordering, durability, locality, scale, failure, recovery or offline semantics.
- Preconditions / trigger: consumer performs coarse feature-name or boolean compatibility matching and selects the provider.
- Affected subjects/revisions: consumer requirement vector; provider descriptor/support-vector revision; binding candidate revision.
- Expected safe behavior: qualification remains dimensioned and may resolve `PARTIAL`, `UNSUPPORTED` or `INCONCLUSIVE`; unsupported dimensions remain visible.
- Forbidden behavior: treat equal feature labels, protocol conformance or adapter shape as proof of portable semantic equivalence.
- Effect/failure disposition: qualification failure or bounded degraded eligibility; never silent `SUPPORTED`.
- Owner(s): Provider/Binding for qualification; domain owner for required semantics; Standards for protocol conformance.
- Evidence/currentness: provider claim plus applicable, revision-bound evidence for each required dimension.
- Recovery/reconciliation: requalify against current requirement/support vectors; no automatic semantic shim assumption.
- Blast radius: binding → process/system depending on provider scope.
- Severity: HIGH. Misuse likelihood: likely accidental, plausible automated.
- Proof obligation: differential conformance corpus must demonstrate portable semantics, not only invocation compatibility.
- Saturation: MATERIAL / streak reset.

### G2-EDGE-PROVIDER-002 — Stale or incomplete qualification survives requirement/provider revision

- Scenario: provider was qualified at revision N, then consumer requirements, provider implementation, policy, trust evidence, quota or locality constraints change.
- Activation: cached `SUPPORTED` result is reused without its applicability/currentness horizon.
- Expected safe behavior: stale/incomplete evidence yields requalification or `INCONCLUSIVE`; historical qualification remains explainable but not timeless.
- Forbidden behavior: promote prior qualification into current eligibility without revision/applicability proof.
- Effect/failure disposition: `INCONCLUSIVE` or blocked admission/binding until evidence is current.
- Owner(s): Provider/Binding; relevant policy/domain owners for changed dimensions.
- Evidence/currentness: requirement revision, provider descriptor revision, evidence timestamps/horizons, policy/trust revisions.
- Recovery/reconciliation: regenerate qualification against the current revision vector.
- Blast radius: Station/system; potentially enterprise if shared provider.
- Severity: HIGH. Misuse likelihood: likely under long-lived caches/offline operation.
- Proof obligation: qualification replay must fail closed when any required revision dimension is stale/unknown.
- Saturation: MATERIAL / streak reset.

### G2-EDGE-PROVIDER-003 — Concurrent bind/rebind/withdraw creates split authority

- Scenario: old binding is draining while a new binding is admitted/cut over; concurrent workers, sessions, subscriptions, callbacks or clients still actuate through the old provider.
- Activation: cutover acknowledgement precedes proof that old authoritative cohorts are drained.
- Expected safe behavior: coexistence and residual cohorts remain explicit; withdrawal is not complete until authority/effect producers are dispositioned.
- Forbidden behavior: equate routing/config change with complete provider substitution.
- Effect/failure disposition: `PARTIAL` convergence until residual cohorts are proven drained or quarantined.
- Owner(s): Provider/Binding for binding lifecycle/cohorts; domain owner for effect authority; Lifecycle for generic coexistence semantics.
- Evidence/currentness: active binding revisions, cohort inventory, in-flight operation lineage, current routing/credential/subscription state.
- Recovery/reconciliation: reconcile old/new effects and cohort authority before withdrawal closure.
- Blast radius: system/external parties.
- Severity: CRITICAL where duplicate/destructive effects are possible. Misuse likelihood: plausible.
- Proof obligation: cutover test must prove no residual authoritative effect path remains, or explicitly classify retained paths.
- Saturation: MATERIAL / streak reset.

### G2-EDGE-PROVIDER-004 — Provider ACK or transport failure is mistaken for canonical effect

- Scenario: provider accepts a request, times out, or returns an operation ID, while actual domain effect is delayed, partial, failed or unknown.
- Activation: caller maps provider response directly to business/domain success or `NOT_APPLIED`.
- Expected safe behavior: preserve attempted/accepted/effect/convergence lineage and explicit `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`.
- Forbidden behavior: retry destructive mutation merely because transport failed; claim canonical completion from provider ACK alone.
- Effect/failure disposition: `UNKNOWN` requires reconciliation before unsafe retry unless idempotency scope is explicitly qualified.
- Owner(s): Provider/Binding for realization lineage; domain owner for semantic success.
- Evidence/currentness: operation IDs, idempotency scope/horizon, read-after-write/event evidence, provider mapping.
- Recovery/reconciliation: query/reconcile effect, then decide retry/compensation/escalation.
- Blast radius: record to external parties; potentially financial/security critical.
- Severity: CRITICAL. Misuse likelihood: likely under transient failure.
- Proof obligation: fault-injection proof around lost ACK, timeout-after-apply and delayed completion.
- Saturation: MATERIAL / streak reset.

### G2-EDGE-PROVIDER-005 — Provider-native identity leaks into canonical truth

- Scenario: provider account/resource/project/tenant ID is copied into canonical identity because it is convenient or globally unique inside one realization.
- Activation: import, migration, late initialization, substitution or AI mapping adopts external ID without governed semantic-owner transition.
- Expected safe behavior: provider/native identity remains mapping/realization evidence; ambiguity is explicit.
- Forbidden behavior: provider substitution silently changes canonical identity or merges subjects solely by provider-native ID/name.
- Effect/failure disposition: mapping conflict / `INCONCLUSIVE`; block destructive reconciliation when identity is ambiguous.
- Owner(s): Provider/Binding for mapping lineage; domain owner for canonical identity.
- Evidence/currentness: canonical subject revision, provider descriptor/binding revision, external mapping provenance.
- Recovery/reconciliation: owner-qualified adoption/merge decision only when concrete evidence justifies it.
- Blast radius: data/domain-wide if identity contamination propagates.
- Severity: HIGH. Misuse likelihood: plausible accidental; high impact.
- Proof obligation: substitution/import tests must preserve canonical identity independently of provider IDs.
- Saturation: MATERIAL / streak reset.

### G2-EDGE-PROVIDER-006 — Degradation, quota or offline state silently narrows supported semantics

- Scenario: provider remains reachable but quota, region capacity, degraded mode, offline cache age or partial service disables required behavior while coarse health stays green.
- Activation: actuation relies on global health/availability rather than dimension- and scope-qualified support currentness.
- Expected safe behavior: qualification can degrade to `PARTIAL`, `UNSUPPORTED` or `INCONCLUSIVE` per scope and validity horizon.
- Forbidden behavior: treat reachability, cached descriptor or prior health as evidence that all required semantics remain available.
- Effect/failure disposition: constrained/degraded eligibility or block; no silent semantics weakening.
- Owner(s): Provider/Binding; Observability supplies telemetry; domain/policy owners define acceptable degraded operation.
- Evidence/currentness: quota/capacity/region/support observations, observation time, horizon and covered dimensions.
- Recovery/reconciliation: refresh qualification; re-admit fallback only if current semantics/policy permit.
- Blast radius: Station/system.
- Severity: HIGH. Misuse likelihood: likely during incidents/offline operation.
- Proof obligation: degraded/offline tests must expire stale qualification rather than preserve indefinite `SUPPORTED`.
- Saturation: MATERIAL / streak reset.

### G2-EDGE-PROVIDER-007 — AI/low-code multi-provider composition amplifies authority or cost

- Scenario: AI/low-code selects, probes, fans out to, or falls back across multiple individually admitted providers, producing broader authority, data disclosure, quota consumption or cost than any single intended binding.
- Activation: composition is syntactically valid and each provider is locally usable, but aggregate provider set/scope/objective is not authorized or economically bounded.
- Expected safe behavior: aggregate composition remains within delegated Station/Role/Person authority, policy, privacy and resource/cost bounds; unsupported dimensions remain visible.
- Forbidden behavior: infer authority to combine providers from authority to use each separately; silently weaken required semantics to obtain a fallback.
- Effect/failure disposition: reject/warn/escalate based on later policy; research records only the pattern.
- Owner(s): Provider/Binding, Authorization, Governance/Privacy, FinOps; AI/AGWS never owns authority.
- Evidence/currentness: current authority envelope, admitted binding set/revisions, data-transfer scope, quota/cost estimates, semantic requirement vector.
- Recovery/reconciliation: detect fan-out/residual effects and route to bounded owner reconciliation.
- Blast radius: enterprise/external parties.
- Severity: HIGH to CRITICAL. Misuse likelihood: plausible accidental and adversarial.
- Proof obligation: compositional tests must prove aggregate authority/data/cost does not exceed the governing envelope.
- Saturation: MATERIAL / streak reset.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-PROVIDER-QUALIFICATION-001 — Local compatibility, global semantic incompatibility

- Family: provider + semantic + policy.
- Activation conditions: provider is protocol-compatible and advertises requested feature, but at least one required semantic/policy dimension is unsupported, stale or unknown.
- Incompatible claims/actions/states: `provider says feature available` versus `consumer requires stronger portable semantics/current constraints`.
- Why local validation misses it: adapter/protocol tests can pass while durability, ordering, locality, recovery, trust or offline semantics diverge.
- Detection candidates: requirement-vector × support-vector comparison; provider-differential conformance corpus; current policy/trust evidence.
- Owner(s): Provider/Binding + domain semantic owner + relevant policy owner.
- Severity: HIGH; confidence: strongly supported; detectability: pre-execution; blast radius: binding/system; reversibility: migration may be required; time-to-harm: immediate or latent; misuse likelihood: likely accidental; evidence currentness: must be current.
- False-positive risk: legitimate bounded degraded modes may intentionally accept a subset when explicitly authorized.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE` (requalify, constrain scope, select another provider, or owner-authorized exception when observed).
- Proof candidate: provider differential semantic corpus.
- Saturation: MATERIAL.

### G2-CONFLICT-PATTERN-BINDING-COEXISTENCE-001 — Individually valid bindings remain jointly authoritative

- Family: version + lifecycle + state-transition + provider.
- Activation conditions: old and new bindings are each valid for some cohort during rebind/cutover; residual workers/sessions/messages/callbacks continue to emit effects.
- Incompatible claims/actions/states: `new binding is effective` versus `old binding still has authoritative effect producers`.
- Detection candidates: binding revision/cohort graph, operation lineage, route/subscription/session/credential inventory, convergence checks.
- Owner(s): Provider/Binding + realized domain owner + Lifecycle.
- Severity: CRITICAL; confidence: strongly supported; detectability: runtime/post-effect; blast radius: system/external parties; reversibility: bounded compensation to potentially irreversible; time-to-harm: immediate; misuse likelihood: plausible; evidence currentness: current.
- False-positive risk: intentional dual-active semantics may be valid when the domain owner explicitly supports them.
- Future remediation disposition: catalogue and route to cohort reconciliation/drainage when concrete evidence shows conflicting authority.
- Proof candidate: cutover fault/chaos proof with residual cohorts.
- Saturation: MATERIAL.

### G2-CONFLICT-PATTERN-PROVIDER-EFFECT-001 — ACK/retry semantics conflict with actual remote mutation

- Family: exception/recovery + temporal + provider.
- Activation conditions: mutating request has ambiguous response; retry policy assumes broader idempotency scope/horizon than provider actually guarantees, or concurrent state changed before retry.
- Incompatible claims/actions/states: `retry is locally safe` versus `first attempt may already be applied or provider idempotency no longer covers the retry`.
- Detection candidates: effect disposition, idempotency-key scope/horizon, provider operation mapping, current target revision and reconciliation evidence.
- Owner(s): Provider/Binding + domain owner.
- Severity: CRITICAL; confidence: strongly supported; detectability: runtime/pre-retry; blast radius: record/system/external; reversibility: potentially irreversible; time-to-harm: immediate; misuse likelihood: likely during failure; evidence currentness: current.
- False-positive risk: operations with contractually proven idempotency may safely retry.
- Future remediation disposition: catalogue; when activated, reconcile `UNKNOWN` before retry or use qualified operation-specific idempotency.
- Proof candidate: timeout-after-apply and delayed-ACK fault injection.
- Saturation: MATERIAL.

### G2-CONFLICT-PATTERN-PROVIDER-COMPOSITION-AUTHORITY-001 — Aggregate provider composition exceeds delegated envelope

- Family: authority + objective + AI/low-code + provider.
- Activation conditions: multiple individually admitted providers are composed through fallback/fan-out/probing/AI selection; aggregate data movement, authority, quota or cost exceeds delegated constraints.
- Incompatible claims/actions/states: `each provider is locally permitted` versus `the combined action set is not permitted or does not preserve required semantics`.
- Detection candidates: aggregate binding graph + current Enterprise→Station→Role→Person authority + privacy/governance constraints + cost/quota bounds + requirement vector.
- Owner(s): Provider/Binding, Authorization, Governance/Privacy, FinOps; AI/AGWS has no independent authority.
- Severity: HIGH/CRITICAL; confidence: supported; detectability: design-time/pre-execution/runtime; blast radius: enterprise/external; reversibility: bounded to potentially irreversible; time-to-harm: immediate/cumulative; misuse likelihood: plausible/adversarial; evidence currentness: current.
- False-positive risk: explicitly authorized multi-provider redundancy/fan-out is legitimate.
- Future remediation disposition: catalogue and route to owner-qualified aggregate composition review when signalled/observed.
- Proof candidate: N-wise provider-composition authority/privacy/cost analysis.
- Saturation: MATERIAL.

## Cross-capability deepening

No 13th mandatory cluster is created. These findings deepen existing clusters:

- **Provider/Binding × external realizations:** all seven local scenarios; especially qualification semantic mismatch, effect ambiguity and residual cohorts.
- **Identity × Authorization × Station × AGWS × AI:** provider composition cannot amplify delegated authority; provider-native identity cannot become canonical identity by convenience.
- **Secrets/Config × Runtime × Provider substitution:** binding revisions can coexist with stale credentials/endpoints/config and must not imply cutover convergence.
- **Observability × Security/Recovery × runtime truth:** reachability/health/ACK is not semantic support, effective outcome or safe retry evidence.
- **Enterprise Trust/PKI × Identity × Artifact/Release × provider substitution:** current trust/protocol compatibility is only part of provider qualification and does not prove full semantic interchangeability.
- **Commercial/FinOps and Privacy/Governance interactions:** automatic multi-provider probing/fallback/fan-out can create aggregate economic or data-governance effects not visible in local provider admission.

## Research disposition and proof obligations

No implementation is authorized. Material consequences are limited to catalogue/classification/detection/proof candidates for later architecture phases. HIGH/CRITICAL scenarios all have semantic owners and proof obligations. No `ConflictInstance` is asserted.

Local no-material streak: **0**. Affected mandatory-cluster streaks remain **0** because this visit produced material findings.
