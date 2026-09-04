# Deep Research — Low-code Composition Authority & Semantic Effect 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

## Question

When a low-code/AI-generated workflow is assembled exclusively from primitives that are individually valid and individually authorized, can the composition still create a canonical semantic effect, information flow, authority relationship, separation-of-duty violation or cross-owner postcondition that was never authorized as a whole? If so, what is the smallest portable invariant that Generation 2 should preserve without turning low-code into an over-restrictive global theorem prover?

This deep dive falsifies the safe assumption behind `G2-CONFLICT-PATTERN-LOWCODE-MATERIALIZATION-001`: **`each primitive allowed` does not imply `composition admissible`**.

## Why this is architecturally material

The UI/low-code breadth pass already found that a `DerivedValue`, field, rule, condition or action can be safe in isolation while their composition silently creates new StoredFact/process/policy meaning or wider authority. The next breadth focus is Integration & Automation, where the same failure shape can escape the UI boundary and create external effects, data movement, loops and durable automation.

If G2 checks only node-level syntax and node-level authorization, it can approve a graph whose emergent semantics violate a cross-task constraint, owner invariant, data-flow policy or authority boundary. If G2 instead tries to derive one universal global semantics for every possible graph, it becomes a semantic god-object and over-constrains legitimate enterprise processes. The boundary therefore affects UI/low-code, Workflow, Integration, Authorization, Data, Formula/Calculation, AGWS/AI, Lifecycle and Provider/Binding at once.

## SB corpus consumed

