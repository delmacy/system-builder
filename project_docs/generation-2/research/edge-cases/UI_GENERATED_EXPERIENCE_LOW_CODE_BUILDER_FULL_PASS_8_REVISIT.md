# Generation 2 — UI / Generated Experience / Low-code Builder — Full Pass 8 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: UI / Generated Experience / Low-code Builder
Pass: 8

Research only. No product code, Work Package, TASK, Construction, Canvas implementation, GraphDB implementation, physical-control implementation, remediation, or concrete conflict correction is authorized. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`.

## Method

This revisit followed the authoritative Full Pass 8 `next_action` and used materially different probes from Full Pass 7:

1. **projection-lag fracture** — current semantic revision versus stale Canvas/Graph Explorer/Fleet/provider/site projection;
2. **semantic-vs-visual identity mutation** — same label/icon/edge rendered for objects with different qualified semantic identity;
3. **graph-rewrite visibility subtraction** — candidate edit -> graph revision N+1 while affected subgraph, invalidated proof, migration/revalidation debt, and in-flight revision are selectively hidden;
4. **semantic-kind erasure** — Workflow/Decision/Calculation/StoredFact/DerivedValue/Estimate/AI inference/Human decision rendered as visually interchangeable nodes or scalar fields;
5. **dimension/uncertainty collapse** — quantity kind, unit, vector components, interval/distribution, confidence/currentness, or Pareto trade-offs removed from the projection;
6. **context subtraction** — tenant/client/site/provider/resource context removed while preserving apparently valid local identifiers;
7. **elicitation false-complete attack** — unanswered, contradicted, stale, `N/A`, or unsupported coverage dimensions hidden behind generated stories/use cases/scenarios or visually “complete” Wizards;
8. **Brownfield observed-vs-desired inversion** — mirrored spreadsheet/form/process/device/provider observations rendered as canonical desired state;
9. **Physical/Peripheral operation-class mutation** — read/inventory/provision/broker/event semantics visually strengthened into generic write/actuate/control capability;
10. **AI/low-code authority amplification** — generation or drag-and-drop composition creates a semantically stronger action than the authority/evidence carried by its components.

All 124 reusable ConflictPatterns were duplicate-screened before classification. No candidate below justified a new ConflictPattern, ConflictInstance, or preventive invariant.

## Evidence refresh

### Visual interchange is not semantic validation

OMG BPMN 2.0.2 explicitly separates diagram interchange from semantic correctness. BPMN DI exists to exchange/render diagrams and does not itself ascertain that a BPMN diagram is syntactically or semantically correct; the specification also warns that non-normative visual properties such as color may vary by tool/user and lead to misinterpretation. This is a strong witness for `projection != semantic authority` and `visually connected/valid != executable/sound/authorized`.

Sources:
- https://www.omg.org/spec/BPMN/2.0.2/PDF/
- https://www.omg.org/bpmn/

### Decision semantics cannot be flattened into generic workflow branching

OMG DMN 1.5 gives decision tables explicit hit policies, matching behavior, defaults, aggregation constraints, and result semantics. A UI that projects a decision table merely as an `if/switch` shape can hide material rule ownership, hit-policy, default, completeness, and conflict semantics. This reinforces the standing separation `Process/Workflow != Decision != Calculation`; it does not create a new conflict family.

Sources:
- https://www.omg.org/spec/DMN/1.5/PDF
- https://www.omg.org/dmn/

### Occurrence time and observation time remain distinct

OpenTelemetry semantic conventions require event `Timestamp` to represent occurrence time and distinguish it from `ObservedTimestamp`, which represents when telemetry was observed/received. Therefore a UI timeline that sorts or labels only one timestamp can create a false currentness/order impression for delayed, offline, federated, Brownfield, or edge/site data. This duplicate-screens into existing temporal/currentness/evidence-order families.

Sources:
- https://opentelemetry.io/docs/specs/semconv/general/events/
- https://opentelemetry.io/docs/specs/otel/logs/data-model/

## Adversarial results

### 1. Canvas/Graph Explorer projection lag

Candidate failure: semantic graph revision N+1 is current while Canvas, generated form, Graph Explorer, Fleet projection, provider inventory, or site view still renders N. A user may therefore inspect a coherent-looking but stale graph and make a valid action against an invalid context.

- semantic owners: graph/revision owner + UI projection owner + affected capability owner;
- detection candidate: projection revision/currentness tuple, source revision, invalidation marker, and stale/UNKNOWN disposition;
- blast radius: object -> workflow/system/site depending on the stale projection;
- reversibility: high before mutation, potentially low after external effect;
- currentness: revision- and source-qualified;
- proof obligation: a projection cannot claim `current` or `effective` without evidence that the displayed semantic revision and relevant external observations are qualified/current.

Duplicate-screen: temporal/currentness, stale-read destructive mutation, canonical-vs-realization identity, and false-convergence families. No new material pattern.

### 2. Visual identity collision

Candidate failure: two objects share a label/icon/name such as `Approve`, `User`, `Camera`, `Total`, `Risk`, or `Payment`, while their qualified identities differ by capability, semantic kind, tenant/site, provider profile, revision, quantity kind, or authority scope. Auto-link or drag-and-drop can connect the wrong object because visual identity appears equivalent.

- owners: canonical semantic owner + UI + Authorization/Provider where applicable;
- detection candidate: stable semantic reference plus object kind, revision, scope/context, provider profile and unit/type qualifications;
- blast radius: cross-capability and cross-tenant/site;
- reversibility: medium to low after external mutation/disclosure;
- proof obligation: `same visual label != same semantic identity`, and visual reachability does not prove compatibility or authorization.

Duplicate-screen: identity collision, provider semantic mismatch, target-scope confusion and authority amplification families.

### 3. Candidate edit -> graph revision N+1 with hidden invalidation debt

Candidate failure: a Canvas edit is shown as a successful “change” but the UI suppresses affected-subgraph, migration, proof invalidation, revalidation, in-flight pinned revision, or residual cohort implications. The graph rewrite itself may be valid while its preservation obligations remain unresolved.

- owners: graph-revision/lifecycle semantic owner + affected capability owners + UI;
- detection candidate: semantic diff, affected-subgraph closure, preserved/invalidated proof set, migration/revalidation obligations, in-flight revision references;
- blast radius: workflow/system/release/runtime;
- reversibility: migration-dependent;
- proof obligation: edit acceptance cannot be rendered as deploy/operation safety or proof preservation unless those claims are separately evidenced.

Duplicate-screen: revision-vector, graph transformation, false rollback safety, proof-currentness and residual-cohort families.

### 4. Semantic-kind erasure in generated forms and nodes

Candidate failure: `StoredFact`, `DerivedValue`, deterministic formula result, statistical estimate, optimization result, AI inference, human decision, and externally observed value are all presented as ordinary scalar fields; similarly a decision becomes an unlabeled workflow condition.

- owners: mathematical/decision/data semantic owners + UI;
- detection candidate: result/semantic kind, derivation/provenance reference, authority, unit/dimension, uncertainty/currentness, and editability semantics;
- blast radius: record -> process -> financial/operational decision;
- reversibility: low after historical or external business effect;
- proof obligation: display/edit affordance must not convert a derived/uncertain/inferred value into authoritative stored fact or policy decision.

Duplicate-screen: StoredFact/DerivedValue, analytical-kind collapse, decision/workflow ownership and provenance-overattribution families.

### 5. Unit/vector/uncertainty silent scalarization

Candidate failure: a risk/resource/capacity vector, interval/distribution, multi-objective result, currency/unit-qualified quantity, or confidence-qualified forecast is reduced to one color/badge/number without exposing the projection rule and lost dimensions. A visually simple value may then be treated as exact or globally comparable.

- owners: mathematical/analytical owner + domain semantic owner + UI;
- detection candidate: quantity/result kind, units, normalization/scalarization rule, precision, uncertainty representation, provenance and revision;
- blast radius: planning, commercial, capacity and operational decisions;
- reversibility: medium before actuation, lower after commitments;
- proof obligation: scalar projection must remain explicitly a qualified projection and cannot silently become canonical truth.

Duplicate-screen: dimensional mismatch, uncertainty collapse, objective-conflict and qualified-projection families.

### 6. Elicitation/Wizard false completeness

Candidate failure: a fluent AI conversation or Wizard shows a capability as complete because visible questions have answers, while authority, source-of-truth, failure/recovery, external-effect reconciliation, privacy, currentness, historical revision, operability, stakeholder coverage, contradiction, or Product Proof dimensions are still unresolved.

A related case occurs when generated User Stories, Use Cases and Scenarios disagree: a story promises an outcome, the use case omits a failure/recovery path, and the scenario/model assumes a stronger authority or source-of-truth. The generated artifacts can look individually complete while the traceability graph exposes contradictions or missing evidence.

- owners: Elicitation methodology/knowledge-base hypothesis + affected capability owner + UI/Wizard projection;
- detection candidate: multidimensional coverage state, question/evidence currentness, unresolved/contradiction inbox, cross-artifact semantic-reference comparison, stakeholder/source coverage and blocked-artifact links;
- blast radius: candidate architecture through publish/operation;
- reversibility: high while still in research/design, expensive after implementation;
- currentness: question/evidence/revision-qualified;
- proof obligation: `answered != resolved != sufficient`; `N/A` requires applicability rationale/evidence; AI inference remains candidate; UI may not emit a false aggregate `complete` claim.

Duplicate-screen: false-completeness, assumption-to-fact, stale evidence, hidden contradiction and AI evidence-strengthening families. No new ConflictPattern.

### 7. Brownfield observed state rendered as desired/canonical state

Candidate failure: Mirroring imports legacy forms, spreadsheet fields, process traces, permissions, provider resources, formulas/macros or device inventories and the UI draws them as if they were approved canonical semantics. Observed behavior and source structure can be highly informative while still being stale, accidental, workaround-driven or semantically ambiguous.

- owners: Mirroring/reconciliation semantic hypothesis + destination capability owner + UI;
- detection candidate: source artifact identity, mapping revision, inferred/approved status, source-of-truth status, provenance/currentness and contradiction queue;
- blast radius: migration/cutover and historical interpretation;
- reversibility: migration-dependent;
- proof obligation: `observed behavior != intended procedure != approved future workflow`; inferred mappings remain candidates until owner-qualified.

Duplicate-screen: Brownfield provenance/authority/currentness and source-of-truth movement families.

### 8. Physical/Peripheral operation-class strengthening

Candidate failure: a low-code palette sees a VMS/access/BMS/PDV/IoT provider exposing inventory, users, grants, telemetry, events, or brokered sessions and visually generalizes that provider into generic control/actuation nodes. The same risk exists when `revoke requested` is shown as `physical access impossible` or `camera online` as `media currently available`.

- owners: Identity/Authorization + Integration/provider + external-resource/device semantics + UI;
- detection candidate: explicit operation class (`READ`, `QUERY`, `PROVISION`, `GRANT`, `REVOKE`, `BROKER`, `EVENT`, exceptional provider-specific `ACTUATE`), target/site, authority, provider support profile and effect evidence;
- blast radius: privacy, tenant/site isolation and potentially physical safety;
- reversibility: potentially low for disclosure/actuation;
- proof obligation: read/provision/broker capability does not imply control/actuation authority; provider-reported state does not equal physical truth.

Duplicate-screen: authority non-amplification, provider-semantic mismatch, external-effect evidence and target-scope families. Physical control remains NON-GOAL/provider-specific exceptional extension absent a later explicit Planning C decision.

### 9. Temporal event rendering and causal overclaim

Candidate failure: UI sorts delayed events by observation time, currentizes historical data using current labels/formulas, or connects provenance edges visually so strongly that users infer causality/authority. OpenTelemetry occurrence-vs-observation semantics provide a concrete witness that a single timeline axis is insufficient in some contexts.

- owners: temporal/provenance semantic owner + UI + source capability;
- detection candidate: occurrence time, observation time, valid-time/transaction-time where relevant, revision and provenance relation kind;
- blast radius: audit, incident analysis, Brownfield reconstruction and business decisions;
- reversibility: low after historical claims are relied upon;
- proof obligation: `lineage relation != authority != causal proof`; historical projection must preserve producing revision and time qualification.

Duplicate-screen: temporal reinterpretation, provenance overclaim, historical recomputation and causal-strengthening families.

### 10. AI-generated composition strengthens authority or proof

Candidate failure: AI infers that because two nodes are visually connectable, their composition is allowed, sound, authorized, provider-supported, current, sufficiently elicited, or production-ready. Examples include composing an inferred Brownfield mapping into a canonical write, using a stale external role to authorize a new site, or treating a successful provider ACK as final business/physical effect.

- owners: AI/low-code composition + semantic/authority owners of involved operations;
- detection candidate: aggregate semantic review over operation kinds, authorities, revisions, provider profiles, targets, uncertainty/currentness, evidence/proof obligations and unresolved elicitation debt;
- blast radius: workflow/system/external parties;
- reversibility: effect-dependent;
- proof obligation: AI output remains candidate until independently qualified; composition cannot strengthen authority, evidence or semantic guarantees beyond its qualified inputs.

Duplicate-screen: AI/low-code composition conflict, confused deputy, unsafe aggregate authority and proof-claim strengthening families.

## Conflict classification result

Every candidate above was screened against the 124 existing `ConflictPattern` families and the current edge registers before any attempt to classify novelty. The strongest candidates map to already-catalogued families:

- stale/currentness-qualified projection;
- canonical semantic identity versus realization/visual identity;
- revision-vector and residual-cohort mismatch;
- graph transformation/proof invalidation;
- semantic-kind/StoredFact/DerivedValue collapse;
- unit/vector/uncertainty scalarization;
- false elicitation/production-readiness completeness;
- Brownfield observed-to-canonical authority strengthening;
- provider/operation-class semantic mismatch;
- tenant/site target confusion;
- provenance/causal overclaim;
- AI/low-code authority/evidence amplification.

No activation evidence for a concrete client/system revision was observed, so no `ConflictInstance` exists. No research result justifies pre-emptive remediation.

## Architecture-hypothesis disposition

The Full Pass 8 revisit continues to support, without canonicalizing:

- Canvas/Graph Explorer as projections over typed semantic references rather than authority;
- graph edits as candidate transformations producing revision N+1 with explicit semantic diff/affected-subgraph/proof disposition;
- decision/calculation/workflow/result-kind distinctions visible enough to prevent semantic erasure;
- qualified representations for unit/vector/uncertainty/currentness/provenance;
- a versioned Elicitation Knowledge Base with Master Wizard/sub-wizard/AI/expert surfaces as a cross-cutting hypothesis, not a static questionnaire and not a 29th capability;
- Brownfield/Mirroring evidence as candidate input, never automatic canonical truth;
- Physical/Peripheral integration as integration/governance plane by default, with specialized media/control planes retained by vendor systems;
- PostgreSQL relational graph as plausible baseline and GraphDB as optional/provider-level; neither is decided here.

## Carry-forward

Planning C must decide projection versus authority boundaries, graph-revision editing semantics, UI visibility for invalidated proofs/revalidation, semantic-kind presentation, Elicitation Knowledge Base/Wizard/AI boundaries, Brownfield observed-vs-desired handling, and Physical/Peripheral operation classes including any separately justified exceptional actuation proof profile.

Planning D must address revision coexistence, stale/generated UI migration, free-form plus structured elicitation coexistence, Brownfield mapping/cutover, provider/site migration, and residual legacy/external cohorts without fabricated historical certainty.

Planning E must prove at minimum: revision/currentness visibility; no silent semantic-kind/unit/uncertainty collapse; adaptive questioning and unresolved/contradiction handling; source-to-proof traceability; capability-specific routing; critical-gap detection; no false `complete`; Brownfield inferred mapping remains non-authoritative until approved; provider/site isolation; provisioning/revoke/drift/reconciliation views; and no accidental expansion from integration/provision/read/broker semantics into specialized physical control.

Architecture Reconciliation must compare static questionnaire, conversational AI, deterministic Wizard, capability schemas and hybrid knowledge-base approaches, and compare purely visual model ownership versus typed semantic model + visual projection approaches.

## Saturation disposition

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- ConflictInstances: **0**;
- preventive invariant candidates: **0**;
- UI no-material streak: **remains capped at 2**;
- mandatory-cluster streaks: **unchanged, capped at 2**;
- campaign inventory: **284 edge scenarios + 124 ConflictPatterns = 408 material findings**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- negative-space: **NOT_STARTED**;
- saturation: **NOT_SATURATED**;
- Planning C: **BLOCKED**.

## Next rotation candidate

Subject to immediate authoritative state/head revalidation before persistence, continue Full Pass 8 with `Integration & Automation`, carrying all standing lenses. Focus on cross-system/federated invocation identity, mutating `UNKNOWN` and reconcile-before-retry, provider/site operation qualification, permission provisioning/drift, edge/offline event buffering, temporal/currentness cuts, graph-revision crossing, Brownfield source-of-truth/coexistence, Elicitation unresolved integration semantics, Physical/Peripheral read/provision/broker versus exceptional actuation, queue/backpressure/resource vectors and AI/low-code composition. Duplicate-screen all 124 ConflictPatterns and do not enter Planning C.