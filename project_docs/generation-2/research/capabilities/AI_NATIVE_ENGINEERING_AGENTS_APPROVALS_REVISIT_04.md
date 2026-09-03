# AI-native Engineering / Agents / Approvals — Revisit 04 / Cycle 5

## Research question
How should Generation 2 harden AI/agent proposal, approval, delegation and actuation so long-lived approvals, nested agents, durable resume, tool/provider substitution, ambiguous side effects, recovery assistance and disconnected execution cannot amplify authority or turn probabilistic behavior into constitutional truth?

## Representatives and evidence/source ledger
1. **OpenAI Agents SDK (2026)** — run-wide HITL interruptions across top-level agents, handoffs and nested `agent.asTool()`; separate approval at the agent-tool layer and inner-tool layer; serialized long-running approval state; fail-closed behavior when resumed state cannot prove output ownership; pre/post tool guardrails and explicit statement that post-execution guardrails do not undo external side effects. Official SDK evidence. Sources: https://openai.github.io/openai-agents-js/guides/human-in-the-loop/ ; https://openai.github.io/openai-agents-js/guides/guardrails/
2. **Anthropic Claude Code containment/sandboxing (2025–2026)** — filesystem + network isolation, deny/allow boundaries, prompt-injection containment and evidence that approval fatigue motivates moving safety into independently enforced sandbox/egress boundaries rather than relying on repeated confirmations. Official engineering evidence. Sources: https://www.anthropic.com/engineering/claude-code-sandboxing ; https://www.anthropic.com/engineering/how-we-contain-claude ; https://www.anthropic.com/engineering/claude-code-auto-mode
3. **LangGraph interrupts/checkpointing (2026)** — durable HITL pause/resume via checkpoints; resuming an interrupt restarts the node from the beginning rather than the exact source line, making pre-interrupt side effects and idempotency a material recovery concern. Official framework evidence. Sources: https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/wait-user-input/ ; https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/breakpoints/
4. **Model Context Protocol (2025–2026)** — model-controlled tool discovery does not define a universal authorization model; transport authorization is distinct from operation authority; secure URL-mode elicitation keeps sensitive credentials/payment-style interactions out of the model/client context; recent authorization revisions strengthen issuer/discovery validation. Standards/ecosystem evidence. Sources: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization ; https://modelcontextprotocol.io/seps/1036-url-mode-elicitation-for-secure-out-of-band-intera ; https://blog.modelcontextprotocol.io/posts/2026-07-28/
5. **Google ADK + Restate integration / Agents CLI (2026)** — durable journaling of LLM/tool calls, pause/resume human approval, version-aware routing and deterministic recovery; CLI lifecycle includes explicit evaluation and observability rather than treating agent execution as self-validating. Official ecosystem evidence. Sources: https://google.github.io/adk-docs/integrations/restate/ ; https://google.github.io/agents-cli/cli/

## Source of truth and universal primitives
The semantic source of truth must remain outside the probabilistic model and outside provider-specific agent state. Generation 2 should preserve at least:

`SemanticAgentIntent`
`AgentPolicyRevision`
`AuthorityProjectionRevision`
`TrustedInstructionEnvelope`
`ContextArtifact{provenance,trust_class}`
`ToolCapabilityDescriptor`
`ToolBindingRevision`
`ModelHarnessRealizationRevision`
`AgentProposalRevision`
`DeterministicValidationEvidence`
`ApprovalRequirement`
`ApprovalDecision{scope,subject_digest,expiry}`
`ExecutionAuthorization`
`ActuationAttempt`
`ProviderReceipt/OutcomeUnknown`
`EffectiveOutcomeEvidence`
`RecoveryDisposition`

The lifecycle is:

`intent → context qualification → proposal → deterministic validation → approval requirement/decision → execution authorization → actuation attempt → effective-state reconciliation → semantic postcondition validation → recovery/compensation/escalation`.

No transition collapses into another merely because a provider API exposes them through one agent run object.

## Identity, lifecycle and versioning
Approval identity is call/candidate scoped, not a reusable human sentiment. At minimum it binds the semantic operation, normalized tool arguments or candidate digest, applicable policy/authority projection, tool/binding identity, required trust context and expiry/freshness dimensions.

OpenAI's HITL model keeps per-call approvals and explicitly re-runs input guardrails after approval. Its serialized-state handling also fails closed when ownership of a pending output cannot be proven. These are evidence for a universal rule: **resume is a new qualification point**. If candidate, policy, Station/Role authority, tool schema, binding, credential/trust state or relevant provider realization changed, the old approval is stale until explicitly requalified.

Nested delegation has layered identity. Approval to invoke an agent-as-tool does not imply approval of every consequential tool the nested agent may later choose. Conversely, approval of one inner call must not become a blanket grant to sibling/parent agents.

