# Palantir Telemetry Export Governance Study

Date: 2026-09-23
Status: `RESEARCH_ACTIVE / DEFERRED_IMPROVEMENT`
Scope: public architectural benchmark only; no implementation authority.

## Sequencing

The Station visual/application environment remains the product implementation priority. Every finding below is `DEFERRED_IMPROVEMENT`; none authorizes WBS, Work Package, Sprint, TASK, Core/Agent/infra refactor, or priority change.

## Primary-source evidence reviewed

1. Palantir Foundry `Organization settings > Configure logging` (reviewed 2026-09-23): organization administrators can continuously export Foundry logs into a streaming dataset; output markings are optional but recommended; exports are evaluated per source executor; OpenTelemetry is an available downstream schema; the stream can be exported onward to external monitoring systems. The same page explicitly states that Foundry logs are **not audit logs**, delivery is not guaranteed to be 100%, and log contents may change without notice.
2. Palantir `Ontology and AIP observability > Log permissions` (reviewed 2026-09-23): source/input/accessed-data markings are not automatically propagated to service/trace logs; administrators must choose markings representing maximum workflow sensitivity.
3. Palantir `Security auditing > Audit logs` (reviewed 2026-09-23): audit-log export datasets have separately configurable retention, up to 730 days, reinforcing that audit evidence and ordinary application telemetry have distinct contracts.
4. Palantir `Data Connection > Exports > Overview` (reviewed 2026-09-23): datasets/streams, ML inference results and Ontology operational data can be exported to external systems.
5. Palantir `Data Connection > Export tasks [Legacy]` (reviewed 2026-09-23): legacy export tasks are explicitly documented as not integrated with markings and export controls; exported data does not require unmarking permission. This is treated as a legacy failure/lock-in boundary, not as a recommended architecture.

## Finding TE-01 — telemetry transport interoperability does not preserve governance semantics

- **Mechanism:** Foundry can serialize log exports using OpenTelemetry and stream them toward downstream collectors/systems, while markings on the intermediate output dataset are explicitly configured rather than inherited from all reached data.
- **Problem solved by Palantir mechanism:** interoperable operational telemetry processing and export.
- **Universal primitive:** `transport interoperability != policy interoperability`.
- **Preconditions:** telemetry crosses a provider/system boundary; the downstream destination can persist/process data independently.
- **Trade-offs:** standard schemas reduce integration lock-in, but cannot by themselves encode or enforce tenant, purpose, retention, disclosure, deletion, residency, or business-classification obligations.
- **Failure modes:** a correctly authorized export is retained too long downstream; tenant/purpose context is lost; destination ACLs are weaker; redaction differs; a collector republishes data under a broader policy.
- **Palantir-specific lock-in:** Foundry markings and organization/project controls govern the platform-side stream; public evidence reviewed does not establish that those controls remain enforceable after arbitrary third-party export.
- **SB relation:** Resource Fabric/provider replaceability must not equate protocol compatibility with governance equivalence. Autonomous runtimes need portable policy/evidence envelopes rather than a Builder-only enforcement dependency.
- **Classification:** `ADOPT PRINCIPLE`.
- **Implementation state:** `DEFERRED_IMPROVEMENT`.

Candidate backlog primitive: `export authorization != downstream-policy continuity`.

## Finding TE-02 — operational logs are explicitly weaker evidence than audit records

- **Mechanism:** Palantir states that Foundry application logs are not audit logs, are not guaranteed 100% delivery, and their contents may change; audit-log exports have a separate security/retention mechanism.
- **Problem solved:** distinguishes debugging/observability telemetry from stronger security/audit evidence.
- **Universal primitive:** `telemetry != audit evidence != canonical operational truth`.
- **Preconditions:** operators or UI consumers might use logs as proof that an action did or did not occur.
- **Trade-offs:** best-effort operational telemetry can be cheaper/faster and evolve independently; it cannot safely carry non-repudiation or completeness obligations.
- **Failure modes:** missing log interpreted as non-occurrence; schema evolution breaks evidence interpretation; export loss creates false negatives; retention deletion is mistaken for absence of historical effect.
- **Palantir-specific lock-in:** exact Foundry audit/log products and schemas are platform services; the semantic distinction is portable.
- **SB relation:** strengthens `projection != canonical truth`, evidence/currentness semantics, Observe replaceability, and `AUTHORIZED != EXECUTED != EFFECTIVE != OBSERVED`. Observe must remain removable without destroying authoritative runtime evidence.
- **Classification:** `ALREADY COVERED` with stronger industrial evidence.
- **Implementation state:** `DEFERRED_IMPROVEMENT`.

