# Palantir AIP / Agent Study

Date: 2026-09-23
Status: `RESEARCH / PUBLIC-DOC EVIDENCE`

## Findings

### P-AIP01 — AI logic executes in an explicit permission scope
AIP Logic publicly documents user-scoped and project-scoped execution modes. This makes execution identity/authority an explicit configuration rather than assuming model authority.

**Primitive:** inference context != execution principal.

**SB relation:** reinforces `AI inference != authority`; every AI-proposed command requires an independently resolved principal/authority context.

**Classification:** `ADOPT PRINCIPLE`.

### P-AIP02 — Evaluation is a first-class lifecycle
AIP Evals supports test cases, metrics, multi-run variance, model comparisons and cost/performance experiments.

**Primitive:** probabilistic component qualification requires repeatable evaluation evidence, not deterministic unit-test assumptions alone.

**SB relation:** candidate for AI provider/model qualification and regression gates, while evaluation result remains evidence rather than authority.

**Classification:** `ADAPT`.

### P-AIP03 — Ontology mutation by AI can be bounded per entity
Pilot public docs expose per-entity controls such as allowing or disallowing Ontology modifications; when locked resources require change, Pilot pauses for a decision.

**Primitive:** AI change scope is capability/resource bounded and can escalate rather than silently broaden authority.

**SB relation:** aligns with candidate->review->authorized change and bounded self-evolution.

**Classification:** `ADOPT PRINCIPLE`.

### P-AIP04 — AI/application coupling follows Ontology contracts
AIP and Pilot operate against Ontology entities/actions rather than treating free-form model output as direct business state.

**Primitive:** AI interacts through typed governed tools/contracts.

**SB relation:** strongly compatible with `AI interprets; contracts formalize; engines execute`.

**Classification:** `ALREADY COVERED`.

## Adversarial requirements for SB

- AI proposes an action outside the invoking user's authority -> reject/escalate; never inherit model/service authority silently.
- AI recommends a schema/interface change that breaks consumers -> proposal must expose blast radius and compatibility evidence.
- Model/provider change improves average eval score but weakens critical safety case -> multidimensional evals; no scalar score as sole gate.
- AI output is derived from restricted data -> downstream classification/evidence policy must survive derivation.
- AI-generated change is correct but stale relative to newer SystemDefinition/policy -> bind candidate to source revisions/currentness and revalidate before authorization.
- Project-scoped automation has broader rights than the human invoking a UI -> UI must make execution principal/authority explicit.

## Remaining gaps

Next passes should inspect public AIP Agents/tool execution, human review modes, observability/log permissioning, prompt/output classification propagation, MCP proposal flows, model adapters, and exact action/tool side-effect semantics.

## Sources

Official Palantir docs accessed 2026-09-23: AIP Logic core concepts; Pilot Ontology tab; Architecture Center Ontology system.