- `RESEARCH_PIPELINE_STATE.json` — adversarial Full Pass 1 active; UI visit produced `LOWCODE-MATERIALIZATION-001`; next focus is Integration & Automation.
- `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md` — explicitly requires authority/misuse, scale, provider divergence and valid-but-pathological composition analysis.
- `edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md` — requires preserving `ConflictPattern != ConflictInstance`, signals versus confirmed conflicts, and default `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.
- `edge-cases/UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_EDGE_CASE_REGISTER.md` — `G2-EDGE-UI-007` and `G2-CONFLICT-PATTERN-LOWCODE-MATERIALIZATION-001` are the immediate input hypotheses.
- `edge-cases/WORKFLOW_DURABLE_EXECUTION_EDGE_CASE_REGISTER.md` — already proves that individually valid retries, transitions and fan-out can conflict at composition/effect boundaries.
- `deep-research/DEEP_RESEARCH_EXECUTABLE_OPERATION_COMPOSITION_01.md` — capability-owned semantic operations remain distinct from workflow orchestration and provider mechanics.
- Existing authority/evidence deep researches remain inputs, especially non-amplification, qualified claims, recursive trust and durable delegated authority.

Breadth findings are treated as hypotheses/input corpus, not independent proof.

## External evidence ledger

### E1 — Microsoft Power Platform connector classification / DLP
Source: https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification

Power Platform classifies connectors into groups and prevents Business and Non-Business connectors from being used together in the same app/flow. The significant evidence is not the product taxonomy; it is that mature low-code governance treats **combination** as a separate security subject. A connector can be usable by itself while a particular connector pairing is prohibited.

Evidence strength: strong mature-system evidence for composition-level admissibility beyond primitive availability.

### E2 — Microsoft Power Automate DLP for desktop-flow actions
Source: https://learn.microsoft.com/en-us/power-automate/prevent-data-loss

DLP can classify connector/action groups and prevent combinations across a flow. Again, local action availability is insufficient to prove graph admissibility.

Evidence strength: strong industrial evidence; mechanism remains provider-specific.

### E3 — NIST least privilege
Source: https://csrc.nist.gov/glossary/term/least_privilege

NIST defines least privilege as restricting users/processes to the minimum resources and authorizations necessary for their function. This supports actuation-time bounded authority and rejects ambient use of broader platform credentials. It does **not** by itself prove that the union of individually minimal actions is a safe composition.

Evidence strength: strong principle; incomplete for emergent cross-action constraints.

### E4 — Cedar authorization composition
Sources:
- https://docs.cedarpolicy.com/auth/authorization.html
- https://docs.cedarpolicy.com/policies/validation.html

Cedar uses explicit principal/action/resource/context requests, default deny, and forbid-overrides-permit. It also separates schema validation from authorization evaluation and warns that schema evolution can invalidate earlier assumptions. This strongly supports two G2 boundaries: each protected actuation needs current authoritative evaluation; and local/static validation is a different proof from runtime authorization.

Negative evidence: even a correct authorization engine only decides the requests and policies presented to it. It does not automatically discover arbitrary business-process invariants or cross-step semantic conflicts.

### E5 — Workflow authorization constraints and inter-instance separation of duty
Source: Janice Warner, Vijayalakshmi Atluri, “Inter-instance authorization constraints for secure workflow management,” SACMAT 2006, DOI 10.1145/1133058.1133085.
https://doi.org/10.1145/1133058.1133085

The paper shows that separation-of-duty constraints can span multiple workflow instances and execution history. Tasks/users may be individually authorized while the assignment/execution set is invalid when considered jointly.

Evidence strength: strong peer-reviewed evidence that per-task authorization is not composition authorization.

### E6 — Workflow with SoD constraints modeled jointly
Source: Lu, Zhang, Sun, “Using colored Petri nets to model and analyze workflow with separation of duty constraints,” International Journal of Advanced Manufacturing Technology, 2009.
https://doi.org/10.1007/s00170-007-1316-1

The work combines control flow, authorization and SoD constraints into an integrated model and detects latent deadlocks caused by their inconsistency.

Evidence strength: strong evidence that locally valid workflow/security pieces may jointly be unsatisfiable; supports model-checking candidates, not a mandatory Petri-net implementation.

### E7 — Access-control policy composition
Source: Bruns & Huth, “Access control via Belnap logic: intuitive, expressive, and analyzable policy composition,” ACM TISSEC 14(1), 2011.
https://doi.org/10.1145/1952982.1952991

The paper explicitly represents composed policy outcomes including grant, deny, conflict and unspecified and supports conflict analysis.

Evidence strength: strong evidence that policy composition needs an explicit conflict/unspecified vocabulary rather than arbitrary rule order. G2 should not copy Belnap logic universally.

### E8 — Composite-service policy consistency
Source: IBM Research, Satoh & Tokuda, “Security policy composition for composite web services,” IEEE Transactions on Services Computing, 2011.
https://research.ibm.com/publications/security-policy-composition-for-composite-web-services

The work argues that a composite service policy must remain consistent with policies of external services and supports both top-down and bottom-up composition checks.

Evidence strength: strong industrial/research evidence for cross-owner policy compatibility at service-composition boundaries.

### E9 — Nonmalleable information flow
Source: Cecchetti, Myers, Arden, CCS 2017.
https://www.cs.cornell.edu/andru/papers/nmifc/

Noninterference is compositional but too restrictive for real systems; controlled downgrading is necessary, and unconstrained downgrading breaks compositional security. The paper introduces controlled declassification/endorsement semantics.

Evidence strength: strong formal evidence for a crucial analogy: composition may cross an information/integrity boundary only through an explicit owner-authorized downgrade/endorsement, not because adjacent steps are individually valid.

### E10 — Flow-Limited Authorization
Source: Arden & Myers, CSF 2016.
https://www.cs.cornell.edu/andru/papers/flac/

FLAC addresses dynamically computed authority and shows that authorization computation itself can compromise integrity/confidentiality if adversarial inputs improperly influence it.

Evidence strength: strong formal evidence that dynamically composed authorization/effect decisions require authority-flow reasoning, not only endpoint permission checks.

### E11 — Capability-security authority transfer / confused deputy
Source: E language capability-security material, drawing on Miller et al.
https://www.erights.org/elang/kernel/auditors/index.html

Capability authority is conveyed through explicit capability relationships rather than ambient global authority. This supports explicit delegation/projection and warns against a composer/deputy silently wielding platform authority not conveyed by the triggering lineage.

Evidence strength: strong security-design lineage; exact object-capability mechanics are not prescribed for G2.

## Competing models

### Model A — Node-validity implies graph-validity

Every node/action validates syntax, types and permissions. If all nodes pass, the graph is publishable/executable.

**Falsified.** SoD, connector-combination, information-flow and policy-composition evidence all demonstrate constraints whose activation only exists across nodes, owners, instances or history.

Disposition: `DO_NOT_BUILD` as the sole safety model.

### Model B — Re-authorize every actuation; no composition analysis

Every external/canonical mutation is re-authorized against current principal/action/resource/context. This closes many confused-deputy paths and is mandatory for protected effects.

**Necessary but insufficient.** A user may be individually authorized for A and B while `A then B`, `A and B by same actor`, or `data from A -> sink B` violates SoD, information-flow, policy, temporal or domain constraints.

Disposition: `KEEP` as actuation invariant, but not sufficient as composition proof.

### Model C — Universal graph theorem prover / universal semantic evaluator

Normalize every process/rule/formula/provider/policy into one formal language and prove all possible conflicts globally.

**Overreaches.** Formal methods are valuable for bounded classes, but enterprise business semantics include domain-specific invariants, human exceptions, provider-specific behavior and runtime data. One universal evaluator would usurp semantic owners and create a new god-object.

Disposition: `DO_NOT_BUILD` as universal architecture.

### Model D — Owner-declared constraints + composition qualification + actuation re-authorization

Each primitive preserves its semantic owner, authority requirements and effect contract. Composition introduces a separate admissibility question evaluated against **declared material constraints**: authority/non-amplification, policy/SoD, data-flow/materialization, revision compatibility, resource/termination and owner-specific invariants. Static analysis handles provable classes; runtime/pre-effect qualification handles current/data-dependent classes; unresolved material uncertainty stays `INCONCLUSIVE/UNKNOWN` rather than being silently approved.

Disposition: strongest model. `KEEP + GENERALIZE + SPECIALIZE` as research recommendation.

## Strongest evidence for

1. Mature low-code systems restrict **connector combinations**, proving graph-level governance is useful beyond primitive-level availability.
2. Workflow-security literature proves authorization constraints can span tasks, instances and history; local task authorization can remain true while the workflow assignment is invalid.
3. Policy-composition research explicitly represents conflict/unspecified outcomes; arbitrary rule ordering is not a sound universal conflict resolver.
4. Formal information-flow work shows controlled downgrading/endorsement is the safe exception to otherwise compositional restrictions; cross-owner semantic adoption should similarly require explicit owner authority.
5. Capability/confused-deputy lineage supports causal/minimum authority projection instead of ambient platform credentials.

## Strongest evidence against overgeneralization

1. Microsoft DLP group semantics are product policy, not a universal enterprise ontology; G2 must not copy Business/Non-Business/Blocked as canonical categories.
2. SoD applies only when a domain/policy declares a duty constraint; banning same-actor multi-step composition globally would break legitimate work.
3. Noninterference is intentionally too restrictive for practical systems; legitimate declassification/endorsement exists. Therefore “no cross-boundary flow ever” is not acceptable.
4. Cedar demonstrates that a narrow authorization engine can be precise without owning business process semantics; G2 should retain semantic-owner separation.
5. Many composition conflicts are runtime/data/revision dependent and cannot be conclusively prevented statically without false positives.

## Reconciled distinctions / invariants

The evidence supports preserving these distinctions:

`PrimitiveValid != CompositionAdmissible != InvocationAuthorized != EffectQualified`

`Proposal/Projection != SemanticAdoption`

`AuthorityToA + AuthorityToB != AuthorityForArbitrary(A∘B)`

`IndividualPolicyPermit != CrossPolicy/ProcessCompatibility`

`StaticConflictSignal != ConfirmedConflict`

`CompositionAdmissibility` is not a new semantic owner. It is a **qualification relation over owner-declared constraints and evidence**. The capability/domain owners retain the meaning of the constraint, policy, fact, formula, process and effect.

### Preventive invariant candidate — bounded and justified

A universal prevention candidate is justified only at the following narrow level:

> A low-code/AI composition MUST NOT silently create canonical truth, privileged actuation or cross-owner semantic adoption merely because all constituent primitives are individually valid. Any new canonical effect or authority-bearing composition must remain within an explicit delegated/owner-authorized envelope and must be requalified against material current constraints before actuation/adoption.

This does **not** imply every composition needs a globally complete static proof. Unknown domain constraints remain diagnosable/routable rather than globally forbidden.

## Failure / adversarial analysis

### F1 — Individually allowed source + sink leaks governed data
A user may read from source A and separately send to sink B; the combined flow violates data-boundary policy. Local authorization passes both actions.

### F2 — Same actor performs two individually authorized steps that violate SoD
Request and approval are each allowed for the actor in isolation but forbidden in the same workflow/history context.

### F3 — DerivedValue becomes StoredFact through a low-code save binding
The formula is authorized to compute and the form is authorized to save, but no owner authorized adoption of the derived result as canonical fact.

### F4 — Integration loop creates emergent mutation amplification
Webhook A can invoke operation B; event B can invoke A. Each edge is valid; graph composition creates unbounded externally visible effects/cost.

### F5 — AI uses ambient platform credential
The AI/composer is allowed to propose a graph and the platform integration credential can perform privileged operations. If invocation uses platform authority rather than delegated causal authority, the composer becomes a confused deputy.

### F6 — Revision drift changes composition meaning
Graph N was admitted under policy/schema/formula revisions N; one owner evolves. Each node remains syntactically valid, but cross-owner material constraint no longer holds.

### F7 — Provider substitution preserves feature names but weakens combination guard
Both providers expose “send”, “write” or “idempotent” features, but support vectors, scopes or DLP semantics differ. Matching labels do not prove composition equivalence.

### F8 — Static analysis rejects a legitimate owner-authorized downgrade
A naive global rule blocks all cross-boundary flow, producing false positives and preventing valid declassification/exception paths.

### F9 — Human exception bypasses hidden graph constraint
A manual step is individually authorized but changes canonical state outside the assumptions used by the generated graph, making later actions unsafe.

### F10 — Resource-safe nodes form unsafe fan-out
Each action respects provider quota in isolation; N-way composition exceeds aggregate capacity/cost and creates partial external effects.

## Provider-specific vs portable semantics

### Portable semantics G2 should own/preserve

- stable canonical operation/constraint/revision identities;
- explicit semantic owner and owner-authorized adoption/materialization boundary;
- delegated authority envelope and current actuation authorization;
- material composition dependency/revision vector;
- typed effect/outcome lineage including `UNKNOWN`;
- qualified conflict/admissibility evidence and currentness;
- distinction between static signal, applicability, observed conflict and confirmed conflict;
- explicit exception/declassification/endorsement authority where a domain permits a normally forbidden composition.

### Providerized mechanics

- connector grouping/DLP implementations;
- workflow/model-checking engine;
- Cedar/OPA/other authorization evaluator;
- information-flow/static-analysis engine;
- graph cycle/resource analyzer;
- provider-native action IDs/credentials/scopes;
- low-code renderer/editor/runtime.

Provider mechanics may strengthen proof, but provider-native policy/action IDs do not become canonical truth.

## Consequences for existing findings/candidates/hypotheses

1. **KEEP + DEEPEN** `G2-CONFLICT-PATTERN-LOWCODE-MATERIALIZATION-001`; no new ConflictPattern is necessary in this dive because the breadth pattern already names the right reusable class.
2. **GENERALIZE** the pattern beyond UI persistence: composition can create new authority, information flow, cross-owner postcondition, SoD state or external effect even when no new field is materialized.
3. **KEEP** `CapabilityOperation` as semantic executable unit; graph admission cannot be inferred from the validity of each operation alone.
4. **KEEP** actuation-time Authorization/AGWS enforcement; assignment, visibility, graph publication and provider credential are not continuing authority.
5. **SPECIALIZE** owner-declared composition constraints: SoD, data-flow, formula materialization, policy, resource, temporal and provider-compatibility constraints remain with their owners.
6. **GENERALIZE** qualified evidence/currentness to composition admission: a prior graph admission is not eternal when material owner revisions change.
7. **PROVIDERIZE** DLP, policy solvers, model checkers and static analyzers.
8. **DO_NOT_BUILD** a universal semantic evaluator that arbitrarily resolves conflicts or automatically decides owner precedence.
9. **DEFER** exact representation/name of a reusable `CompositionQualification` envelope to Planning C; research supports the relation, not a new top-level capability.

No 29th canonical capability is recommended.

## Conflict record — deepening `G2-CONFLICT-PATTERN-LOWCODE-MATERIALIZATION-001`

- **Activation conditions:** two or more individually valid primitives/operations/constraints are composed and the composition crosses a semantic-owner, authority, data-flow, duty, temporal, resource or provider boundary.
- **Incompatible claims/actions/states:** primitive-level `allowed/valid` claims versus graph-level owner constraint, postcondition, information-flow rule, SoD rule or delegated authority envelope.
- **Why local validation misses it:** each node sees only its local contract/authorization; material conflict depends on graph reachability, shared history, cross-owner revision/currentness, cumulative data/effect flow or runtime context.
- **Falsification path:** construct graphs where all nodes remain individually valid and vary only a cross-node constraint. If no graph can violate owner-declared policy/postcondition/SoD/data-flow constraints without some node becoming locally invalid, the finding is weakened. Existing evidence provides multiple counterexamples, so confidence is high.
- **Detection stages/candidates:** design-time graph/constraint/dependency analysis; publish-time owner/revision compatibility qualification; pre-actuation authority/currentness re-evaluation; runtime loop/effect/resource conflict signals; post-effect audit for emergent violations.
- **Owners:** UI/low-code composition owner; semantic owners of affected Process/Data/Formula/Authorization/Integration effects; Lifecycle for revision coexistence; Provider/Binding for realization support evidence.
- **Severity:** HIGH–CRITICAL.
- **Confidence:** strongly supported.
- **Detectability:** static + pre-execution + runtime; some domain conflicts audit-only.
- **Blast radius:** record/task → process/system/enterprise/external parties.
- **Reversibility:** easy pre-publish to potentially irreversible after external/financial/physical effect.
- **Time-to-harm:** immediate, delayed or cumulative depending on composition.
- **Misuse likelihood:** accidental plausible/likely; adversarial exploitation plausible where ambient authority exists.
- **Evidence currentness:** current external standards/docs and mature-system docs plus stable peer-reviewed/formal literature.
- **False-positive risks:** high if generic heuristics pretend to know undeclared domain semantics; conditional alternatives, intentional declassification and authorized same-actor sequences must remain valid.
- **Future remediation route:** owner-qualified reject/warn/acknowledge; require explicit semantic adoption/declassification; re-evaluate authority; pin/migrate revision; reconcile `UNKNOWN`; throttle/isolate loop/resource path; human owner reconciliation where semantics are not mechanically decidable.
- **Default research disposition:** `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## Proof obligations

