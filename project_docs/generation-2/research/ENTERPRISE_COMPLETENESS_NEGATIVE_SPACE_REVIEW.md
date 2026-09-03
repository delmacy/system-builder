# Generation 2 — Enterprise Completeness / Negative-Space Review

Status: PASS 1 COMPLETE / GATE OPEN / STRUCTURAL GAP 1 RESOLVED / MORE GAPS OPEN
Phase: RESEARCH_ELICITATION
Authority: `RESEARCH_PIPELINE_STATE.json`, `ARCHITECTURE_PROOF_QUALITY_METHOD.md`, active capability dossiers and ledgers

## Purpose

Attempt to falsify the current capability taxonomy after completion of the mandatory seven research cycles. This review is deliberately hostile to premature synthesis: it asks which enterprise concerns cannot be represented without smuggling provider/product concepts into existing semantic owners, which concerns are merely domain compositions, and which apparently-covered claims still lack architecture-proof closure.

This artifact does **not** materialize Work Packages and does **not** execute product code. Candidate promotion is permitted only after its own bounded multi-representative research closes the promotion/merge question.

## Structural-gap disposition log

### Gap 1 — Enterprise Trust / PKI / Certificate Lifecycle — RESOLVED BY PROMOTION

Dedicated artifact: `project_docs/generation-2/research/ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE.md`.

Multi-representative research across RFC 5280, RFC 8555, SPIFFE/SPIRE, cert-manager, HashiCorp Vault PKI and Smallstep proved convergent semantic ownership for trust domains/relationships, trust-anchor/bundle revisions, issuer/certificate lifecycle, issuance authority, revocation/currentness, rollover and consumer-effective trust. These semantics cannot be wholly assigned to Secrets, Identity or Security without ownership collapse.

Disposition: `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE` is **PROMOTED_TO_ACTIVE_RESEARCH_TAXONOMY / CROSS_CUTTING / NOT_SATURATED**.

Boundary: Secrets retains protected key/material storage and references; Identity retains subject/authentication/federation semantics; Security retains assurance/risk/cryptographic policy; Enterprise Trust owns portable trust relationship/lifecycle/qualification semantics. CA cryptography, signing, enrollment-protocol mechanics, HSM/key custody and native issuer resources remain provider realizations. System Builder is not required to implement a bespoke CA.

`G2-FINDING-ENSR-01` is therefore **STRUCTURALLY_RESOLVED**. Its executable proof obligations remain `BACKFILL_REQUIRED`, especially revocation-currentness, issuer/root rotation with residual-consumer drainage, provider substitution and disconnected trust horizons.

Next structural gap: `G2-CAPABILITY-CANDIDATE-PRIVACY-DATA-GOVERNANCE-RETENTION-LEGAL-HOLD-RESIDENCY`.

## Decision rule

Every screened concern is classified as one of: `ALREADY_COVERED`, `NEEDS_DEEPER_REVISIT`, `NEW_CAPABILITY_CANDIDATE`, `DOMAIN_ONLY`, `PROVIDER_SPECIFIC`, `DUPLICATE`, `LOW_VALUE`, `N_A`.

A `NEW_CAPABILITY_CANDIDATE` remains unpromoted until multi-representative research or a clear structural System Builder need proves a distinct semantic owner. `ALREADY_COVERED` means an existing capability owns the semantics; it does not imply that its proof backfill is closed.

## Enterprise archetype falsification — pass 1

| Archetype | Required decomposition | Result | Material challenge |
|---|---|---|---|
| Small internal business system | process/model, data, identity/authz, UI/AGWS, notifications, simple deployment/runtime | DECOMPOSES_WITH_PROOF_GAP | Minimal capability/runtime closure is still a hypothesis: optional components must be demonstrably omitted and every included component must trace to a capability/dependency obligation. |
| Scaled multi-tenant SaaS | tenant/Station isolation, routing, provider binding, rollout, telemetry, billing/entitlement, lifecycle | DECOMPOSES_WITH_PROOF_GAP | Same semantic capability graph must support materially different qualified runtime realizations without mutating business semantics; mixed-version/provider cohort drainage remains proof debt. |
| Regulated / high-assurance enterprise | governance/audit, security/recovery, data governance, trust/certificates, supply-chain integrity, evidence retention | PARTIALLY_RESOLVED | Enterprise Trust now has an owner; Privacy/retention/legal-hold/residency remains ownerless pending bounded research. |
| Brownfield enterprise integration | identity federation/provisioning, APIs/events, external data, migration/coexistence, provider reconciliation | DECOMPOSES_WITH_BOUNDARIES | SCIM-style provisioning fits Identity/Integration; external IDs remain realization identities. Brownfield semantics must preserve canonical identity and evidence. |
| Disconnected / edge / Station deployment | local closure, bounded trust, autonomy, reconnect/requalification, deployment/runtime, observability | DECOMPOSES_WITH_PROOF_GAP | Enterprise Trust now owns trust horizon semantics, but local evidence freshness and reconnect requalification remain executable proof debt. |
| AI-assisted engineering / operations | agent/tool authority, approvals, evidence, model/prompt/version lineage, evaluations/safety, provider substitution | DECOMPOSES_PARTIALLY | Agent authority is covered; model/prompt/evaluation/safety lifecycle still requires dedicated bounded disposition before synthesis. |