## Failure semantics
Generation 2 must distinguish:
- denied or unavailable tool;
- malformed/uninspectable call;
- validator rejection;
- stale/expired approval;
- interrupted/checkpointed run;
- replayed node or repeated pre-interrupt code;
- provider timeout/acknowledgement loss;
- tool side effect succeeded but response was lost;
- post-execution guardrail rejection after an external side effect already occurred;
- partial multi-tool/multi-agent actuation;
- semantic postcondition failure;
- compensation/recovery failure;
- evidence insufficiency / `INCONCLUSIVE`.

A critical rule follows: `GuardrailRejectedAfterExecution` cannot be modeled as `NoEffect`. OpenAI explicitly notes that guardrails do not undo external tool side effects. Therefore outcome-unknown or rejected-after-side-effect states require reconciliation and an authorized repair/compensation path before retry.

LangGraph adds another replay hazard: resuming an interrupt restarts the node. Any side effect performed before the interrupt must either be prohibited there, idempotent/correlated, or represented by durable attempt evidence so resume cannot duplicate it blindly.

## Extensibility and provider boundaries
Models, agent harnesses, checkpoint engines, tool transports, sandbox implementations, approval UI and model-based safety classifiers are replaceable providers.

The SB owns semantic intent, authority projection, trust classification, approval applicability, validator contract, recovery disposition and evidence lineage. Provider metadata may inform admission but does not create authority.

MCP transport authorization proves a client may access a server under negotiated credentials/scopes; it does not prove every model-selected operation is authorized by the SB's Enterprise/Station/Role/Person policy. Sensitive elicitation that can bypass the agent context is a useful product-specific mechanism supporting the universal primitive `SensitiveInteractionBoundary`.

## Governance and observability
Every consequential run should be reconstructable as:

`actor → effective authority revision → semantic intent → context provenance/trust → model/harness revision → proposal digest → validator evidence → approval decision/scope → execution authorization → tool/binding/credential reference → attempt → provider acknowledgement/uncertainty → reconciled effective result → semantic postcondition → repair/recovery lineage`.

Observability must distinguish model output from actual effect. A trace saying "tool called" or "approved" is not proof that the intended state changed, nor that it changed exactly once.

## Portability and lock-in
Portable agent semantics require preserving intent, capability/tool contract, authority, validation and evidence independent of model/provider. Exact token replay is neither required nor generally defensible as a portability invariant.

A model/harness substitution produces a new realization lineage and requires independent result validation. If the substituted provider cannot represent a required approval boundary, sandbox constraint, durable checkpoint or provenance field, capability negotiation must return degraded/unsupported/`INCONCLUSIVE`, not silently weaken the contract.

## Local/offline closure
A qualified local agent closure declares the model/runtime artifact, policy and authority revisions, admitted tool schemas/bindings, local trust roots and credential references, sandbox/network constraints, validators, checkpoint/replay semantics, approval mechanism, evidence store and recovery dispositions.

Disconnected mode does not grant emergency authority. Break-glass remains an explicit separately authorized facet with scope/expiry/audit obligations. On reconnection, approval/authority/trust/provider revisions must be requalified before queued privileged actuation is released.

## Product-specific mechanisms vs universal primitives
**Product-specific:** OpenAI `interruptions`/`RunState`, pre-approval guardrails and fail-closed serialized output ownership; Claude sandbox/auto-mode classifier; LangGraph `interrupt()` and node restart semantics; MCP URL-mode elicitation/OAuth transport profile; ADK/Restate journal and routing APIs.

**Universal:** revision-bound approval applicability; layered nested delegation; actuation-surface-specific enforcement coverage; replay-safe checkpoint boundaries; ambiguous-effect disposition; effective-state reconciliation; non-amplifying sandbox/egress authority; sensitive-interaction boundary; provider-substitution requalification; qualified local closure.

## Convergent patterns
- Hard safety boundaries are outside the model and remain effective despite prompt/model failure.
- Approval is evidence for a bounded operation, not a credential or general role grant.
- Durable resume requires explicit state/identity semantics and cannot assume no earlier side effects.
- Nested agents preserve multiple approval/authority layers.
- Tool/provider receipts and traces do not substitute for effective-state/postcondition evidence.
- Provider/model substitution requires fresh validation.

## Divergent patterns
- Frameworks differ on whether approval is tool-level, run-level, node-level or provider-hosted.
- Checkpoint/replay semantics differ materially: some resume provider/runtime state while others re-enter application nodes.
- Guardrail coverage differs by actuation surface; a framework may protect custom function tools differently from hosted/built-in tools or handoffs.
- Some systems reduce approval prompts by stronger sandboxing while others expose more human confirmation points.