### DR-LCCASE-01 — Individually authorized actions, forbidden composition
Create two operations each individually authorized for one actor/resource scope but with an owner-declared cross-operation prohibition. Prove graph publication/execution cannot infer composition admissibility from node permits alone.

### DR-LCCASE-02 — Separation-of-duty history
Actor may request and may approve in different contexts. Prove a same-instance/history SoD constraint blocks the forbidden assignment without globally banning either permission.

### DR-LCCASE-03 — Data-flow source/sink combination
Allow reads from a governed source and writes to an external sink independently under different purposes. Prove a prohibited cross-boundary flow is signalled/blocked when the owner policy activates, while an explicit authorized declassification path remains possible.

### DR-LCCASE-04 — DerivedValue materialization
Render a derived value and permit ordinary record save. Prove the result cannot become StoredFact without explicit materialization/adoption semantics tied to producing FormulaRevision/input evidence.

### DR-LCCASE-05 — Ambient credential confused deputy
Give the low-code runtime a broad provider credential and the triggering actor a narrower envelope. Prove graph execution cannot use runtime ambient authority to exceed the triggering/delegated authority lineage.

### DR-LCCASE-06 — Composition revision drift
Admit a graph under revision vector N, then change one material owner constraint. Prove old admission does not authorize new privileged/canonical effects without compatibility/currentness requalification.