Pass-1 conclusion remains: the taxonomy is **not yet safe to synthesize**. One strong structural gap has now been resolved by promotion; Privacy remains a structural gap, while AI lifecycle/evaluation and Economic Governance still require bounded disposition and centralized architecture-proof work remains open.

## Negative-space concern screen

| Concern | Classification | Current semantic owner / disposition | Pass-1 evidence / rationale |
|---|---|---|---|
| Procurement / FinOps / cost allocation / budgets / commitments | DOMAIN_ONLY + NEW_CAPABILITY_CANDIDATE | Governance + Observability + Provider supply inputs; proposed Economic Governance / FinOps domain capability | FinOps distinguishes allocation, forecasting and budgeting as operational capabilities with explicit ownership and cost attribution. Cost semantics are real, but do not yet justify a new universal primitive. |
| Networking / routing / ingress / segmentation | ALREADY_COVERED | Deployment/Runtime + Tenant Fleet/Edge/Ingress/Routing hypotheses + Security + Provider Binding | Network constructs are realization/topology/security semantics unless future research finds business-canonical network policy that cannot be represented by those owners. |
| Certificate / PKI / trust lifecycle | **ALREADY_COVERED after promotion** | **Enterprise Trust / PKI / Certificate Lifecycle** + consuming boundaries Secrets/Identity/Security | Dedicated multi-representative research proved distinct trust-anchor/issuer/certificate/revocation/rotation/consumer-effective semantics. Provider mechanisms remain providerized; proof backfill remains open. |
| Supply-chain integrity / provenance | ALREADY_COVERED + NEEDS_DEEPER_REVISIT | Build + Artifact/Release/SBOM/Provenance + Security + Enterprise Trust at verifier-root boundary | Existing owners are adequate, but runtime admission must consume exact qualified artifact/provenance/trust revisions rather than infer trust from publication/signature presence. |
| Runtime integrity / admission | NEEDS_DEEPER_REVISIT | Security + Deployment/Runtime + Artifact provenance + Enterprise Trust | Need proof that deploy/admission consumes revision-qualified artifact/provenance/trust policy and becomes `INCONCLUSIVE`/denied when verifier roots or evidence are stale/unavailable. |
| SRE / incident / continuity / BCDR | ALREADY_COVERED | Observability/Operations/Incident + Security/Resilience/Failure Recovery + Governance | Existing owners cover incident/recovery semantics; proof must distinguish declaration, containment, recovery, requalification and return-to-service. |
| Privacy / data governance / retention / legal hold / residency | NEW_CAPABILITY_CANDIDATE | Proposed Privacy / Data Governance / Retention / Residency | Privacy risk is not reducible to cybersecurity or schema migration. Data purpose/use, retention/hold, jurisdiction/residency and deletion eligibility can conflict with ordinary lifecycle and need an explicit semantic-owner study. |
| Model / prompt / evaluation / safety lifecycle governance | NEW_CAPABILITY_CANDIDATE + NEEDS_DEEPER_REVISIT | AI-native Engineering + Governance + Artifact/Lifecycle today; candidate for dedicated AI Evaluation / Model / Prompt / Safety Governance | Current agent/approval research proves authority boundaries but does not by itself prove lifecycle/evaluation ownership for models/prompts/eval suites. |
| Enterprise search / knowledge | DOMAIN_ONLY | Data/Storage/Documents + Identity/Authz + Integration + AGWS/UI + Provider Binding | Search/indexing is a domain composition unless later evidence proves a missing universal owner. |
| Developer platform / internal portal | DOMAIN_ONLY / DUPLICATE | Developer/Operator Experience + AGWS + Extension/Plugin + catalog-like domain models | Portal composition validates existing owners rather than a missing universal capability. |
| Admin directory / lifecycle provisioning | ALREADY_COVERED | Identity/Auth/Federation + Integration/Automation + Authorization | SCIM-style cross-domain provisioning fits existing identity/integration ownership. |
| Mail / calendar / collaboration | PROVIDER_SPECIFIC / DOMAIN_ONLY | Integration + Workflow + Notifications + Authorization + Provider Binding | Provider-specific APIs and domain models should not become universal primitives absent cross-domain evidence. |
| Controlled extensibility / marketplace | ALREADY_COVERED | Extension / Plugin / Marketplace Architecture | Dedicated active capability exists; no ownerless category found. |
| Frontier agentic execution | ALREADY_COVERED + NEEDS_DEEPER_REVISIT | AI-native Engineering/Agents/Approvals + Authorization + Workflow + Security | Authority must remain non-amplifying; model/runtime evolution and eval evidence remain separate research gaps. |
| LLMOps / evaluations / safety evidence | NEEDS_DEEPER_REVISIT | AI-native Engineering + Governance + Observability today | Determine whether evaluation/safety evidence is a subcapability or distinct semantic owner. |

