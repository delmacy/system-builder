# Generation 2 — Planning E E4 Build / Artifact / Deployment / Lifecycle / Extension Proofs

Status: **DECIDED / PASS FOR E4**  
Phase: `PLANNING_E_PRODUCT_PROOF_ACCEPTANCE`  
Decision: `E4`  
Scope: proof/acceptance architecture only. No product code, test execution, remediation, Architecture Reconciliation phase execution, WBS, Work Packages, executive TASKs or Construction.

## 1. Authority and decision question

`RESEARCH_PIPELINE_STATE.json` authorizes only E4. E0–E3 are CLOSED/PASS; Planning C and D remain CLOSED/PASS; adversarial research remains CLOSED/SATURATED/PASS with 284 edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings.

Constitutional distinctions remain binding:

- `Research != remediation`; `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`;
- `claim != evidence != proof decision`;
- `declared dependency != resolved dependency != fetched material`;
- `build success != reproducible build`;
- `build output != canonical artifact != release != deployment != effective runtime`;
- `SBOM/provenance/signature present != complete/current/trusted/admitted`;
- `release admitted != distributed != deployed != ready != serving/effective`;
- `installed extension != admitted != authorized != effective`;
- `desired != accepted != observed != effective != converged`;
- `rollback artifact retained != rollback currently eligible != rollback converged`;
- `Fleet aggregate != Station/local truth`; and
- `AI proposal != owner authority`.

E4 answers: **what evidence and acceptance obligations prove the Generation 2 build-to-runtime supply path and extension lifecycle without collapsing identities, hiding residual cohorts, overstating reproducibility, treating provider acknowledgement as convergence, or allowing extensions to amplify authority?**

## 2. Decision

E4 adopts a **material-closure-first, immutable-identity, revision-vector-qualified, cohort-aware Product Proof Matrix** spanning Build / Dependency Graph / Reproducibility, Artifact / Supply Chain / Provenance, Deployment / Release / Runtime Lifecycle, Lifecycle / Evolution / Compatibility, and Extension / Plugin / Marketplace Architecture.

No single CI result, signature, registry publication, deployment health status, marketplace listing or aggregate rollout score can satisfy the matrix. Proof is subject-, revision-, population-, provider-, environment- and currentness-qualified under E0.

## 3. Proof matrix A — build and material closure

Mandatory proof obligations:

| Proof | Claim | Required evidence | Mandatory negative/adversarial route | Reopen condition |
|---|---|---|---|---|
| `E4-BLD-01` | declared dependency intent resolves to an explicit qualified material closure for the target profile | manifests/constraints, resolver output, transitive graph, integrity/currentness, conditional-edge evidence | undeclared ambient dependency; platform-conditional edge omitted | resolver/material/toolchain/target revision changes |
| `E4-BLD-02` | build attempt is bound to exact source/model, recipe, material, toolchain, runner and target revisions | attempt envelope, input digests, runner/environment qualification, provenance | mutable network input; locale/time/randomness/environment leakage | any input or qualification horizon changes |
| `E4-BLD-03` | reproducibility claim is valid only for its declared equivalence profile | repeated independent attempts, output comparison, controlled-impurity declaration, limitations | cache hit masquerading as reproducibility; same runner only | material/toolchain/runner/equivalence profile changes |
| `E4-BLD-04` | cache cannot strengthen build authority/currentness | cache key derivation, producing revisions, target scope, integrity/invalidation evidence | stale/cross-target/poisoned cache | cache algorithm, producer or target changes |
| `E4-BLD-05` | runner/provider substitution preserves only qualified semantics | support vector, shadow rebuilds, equivalence evidence, bounded cohort admission | provider feature-name equality assumed equivalent | provider/version/quota/policy/support vector changes |

`PASS` for reproducibility MUST name whether equality is bitwise or a weaker explicitly governed equivalence. Unknown historical ambient inputs remain `INCONCLUSIVE`; backfill must not invent provenance.

## 4. Proof matrix B — artifact, SBOM, provenance, signature and release admission

- `E4-ART-01`: prove `BuildOutputSet -> validation -> explicit canonical ArtifactRevision adoption`; registry/object-store existence is insufficient.
- `E4-ART-02`: prove immutable artifact identity independently of mutable tag/path/provider coordinate.
- `E4-ART-03`: prove SBOM coverage against an exact artifact/release subject, generator/profile revision, component population and known exclusions.
- `E4-ART-04`: prove provenance subject binding to source/material/build identities and producing revisions; provenance existence alone cannot PASS completeness.
- `E4-ART-05`: prove cryptographic validity separately from signer/attestor trust/currentness and separately again from release admission authority.
- `E4-ART-06`: prove trust rotation/revocation can reopen current admission while preserving historical signature validity.
- `E4-ART-07`: prove release composition references exact immutable artifact revisions and a qualified `RevisionVector` for schema/data, config/secrets, trust, policy, provider support, environment and evidence horizons.
- `E4-ART-08`: prove release admission is scoped/effective-dated and reopens on material vulnerability, trust, policy, compatibility or provider evidence changes.
- `E4-ART-09`: prove publication/distribution with `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN`; timeout cannot become NOT_APPLIED and `UNKNOWN -> reconcile-before-retry` unless exact duplicate safety is qualified.
- `E4-ART-10`: prove mirrors/replicas and consumer references converge before old distribution cohorts close.