### DR-LCCASE-07 — Cross-provider substitution
Realize the same canonical composition through providers with different DLP/action/idempotency semantics. Prove canonical admissibility is stable only where provider support evidence satisfies the required semantics; provider labels alone are insufficient.

### DR-LCCASE-08 — Loop amplification
Compose individually bounded webhook/event operations into a cycle. Prove cycle/resource/effect signals are detectable and cannot silently produce unbounded authoritative external mutations.

### DR-LCCASE-09 — Legitimate conditional alternative false positive
Create mutually exclusive branches that look contradictory statically but cannot co-activate. Prove the detector records applicability/conditions and does not confirm conflict solely from textual opposition.

### DR-LCCASE-10 — Authorized downgrade/exception
Create a normally forbidden data/semantic transition with an explicit owner-authorized exception/declassification. Prove the system preserves the exception authority/evidence rather than enforcing an absolute global ban.

### DR-LCCASE-11 — Human/manual state escape
A human task changes owner state outside the generated graph. Prove subsequent composition requalifies current state rather than assuming the original graph-level proof still applies.

### DR-LCCASE-12 — AI-generated composition non-amplification
AI proposes a graph of individually permitted operations whose cumulative effect exceeds its delegated envelope. Prove proposal/materialization remains non-authoritative until the correct owner adopts it and actuation remains bounded by current authority.

