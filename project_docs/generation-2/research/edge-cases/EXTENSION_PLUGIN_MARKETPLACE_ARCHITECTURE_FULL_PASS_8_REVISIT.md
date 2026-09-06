# Generation 2 — Extension / Plugin / Marketplace Architecture — Full Pass 8 Revisit

Status: ACTIVE / ELIGIBLE NO-NEW-MATERIAL REVISIT  
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`  
Full pass: 8  
Capability: Extension / Plugin / Marketplace Architecture  
Mandatory cluster: Extension/Plugin × authority × provider trust × lifecycle

Research only. `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`. No product, Work Package, executive TASK, Construction or remediation is authorized.

## 1. Authority and bounded scope

This revisit follows `RESEARCH_PIPELINE_STATE.json` as sole phase/current-focus/next-action authority. It keeps Extension / Plugin / Marketplace Architecture as the bounded capability under challenge and carries all standing cross-cutting research lenses without promoting any of them into a new canonical capability.

Standing lenses carried here: Typed Semantic Graph; `ExecutionEnvelope` / `ExecutionState` / `ExecutionJournal`; Inter-System/Federated Graph; control-flow primitives; mathematical/analytical kinds; multidimensional/vector semantics; workflow soundness/completion proof; temporal/dynamic graph; provenance/lineage; decision semantics; units/dimensional analysis; uncertainty propagation; graph transformation/revision; Legacy Mirroring/Brownfield Assimilation; Physical/Peripheral Integration constrained to integration/governance plane; Elicitation & System Understanding; Operability Elicitation; Autonomous Builds/Fleet/local-first evidence.

Duplicate-screen baseline: all 124 reusable ConflictPatterns. Extension local and paired-cluster no-material streaks are already capped at 2 and must not increase without material novelty.

## 2. Technique rotation — Full Pass 8

This pass intentionally avoids merely repeating the Full Pass 7 trust-time-cube and graph-rewrite probes. It uses:

1. **dependency-set/proof-set subtraction** — hold a dependency realization constant while removing one proof class at a time: provenance, admission, runtime currentness, authority, provider-scope qualification, quiescence or production-readiness evidence;
2. **N-wise transitive/diamond closure** — independently satisfiable peer/host/provider edges are composed and checked for a common semantic realization rather than pairwise package validity;
3. **host-API/semantic-contract skew matrix** — extension binary/package compatibility, host API availability, semantic contract revision and provider binding are independently varied;
4. **publisher/admission/revocation split** — publisher trust, signature verification, marketplace admission, tenant/site activation and invocation-time authority are treated as distinct temporally qualified claims;
5. **deactivate/uninstall residual-set challenge** — extension registration is removed while queued jobs, callbacks, leases, sessions, tokens, subscriptions, webhook side effects and external provider mutations remain possible;
6. **scope-expansion permutation** — a connector extension gains a broader provider permission or target set than the canonical capability/tenant/site authority that invoked it;
7. **semantic-owner collision composition** — two extensions independently contribute rules, decisions, calculations, schema fields or external writes that appear compatible but claim overlapping semantic ownership;
8. **resource/queue amplification** — valid extension composition multiplies retry, callback, polling, telemetry and provider-request cardinality without collapsing pressure into one scalar;
9. **Brownfield discovery subtraction** — hidden plugins/scripts/macros/webhooks/adapters in a legacy estate are omitted from inventory to test whether migration or readiness can be falsely declared complete;
10. **Production Readiness Coverage subtraction** — install/activate happy-path evidence is retained while rollback, disable, residual-effects, outage, ownership, observability or recovery evidence is removed;
11. **Physical/Peripheral authority firewall** — VMS/access/BMS/PDV/device connectors expose read/provision/grant/session capabilities but are challenged against accidental inheritance of write/call/actuation authority;
12. **local-first/Fleet disagreement** — local extension state and evidence remain current while Fleet/aggregate projection is stale, incomplete or absent;
13. **AI/low-code aggregate composition** — separately approved extensions are composed by AI/low-code into a reach/authority/provider set that no single extension held alone.

## 3. Current external evidence and portable interpretation

### npm peer compatibility

npm's current `package.json` documentation describes `peerDependencies` as compatibility constraints between a plugin and its host and notes that conflicting requirements can make the dependency tree unresolvable. A resolved dependency tree therefore proves at most that package constraints can be realized; it does **not** prove common semantic ownership, provider scope, authority, trust, side-effect safety or production readiness.

Portable conclusion: `dependency realization != semantic qualification != authority qualification`.

### VS Code extension runtime/trust

Current VS Code documentation states that extensions in its extension host can act with the same permissions as VS Code itself, including file/network/process access. It also distinguishes publisher trust and extension signature verification; disabling an extension can require restarting the extension host, and local/web/remote extension hosts are distinct runtime locations.

This is a useful industrial witness for three SB-relevant separations:

- `publisher trusted != extension semantically authorized`;
- `package signature/integrity != permitted provider/business effect`;
- `disabled/uninstalled configuration != already-running or externally-issued effect quiescence`.

It also reinforces that runtime location is a qualified property: a host/plugin relationship may have local, remote or browser realizations with materially different mechanics.

### Sigstore policy admission

Sigstore policy-controller currently validates signatures/attestations against configured policies/authorities and supports per-namespace enforcement. Its own model separates verifiable supply-chain metadata from the admission policy that decides whether the artifact may run.

Portable conclusion: `signature/provenance evidence != admission policy != invocation-time business authority`. Namespace/site/tenant selection is an additional qualifier rather than an implication of a valid signature.

### Kubernetes admission/webhook lifecycle

Current Kubernetes admission documentation makes `failurePolicy`, timeout, reinvocation/idempotency and side-effect declarations explicit. It notes that webhook configuration changes can take time to become effective, that mutating webhooks may be reinvoked, and that webhooks with side effects require reconciliation because a later admission stage can reject the original request after the side effect occurred. Good-practice documentation also warns about dependency loops and self-triggering webhook behavior.

Portable conclusion: `hook returned/accepted != final host outcome`; `hook disabled/config changed != immediate fleet-wide currentness`; `side-effectful extension call != host transaction`. Extension lifecycle therefore needs effect/reconciliation evidence distinct from plugin registration state.

### OpenTelemetry extensibility and queue pressure

The OpenTelemetry Collector remains explicitly extensible through receivers/processors/exporters/connectors/extensions, while its resilience guidance documents finite queues, retry horizons, queue-full loss and persistent-WAL limits. This is a useful witness that a healthy extension surface can still become operationally unsafe through composed queue/backpressure behavior.

Portable conclusion: `extension/component health != bounded aggregate resource pressure != guaranteed delivery`.

## 4. Typed Semantic Graph / Execution / temporal / provenance interpretation

The research continues to support typed subjects/relations such as:

- `ExtensionDefinition` / `ExtensionRevision`;
- `ExtensionInstallation` / `ExtensionActivation`;
- `PublisherIdentityRef` / `TrustEvidenceRef` / `AdmissionPolicyRef`;
- `HostApiRevisionRef` / `SemanticContractRevisionRef`;
- `CapabilityUse` / `Invocation`;
- `ProviderBinding` / `ExternalGrantRef` / `ExternalResourceRef`;
- `ExecutionEnvelope` / `ExecutionState` / `ExecutionJournal`;
- effect/reconciliation/provenance evidence.

These are research hypotheses/semantic candidates, not canonical architecture decisions. Temporal qualifiers remain necessary because publish/sign/admit/install/activate/invoke/revoke times can differ. Provenance edges do not establish authority or causal proof. A reachable graph path does not establish permission.

PostgreSQL relational graph remains a plausible baseline. Nothing in this pass creates evidence requiring GraphDB. Canvas/Fleet remain projections rather than authoritative semantic state.

## 5. Legacy Mirroring / Brownfield assimilation lens

A Brownfield estate can contain plugins, office macros, scheduled scripts, database triggers, SaaS webhooks, spreadsheet add-ons and manual connector routines that are semantically equivalent to hidden extensions even when no marketplace/package registry records them.

The pass challenged false readiness where only declared extensions are inventoried. The candidate failure is: migration/cutover is marked complete while a hidden adapter or macro continues to mutate a source, issue callbacks, transform fields or enforce an implicit rule.

Detection candidate: extension/adapter inventory must permit evidence from filesystem/package manifests, legacy config, scheduled jobs, webhook registries, provider consoles, scripts/macros, logs and stakeholder elicitation; unresolved inferred mechanics remain `InferredCandidate`/`OpenQuestion`, not truth.

This duplicate-screens into existing Brownfield completeness, residual-cohort, semantic-owner, provenance/currentness, external-effect and false-convergence families. No new pattern is needed.

## 6. Physical / Peripheral integration-plane lens

The extension mechanism is a likely realization boundary for VMS, access-control, BMS/HVAC, PDV, device/edge and similar provider adapters, but the pass preserves the deliberate product boundary:

`read/query/inventory/event/provision/grant/session broker != media/control plane != physical actuation authority`.

A connector extension that can create an external user, map a role, read camera/door/site inventory, ingest alarms/access events or request an authorized session/token does not thereby gain generic authority to open a door, change a BMS setpoint, control a camera stream or operate a payment terminal.

The strongest adversarial permutation was provider-scope widening: the external credential behind the extension has broader site/device/action rights than the canonical subject invoking the extension. Detection candidate: compare canonical authority envelope, provider credential scope, requested external resource/site/action and observed provider effect. Existing confused-deputy, provider-scope, authority-non-amplification and tenant/site-isolation patterns cover the case.

Actuation remains NON-GOAL/provider-specific/exceptional and would require a separate Planning C decision plus safety/authority proof obligations.

## 7. Elicitation & System Understanding lens

Extension readiness cannot be `RESOLVED` merely because stakeholders name the plugin and say what it "does". Capability-aware elicitation should be able to uncover, where applicable:

- purpose and semantic owner;
- publisher/source/provenance;
- host/runtime locations and supported host/API revisions;
- canonical capability/operation exposed;
- provider/system/site/tenant/resource scope;
- requested versus effective external permissions;
- activation/deactivation/uninstall semantics;
- in-flight hooks/jobs/subscriptions/tokens after disable;
- retries/idempotency/timeout/`UNKNOWN` external effects;
- queue/resource/cost/cardinality bounds;
- data/privacy/retention consequences;
- observability/reconciliation/effect evidence;
- upgrade/downgrade/rollback compatibility;
- hidden Brownfield predecessor/adapters;
- exceptional physical-actuation surface, if any;
- acceptance and production-readiness proof.

Contradictory stakeholder claims must remain conflicts/open questions with owners/evidence routes. AI inference about plugin capability or safety remains `InferredCandidate`, never authority. A marketplace description or feature label is evidence, not a canonical semantic contract.

## 8. Adversarial dispositions after duplicate-screen

### 8.1 Dependency-set resolved, proof-set incomplete

All package/host constraints resolve, but one of authority, provider-scope, admission-currentness, semantic-owner or production-readiness evidence is missing.

- detection candidate: N-wise realized dependency set + required proof-set coverage by context;
- blast radius: extension host to tenant/site/provider scope, potentially cross-system;
- reversibility: variable; external mutations may be non-reversible or `UNKNOWN`;
- currentness: invocation-time qualification required;
- proof obligation: dependency realization must not be accepted as semantic/authority readiness.

Duplicate-screen: qualification/proof-claim/currentness families.

### 8.2 Transitive trust expansion

Trusting/installing one extension causes dependencies or extension packs to bring additional publishers/code into the realized set.

- detection candidate: transitive publisher/artifact/dependency closure;
- blast radius: host/runtime and all reachable providers/resources;
- reversibility: installation reversible, effects potentially residual;
- currentness: dependency graph and publisher policy revision qualified;
- proof obligation: trust/admission must be evaluated over realized transitive closure, not only root package.

Duplicate-screen: transitive trust/provider/authority closure families.

### 8.3 Admission currentness split

Artifact satisfied admission at install time but host policy, trust roots, provider scope or business authority changed before invocation.

- detection candidate: install/admit revision versus invocation-qualified policy/trust/authority;
- blast radius: invocation and downstream effects;
- reversibility: context dependent;
- currentness: central;
- proof obligation: historical admission cannot be treated as perpetual invocation authority.

Duplicate-screen: temporal-currentness/revocation families.

### 8.4 Disable/uninstall without effect quiescence

Extension is deactivated/uninstalled while jobs, callbacks, webhook side effects, tokens, sessions, leases or provider-side automation remain active.

- detection candidate: residual reachable invocation/effect set plus reconciliation evidence;
- blast radius: provider/system/site and any federated downstream consumer;
- reversibility: often partial;
- currentness: residual-set observation must be time-qualified;
- proof obligation: configuration removal does not prove quiescence.

Duplicate-screen: residual cohort/revocation/ambiguous-effect/recovery families.

### 8.5 Extension semantic-owner collision

Two extensions expose or mutate the same business concept under different semantics while both appear locally valid.

- detection candidate: canonical semantic-owner map + affected typed facts/operations/decision/formula refs;
- blast radius: shared canonical object/process;
- reversibility: may require semantic reconciliation rather than simple uninstall;
- currentness: graph/revision qualified;
- proof obligation: extension contribution must not silently create competing canonical ownership.

Duplicate-screen: semantic-owner/cross-process/data-consistency families.

### 8.6 Queue/resource amplification

Composed extensions multiply retries, polling, callbacks, provider requests or telemetry until one resource vector becomes unstable while host health remains apparently green.

- detection candidate: per-extension and aggregate queue/CPU/memory/provider-quota/cost/cardinality vectors plus bottleneck headroom;
- blast radius: host, provider quotas, external latency and dependent workflows;
- reversibility: usually operationally reversible after backlog/effect disposition;
- currentness: near-real-time pressure evidence required;
- proof obligation: scalar health cannot prove bounded composition.

Duplicate-screen: resource/capacity/objective/backpressure families.

### 8.7 Brownfield hidden extension omitted from readiness

Undocumented script/macro/webhook/adapter continues to transform or mutate data after modernization declares old extension surface retired.

- detection candidate: multisource inventory + observed-effects reconciliation + stakeholder negative-space elicitation;
- blast radius: affected data/process/provider path;
- reversibility: depends on silent historical mutations;
- currentness: evidence must distinguish historical from still-active mechanism;
- proof obligation: readiness/cutover cannot depend only on declared package inventory.

Duplicate-screen: Brownfield completeness/residual-cohort/provenance/currentness families.

### 8.8 Physical connector inherits actuation accidentally

Connector authorized for identity/provisioning/read/events is given provider credentials that also permit physical actuation, and generic extension composition exposes that action.

- detection candidate: requested canonical operation versus provider credential/action matrix and target site/resource;
- blast radius: physical site/device/person safety/privacy;
- reversibility: may be irreversible or safety-critical;
- currentness: invocation-time authority/provider scope;
- proof obligation: read/provision/broker semantics must not imply actuation authority.

Duplicate-screen: authority-non-amplification/confused-deputy/provider-scope/physical-boundary families. No actuation capability is promoted.

### 8.9 Fleet projection falsely declares extension convergence

Fleet view reports a common extension revision/policy while one offline/local cohort still runs previous code/binding/trust state.

- detection candidate: local attested runtime evidence with observation timestamp/revision versus aggregate projection;
- blast radius: residual cohort/site;
- reversibility: usually operationally manageable but effects may already differ;
- currentness: local-first evidence essential;
- proof obligation: Fleet projection cannot erase autonomous local truth or uncertainty.

Duplicate-screen: residual-cohort/currentness/false-convergence/evidence families.

### 8.10 AI/low-code aggregate reach expansion

AI composes extensions whose individually allowed operations form a combined path to a provider/resource/effect no single extension was intended to authorize.

- detection candidate: aggregate capability/provider/authority reachability plus semantic-owner and policy constraints;
- blast radius: composition-dependent, potentially enterprise/provider-wide;
- reversibility: variable;
- currentness: generated composition and policies must be revision-qualified;
- proof obligation: composition must not amplify authority/trust/provider reach beyond explicit policy.

Duplicate-screen: AI/low-code composition, aggregate authority and graph-reachability qualification families.

## 9. Result and saturation disposition

After duplicate-screen against all 124 existing ConflictPatterns:

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- new preventive invariant candidates: **0**.

Inventory remains **284 edge scenarios + 124 ConflictPatterns = 408 material findings**. HIGH/CRITICAL without owner/proof/detection route remains **0**.

Extension / Plugin / Marketplace Architecture remains capped at **streak 2**. `Extension/Plugin × authority × provider trust × lifecycle` remains capped at **streak 2**. This revisit advances Full Pass 8 from **9/28 to 10/28 capabilities** and mandatory-cluster coverage from **9/12 to 10/12**. Completed full passes remain **7**, so the minimum-pass gate remains unmet until Full Pass 8 finishes all 28 capabilities. Negative-space remains `NOT_STARTED`; saturation remains `NOT_SATURATED`; Planning C remains blocked.

## 10. Carry-forward obligations

Planning C must eventually decide extension semantic ownership, host/API contract boundaries, publisher/trust/admission model, invocation-time authority qualification, provider scope isolation, tenant/site boundaries, Extension versus Provider mechanics, and whether any bounded Physical/Peripheral integration family deserves explicit canonical ownership. Physical actuation remains an exceptional NON-GOAL unless separately justified.

Planning D must address extension/provider revision coexistence, local/offline residual cohorts, deactivate/uninstall quiescence, provider migration, Brownfield hidden adapters and staged migration without big-bang assumptions.

Planning E must require proofs for transitive dependency/trust closure, host/API compatibility, admission versus invocation currentness, disable/uninstall residual effects, provider-scope non-amplification, tenant/site isolation, queue/resource bounds, Brownfield extension inventory/reconciliation, local-versus-Fleet convergence evidence and AI/low-code aggregate authority. For Physical/Peripheral connectors, require provisioning/revoke/drift/reconciliation, camera/access isolation, read/event currentness, provider outage behavior and no accidental expansion into specialized control software.

Architecture Reconciliation must compare tightly sandboxed extension systems, trusted in-process plugins, provider adapters, declarative extension schemas and hybrid models without assuming one universal mechanism.

These are research carry-forwards, not implementation authorization.

## 11. Next bounded focus

Continue Full Pass 8 with **Commercial Metering / Entitlements / Rating / Billing / Payment** and explicitly exercise `Commercial Metering × Entitlements × Rating × Billing × Payment`.

Carry temporal/provenance/decision/units/uncertainty/vector/queue/revision/causal, Typed Semantic Graph/Federation, Legacy Mirroring, Physical/Peripheral integration-plane, Elicitation/Operability, Autonomous Builds/Fleet and AI/low-code lenses into usage identity, entitlement-versus-authorization, late/corrected/imported historical usage, rating revision pinning, rerating/credits/refunds/chargebacks, currency/unit/rounding, settlement divergence, provider billing evidence, residual cohorts, monetary `PARTIAL/UNKNOWN`, source-of-truth movement and proof claims. Duplicate-screen all 124 ConflictPatterns. Commercial and paired-cluster streaks are already capped at 2; do not inflate without material novelty. Do not enter Planning C.