Negative routes include mutable-tag substitution, incomplete SBOM presented as complete, valid signature by revoked/untrusted signer, stale admission cache, publication timeout followed by unsafe duplicate upload/promotion, and a residual registry still serving an old release.

## 5. Proof matrix C — deployment and effective runtime

E4 requires independent evidence for:

`release admitted -> deployment plan qualified -> desired generation -> provider actuation disposition -> observed generation -> readiness -> traffic serving -> consumer/service effectiveness`.

Proof obligations:

- `E4-DEP-01`: desired generation is revision-vector and cohort qualified.
- `E4-DEP-02`: provider acceptance/resource creation cannot prove readiness or effectiveness.
- `E4-DEP-03`: `RUNNING`, `READY`, `REACHABLE`, `SERVING` and `EFFECTIVE` remain distinguishable.
- `E4-DEP-04`: rollout strategy (rolling/blue-green/canary/partition/shadow) exposes cohort identity, population and local evidence.
- `E4-DEP-05`: aggregate health cannot mask a critical failing/unknown cohort.
- `E4-DEP-06`: old runtime generations capable of traffic, queue consumption, event emission, session handling or external effects remain residual cohorts until fenced/drained/dispositioned.
- `E4-DEP-07`: deployment external effects preserve `PARTIAL/UNKNOWN` and reconciliation semantics.
- `E4-DEP-08`: autonomous generated runtime remains operable inside its qualified local closure without live Builder dependency.
- `E4-DEP-09`: offline Station evidence carries observation/currentness horizons; reconnect requires reconciliation rather than latest-wins.
- `E4-DEP-10`: Fleet PASS is a projection over inspectable member evidence and cannot overwrite member-local truth.

## 6. Proof matrix D — lifecycle, compatibility and rollback truth

- `E4-LCY-01`: prove sparse `RevisionVector` semantics; explicit revision, `ABSENT`, `NOT_APPLICABLE` and `UNKNOWN` are distinct.
- `E4-LCY-02`: prove compatibility is directional and scope-qualified, including mixed-revision consumers/producers.
- `E4-LCY-03`: prove historical artifact/release/deployment evidence remains interpretable under its producing revision.
- `E4-LCY-04`: prove cutover does not transfer source-of-truth or authority implicitly.
- `E4-LCY-05`: prove rollback eligibility at time of use against schema/data, workflow/in-flight work, trust/config/secrets, policy/security/privacy, provider support, consumer compatibility and committed external effects.
- `E4-LCY-06`: prove rollback, roll-forward, provider routing reversal, domain compensation, state restore and manual reconciliation are not conflated.
- `E4-LCY-07`: prove lifecycle closure only after all materially effect-capable residual cohorts have terminal owner-qualified disposition and current evidence.
- `E4-LCY-08`: prove a new vulnerability/trust/policy/currentness fact can reopen a prior PASS without rewriting historical proof.

An available previous artifact is not rollback proof. An irreversible migration or external effect may require roll-forward/compensation/manual reconciliation.

## 7. Proof matrix E — Extension / Plugin / Marketplace

Extensions are treated as governed realizations, not trusted code merely because they are packaged or listed.

Mandatory obligations:

- `E4-EXT-01`: canonical extension identity/revision is independent of package, registry, marketplace, provider and runtime coordinates.
- `E4-EXT-02`: manifest/requested capabilities are declarations; prove separate admission, granted authority and effective reachability.
- `E4-EXT-03`: extension point compatibility is typed and revision-qualified; unknown/incompatible hooks fail closed or remain BLOCKED.
- `E4-EXT-04`: publisher identity/signature/provenance/SBOM evidence is separated from trust, semantic compatibility and admission.
- `E4-EXT-05`: marketplace listing/discovery does not grant trust, install authority or runtime authority.
- `E4-EXT-06`: requested capability cannot exceed owner-qualified grant; effective runtime authority cannot exceed grant even through provider/API indirection.
- `E4-EXT-07`: dependency/conflict graph exposes cycles, incompatible revisions and ambiguous ownership rather than resolving silently.
- `E4-EXT-08`: install/upgrade/disable/uninstall effects use `ExecutionEnvelope/State/Journal` and `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN` where external realization exists.
- `E4-EXT-09`: disable/revoke is not complete until residual workers, sessions, tokens, callbacks, cached code/config and provider resources capable of effect are fenced/drained/reconciled.
- `E4-EXT-10`: resource budgets and containment are evidenced under overload/abuse; extension exhaustion cannot silently starve mandatory control/reconciliation work.
- `E4-EXT-11`: provider substitution/coexistence proves semantic support vector and residual provider cohorts.
- `E4-EXT-12`: extension updates preserve data/schema/workflow/event compatibility and rollback/roll-forward qualification.
- `E4-EXT-13`: offline/local extension closure cannot amplify authority or outlive trust/config/currentness horizons.
- `E4-EXT-14`: Physical/Peripheral extensions remain inside the integration/governance plane; no plugin/marketplace route creates generic direct physical actuation authority.

