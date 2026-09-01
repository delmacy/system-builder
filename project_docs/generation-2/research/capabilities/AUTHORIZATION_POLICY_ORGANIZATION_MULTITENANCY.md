# Generation 2 Research — Authorization / Policy / Organization / Multitenancy

Status: first deep pass; **NOT SATURATED**.

## 1. Research question

How should Generation 2 separate authentication from authorization, represent `principal/subject + action + resource + context`, combine role/attribute/relationship models, make organization/tenant boundaries explicit, support delegated administration, version policy/models safely, separate policy decision from enforcement, and preserve decision evidence plus generated-runtime autonomy without copying any one authorization product as the SB ontology?

## 2. Representatives

1. **Open Policy Agent (OPA)** — selected for distributed policy decision, explicit control-plane/data-plane separation, signed/versioned policy bundles, decision logs and runtime-local enforcement architecture.
2. **Cedar / Amazon Verified Permissions** — selected for strongly typed `principal/action/resource/context` authorization requests, schema validation, explicit policy/application contract and deny/permit semantics.
3. **Google Zanzibar + OpenFGA** — Zanzibar supplies the production relationship-based authorization architecture and consistency model; OpenFGA provides a current, inspectable implementation model with immutable authorization models, relationship tuples, contextual tuples and conditions.
4. **Keycloak Authorization Services + Organizations** — selected for practical RBAC/ABAC/context policies, explicit resource/scope/policy/permission separation, PEP/PIP terminology, UMA resource-owner delegation, and current organization-scoped delegated administration.
5. **Microsoft Entra / Azure multitenancy guidance** — selected as a contrast for tenant isolation as an architectural boundary spanning control and data planes rather than merely a token claim or role.

## 3. Evidence/source ledger

| Source | Current claim used |
|---|---|
| OPA Management APIs | OPA supports distributed local policy decision with logically centralized management; bundles distribute policy, decision logs capture decisions, status reports active revisions and health, discovery configures agents. |
| OPA Bundles / Decision Logs | Bundles can be signed and activated without process restart; decision logs include `decision_id`, policy path, bundle revision, inputs/results and trace identifiers. |
| Cedar policy/schema docs | Authorization requests are based on principal, action, resource and context (PARC); schemas validate policies separately from evaluation and form a contract between application and policy; schema evolution can invalidate policies. |
| Zanzibar paper | Authorization is modeled as a global relationship/ACL system with causal ordering/external consistency between authorization changes and protected-object changes. |
| OpenFGA docs | Relationship tuples persist graph edges; contextual tuples are request-scoped and non-persistent; conditions add contextual/attribute constraints; authorization models are immutable and checks can pin a specific model ID. |
| Keycloak Authorization Services | Resources/scopes, policies and permissions are separate concepts; PEP enforces decisions; policies can combine RBAC, ABAC and context; resource-owner/delegated permission flows are supported by UMA. |
| Keycloak 26.7 release | Organizations are first-class resources for fine-grained admin permissions and can delegate management per organization without realm-wide power. |
| Azure multitenancy guidance | Tenant isolation is a system architecture choice across control plane/data plane, with trade-offs in security, topology, operations and cost. |

Primary sources:
- https://www.openpolicyagent.org/docs/management-introduction
- https://www.openpolicyagent.org/docs/management-bundles
- https://www.openpolicyagent.org/docs/management-decision-logs
- https://docs.cedarpolicy.com/
- https://docs.cedarpolicy.com/policies/validation.html
- https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/
- https://openfga.dev/docs/concepts
- https://openfga.dev/docs/getting-started/immutable-models
- https://openfga.dev/docs/interacting/contextual-tuples
- https://openfga.dev/docs/modeling/conditions
- https://www.keycloak.org/docs/latest/authorization_services/index.html
- https://www.keycloak.org/2026/07/keycloak-2670-released
- https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/service/aks

## 4. Capability / primitive extraction

### Source of truth

Authorization truth is not a single table or token. Mature systems separate at least:

- **identity/authentication evidence** — who authenticated and under which issuer/session;
- **authorization model/schema** — which subject/resource/action/context types and relationships exist;
- **policy declarations** — reusable decision rules;
- **relationship/role bindings** — durable grants, memberships or graph edges;
- **request context** — transient organization/session/environment facts;
- **decision** — allow/deny plus evidence of what model/policy/data produced it;
- **enforcement** — the component that actually permits or blocks the operation.

