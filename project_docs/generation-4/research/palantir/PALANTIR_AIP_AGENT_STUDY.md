# Palantir AIP / Agent Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`
Implementation state: `DEFERRED_IMPROVEMENT`

## Findings

### P-AIP01 — AI logic executes in an explicit permission scope
AIP Logic publicly documents user-scoped and project-scoped execution modes. This makes execution identity/authority an explicit configuration rather than assuming model authority.

**Primitive:** inference context != execution principal.

**SB relation:** reinforces `AI inference != authority`; every AI-proposed command requires an independently resolved principal/authority context.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP02 — Evaluation is a first-class lifecycle
AIP Evals supports test cases, metrics, multi-run variance, model comparisons and cost/performance experiments.

**Primitive:** probabilistic component qualification requires repeatable evaluation evidence, not deterministic unit-test assumptions alone.

**SB relation:** candidate for AI provider/model qualification and regression gates, while evaluation result remains evidence rather than authority.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP03 — Ontology mutation by AI can be bounded per entity
Pilot public docs expose per-entity controls such as allowing or disallowing Ontology modifications; when locked resources require change, Pilot pauses for a decision.

**Primitive:** AI change scope is capability/resource bounded and can escalate rather than silently broaden authority.

**SB relation:** aligns with candidate->review->authorized change and bounded self-evolution.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP04 — AI/application coupling follows Ontology contracts
AIP and Pilot operate against Ontology entities/actions rather than treating free-form model output as direct business state.

**Primitive:** AI interacts through typed governed tools/contracts.

**SB relation:** strongly compatible with `AI interprets; contracts formalize; engines execute`.

**Classification:** `ALREADY COVERED`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP05 — Observability content can be more sensitive than its source-executor metadata
**Source/date:** Palantir official docs, Ontology and AIP observability — Log permissions / Configure logging / Trace views, reviewed 2026-09-23.

**Palantir mechanism:** trace and service logs may contain prompts, completions, object-property values, user inputs and function input/output. Log viewing requires resource permission, explicit log-access enablement and every marking explicitly attached to the logs. Critically, those log markings are not automatically derived from the source executor, its inputs, or data reached during execution; administrators must choose markings representing the maximum sensitivity the workflow may touch.

**Problem solved:** makes rich cross-service debugging possible while providing a separately governed telemetry-access boundary.

**Universal primitive:** `source-data authorization/classification != derived-observability authorization/classification`; derivation creates a new governed disclosure surface whose sensitivity must be conservatively qualified.

**Preconditions:** know or bound the maximum sensitivity reachable by the workflow; control who may enable logging; retain independent authorization for telemetry access.

**Trade-offs:** rich traces materially improve diagnosis and AI evaluation, but prompt/output/input visibility expands disclosure surface and conservative classification may reduce observability usability.

**Failure modes:** under-marked logs expose restricted derived content; workflow reach expands after log policy was configured; privileged editor receives telemetry broader than intended; exported telemetry escapes the in-platform policy domain; debugging code logs sensitive provider payloads.

**Lock-in boundary:** Palantir's markings/log-access machinery is platform-specific. The transferable requirement is classification/authorization continuity for derived telemetry, not Foundry markings or Workflow Lineage.

**SB relation:** strengthens evidence/provenance/currentness and `projection != canonical truth`. Observe remains replaceable and non-authoritative, but replaceability cannot discard confidentiality obligations. Resource Fabric/provider data, AI context and generated-runtime telemetry need explicit derived-data policy rather than inheriting a UI/resource label by assumption.

**Classification:** `ADOPT PRINCIPLE`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP06 — Trace access is a distinct authority domain from execution authority
**Source/date:** Palantir official docs, Log permissions and Trace views, reviewed 2026-09-23.

**Palantir mechanism:** execution history, traces and service logs have distinct access requirements. Trace details can expose function parameters/results, LLM prompts/responses, token use, errors and cross-service execution structure. A source executor anchors log-access policy for a call chain.

**Problem solved:** permits operational debugging without treating ability to execute a workflow as blanket authority to inspect all historical telemetry.

**Universal primitive:** `may execute != may inspect derived telemetry != may administer telemetry disclosure`; observability authority is separately scoped.

**Preconditions:** stable execution/source identity, explicit telemetry-access policy, auditable administrator authority and retention boundaries.

