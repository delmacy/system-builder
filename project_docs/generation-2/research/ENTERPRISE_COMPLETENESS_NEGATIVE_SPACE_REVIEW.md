# Generation 2 — Enterprise Completeness / Negative-Space Review

Status: PASS 1 COMPLETE / GATE OPEN / STRUCTURAL GAPS FOUND
Phase: RESEARCH_ELICITATION
Authority: `RESEARCH_PIPELINE_STATE.json`, `ARCHITECTURE_PROOF_QUALITY_METHOD.md`, active capability dossiers and ledgers

## Purpose

Attempt to falsify the current 25-capability taxonomy after completion of the mandatory seven research cycles. This review is deliberately hostile to premature synthesis: it asks which enterprise concerns cannot be represented without smuggling provider/product concepts into existing semantic owners, which concerns are merely domain compositions, and which apparently-covered claims still lack architecture-proof closure.

This artifact does **not** promote candidates, does **not** materialize Work Packages and does **not** execute product code.

## Decision rule

Every screened concern is classified as one of: `ALREADY_COVERED`, `NEEDS_DEEPER_REVISIT`, `NEW_CAPABILITY_CANDIDATE`, `DOMAIN_ONLY`, `PROVIDER_SPECIFIC`, `DUPLICATE`, `LOW_VALUE`, `N_A`.

A `NEW_CAPABILITY_CANDIDATE` remains unpromoted until multi-representative research or a clear structural System Builder need proves a distinct semantic owner. `ALREADY_COVERED` means an existing capability owns the semantics; it does not imply that its proof backfill is closed.

## Enterprise archetype falsification

| Archetype | Required decomposition | Result | Material challenge |
|---|---|---|---|
| Small internal business system | process/model, data, identity/authz, UI/AGWS, notifications, simple deployment/runtime | DECOMPOSES_WITH_PROOF_GAP | Minimal capability/runtime closure is still a hypothesis: optional components must be demonstrably omitted and every included component must trace to a capability/dependency obligation. |
| Scaled multi-tenant SaaS | tenant/Station isolation, routing, provider binding, rollout, telemetry, billing/entitlement, lifecycle | DECOMPOSES_WITH_PROOF_GAP | Same semantic capability graph must support materially different qualified runtime realizations without mutating business semantics; mixed-version/provider cohort drainage remains proof debt. |
| Regulated / high-assurance enterprise | governance/audit, security/recovery, data governance, trust/certificates, supply-chain integrity, evidence retention | FAILS_CURRENT_TAXONOMY_CLEANLY | Privacy/retention/legal-hold/residency and enterprise PKI/trust lifecycle do not yet have unambiguous semantic owners. |
| Brownfield enterprise integration | identity federation/provisioning, APIs/events, external data, migration/coexistence, provider reconciliation | DECOMPOSES_WITH_BOUNDARIES | SCIM-style provisioning fits Identity/Integration; external IDs remain realization identities. Brownfield semantics must preserve canonical identity and evidence. |
| Disconnected / edge / Station deployment | local closure, bounded trust, autonomy, reconnect/requalification, deployment/runtime, observability | DECOMPOSES_WITH_PROOF_GAP | Existing capabilities cover the semantics, but local trust/evidence horizons and reconnect requalification need cross-capability executable proof. |
| AI-assisted engineering / operations | agent/tool authority, approvals, evidence, model/prompt/version lineage, evaluations/safety, provider substitution | DECOMPOSES_PARTIALLY | Agent authority is covered; model/prompt/evaluation/safety lifecycle may warrant a distinct domain/cross-cutting owner and requires dedicated research before synthesis. |

Pass-1 conclusion: the taxonomy is **not yet safe to synthesize**. Two strong structural gaps and two bounded research gaps were found; the gate remains open.

## Negative-space concern screen

