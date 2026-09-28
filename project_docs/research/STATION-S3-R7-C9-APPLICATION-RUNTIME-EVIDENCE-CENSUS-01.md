# Station S3 — R7 C9 Application Runtime Evidence Census 01

Date: 2026-09-28
Status: RESEARCH EVIDENCE — NON-AUTHORITATIVE
Branch: `station-s3-r7-studio-readiness`

## Purpose

Blocker-first repository census for C9 Application before C10 promotion or synthesis. This artifact separates executable evidence already present in Station from C9/C10 hypotheses that remain unproven. It does not create product/Core authority.

## Fresh-plan reconciliation

Fresh main introduced the bounded R7B engineering workbench/product-factory benchmark and Decision Graph synthesis requirement after the R7 branch was created. R7 therefore carries those requirements forward: R7 handoff is not synthesis eligibility by itself; R7B must challenge the grammar before synthesis.

## Existing C9-shaped runtime evidence

`packages/station-app-runtime/types.ts` already defines provider-neutral `ToolManifest`, `AppManifest`, `LaunchPolicy` and `AppLaunch`. `AppManifest` owns presentation/application declaration fields (`id`, `name`, `description`, semantic `icon`, launch policy, window definitions, command ids and tool manifests). It does not declare business permissions, deployment truth or Core authority.

`packages/station-app-runtime/validation.ts` normalizes manifests fail-closed: unknown fields are rejected; app identity must be non-empty; windows must belong to the owning app via `appRef`; duplicate window/tool ids are rejected; launch policy is bounded; semantic icon tokens are validated. This is concrete evidence for a narrow existing application assembly/configuration boundary.

`tests/product/station-app-runtime.test.ts` supplies executable evidence for several C9-adjacent obligations:

- stable app identity is distinct from display name;
- duplicate app identity is rejected deterministically;
- unsupported authority-shaped manifest fields such as `capabilityAuthority` and `deploymentState` are rejected;
- window definitions must remain scoped to owning app identity;
- launch projects manifests into provider-neutral `WindowDefinition`s without deployment/capability authority;
- tools are discoverable without permissions/authority fields;
- `MULTI_INSTANCE` changes launch behavior without changing manifest/app identity.

These proofs are real but narrow. They prove the current station-app-runtime contract, not the entire proposed C9 grammar.

## Coverage classification

| C9 obligation | Evidence | Status | Interpretation |
|---|---|---|---|
| app identity distinct from display presentation | product test | proven | narrow current runtime contract |
| duplicate app identity fail-closed | product test | proven | registry-level identity invariant |
| authority-shaped manifest fields rejected | product test + validator | proven | Station manifest does not acquire business authority |
| window ownership by appRef | validator + product test | proven | application/window reference integrity |
| provider-neutral launch projection | product test | proven | launch remains presentation/runtime projection |
| launch policy independent of app identity | product test | proven | behavior/configuration != identity |
| tool contribution discovery without authority | product test | proven | current manifest surface only |
| unknown/incompatible C8 Tool-role contract rejection | no C8 role compatibility runtime evidence found here | unproven-gap | current `ToolManifest` validates shape, not C8 semantic compatibility |
| deterministic artifact/context entry routing | no adequate evidence found | unproven-gap | launch by appRef is not artifact/context routing proof |
| lifecycle/restoration currentness | no adequate evidence found | unproven-gap | window launch is not stale/currentness revalidation |
| contribution isolation against command/registry bypass | partial shape evidence only | unproven-gap | absence of authority fields is insufficient to prove isolation |
| `AppManifest != ComponentRegistry` end-to-end | architectural separation + narrow tests | unproven-gap | needs explicit proof that manifest resolution cannot create component species/authority |
| save/reopen/readback/version semantics | no adequate evidence found | unproven-gap | do not infer from runtime registry |

No missing entry is PASS.

## Proof inheritance and smallest C9 deltas

C9 may inherit C8 Tool identity, participant contracts, active-context routing and restoration semantics only after those C8 obligations themselves are proven under unchanged preconditions. Current executable app-runtime evidence can be reused directly for app identity, manifest shape, app/window ownership and authority-shaped-field rejection.

Future Construction should add only the smallest missing C9 proofs:

1. manifest references known compatible Tool/contribution identities and rejects incompatible references before activation;
2. artifact/context entry resolves deterministically without creating canonical artifact authority in Station;
3. reopen/restoration restores presentation/configuration but revalidates current artifact/business context with the owner;
4. contribution activation cannot bypass command/capability registries or authority owners;
5. manifest resolution cannot register a new component species or mutate `ComponentRegistry`;
6. if save/readback/version is admitted, stale revision handling is explicit and last-write-wins is not silently assumed.

## C10 consequence

The census weakens any argument that C10 Studio is needed merely because Station already has applications, tools, windows or multi-instance launch. Existing evidence demonstrates a bounded application runtime/configuration boundary. C10 still requires a genuinely new reusable invariant: cooperating Tools around one shared work-context/artifact projection with cross-Tool consequence/navigation semantics that cannot be represented by C9 configuration alone.

Therefore `Studio = rich AppManifest`, `Studio = saved workspace`, and `Studio = array<Tool>` remain rejected hypotheses.

## Grammar Sufficiency pressure

The five representative systems — document approval, ticketing, CRUD, operational dashboard and deployment configuration — should first be expressed through the same C0→C9 grammar by varying manifests, Tool participants, command/capability bindings and canonical artifact projections. A domain-specific Application class is not justified by name alone. Any failure must be recorded as a concrete grammar gap before proposing a new abstraction.

Status remains `candidate sufficiency / unproven-gap`: current app-runtime tests prove useful C9-adjacent invariants but do not yet prove cross-domain sufficiency, artifact/currentness routing, restoration or contribution isolation.

## Next blocker-first work

1. Continue the mandatory Core Contract Reuse & Station Projection Census for artifact/process identity+revision/currentness, command/capability target/conditions, result/evidence states, lifecycle/save/readback/version, consequence/reconciliation and Gateway/SDK boundaries.
2. Build the C9/C10 Journey + Exit/Proof Matrix with explicit inherited/delta proofs.
3. Reconcile R7 findings against the five Grammar Sufficiency cases.
4. Complete R7 handoff without constructing a Studio.
5. Execute the newly authoritative R7B engineering workbench/product-factory benchmark before synthesis.
6. Only after R7B + synthesis may Construction materialization be considered, with intermediate Test Review/Hardening and final QA Coverage/Evidence Review planned explicitly.