No new implementation candidate is required if existing evidence/currentness contracts already preserve this distinction; backlog should reference this evidence rather than duplicate it.

## Finding TE-03 — export-control enforcement is path-dependent unless architecture makes it invariant

- **Mechanism:** current log-export configuration applies organization/source-executor constraints, while Palantir's explicitly legacy Data Connection export-task path documents that it is not integrated with markings/export controls and does not require unmarking permission.
- **Problem exposed:** two mechanisms that both move data outward can have materially different governance semantics.
- **Universal primitive:** `same destination/effect class != same admission/security semantics`.
- **Preconditions:** multiple providers/adapters/export mechanisms can satisfy one apparent capability.
- **Trade-offs:** compatibility with legacy mechanisms preserves operations but creates policy asymmetry.
- **Failure modes:** policy bypass by selecting a weaker adapter; migration changes security semantics without changing business intent; UI labels both paths merely as “export”.
- **Palantir-specific lock-in:** the legacy/current distinction and marking model are Foundry-specific. It is evidence of the general adapter-bypass risk, not a recommendation to reproduce either mechanism.
- **SB relation:** capability/provider separation must place mandatory governance invariants above provider-specific implementation. Provider substitution must prove security-semantic conformance, not only functional conformance.
- **Classification:** `AVOID` for provider-specific policy bypass; `ADOPT PRINCIPLE` for invariant capability-level admission.
- **Implementation state:** `DEFERRED_IMPROVEMENT`.

Candidate backlog primitive: `provider replaceability != permission to weaken capability invariants`.

## Adversarial reconciliation

- **Permission drift:** an export remains configured while workflow reach expands; downstream policy is no longer sufficient.
- **Source truth vs operational truth:** exported logs may be incomplete and therefore cannot settle whether an external effect occurred.
- **Platform-specific SDK/provider lock-in:** OTel reduces transport coupling but does not make governance portable.
- **Application cannot leave platform:** portability requires exporting not just bytes/schema but the obligations needed to interpret and govern them elsewhere.
- **AI output leakage:** prompts/completions may enter telemetry; export multiplies the disclosure boundary.
- **Multi-tenant:** organization filtering is platform-side evidence, not proof that arbitrary downstream systems preserve tenant isolation.

## SB comparison

For Business Mirroring/Recipe/SystemDefinition, this study does not change semantic ownership. For Semantic Registry and capability/provider contracts, it strengthens the need for portable governance metadata and provider conformance. For Station/Core/Gateway/Host Agent, it adds no immediate implementation scope: Station may eventually represent export destination, evidence class and policy-domain transition without becoming the authority. For Resource Fabric, a provider must not satisfy an `export` capability merely by moving bytes if mandatory policy/evidence obligations are lost. For autonomous client runtime, policy enforcement cannot require System Builder availability. For Observe, ordinary telemetry remains replaceable and non-canonical. For AI, derived prompts/completions remain governed data even when serialized through an open telemetry protocol.

## Station sequencing impact

No direct correctness/security blocker was found that requires displacing the visual milestone. The only immediate representational constraint is future-facing: UI should not label `exported`, `logged`, `observed`, or `OTel-compatible` as equivalent to `audited`, `complete`, `policy-preserving`, or `canonically effective`.

## Saturation

The basic telemetry-export governance boundary is now materially evidenced and near saturation. Further searches for “can Foundry export logs?” have low marginal value. Highest-value next vectors are: (1) nested pro-code Agent -> OSDK/OMCP -> Function/Agent principal propagation; (2) resource/tool closure requalification when Ontology/application scopes evolve; (3) stronger public evidence for bundle replay/destination/expiry semantics if it appears.