| Concern | Classification | Current semantic owner / disposition | Pass-1 evidence / rationale |
|---|---|---|---|
| Procurement / FinOps / cost allocation / budgets / commitments | DOMAIN_ONLY + NEW_CAPABILITY_CANDIDATE | Governance + Observability + Provider supply inputs; proposed Economic Governance / FinOps domain capability | FinOps distinguishes allocation, forecasting and budgeting as operational capabilities with explicit ownership and cost attribution. Cost semantics are real, but do not yet justify a new universal primitive. |
| Networking / routing / ingress / segmentation | ALREADY_COVERED | Deployment/Runtime + Tenant Fleet/Edge/Ingress/Routing hypotheses + Security + Provider Binding | Network constructs are realization/topology/security semantics unless future research finds business-canonical network policy that cannot be represented by those owners. |
| Certificate / PKI / trust lifecycle | NEW_CAPABILITY_CANDIDATE | Proposed Enterprise Trust / PKI / Certificate Lifecycle | X.509 PKI separates certificate identity, issuer, validity, policy, chain validation, revocation scope/status and trust anchors; ACME adds authorization/order/challenge/issuance/revocation/key-rollover lifecycle. Treating certificates as secret blobs loses lifecycle and effective-trust semantics. |
| Supply-chain integrity / provenance | ALREADY_COVERED + NEEDS_DEEPER_REVISIT | Build + Artifact/Release/SBOM/Provenance + Security | SLSA explicitly separates provenance subject, builder identity, signer/root-of-trust and downstream verification. Existing owners are adequate, but runtime admission/trust verification must be added to product-proof junctions. |
| Runtime integrity / admission | NEEDS_DEEPER_REVISIT | Security + Deployment/Runtime + Artifact provenance | No new semantic owner yet. Need proof that deploy/admission consumes revision-qualified artifact/provenance/trust policy and becomes `INCONCLUSIVE`/denied when verifier roots or evidence are stale/unavailable. |
| SRE / incident / continuity / BCDR | ALREADY_COVERED | Observability/Operations/Incident + Security/Resilience/Failure Recovery + Governance | CSF 2.0 explicitly spans Govern, Identify, Protect, Detect, Respond and Recover. Existing owners cover incident/recovery semantics; proof must distinguish declaration, containment, recovery, requalification and return-to-service. |
| Privacy / data governance / retention / legal hold / residency | NEW_CAPABILITY_CANDIDATE | Proposed Privacy / Data Governance / Retention / Residency | Privacy risk is not reducible to cybersecurity or schema migration. Data purpose/use, retention/hold, jurisdiction/residency and deletion eligibility can conflict with ordinary lifecycle and need an explicit semantic-owner study. |
| Model / prompt / evaluation / safety lifecycle governance | NEW_CAPABILITY_CANDIDATE + NEEDS_DEEPER_REVISIT | AI-native Engineering + Governance + Artifact/Lifecycle today; candidate for dedicated AI Evaluation / Model / Prompt / Safety Governance | NIST AI RMF and the GenAI profile treat governance, measurement/evaluation and management across AI lifecycle as first-class risk work. Current agent/approval research proves authority boundaries but does not by itself prove lifecycle/evaluation ownership for models/prompts/eval suites. |
| Enterprise search / knowledge | DOMAIN_ONLY | Data/Storage/Documents + Identity/Authz + Integration + AGWS/UI + Provider Binding | Search/indexing is a domain composition. Backstage demonstrates a provider/product mechanism over catalog metadata and pluggable search rather than a new universal SB primitive. |
| Developer platform / internal portal | DOMAIN_ONLY / DUPLICATE | Developer/Operator Experience + AGWS + Extension/Plugin + Catalog-like domain models | Backstage composes catalog, templates, docs, search and plugins. This validates composition rather than a missing universal owner. |
| Admin directory / lifecycle provisioning | ALREADY_COVERED | Identity/Auth/Federation + Integration/Automation + Authorization | SCIM provides a common user schema, extension model and HTTP provisioning protocol for cross-domain identity management; it fits existing identity/integration ownership. |
| Mail / calendar / collaboration | PROVIDER_SPECIFIC / DOMAIN_ONLY | Integration + Workflow + Notifications + Authorization + Provider Binding | Provider-specific APIs and domain models should not become universal primitives absent cross-domain evidence. |
| Controlled extensibility / marketplace | ALREADY_COVERED | Extension / Plugin / Marketplace Architecture | Dedicated active capability exists; no ownerless category found. |
| Frontier agentic execution | ALREADY_COVERED + NEEDS_DEEPER_REVISIT | AI-native Engineering/Agents/Approvals + Authorization + Workflow + Security | Authority must remain non-amplifying; AGWS/AI can propose/escalate but not inherit canonical/provider-admin authority. Model/runtime evolution and eval evidence remain separate research gaps. |
| LLMOps / evaluations / safety evidence | NEEDS_DEEPER_REVISIT | AI-native Engineering + Governance + Observability today | NIST AIRC explicitly supports testing, evaluation, verification and validation (TEVV). Determine whether evaluation/safety evidence is a subcapability or distinct semantic owner. |

## New material findings