The portable primitive is therefore closer to `AuthorizationRequest`, `AuthorizationModelRef`, `PolicyRef`, `Relationship/RoleBinding`, `Decision`, `DecisionEvidence` and `EnforcementPoint` than to a product-specific "role" table.

### Identity

Authentication identity must be input to authorization, not authorization itself. Cedar's request roles (`principal`, `action`, `resource`, `context`) and Zanzibar/OpenFGA's `user/relation/object` both require identities qualified by their semantic type/namespace. Organization or tenant context must not be inferred merely from a global user identifier.

### Lifecycle

At least four lifecycles are distinct:

1. authorization model/schema lifecycle;
2. policy lifecycle;
3. relationship/grant/membership lifecycle;
4. runtime decision/enforcement lifecycle.

OPA bundle activation and OpenFGA immutable model IDs show why policy/model rollout must be independently observable and pin-able. Keycloak shows a fifth operational lifecycle for delegated permission/owner approval.

### Versioning

A single generic `policyVersion` is insufficient. Evidence suggests distinct identities for:

- authorization schema/model revision;
- policy bundle/policy revision;
- relationship/grant state revision or consistency token where available;
- evaluator/provider version;
- decision ID / execution timestamp.

OpenFGA explicitly recommends passing `authorization_model_id`; OPA decision logs carry bundle revisions. Cedar warns that schema changes can make previously valid policies invalid. This is a recurring cross-platform signal for **decision-to-model version binding**.

### Failure semantics

Authorization failures must distinguish:

- explicit deny;
- no applicable grant/default deny;
- invalid request shape/context;
- invalid or incompatible policy/model;
- missing/stale relationship or external data;
- policy engine/provider unavailable;
- enforcement-point failure;
- decision evidence unavailable.

Fail-open/fail-closed behavior is security policy and deployment semantics, not something a generic provider should silently choose.

### Extensibility

OPA supports arbitrary policy/data with Rego and plugins; Cedar exposes typed policy/schema constructs; OpenFGA combines relationships with conditions; Keycloak supports policy providers through SPI. The universal lesson is bounded extensibility behind a stable request/decision contract—not adopting Rego, Cedar syntax, FGA DSL or Keycloak policy providers as SB's canonical business model.

### Provider boundaries

A useful universal boundary is:

`portable authorization intent/model` → `provider projection/binding` → `decision point` → `enforcement point` → `decision evidence`.

OPA is strong evidence that policy decision can be colocated with workloads while management remains centralized. Keycloak makes PEP explicit. This supports provider replacement only if the SB contract does not leak the provider language into business semantics.

### Governance

Governance requires explicit authority over:

- who can author policies/models;
- who can bind roles/relationships;
- who may delegate administrative authority;
- which organizations/tenants an administrator may manage;
- which policy/model revisions may be promoted;
- which components may enforce or bypass decisions.

Keycloak 26.7's per-organization fine-grained admin permissions are strong evidence that **administrative authority is itself a protected resource domain**, separate from end-user permissions.

### Observability / evidence

OPA's `decision_id`, trace IDs and bundle revision are a strong pattern. Decision evidence should be able to answer:

- what authorization request was evaluated;
- which policy/model/provider revision participated;
- what durable grants/relationships or contextual facts were considered;
- what result was produced;
- where it was enforced;
- whether sensitive input was redacted before durable logging.

Decision logs are evidence, not necessarily business records, and require retention/redaction controls.

### Portability and lock-in

The portable surface should preserve semantic intent (`subject/principal`, `action`, `resource`, `context`, relationships/roles, effect, policy references) while allowing projections to RBAC, ABAC, ReBAC or mixed providers. Full semantic equivalence across providers cannot be assumed; compatibility/negotiation must reveal unsupported semantics before binding.

Lock-in risk rises sharply when canonical business definitions embed Rego, Cedar expressions, FGA DSL, Keycloak-specific scopes, or cloud-specific tenant objects directly.

## 5. Product-specific mechanisms that must not be copied automatically

- Rego syntax, OPA bundle/discovery wire format and OPA plugin topology.
- Cedar policy syntax or Amazon Verified Permissions policy-store constraints.
- Zanzibar's Google-scale consistency/storage architecture or OpenFGA tuple syntax/store API.
- Keycloak UMA/RPT/permission-ticket flows, JavaScript policies, realm/client resource model or admin-role names.
- Azure namespace topology as the universal definition of tenant isolation.

These are implementations or provider contracts. The reusable primitives are request shape, typed model, relationship/grant semantics, policy/model version binding, decision/enforcement separation, tenant context, delegated administrative authority and decision evidence.