## Subcapabilities
Trusted/untrusted cumulative context; semantic proposal/materialization; deterministic validation; approval applicability/freshness; nested delegation; tool/binding admission; hard sandbox/network/credential enforcement; checkpoint/replay safety; ambiguous side-effect reconciliation; provider/model substitution; recovery assistance; sensitive out-of-band elicitation; AGWS materialization; local/offline closure; evaluation/conformance evidence.

## System Builder comparison — bounded evidence only
A bounded search against fresh default `main` for `approval agent` returned no matches during this run. This is **not** repository-wide evidence of absence and creates no implementation claim. Full archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

Research target remains constitutional: AI may propose/materialize within delegated scope, but deterministic validators, authorization, provider bindings and recovery controls remain independently enforceable.

## Reconciliation hypotheses
- **GENERALIZE** `Proposal → Validation → Approval → ExecutionAuthorization → Attempt → EffectiveOutcome → Postcondition` as a cross-capability governed-transition primitive.
- **HARDEN** approval applicability with revision vectors and expected-base semantics.
- **HARDEN** checkpoint/resume with replay-safe side-effect boundaries and attempt correlation.
- **GENERALIZE** ambiguous external-actuation disposition and reconcile-before-retry with Integration, Workflow, Lifecycle and Architecture Reconciliation.
- **PROVIDERIZE** model, harness, checkpoint runtime, tool transport and safety classifier without transferring semantic authority.
- **INTEGRATE** recovery-assistance proposals with Security/Recovery recovery-point eligibility and break-glass authority.
- **DO_NOT_BUILD** an AI-specific authorization plane, model-self-certifying safety, or blanket nested-agent approval inheritance.

## Repo-validation questions
1. Are approvals bound to exact candidate/tool-call/policy/authority/binding generations, with expected-base/freshness checks at resume?
2. Can nested agents receive distinct authority subsets and separate approvals at outer-agent and inner-tool layers?
3. Which current tool surfaces are covered by deterministic guardrails, and which bypass those guardrail paths?
4. Can checkpoint/resume re-enter code that already emitted side effects; if so, are attempts correlated/idempotent/reconciled?
5. Is an acknowledgement-lost tool execution represented as outcome unknown rather than retryable failure?
6. Can post-execution validator/guardrail failure trigger explicit reconciliation/repair without pretending the side effect never occurred?
7. Are sandbox/network/credential boundaries independently enforced and auditable under prompt injection or mistaken human approval?
8. Does model/provider substitution create fresh realization/evaluation evidence while preserving semantic task identity?
9. Can recovery agents diagnose/propose without automatically receiving fencing, writer-promotion, secret or provider-admin authority?
10. Does offline mode retain exact approval/policy/trust/tool closure and requalify queued privileged work after reconnection?

## Adaptive Governed Work Surfaces / Station interaction
AGWS remains a distinct active capability. Effective authority is resolved `Enterprise → Station → Role → Person`; lower layers may only specialize delegated dimensions and cannot weaken inherited invariants.

AI is the sole materializer of permitted surface changes but not the authority source. An AGWS request to compose a list/form/grid may proceed against existing admitted contracts; requests that imply canonical schema/domain/process/provider/deployment/recovery mutation are escalated. Mandatory inherited components remain protected. Personal automation can call only admitted provider-neutral capabilities within effective Station/Role/Person authority.

A Station change, Role change, tool/provider rebind or authority revision invalidates any approval whose applicability depended on the prior projection. Personalization lineage/version/diff/reset/rollback/promotion evidence remains independent from agent run state.

## Symbiotic Proof / architecture proof obligations
1. **Exact-approval applicability proof:** approve tool call/candidate A under policy/authority/binding vector X; mutate arguments, candidate digest, policy, Station/Role or binding before resume. Old approval becomes stale and cannot authorize the new actuation.
2. **Layered nested-delegation proof:** approve invocation of a nested agent but not a privileged inner tool. The nested agent may run, while the inner tool independently interrupts/denies; no blanket transitive approval.
3. **Guardrail-surface coverage proof:** configure validation for one tool class and attempt the same prohibited semantic action through a handoff/hosted/built-in/alternate actuation surface. Missing guardrail coverage must be explicit and cannot be inferred safe.
4. **Checkpoint replay proof:** place a correlated side effect before a durable interrupt, resume the run and prove duplicate effects are prevented/reconciled despite node re-entry semantics.
5. **Ambiguous side-effect proof:** external tool succeeds but acknowledgement is lost; a post-execution guardrail then rejects or the run fails. System records `OUTCOME_UNKNOWN/PARTIAL`, reconciles effective state and refuses blind retry.
6. **Sandbox non-amplification proof:** malicious trusted-looking prompt and mistaken approval attempt filesystem/network/credential escape. Independent sandbox/egress/policy boundary denies the operation.
7. **Provider-substitution proof:** execute same semantic intent through two model/harness providers. Authority obligations remain stable, result lineage differs and each effective result receives independent deterministic/postcondition validation.
8. **Recovery-assistance proof:** agent receives complete incident/recovery evidence, including an eligible recovery point, but lacks recovery actuation facet. It may recommend/escalate; writer promotion/fencing/restore/secret/provider-admin action remains denied.
9. **Qualified-local-closure proof:** disconnect external trust/approval services with a declared local closure; remove one required policy/tool/trust/checkpoint dependency. Privileged action becomes denied/degraded/`INCONCLUSIVE`, never implicitly elevated.
10. **Reconnection requalification proof:** queue an offline-approved action, then change Enterprise/Station policy or provider binding before reconnection. The queued approval is invalidated and must be requalified before actuation.