### G2-FINDING-ENSR-01 — Enterprise trust is not equivalent to secret storage
Certificate material, issuer/trust-anchor identity, certification path, validity interval, policy applicability, revocation/status evidence, renewal/rollover attempt and workload-effective trust are distinct facts. `Secrets / Configuration` can protect key material but cannot silently own the full enterprise PKI lifecycle without explicit research. **Value:** HIGH. **Risk if ignored:** stale/revoked credentials treated as healthy merely because secret bytes exist. **Next question:** does multi-representative PKI/service-identity research prove a distinct cross-cutting capability or a bounded Security/Identity subcapability?

### G2-FINDING-ENSR-02 — Privacy/data-governance obligations can override ordinary lifecycle
Data purpose/use, classification, retention schedule, legal hold, deletion eligibility, residency/jurisdiction and evidence of disposition are semantically distinct from schema lifecycle and access control. A retained object may be technically deletable but legally ineligible, or accessible yet prohibited for a purpose. **Value:** HIGH. **Risk:** false compliance and destructive lifecycle automation. **Next question:** identify convergent primitives across privacy frameworks, retention/legal-hold systems and cloud data-governance implementations.

### G2-FINDING-ENSR-03 — Economic governance is real enterprise semantics but not yet a universal primitive
Allocation, budget, forecast, commitment, rate and variance have explicit owners and lifecycles in FinOps practice, but they appear composable from governance, metering/evidence and provider-commercial inputs. **Disposition:** register as DOMAIN candidate; do not promote before testing non-cloud/on-prem/internal chargeback and commercial entitlement boundaries.

### G2-FINDING-ENSR-04 — Supply-chain integrity is covered semantically, but deployment admission is an unresolved proof junction
SLSA provenance distinguishes subject, builder, trusted control plane, signer/root-of-trust and consumer verification. Generation 2 already has Build and Artifact/Provenance owners, but enterprise completeness requires an executable cross-capability proof that Deployment/Security admission consumes the exact qualified artifact/provenance/trust revision rather than treating publication or signature presence as sufficient.

### G2-FINDING-ENSR-05 — Agent authority coverage does not prove model/prompt/evaluation lifecycle governance
Current AI-native research strongly constrains tool/approval authority, but enterprise AI also needs versioned identities and evidence for model, prompt/instruction bundle, evaluation suite/result, safety policy and effective runtime/provider qualification. Whether this is a dedicated capability or a composition of Artifact/Lifecycle/Governance/Observability remains unresolved and must be researched, not assumed.

### G2-FINDING-ENSR-06 — Enterprise portals, search and collaboration are composition tests, not automatic top-level capabilities
Backstage demonstrates that catalog, templates, docs, search and plugins can form a coherent developer platform while retaining separate sources of truth and extensibility. SCIM similarly fits identity provisioning into a standard protocol. These are valuable archetype tests of composition/providerization, but pass 1 finds no evidence that they require a new universal semantic owner.

### G2-FINDING-ENSR-07 — Minimal runtime realization remains a mandatory falsifiable product claim
For simple, scaled and critical archetypes, Generation 2 must prove: (1) unused optional capabilities are omitted where feasible; (2) each included runtime component has deterministic requirement/dependency lineage; (3) the same semantic capability graph can yield different qualified runtime realizations due to workload/quality obligations; and (4) scaling/topology changes never mutate canonical business semantics. Until these are executable proof obligations, workload-driven realization is not closed.

### G2-FINDING-ENSR-08 — Seven cycles satisfy eligibility, not completeness
Every cycle-7 capability produced material findings and the centralized proof matrix still contains many `BACKFILL_REQUIRED`/`PARTIAL` entries. The Enterprise Completeness gate therefore remains `OPEN_REQUIRED`; `CAPABILITY_SYNTHESIS` remains blocked while structural candidates and proof junctions above are unresolved.

## Candidate register additions