**Trade-offs:** separation improves least privilege but complicates incident response and may make debugging unavailable exactly when access is constrained.

**Failure modes:** telemetry administrator silently broadens disclosure; moved/re-attributed resources create stale access assumptions; call-chain/source-executor attribution is mistaken for business-data ownership; trace correlation is mistaken for authority or causation.

**Lock-in boundary:** Foundry's source-executor and project permission model is implementation-specific. SB should preserve the authority separation without requiring a central Builder observability backend at client runtime.

**SB relation:** aligns with autonomous runtimes and replaceable OpenTelemetry-compatible Observe. Telemetry export must carry enough policy/evidence metadata for an external observability provider to avoid silently weakening the source system's disclosure constraints.

**Classification:** `ADAPT`. **Implementation:** `DEFERRED_IMPROVEMENT`.

### P-AIP07 — Telemetry retention/currentness is not business evidence retention/currentness
**Source/date:** Palantir official docs, Log search / Execution history, reviewed 2026-09-23.

**Palantir mechanism:** log search and execution history expose bounded recent windows (documented as 30 days for these surfaces); log search is not live and requires refresh for newer entries.

**Problem solved:** bounds operational telemetry storage and search cost.

**Universal primitive:** `telemetry retention != canonical evidence retention`; `not present in current log window != did not occur`; `search snapshot != live state`.

**Preconditions:** consumers understand retention/currentness metadata and durable business evidence exists elsewhere when required.

**Trade-offs:** bounded retention reduces cost/privacy exposure but limits forensic reconstruction if telemetry was incorrectly treated as durable proof.

**Failure modes:** Station infers non-occurrence from expired logs; stale search results are presented as current; audit obligations depend on telemetry whose retention is shorter than the business obligation.

**Lock-in boundary:** exact Palantir retention windows are product policy, not a universal recommendation.

**SB relation:** reinforces `projection != canonical truth`, `reported != observed != effective` and the constitutional separation between Observe and autonomous runtime. UI must expose freshness/retention where absence could otherwise be interpreted as proof.

**Classification:** `ALREADY COVERED` with concrete benchmark evidence. **Implementation:** `DEFERRED_IMPROVEMENT`.

## Adversarial requirements for SB

- AI proposes an action outside the invoking user's authority -> reject/escalate; never inherit model/service authority silently.
- AI recommends a schema/interface change that breaks consumers -> proposal must expose blast radius and compatibility evidence.
- Model/provider change improves average eval score but weakens critical safety case -> multidimensional evals; no scalar score as sole gate.
- AI output is derived from restricted data -> downstream classification/evidence policy must survive derivation.
- AI-generated change is correct but stale relative to newer SystemDefinition/policy -> bind candidate to source revisions/currentness and revalidate before authorization.
- Project-scoped automation has broader rights than the human invoking a UI -> UI must make execution principal/authority explicit.
- Workflow reaches a newly restricted source after telemetry policy was configured -> existing log markings/access policy may be insufficient; requalify derived-observability policy.
- User may execute an AI workflow but is not entitled to inspect another user's prompts/results -> execution and telemetry-inspection authority remain separate.
- Observability export reaches a third-party backend -> export must not silently erase classification, tenant, retention or disclosure constraints.
- Log entry is absent after retention expiry or search snapshot is stale -> absence cannot prove non-execution/non-effect.

## Station sequencing implications

No finding above is a correctness/security blocker requiring displacement of the current visual milestone. Only representation constraints may be consumed now: future Station observability surfaces should distinguish execution authority from log-inspection authority, expose freshness/retention when material, and avoid presenting trace/log availability as canonical business truth.

## Remaining gaps

Next passes should inspect public AIP Agent tool permissioning and delegation, human review modes, telemetry export policy propagation, prompt/output classification outside logs, MCP proposal flows, model adapters, and exact tool side-effect semantics. The log-classification vector is now materially evidenced and should not be repeatedly rediscovered unless primary documentation changes.

## Sources

Official Palantir docs reviewed 2026-09-23: AIP Logic core concepts; Pilot Ontology tab; Architecture Center Ontology system; Ontology and AIP observability — Log permissions, Trace views, Service logs and debugging, Log search, Execution history; Administration — Configure logging.