Mandatory abuse/misuse cases include forged publisher metadata, valid signature but revoked trust, over-broad capability request, confused-deputy provider binding, stale permission cache, disabled plugin with surviving callback/token, extension dependency substitution, resource exhaustion, offline stale extension, and physical-device adapter attempting undeclared operation-class authority.

## 8. Supply-path residual cohorts and finite drainage

Every E4 acceptance subject must enumerate applicable residual populations: old build jobs/runners/toolchains; dependency/build caches; mutable tags; registry mirrors; old attestations/verification caches; old release pointers; runtime generations; sessions/connections/routes; migration jobs; stale config/secret/trust material; offline Stations; provider-side jobs/callbacks; extension workers/tokens/resources; manual build/deploy/plugin procedures.

Each material cohort requires owner, producing revision, effect/authority capability, population estimate or coverage statement, oldest age, currentness objective, fence/drain/revoke/reconcile route and closure evidence.

Queue/capacity proof must include arrival rate, service/drain rate, depth, oldest age, retry amplification, provider quota, concurrency/headroom and starvation risk where applicable. Means alone cannot prove finite drainage.

## 9. Elicitation & System Understanding proof lens

E4 carries the EKB model without making it a 29th capability. For Build/Artifact/Deployment/Lifecycle/Extension objects, adaptive questions must discover at least:

- authoritative source/model/material/release/runtime/extension owners;
- hidden build inputs, manual scripts, shadow registries and unofficial deployment/plugin procedures;
- target/platform/environment distinctions and compatibility assumptions;
- who may adopt artifacts, admit releases, deploy, rollback, grant extension authority and approve exceptions;
- expected evidence for reproducibility, provenance, trust, readiness, effectiveness and residual drainage;
- provider dependencies, quotas, offline behavior and recovery routes;
- negative-space cases such as emergency hotfixes, copied binaries, manual console changes, bypassed CI, shared signing credentials and local plugin installs.

Evidence retains source/respondent/owner, timestamp/effective period, confidence/status, supporting artifact and supersession lineage. `observed behavior != intended process != approved canonical process`; contradictions remain explicit.

Question occurrences retain provenance: triggering gap, applicable object/capability, blocked downstream artifacts and follow-up rules. Answers that semantically belong to Security, Authorization, Data, Workflow, Integration, Governance or another owner are linked/routed rather than duplicated.

Coverage uses `UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`, with no scalar quality score. Critical gaps include unknown release/deploy authority, ambiguous material source-of-truth, missing rollback/failure semantics, unqualified external effect, stale trust/signing evidence, hidden residual runtime/extension cohort and deployment/provider operation without `UNKNOWN` reconciliation semantics.

Sufficiency remains distinct for abstraction, candidate architecture, implementation and publish/operation. User Stories express intent/value/context; Use Cases preserve end-to-end actor interaction; Scenarios include happy/alternate/failure/boundary/abuse/recovery/offline/concurrency/version-change; Requirements/constraints and Acceptance Criteria/Product Proof remain traceable to evidence and semantic references.

## 10. Production Readiness Coverage for E4

No E4 subject is production-ready merely because feature proofs pass. Applicable readiness must be evaluated dimensionally across `OBSERVABILITY`, `OWNERSHIP`, `FAILURE_HANDLING`, `RECOVERY`, `CAPACITY`, `CURRENTNESS`, `SECURITY`, `RECONCILIATION`, `CHANGE_SAFETY`, `COST`, and `DOCUMENTATION`.

Mandatory examples include:

- ownership for release admission, deployment, rollback and extension grants;
- observable material/provenance/readiness/residual state;
- recovery for interrupted build/publication/deployment/extension lifecycle operations;
- capacity for build queues, artifact replication, rollout and residual drainage;
- currentness for trust, SBOM/vulnerability, provider support, config/secrets and local/Fleet evidence;
- reconciliation for `PARTIAL/UNKNOWN` provider effects and disconnected Stations;
- change safety for revision crossing and extension upgrades;
- cost evidence that cannot override safety/governance/readiness obligations.

An applicable HIGH/CRITICAL FAIL, BLOCKED unresolved conflict, or currentness failure prevents PASS regardless of aggregate reporting.

## 11. Planning E acceptance disposition

E4 is **PASS FOR PROOF ARCHITECTURE** when the matrices above are retained as required proof obligations for later implementation/testing and do not claim that the future product already satisfies them.

This decision creates no `ConflictInstance`, remediation or product change. The inherited 408 research findings remain proof inputs and constraints.

## 12. Carry-forward

The next Planning E decision must be read from fresh `RESEARCH_PIPELINE_STATE.json`; E4 itself does not authorize E5 by convention. If E5 is authorized, it must inherit E0–E4, the 408 adversarial findings, the Elicitation Knowledge Base boundaries, revision/currentness/population qualification, residual-cohort drainage, `UNKNOWN -> reconcile-before-retry`, local/Station/Fleet truth and the bounded Physical/Peripheral integration/governance plane.