| Candidate | Class | Status | Promotion / merge condition |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE` | CROSS_CUTTING | RESEARCH_REQUIRED | Multi-representative research must prove identities/lifecycle/authority/failure/versioning/provider boundaries distinct from Secrets, Identity and Security; otherwise merge into those owners. |
| `G2-CAPABILITY-CANDIDATE-PRIVACY-DATA-GOVERNANCE-RETENTION-LEGAL-HOLD-RESIDENCY` | CROSS_CUTTING | RESEARCH_REQUIRED | Validate convergent purpose/classification/retention/hold/residency/disposition primitives across standards and enterprise systems; determine canonical owner boundaries with Data, Governance and Security. |
| `G2-CAPABILITY-CANDIDATE-ECONOMIC-GOVERNANCE-FINOPS-PROCUREMENT` | DOMAIN | RESEARCH_REQUIRED | Test whether allocation/budget/forecast/commitment/rate semantics remain a domain composition or require cross-cutting primitives across cloud, on-prem and internal chargeback. |
| `G2-CAPABILITY-CANDIDATE-AI-EVALUATION-MODEL-PROMPT-SAFETY-GOVERNANCE` | DOMAIN | RESEARCH_REQUIRED | Test model/prompt/eval/safety identities, lifecycle, evidence and provider substitution against AI-native Engineering, Artifact/Lifecycle, Governance and Observability before promotion or merge. |

No candidate is promoted by pass 1. **Adaptive Governed Work Surfaces remains CORE/promoted and distinct from generic UI**, preserving `Enterprise → Station → Role → Person`, non-weakenable higher invariants and no authority amplification through AI.

## Architecture-proof backfill additions from pass 1

1. **Minimal-runtime closure proof:** generate a small system with optional capabilities absent; prove omitted runtime components are absent where feasible and every included component traces to an explicit capability/dependency obligation.
2. **Same-semantics/different-realization proof:** apply one canonical capability graph to simple, scaled and critical operational profiles; prove topology/runtime changes without canonical business semantic mutation.
3. **Artifact-to-runtime admission proof:** attempt deployment with valid artifact digest but stale/untrusted/mismatched provenance or verifier root; admission must deny or become explicit `INCONCLUSIVE`, never infer trust from artifact presence.
4. **Enterprise trust negative proof:** revoke/expire an otherwise-present certificate or invalidate its path/policy; effective trust must fail/requalify independently of secret/config availability.
5. **Privacy retention/hold conflict proof:** make ordinary retention/deletion policy eligible while a legal hold or purpose/residency constraint applies; destructive transition must be blocked and evidence retain the controlling obligation.
6. **AI evaluation qualification proof:** change model, prompt/instruction bundle, evaluation suite, safety policy or provider after an apparently passing evaluation; previous evidence becomes stale/inapplicable rather than silently inherited.
7. **Domain-composition proof:** implement a developer-portal/search/admin-integration archetype from existing capability contracts; provider-specific catalog/search/SCIM IDs must not become canonical business identity.
8. **Disconnected trust horizon proof:** run a Station under declared offline closure past one trust/evidence freshness horizon; privileged operations must degrade/deny/mark `INCONCLUSIVE`, and reconnect must trigger requalification before authority resumes.

## Evidence / source ledger — pass 1

- NIST Cybersecurity Framework 2.0 — enterprise cybersecurity outcomes and the Govern function: https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20
- NIST SP 1305 — cybersecurity supply-chain risk management and supplier requirements: https://csrc.nist.gov/pubs/sp/1305/final
- FinOps Framework, Allocation: https://framework.finops.org/framework/capabilities/allocation/
- FinOps Framework, Forecasting: https://www.finops.org/framework/capabilities/forecasting/
- NIST Privacy Framework: https://www.nist.gov/privacy-framework/privacy-framework
- NIST AI RMF / AIRC and NIST AI 600-1 Generative AI Profile: https://airc.nist.gov/ and https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- RFC 5280 — X.509 PKI certificate/CRL profile and certification-path validation: https://www.rfc-editor.org/rfc/rfc5280
- RFC 8555 — ACME certificate account/order/authorization/challenge/issuance/revocation lifecycle: https://www.rfc-editor.org/rfc/rfc8555
- RFC 7644 — SCIM cross-domain identity provisioning: https://www.rfc-editor.org/rfc/rfc7644
- SLSA v1.2 provenance / build requirements: https://slsa.dev/spec/v1.2/provenance and https://slsa.dev/spec/draft/build-requirements
- Backstage Software Catalog / developer platform: https://backstage.io/docs/features/software-catalog/ and https://backstage.io/docs/overview/what-is-backstage/

## Gate disposition

`ENTERPRISE_COMPLETENESS_NEGATIVE_SPACE_REVIEW = IN_PROGRESS / PASS_1_COMPLETE / MATERIAL_GAPS_FOUND`.

Do **not** advance to `CAPABILITY_SYNTHESIS`. Return to bounded `RESEARCH_ELICITATION` on exactly one structural gap at a time. First priority is **Enterprise Trust / PKI / Certificate Lifecycle**, because it is a high-assurance cross-cutting gap with clear standards evidence and sits upstream of runtime admission, workload identity, offline trust and recovery qualification. After its disposition, continue with Privacy/Data Governance, then the bounded AI lifecycle/evaluation question, then Economic Governance if still material.