## New material findings from pass 1

### G2-FINDING-ENSR-01 — Enterprise trust is not equivalent to secret storage
Certificate material, issuer/trust-anchor identity, certification path, validity interval, policy applicability, revocation/status evidence, renewal/rollover attempt and workload-effective trust are distinct facts. **Disposition:** structurally resolved by promotion of Enterprise Trust / PKI / Certificate Lifecycle; executable proof remains open.

### G2-FINDING-ENSR-02 — Privacy/data-governance obligations can override ordinary lifecycle
Data purpose/use, classification, retention schedule, legal hold, deletion eligibility, residency/jurisdiction and evidence of disposition are semantically distinct from schema lifecycle and access control. **Status:** OPEN / NEXT STRUCTURAL RESEARCH GAP.

### G2-FINDING-ENSR-03 — Economic governance is real enterprise semantics but not yet a universal primitive
Allocation, budget, forecast, commitment, rate and variance have explicit owners and lifecycles in FinOps practice, but they appear composable from governance, metering/evidence and provider-commercial inputs. **Disposition:** DOMAIN candidate pending bounded test.

### G2-FINDING-ENSR-04 — Supply-chain integrity is covered semantically, but deployment admission is an unresolved proof junction
Generation 2 already has Build and Artifact/Provenance owners; admission must consume exact qualified artifact/provenance/verifier trust rather than treating publication or signature presence as sufficient. Enterprise Trust now owns the verifier-root/trust-lifecycle side of this junction.

### G2-FINDING-ENSR-05 — Agent authority coverage does not prove model/prompt/evaluation lifecycle governance
Versioned identities and evidence for model, prompt/instruction bundle, evaluation suite/result, safety policy and effective runtime/provider qualification still require bounded research.

### G2-FINDING-ENSR-06 — Enterprise portals, search and collaboration are composition tests, not automatic top-level capabilities
These remain useful archetype tests of composition/providerization but pass 1 finds no evidence that they require a new universal semantic owner.

### G2-FINDING-ENSR-07 — Minimal runtime realization remains a mandatory falsifiable product claim
Unused optional capabilities must be omitted where feasible; included runtime components need deterministic requirement/dependency lineage; the same semantic capability graph must support qualified runtime realization changes without canonical business semantic mutation.

### G2-FINDING-ENSR-08 — Seven cycles satisfy eligibility, not completeness
Structural candidates plus unresolved centralized proof obligations keep Enterprise Completeness open and `CAPABILITY_SYNTHESIS` blocked.

## Candidate disposition