## 6. Recurring patterns

1. **Authentication and authorization are deliberately separate.** Identity/token facts become authorization inputs, never automatic business permission.
2. **Authorization has a stable request contract.** Cedar's PARC and Zanzibar/OpenFGA's relationship check differ syntactically but both explicitly name actor, operation/relation and target plus contextual state.
3. **Decision and enforcement are separate responsibilities.** OPA can colocate the decision engine; Keycloak names PEP; applications/resources remain responsible for enforcing the result.
4. **Policy/model versions matter at decision time.** OPA logs bundle revision; OpenFGA pins model ID; Cedar schema evolution requires policy revalidation.
5. **Durable relationship state and ephemeral context are different.** OpenFGA contextual tuples make this distinction explicit and organization-context examples show why session-specific tenant context must not overwrite durable membership.
6. **RBAC, ABAC and ReBAC are composable dimensions, not mutually exclusive products.** Keycloak combines mechanisms; OpenFGA conditions enrich relationships; Cedar entities/attributes/hierarchy combine typed context with policies.
7. **Delegation is a separate authority problem.** Resource-owner sharing and per-organization administration require bounded meta-permissions rather than ordinary application roles.
8. **Tenant isolation is architectural, not merely logical authorization.** Authorization can select tenant context, but data/runtime/control-plane isolation must be proven separately.
9. **Decision provenance is first-class operational evidence.** Traceability requires model/policy revision and decision identity.
10. **Distributed autonomy favors local/available enforcement with centrally governable policy distribution.** OPA demonstrates this pattern while retaining independent management APIs.

## 7. Bounded comparison with System Builder main

Fresh `main` contains a concrete `RuntimeAuthorityProjection`, not just an identity/session placeholder. `packages/compiler/authority-projection.ts` currently defines:

- `CompilerRuntimeRoleBinding { id, roleRef, actorRef?, membershipRef? }`;
- `CompilerRuntimePermission { role, resource, actions, context?, policyRefs? }`;
- permission context with `organizationRef` and `membershipRef`;
- structured policies with `effect: allow|deny`, optional role/resource/action references and `contextEquals`;
- normalization that checks entity/action/identity/policy references and rejects ambiguous role-binding targets and ambiguous permission keys;
- descriptive policies that do not become executable unless `structured` is present.

This is material evidence of existing authorization architecture. It already separates identity from authority, supports role/permission/policy concepts, recognizes organization/membership context and distinguishes descriptive from executable policy.

What this first-pass archaeology **does not prove**:

- a first-class `AuthorizationRequest` / `Decision` contract;
- policy decision point vs enforcement point boundaries;
- policy/model revision pinning and migration;
- decision IDs or durable decision evidence;
- ReBAC/general relationship graph beyond role/membership references;
- explicit default-deny/conflict-combination semantics across multiple matching policies;
- live external authorization provider bindings/replacement;
- tenant isolation outside permission context;
- delegated administration over SB stations/organizations;
- generated-runtime behavior if a remote authorization provider is unavailable.

Therefore the bounded hypothesis is **KEEP/HARDEN/GENERALIZE the existing authority projection**, not replace it with OPA/Cedar/OpenFGA.

## 8. Reconciliation hypotheses only

- **KEEP/HARDEN** — identity/authority separation and the existing `roleBindings → permissions → structured policies` projection.
- **KEEP/HARDEN** — explicit `organizationRef` / `membershipRef` context, subject to archaeology of membership ownership and tenant isolation semantics.
- **GENERALIZE** — request/decision/evidence semantics so policy engines and native policy evaluation can share a stable contract.
- **GENERALIZE** — model/policy revision binding and compatibility validation before runtime use.
- **PROVIDERIZE** — external authorization engines such as OPA/Cedar/OpenFGA only behind explicit provider bindings if product requirements justify them.
- **INTEGRATE** — standardized external decision/evidence interfaces only where interoperability value is demonstrated.
- **DEFER** — graph-scale Zanzibar semantics unless real product scenarios require ReBAC beyond existing role/membership relationships.
- **DO NOT BUILD** — a Google-scale globally consistent ACL database merely because Zanzibar is a useful conceptual reference.

No item above is implementation authority.

## 9. Repository-validation questions