### DR-LCCASE-13 — Composition signal is not confirmed conflict
Feed incomplete/stale evidence to a detector so a possible cross-owner conflict is signalled. Prove state remains `APPLICABLE/UNKNOWN` or `SIGNALLED`, never automatically `CONFIRMED` or remediated.

### DR-LCCASE-14 — Cross-instance constraint
Create two separate workflow instances where each is locally valid but joint history activates an inter-instance constraint. Prove composition/history qualification can detect the material relationship without merging all workflow state into one global mutable context.

## Unresolved questions

1. Which constraint classes deserve native static analyzers in Planning C versus providerized analyzers/conformance adapters?
2. What is the minimum canonical representation for owner-declared cross-operation constraints without inventing a universal rule language?
3. How should a composition admission cache declare the exact material revision/currentness horizon that invalidates it?
4. Which resource/termination bounds are universal enough to be preventive invariants versus runtime/provider support policies?
5. How should explicitly authorized semantic adoption/declassification be represented so AI/low-code can propose it without granting itself authority?
6. Can one compact qualified-claim/evidence envelope represent graph admission without conflating authorization, semantic compatibility and effect qualification?

## Confidence

**Strongly supported** for the core conclusion that primitive validity/authorization is insufficient for composition admissibility. Evidence triangulates mature low-code governance, NIST least privilege, explicit authorization semantics, peer-reviewed workflow authorization, policy composition, formal information-flow and capability-security lineage.