| Candidate | Class | Status | Promotion / merge condition |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-ENTERPRISE-TRUST-PKI-CERTIFICATE-LIFECYCLE` | CROSS_CUTTING | **PROMOTED / NOT_SATURATED** | Multi-representative research threshold met; distinct owner established. |
| `G2-CAPABILITY-CANDIDATE-PRIVACY-DATA-GOVERNANCE-RETENTION-LEGAL-HOLD-RESIDENCY` | CROSS_CUTTING | RESEARCH_REQUIRED | Validate convergent purpose/classification/retention/hold/residency/disposition primitives across standards and enterprise systems; determine canonical boundaries with Data, Governance and Security. |
| `G2-CAPABILITY-CANDIDATE-ECONOMIC-GOVERNANCE-FINOPS-PROCUREMENT` | DOMAIN | RESEARCH_REQUIRED | Test whether allocation/budget/forecast/commitment/rate semantics remain a domain composition or require cross-cutting primitives across cloud, on-prem and internal chargeback. |
| `G2-CAPABILITY-CANDIDATE-AI-EVALUATION-MODEL-PROMPT-SAFETY-GOVERNANCE` | DOMAIN | RESEARCH_REQUIRED | Test model/prompt/eval/safety identities, lifecycle, evidence and provider substitution against AI-native Engineering, Artifact/Lifecycle, Governance and Observability before promotion or merge. |

**Adaptive Governed Work Surfaces remains CORE/promoted and distinct from generic UI**, preserving `Enterprise → Station → Role → Person`, non-weakenable higher invariants and no authority amplification through AI. Enterprise Trust follows the same monotonic hierarchy: delegated Station/Role/Person scope may narrow allowed issuer/profile/usage semantics but cannot add superior roots, widen issuer authority or weaken mandatory trust policy.

## Architecture-proof backfill additions

1. **Minimal-runtime closure proof:** generate a small system with optional capabilities absent; prove omitted runtime components are absent where feasible and every included component traces to an explicit capability/dependency obligation.
2. **Same-semantics/different-realization proof:** apply one canonical capability graph to simple, scaled and critical operational profiles; prove topology/runtime changes without canonical business semantic mutation.
3. **Artifact-to-runtime admission proof:** attempt deployment with valid artifact digest but stale/untrusted/mismatched provenance or verifier root; admission must deny or become explicit `INCONCLUSIVE`.
4. **Enterprise trust negative proof:** revoke/expire an otherwise-present certificate or invalidate its path/policy; effective trust must fail/requalify independently of secret/config availability.
5. **Enterprise trust rotation proof:** roll issuer/root/certificate generations with bounded overlap; no closure until residual old-generation consumers are requalified/drained/disposed.
6. **Trust-provider substitution proof:** move logical trust intent between provider realizations without provider-native identities becoming canonical and without silently inheriting unsupported revocation/offline/rotation semantics.
7. **Privacy retention/hold conflict proof:** make ordinary deletion eligible while a legal hold or purpose/residency constraint applies; destructive transition must be blocked and evidence retain the controlling obligation.
8. **AI evaluation qualification proof:** change model, prompt/instruction bundle, evaluation suite, safety policy or provider after an apparently passing evaluation; previous evidence becomes stale/inapplicable rather than silently inherited.
9. **Domain-composition proof:** implement a developer-portal/search/admin-integration archetype from existing capability contracts; provider-specific IDs must not become canonical business identity.
10. **Disconnected trust horizon proof:** run a Station past one trust/revocation/bundle evidence freshness horizon; privileged operations degrade/deny/`INCONCLUSIVE`, and reconnect triggers requalification before authority resumes.

Detailed proof status is maintained in `ENTERPRISE_COMPLETENESS_ARCHITECTURE_PROOF_BACKFILL.md`.

## Evidence / source ledger — pass 1 and trust-gap disposition

- NIST Cybersecurity Framework 2.0: https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20
- NIST SP 1305: https://csrc.nist.gov/pubs/sp/1305/final
- FinOps Framework Allocation: https://framework.finops.org/framework/capabilities/allocation/
- FinOps Framework Forecasting: https://www.finops.org/framework/capabilities/forecasting/
- NIST Privacy Framework: https://www.nist.gov/privacy-framework/privacy-framework
- NIST AI RMF / AIRC / NIST AI 600-1: https://airc.nist.gov/ and https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence
- RFC 5280: https://www.rfc-editor.org/rfc/rfc5280
- RFC 8555: https://www.rfc-editor.org/rfc/rfc8555
- SPIFFE concepts/federation: https://spiffe.io/docs/latest/spiffe/concepts/ and https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/
- cert-manager Issuers/Certificates: https://cert-manager.io/docs/configuration/ and https://cert-manager.io/docs/usage/certificate/
- HashiCorp Vault PKI: https://developer.hashicorp.com/vault/api-docs/secret/pki and https://developer.hashicorp.com/vault/docs/secrets/pki/considerations
- Smallstep step-ca: https://smallstep.com/docs/step-ca/
- RFC 7644 SCIM: https://www.rfc-editor.org/rfc/rfc7644
- SLSA provenance/build requirements: https://slsa.dev/spec/v1.2/provenance and https://slsa.dev/spec/draft/build-requirements
- Backstage: https://backstage.io/docs/features/software-catalog/ and https://backstage.io/docs/overview/what-is-backstage/

## Gate disposition

`ENTERPRISE_COMPLETENESS_NEGATIVE_SPACE_REVIEW = IN_PROGRESS / PASS_1_COMPLETE / STRUCTURAL_GAP_1_RESOLVED / MORE_GAPS_OPEN`.

Do **not** advance to `CAPABILITY_SYNTHESIS`. Return to bounded `RESEARCH_ELICITATION` on exactly one structural gap at a time. The next priority is **Privacy / Data Governance / Retention / Legal Hold / Residency**. After its disposition, continue with the bounded AI lifecycle/evaluation question and Economic Governance if still material, while retaining the workload-driven runtime and architecture-proof obligations.