1. Where are `roleBindings`, `permissions` and `policies` authored canonically before compiler projection, and what owns their stable identity?
2. Is `membershipRef` backed by a typed organization/membership contract or merely an opaque token today?
3. What exact algorithm combines multiple matching allow/deny policies and permissions? Is default deny explicit and tested?
4. Is there a runtime authorization-check API, or are permissions consumed directly by generated application code?
5. Where is the enforcement point, and can any action/entity/view path bypass it?
6. Is authorization decision evidence emitted with policy/model revision and request identity?
7. Are policy/model revisions immutable, migratable or associated with release/runtime artifacts?
8. Does organization context imply data isolation, or only permission filtering?
9. Can role/permission/policy authority be delegated per organization or SB station without granting global administrative power?
10. Can an external policy provider be unavailable while a generated runtime continues safely with bounded local state/policy?
11. Does the model need general relationships beyond role/membership, or would that introduce unnecessary ReBAC complexity?
12. How are sensitive context attributes redacted from traces/evidence?

## 10. Candidate Symbiotic Proof

A future product proof for this capability should prove six independent properties:

1. **Native path** — a generated runtime enforces an SB-native role/permission/policy model without any external authorization service.
2. **External provider path** — the same portable authorization intent is projected/bound to one external decision provider and enforced without changing business semantics.
3. **Replaceability** — provider A can be replaced by provider B only after compatibility checks; unsupported semantics fail before activation rather than silently degrade.
4. **Portability** — authorization model, bindings and policy intent are exportable without secret/token material and without provider-language contamination of the portable definition.
5. **Governance/evidence** — each decision can be traced to subject/context, policy/model revision, provider/binding, result and enforcement point with sensitive-data redaction.
6. **Runtime autonomy** — native enforcement survives Builder unavailability; external-provider mode has explicit fail-closed/degraded semantics and does not create a hidden dependency on the Builder control plane.

Tenant isolation must have a separate proof that crosses authorization, data, secrets and runtime boundaries; a successful permission check alone is insufficient evidence of tenant isolation.

## 11. Stable findings

- **G2-FINDING-AUTH-01 — Authentication Is Authorization Input, Not Authority.** Successful authentication or token possession must never imply business permission.
- **G2-FINDING-AUTH-02 — Authorization Request Shape Must Be Explicit.** Principal/subject, action/relation, resource/object and context are stable cross-provider concepts even when provider languages differ.
- **G2-FINDING-AUTH-03 — Decision and Enforcement Are Separate Boundaries.** A policy decision is not protection until an identified enforcement point applies it, and bypass paths must be testable.
- **G2-FINDING-AUTH-04 — Decision Must Bind to Policy/Model Revision.** OPA bundle revision, OpenFGA model ID and Cedar schema/policy coupling all show that decision provenance without model version is incomplete.
- **G2-FINDING-AUTH-05 — Durable Relationships and Ephemeral Context Must Stay Distinct.** Tenant/session context must not mutate durable memberships/grants merely to evaluate one request.
- **G2-FINDING-AUTH-06 — RBAC/ABAC/ReBAC Are Composable Semantics.** Generation 2 should not encode a false choice between role-, attribute- and relationship-based authorization; providers may support different subsets that require compatibility checks.
- **G2-FINDING-AUTH-07 — Conflict/Default/Failure Semantics Must Be Explicit.** Allow/deny combination, no-match behavior, invalid policies and provider outages cannot be left to implicit provider defaults.
- **G2-FINDING-AUTH-08 — Delegated Administration Is a Separate Authority Plane.** Permission to administer policies, organizations or SB stations must be independently bounded and cannot be inferred from application roles or identity administration.
- **G2-FINDING-AUTH-09 — Authorization Decision Evidence Is First-Class.** Decision identity, model/policy revision, relevant inputs, provider/binding and enforcement result are required for auditability and debugging.
- **G2-FINDING-AUTH-10 — Tenant Isolation Exceeds Authorization Context.** Organization/tenant authorization is necessary but cannot alone prove data, secret, runtime or control-plane isolation.

## 12. Synthesis

**Value for SB:** very high. The current runtime authority projection means this is not greenfield; research can harden an existing core capability rather than import a new authorization stack.

**Adoption risk:** high if provider DSLs leak into canonical business semantics or if organization context is mistaken for tenant isolation. Medium when external engines remain replaceable providers behind a native authorization request/decision contract.

**Investigation priority:** critical, because authority boundaries constrain every generated runtime, organization model, admin surface, provider integration and future recursive SB-management scenario.

**Next research question for this capability:** whether the existing SB `roleBindings/permissions/policies` model has explicit decision-combination semantics, immutable/versioned authorization models, decision evidence and enforcement-point coverage—and whether real product scenarios justify general ReBAC beyond current membership/role references.