**Moderate** for the exact portable `CompositionQualification` shape. Planning C should choose the smallest representation after consuming other adversarial passes; this deep research does not freeze a primitive or evaluator.

## Proposed dispositions

- `KEEP` — `G2-CONFLICT-PATTERN-LOWCODE-MATERIALIZATION-001`, actuation-time authorization, owner boundaries, qualified evidence/currentness, AI/AGWS non-amplification.
- `GENERALIZE` — low-code materialization conflict into cumulative composition admissibility across authority, data-flow, SoD, formula, temporal, resource and external-effect boundaries.
- `SPECIALIZE` — constraint semantics remain capability/domain-owned; only qualification/evidence structure may be shared.
- `PROVIDERIZE` — DLP engines, policy solvers, model checkers, connector guards, graph/resource analyzers.
- `DEFER` — exact `CompositionQualification` primitive/schema to Planning C.
- `DO_NOT_BUILD` — node-validity-as-graph-validity; ambient platform authority; arbitrary rule-order conflict resolution; universal semantic theorem prover/god-object.

## Saturation consequence

This is a material deepening of an already-material UI conflict family. It **does not increment Full Pass coverage or completed full passes**. UI local streak is already `0`; Identity/Authorization/AGWS/AI and Math/Workflow/Data/UI/Commercial clusters are already `0`. When Integration & Automation breadth consumes this result, any materially new activation family discovered there should keep/reset the affected local/cluster streak at `0` according to the normal breadth register process. This deep dive does not edit saturation state itself.

## Recommended next deep question

After Integration & Automation breadth has materialized, the highest-value residual question is whether **automation recursion and cross-system trigger cycles can be bounded using a portable causal/effect-lineage invariant without assuming global DAGs** — especially where legitimate cyclic business processes exist, provider event identities are non-canonical, delayed callbacks survive cutover, and `UNKNOWN` effects can re-enter the trigger graph.