## Stable findings
- **G2-FINDING-AIN-31 — Approval Applicability Is Bound to the Exact Candidate/Call and Governing Revision Vector.** Value HIGH; risk CRITICAL; priority P0. An approval is not reusable consent when candidate, arguments, policy, authority, tool/binding, trust or expiry dimensions materially change.
- **G2-FINDING-AIN-32 — Nested-Agent Invocation Approval and Inner-Tool Approval Are Distinct, Non-Transitive Authority Decisions.** Value HIGH; risk CRITICAL; priority P0. Delegation layers may surface through one run, but authority cannot collapse into blanket nested approval.
- **G2-FINDING-AIN-33 — Guardrail/Policy Coverage Must Be Proven Per Actuation Surface, Not Inferred from Framework-Level Enablement.** Value HIGH; risk CRITICAL; priority P0. Custom function tools, hosted/built-in tools, handoffs and nested agents can traverse different enforcement paths.
- **G2-FINDING-AIN-34 — Durable Agent Resume Requires Replay-Safe Side-Effect Boundaries and Checkpoint Attempt Evidence.** Value HIGH; risk CRITICAL; priority P0. A resumed graph/runtime may re-enter code; side effects before interruption need idempotency/correlation/reconciliation.
- **G2-FINDING-AIN-35 — Post-Execution Rejection Cannot Erase External Side Effects; Ambiguous Effective State Must Be Reconciled Before Retry.** Value HIGH; risk CRITICAL; priority P0.
- **G2-FINDING-AIN-36 — Sandbox/Egress/Capability Boundaries Are Constitutional Safety Controls; Repeated Human Approval Is Not.** Value HIGH; risk CRITICAL; priority P0. Approval fatigue and prompt compromise make hard external enforcement necessary.
- **G2-FINDING-AIN-37 — Transport Authentication/Tool Discovery and Semantic Operation Authority Are Separate Boundaries.** Value HIGH; risk HIGH; priority P0. MCP-style access establishes connectivity/credential context, not permission for every model-selected semantic operation.
- **G2-FINDING-AIN-38 — Offline or Provider-Substituted Agent Execution Requires Fresh Effective-Result and Reconnection Qualification Evidence.** Value HIGH; risk HIGH; priority P1. Cached/local capability or a substitute model does not preserve approval/trust/result validity automatically.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-AIN-REVISION-VECTOR-APPROVAL-APPLICABILITY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge with revision-bound evidence and expected-base ownership during synthesis.
- `G2-CAPABILITY-CANDIDATE-AIN-REPLAY-SAFE-AGENT-CHECKPOINT-ACTUATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Workflow durable execution/idempotency and ambiguous-outcome disposition.
- `G2-CAPABILITY-CANDIDATE-AIN-ACTUATION-SURFACE-ENFORCEMENT-COVERAGE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Authorization, Provider Binding and Security hard-boundary proofs.
- `G2-CAPABILITY-CANDIDATE-AIN-SENSITIVE-INTERACTION-OUT-OF-BAND-BOUNDARY` — **CROSS_CUTTING / CANDIDATE**; retain unless broader Secrets/Identity/Governance synthesis absorbs it cleanly.

No candidate is promoted in this revisit.

## Saturation
Material new architectural findings: **yes**. `consecutive_no_material_finding=0`; **NOT SATURATED**. Principal representatives are strong, but the eight new findings reset the saturation streak. Remaining questions concern convergence into shared constitutional primitives plus later repository validation; one additional no-material revisit would still be insufficient because the saturation rule requires two consecutive eligible revisits without material findings.

## Next research question for this capability
During later research-by-exception, test whether revision-bound approval applicability, replay-safe checkpoint actuation, per-surface enforcement coverage and sensitive out-of-band interactions collapse cleanly into shared constitutional primitives without losing AI-specific threat semantics.