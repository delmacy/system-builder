# Deep Research — Historical Interpretation Closure / Revision Retention 01

Status: DEEP RESEARCH / RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

## Question

For workflows/processes that may remain active or auditable for months or years, what **minimum portable interpretation closure** must the System Builder retain so that historical evidence and in-flight runs remain semantically interpretable after workflow definitions, capability-operation contracts, schemas, authorization policies, trust material, validators, provider adapters or concrete providers have been retired?

The closure must satisfy two constraints that pull in opposite directions:

1. **historical interpretability/autonomy** — the client runtime or later auditor must be able to determine what a historical fact meant, which rules produced it and whether it still qualifies a current requirement without requiring the Builder control plane or a retired provider to be online;
2. **bounded retention/operational simplicity** — the system must not need to preserve every old provider service, complete executable infrastructure stack, runtime binary, mutable database snapshot or vendor control plane forever.

This question follows directly from `DEEP_RESEARCH_LONG_LIVED_GATE_CRITERIA_EVOLUTION_01.md`: if evolution changes qualification rather than history, the architecture must retain enough representation and validation information to interpret that history later.

## Why this is architecturally material

Generation 2 increasingly relies on revision-qualified evidence, typed identity, cumulative context, in-flight workflow pinning, provider substitution and qualified local closure. Those ideas fail if an old evidence record eventually becomes only an opaque identifier whose referenced semantics no longer exist.

Example:

```text
2026:
  Purchase saga P17
  workflow definition W7
  operation Purchase.Approve@3
  Gate policy G4
  authorization model A10
  schema S12
  provider binding PB6
  adapter interpretation AD4
  validator profile V8
  decision evidence E900

2031:
  W7 no longer deployed
  provider PB6 vendor exited
  AD4 is retired
  A10 is not current
  schema is S31
  current Gate policy is G19

Question:
  Can E900 still be interpreted as the historical decision it was?
  Can an in-flight/archived run be replayed, audited or migrated without
  pretending that today's semantics were the semantics of 2026?
```

A digest proves bytes; an event history records occurrence; a provider ID names a realization; a decision log may name the policy revision. None of those alone proves that a future verifier still possesses the **meaning/representation information** required to interpret the evidence.

The question affects Lifecycle / Versioning / Evolution / Migration, Workflow & Durable Execution, Artifact / Release / SBOM / Provenance, Governance / Compliance / Audit, Authorization / Policy, Process & Application Modeling, Provider / Binding, Standards / Interoperability, Security / Trust, autonomous runtime, brownfield integration and every candidate that depends on evidence-compatible revision joins.

## SB corpus consumed

This deep research consumed the mandatory Generation 2 corpus as input hypotheses/evidence inventory, not as independent external proof:

- `RESEARCH_PIPELINE_STATE.json`: phase is `RESEARCH_ELICITATION`; five full cycles remain complete; deep research must not advance breadth rotation, cycles or saturation.
- `RESEARCH_EVIDENCE_METHOD.md`: requires triangulation across production systems, standards, scientific literature and engineering evidence and explicitly preserves divergence.
- `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: requires version/migration/coexistence, offline/autonomous closure, evidence, determinism/reproducibility, rollback and provider-substitution proofs; an architectural claim is incomplete without a falsification path.
- `CAPABILITY_DISCOVERY_REGISTER.md`: current consolidation candidates include typed identity continuity, evidence-compatibility proof joins, trust/evidence-horizon-qualified local closure and preserve/interpret/validate/realize/actuate layering.
- `FINDING_INDEX.md`: UCA/PAM/UI/AGWS/WDE/Integration/Identity findings consistently distinguish revision vectors, evidence compatibility, interpretability from actuation, and local closure horizons; notably WDE requires replay-sensitive context to be captured and provider substitution to be compatibility-admitted rather than treated as deployment-only.
- `REPRESENTATIVE_COVERAGE.md`: breadth coverage already contains immutable policy-model revisions, decision logs, workflow migration/versioning and consistency/freshness representatives.
- `CAPABILITY_PROOF_MATRIX.md`: Lifecycle, Artifact/Release/Provenance, Governance/Audit, Standards and Workflow all retain explicit proof debt for historical revision, migration, provenance, retention and autonomy.
- `DEEP_RESEARCH_LONG_LIVED_GATE_CRITERIA_EVOLUTION_01.md`: establishes typed revision axes, historical interpretation versus current qualification and explicit migration.
- `DEEP_RESEARCH_COMPOSITE_SAGA_EFFECT_CLOSURE_01.md`: establishes revision-qualified effect obligations and evidence-derived Gate closure.
- `SEMANTIC_ASSEMBLY_LINE_PROCESS_MODEL.md`: longitudinal Gate progression depends on qualified evidence and revision continuity rather than provider/engine completion alone.

## External evidence ledger

### E1 — ISO 14721:2025 / OAIS long-term preservation model
Source:
- https://www.iso.org/standard/87471.html

OAIS defines long-term preservation as preservation across technological and knowledge-base change. Its key architectural contribution for this question is the idea that preserving a bitstream is insufficient: an information object needs **Representation Information** sufficient for a designated community to understand the preserved data, and that representation information can itself depend on a wider representation-information network.

**Evidence value:** strong standards evidence that long-term preservation is an **interpretation closure** problem, not just byte retention. The SB analogue is that an old evidence object may require its schema, semantic contract, policy/validator interpretation and provenance relations to remain intelligible even after the original runtime disappears.

**Limit:** OAIS does not define workflow/business semantics, current authorization or software execution. The SB must extract the preservation principle, not reproduce an archival-system object model.

### E2 — RFC 4998 Evidence Record Syntax and RFC 6283 XMLERS
Sources:
- https://www.rfc-editor.org/info/rfc4998/
- https://www.rfc-editor.org/info/rfc6283/

ERS/XMLERS address evidence that must remain trustworthy for long or undetermined periods. They explicitly account for cryptographic algorithms weakening, certificates expiring/revoking and the need to preserve validation material and renew evidence before old mechanisms cease to be trustworthy.

**Evidence value:** standards evidence that historical evidence validity has a lifecycle independent from the archived business object. A signature/hash stored once is not automatically a forever-valid proof. Long-term evidence may require preserved validation inputs plus renewal/anchoring lineage.

**Limit:** ERS proves existence/integrity/non-repudiation properties; it does not preserve business semantics or authorization-policy meaning.

### E3 — W3C PROV
Source:
- https://www.w3.org/TR/prov-dm/

PROV explicitly represents entities, activities, agents and version/specialization relations. A dated revision can be identified as a precise entity while still being related to the evolving conceptual object.

**Evidence value:** supports exact historical entity/revision identity and lineage without forcing the current version to overwrite the historical one.

**Limit:** provenance relations do not by themselves preserve an executable validator or explain domain-specific semantics. `wasGeneratedBy` is lineage, not interpretation closure.

### E4 — OCI content-addressable descriptors and manifests
Sources:
- https://specs.opencontainers.org/image-spec/
- https://specs.opencontainers.org/image-spec/descriptor/
- https://specs.opencontainers.org/image-spec/manifest/

OCI descriptors identify content by media type, digest and size. Retrieved bytes can be verified against their digest. OCI manifests can package non-container artifacts as typed, content-addressed objects.

**Evidence value:** strong provider-neutral precedent for preserving exact immutable representations by digest while allowing storage/registry implementations to change. SB semantic definitions, schemas, validators or adapter-interpretation packages can be **addressed by content** without making a particular registry canonical.

**Limit:** content addressability proves identity/integrity of bytes, not that the bytes remain semantically interpretable or safe to execute.

### E5 — SLSA Provenance
Source:
- https://slsa.dev/spec/v1.0/provenance

SLSA provenance identifies build outputs, build type, external parameters and resolved dependencies. The build type is intended to specify how to interpret parameters and initiate the build; dependencies can be pinned by immutable digest/commit.

**Evidence value:** mature precedent for a transitive input/interpretation closure around a produced artifact. It supports retaining **what produced this artifact and which exact inputs/definitions were resolved**, rather than retaining the original build service forever.

**Limit:** SLSA itself states dependency completeness may be best effort. Supply-chain provenance is not automatically sufficient for business evidence interpretation or deterministic rebuild.

### E6 — in-toto supply-chain metadata
Sources:
- https://in-toto.io/docs/getting-started/
- https://in-toto.io/docs/specs/

in-toto binds steps, authorized functionaries, materials/products and signed link metadata to a signed layout. Verification requires the layout, link evidence and owner verification keys; the framework records what was intended, who performed it and what artifacts crossed steps.

**Evidence value:** supports the principle that evidence verification requires both historical result metadata and the **historical rule/layout under which that metadata is meaningful**.

**Adversarial evidence:** the 2023 in-toto audit documents replay/metadata-scope limitations, demonstrating that signed historical metadata still needs explicit freshness/anti-replay context and carefully defined verification scope.

### E7 — OpenFGA immutable authorization models
Source:
- https://openfga.dev/docs/getting-started/immutable-models

OpenFGA models are immutable and versioned with authorization-model IDs; production guidance recommends explicitly passing the exact model ID. Older models can be listed/paginated and targeted independently from the latest model.

**Evidence value:** strong production support for preserving exact policy-model interpretation separately from mutable relationship state/current authority.

**Limit:** retaining the authorization model does not retain the historical tuple/relationship snapshot or prove current authority. Policy syntax/model and policy data/freshness remain separate axes.

### E8 — OPA decision logs
Source:
- https://www.openpolicyagent.org/docs/management-decision-logs

OPA decision logs can include bundle revision metadata, decision ID, path, input and result.

**Evidence value:** strong production support for evidence that identifies the exact policy bundle revision used for a historical decision.

**Limit:** a revision string in a log is useful only if the corresponding policy/data bundle or another sufficient representation remains retrievable. Decision log metadata alone is a pointer, not full interpretation closure.

### E9 — durable workflow replay/versioning (Temporal / previous deep research corpus)
Source family:
- https://docs.temporal.io/

Temporal's deterministic replay model demonstrates that workflow event history is interpreted by compatible workflow code. Worker/versioning mechanisms exist specifically because history alone is not self-executing semantics.

**Evidence value:** strong production support for separating **history retention** from **interpreter/code compatibility retention**.

**Limit:** retaining every historic worker binary forever is neither required nor necessarily desirable; compatible code/upcasters/migration can replace old executors if compatibility is proven.

## Competing models

### Model A — Retain only historical evidence/event payloads

```text
retain:
  event/evidence JSON
  timestamp
  provider ID
```

**Strength:** minimal storage and operational cost.

**Failure:** becomes opaque when schema, operation meaning, policy vocabulary, provider mapping or validator changes. A hash of an object whose interpretation has vanished preserves bytes, not meaning.

**Disposition:** `DO_NOT_BUILD` as long-term closure.

### Model B — Retain evidence plus revision IDs/pointers

```text
Evidence
  → workflowRevision = W7
  → policyRevision = A10
  → schemaRevision = S12
```

**Strength:** strong traceability while revision repositories remain intact.

**Failure:** reference rot. A revision ID that no longer resolves is not self-sufficient; a provider's ID may cease to exist; a mutable URL may return different semantics.

**Disposition:** `KEEP` revision identity but `GENERALIZE` references to verifiable retained content/representation closure.

### Model C — Freeze complete old runtime/provider infrastructure forever

Preserve VM/container/database/provider control plane for every historical revision.

**Strength:** maximum environment fidelity in principle.

**Failure:** economically/operationally unbounded; cloud/provider services may disappear; old infrastructure accumulates vulnerabilities; credential/trust material expires; hardware/platform dependencies become unavailable. It confuses historical interpretation with live actuation.

**Disposition:** `DO_NOT_BUILD` as universal retention policy. Full environment snapshots may be specialized evidence for regulated/high-assurance cases.

### Model D — Retain exact semantic artifacts + representation/validation closure; retain executors only when interpretation genuinely requires them

```text
HistoricalEvidence
  → exact semantic-definition artifact(s)
  → schemas/type contracts
  → policy/decision interpretation artifact(s)
  → validator/conformance profile
  → provider-normalization/adapter interpretation needed to decode historical provider evidence
  → provenance + revision vector
  → trust/verification material appropriate to historical validation
  → integrity/content-address identities
  → migration/upcast transforms where later interpretation depends on them
```

The closure preserves **meaning and verifiability**, not necessarily the old serving infrastructure. Executable/runtime material is retained only when no declarative/portable representation can reproduce the required interpretation.

**Disposition:** strongest model; `KEEP/GENERALIZE` as research recommendation.

### Model E — Continuously transform old evidence into latest schema and discard the old representation

**Strength:** one current interpretation format.

**Failure:** destroys ability to prove what was originally asserted; transform bugs or changed semantics become retroactive history rewrites; future audits cannot distinguish original evidence from migrated projection.

**Disposition:** `DO_NOT_BUILD` for canonical history. Latest normalized projections may coexist with immutable originals and transformation provenance.

## Strongest conclusion

> **Historical evidence is durably interpretable only when the system preserves a verifiable closure of the representation information required to understand and validate that evidence under its historical semantics. Retaining bytes, event history or revision IDs alone is insufficient; retaining the original provider/runtime forever is unnecessary when the semantics and validation dependencies can be preserved portably.**

This suggests a Generation 2 distinction between:

```text
PRESERVATION IDENTITY
  exact immutable bytes/artifact identity

INTERPRETATION CLOSURE
  semantic definitions + schemas + rule/validator meaning required to understand them

VALIDATION CLOSURE
  evidence/trust/verification material required to establish historical claims

REALIZATION CLOSURE
  executable/provider machinery required only when interpretation/validation cannot be reproduced otherwise

ACTUATION CLOSURE
  current authority/trust/provider state needed to perform new effects
```

The last two must not be conflated. Historical interpretation may remain available after actuation against the old provider is permanently impossible.

## Candidate portable `HistoricalInterpretationClosure`

Exact IR names are deferred, but the minimum logical closure for an evidence class should be derivable from its dependencies rather than one global archive bundle.

Candidate logical shape:

```text
HistoricalInterpretationClosure {
  subjectEvidenceIdentity
  historicalRevisionVector

  semanticArtifacts[] {
    kind
    semanticIdentity
    revision
    mediaType/schemaType
    contentDigest
    retrievalHints[]       // non-canonical
  }

  representationDependencies[] {
    schema / vocabulary / operation contract / workflow definition /
    Gate requirement / policy model / mapping specification
  }

  validationDependencies[] {
    validator profile / conformance rules / signature validation material /
    trust epoch evidence / evidence-policy version
  }

  interpretationTransforms[] {
    upcaster / migration / normalization mapping identity
    sourceRevision
    targetRevision
    contentDigest
    proof/status
  }

  providerEvidenceAdapters[] {
    provider evidence format/profile revision
    canonical normalization/interpretation revision
  }

  provenance {
    producer
    producedAt
    source identities
    build/release provenance as applicable
  }

  retentionProfile
  closureEvidence
}
```

This is a conceptual decomposition, not a proposed final schema.

## What must be retained versus what may be retired

### Retain by default when referenced by durable evidence

1. **Exact historical semantic definition or a content-verifiable equivalent**
   - workflow/process definition revision;
   - capability-operation contract revision;
   - Gate/effect-obligation policy revision;
   - domain schema/vocabulary required to decode values.

2. **Exact interpretation rules needed to map stored evidence to semantic meaning**
   - provider normalization mapping when provider-native receipts are part of evidence;
   - policy model/bundle representation used for a recorded decision;
   - semantic version/profile of serializers/encodings where interpretation is not self-describing.

3. **Validator/conformance rule identity and enough material to reproduce the historical validation claim**
   - validator rule set/profile;
   - evidence-policy version;
   - schema validation semantics when version-specific.

4. **Integrity/provenance closure**
   - digest/content identity;
   - provenance connecting semantic artifact, release/build input and evidence producer;
   - signatures/attestations where claims depend on them.

5. **Trust-validation material where historical cryptographic verification requires it**
   - relevant certificate/trust-chain/OCSP/CRL/timestamp evidence or equivalent long-term evidence-record material;
   - do not confuse this with preserving an expired credential for future actuation.

6. **Migration/upcast transformation lineage when a current interpreter consumes transformed historical data**
   - immutable original remains available;
   - exact transform revision and output identity are evidence;
   - transformation does not erase original semantics.

### Retain only when required by the semantic profile

- historic workflow executable/worker binary when deterministic interpretation cannot be reproduced by a declared compatible interpreter;
- provider adapter executable when provider-native evidence cannot be represented declaratively;
- environment/runtime image when validation depends materially on exact execution behavior;
- database snapshots when a claim depends on historical mutable state that was not otherwise captured as an exact snapshot/evidence set.

These should be explicit high-assurance or migration profiles, not universal ceremony.

### May normally be retired

- old live provider service/control plane, once all required evidence and normalization semantics are preserved and no in-flight actuation depends on it;
- mutable aliases/tags when immutable digests/revisions are retained;
- old Builder control-plane availability;
- obsolete UI/editor representations that are not required to interpret canonical semantics/evidence;
- old credentials/secrets used only for actuation, provided historical validation evidence is preserved separately.

## Transitive closure, not flat retention

OAIS's representation-information insight is particularly important: an archived semantic artifact may itself depend on another artifact to be understandable.

Example:

```text
Evidence E900
  → operation contract Purchase.Approve@3
      → schema PurchaseDecision@12
          → Money@4
  → Gate G4
      → evidence policy EP7
  → authorization decision D41
      → OpenFGA model A10
      → historical relationship snapshot/reference R55
  → provider receipt PR8
      → normalization mapping StripeSettlementProfile@6
```

The system therefore needs a dependency graph/closure, not a magic `archive=true` bit.

Candidate invariant:

> **Any durable evidence object must either carry self-describing semantics sufficient for its declared retention horizon or reference a recursively preservable, integrity-verifiable interpretation dependency closure.**

## Referential identity must resist repository/provider disappearance

A human-readable ID or provider URL may remain useful discovery metadata, but long-lived closure needs immutable/verifiable identity.

Recommended research direction:

```text
semantic identity/revision
  + content digest
  + media/type/profile identity
  + non-canonical retrieval hints
```

This follows OCI/SLSA-style separation between logical references and exact resolved content.

The architecture should be able to move historical semantic artifacts from GitHub to object storage, registry A to registry B or online service to offline archive without changing the historical evidence identity.

## A historical validator is not automatically current authority

One key adversarial boundary from the prior deep research remains:

```text
Historical validation:
  "Decision D41 was valid under A10/R55 at T1"

Current actuation qualification:
  "May D41 authorize crossing Gate G19 at T2?"
```

The closure may prove the first statement forever while the second becomes `NO` or `INCONCLUSIVE` because authority/trust/current Gate requirements changed.

Candidate invariant:

> **Preservation of historical interpretability must never preserve or resurrect actuation authority.**

This is especially important for offline Station archives, replay tools and AI/AGWS inspection surfaces.

## Provider-specific versus portable semantics

### Portable SB-owned semantics

The SB should own:

- semantic identity/revision of workflows, operations, Gates and evidence obligations;
- interpretation-dependency graph;
- integrity-verifiable references/content identities;
- distinction among preservation, interpretation, validation, realization and actuation closure;
- compatibility/migration/upcast lineage;
- provider-normalized evidence contract and historical adapter/profile identity;
- retention/withdrawal state and evidence that closure remains sufficient.

### Provider-specific mechanics

Providers may supply:

- workflow history storage/replay mechanics;
- policy-model persistence;
- registry/blob storage;
- timestamp/archive services;
- signature validation services;
- provider-native receipts/event schemas;
- adapter executables/toolchains.

These mechanics are providerized. A provider's proprietary revision ID, container tag, workflow run ID or log format must not be the sole surviving interpretation anchor.

## Retention classes should be obligation-driven

Not every artifact deserves indefinite retention. The retention horizon should follow the longest-lived obligation that depends on the artifact.

Illustrative profiles:

```text
EPHEMERAL
  no durable evidence depends on representation after run closure

RUN_LIFETIME
  retain until all in-flight executions and rollback windows close

AUDIT_HORIZON
  retain through business/regulatory evidence horizon

LONG_TERM_VERIFIABLE
  preserve interpretation + validation closure and cryptographic renewal as needed

PERMANENT/ARCHIVAL
  explicit exceptional policy, not default
```

Names are not frozen.

Deletion/withdrawal must therefore be dependency-aware:

> An artifact cannot be garbage-collected merely because it is not the latest version; it is removable only when no retained evidence/in-flight run/rollback/legal obligation depends on its interpretation or when an explicitly proven replacement closure exists.

## Replacement closure instead of eternal executable retention

A major cost-control result is that interpretation dependencies may be **superseded by a proven equivalent interpreter/transform**, provided evidence remains explicit.

Example:

```text
Old validator V3 runtime is retired.

Before retirement:
  prove V9 can validate V3-format historical artifacts
  against a retained conformance corpus / property set;
  retain V3 rule/spec artifact;
  retain compatibility proof CP17;
  retain V9 revision/content identity.

Then:
  old executable V3 may be retired
  while historical V3 semantics remain interpretable.
```

This is not semantic migration of the historical evidence. It is **interpreter substitution under conformance proof**.

Provider substitution should use the same pattern.

## Failure and adversarial analysis

### F1 — revision pointer resolves to latest after mutable tag reuse

Expected behavior: digest/revision mismatch rejects the object; mutable tag is not accepted as historical identity.

### F2 — historical schema deleted while event payload remains

Expected behavior: closure becomes explicitly `INCOMPLETE/INCONCLUSIVE`; audit must not guess using current schema.

### F3 — OPA/OpenFGA decision log retains revision ID but bundle/model is unavailable

Expected behavior: decision occurrence remains observable, but semantic revalidation/reinterpretation claim is downgraded; revision ID alone is insufficient closure.

### F4 — old provider disappears

If provider-native receipt + retained normalization profile is enough to establish the required historical claim, interpretation remains available. If the claim depends on querying mutable provider state that was never captured, the historical claim is `INCONCLUSIVE`; architecture must not fabricate closure retrospectively.

### F5 — validator executable has a critical vulnerability

Historical semantics must remain interpretable without requiring unsafe execution of vulnerable code. Prefer declarative rule artifacts, sandboxed interpreters, emulator/isolation or proven new-interpreter compatibility. Retention is not permission to execute arbitrary historic binaries.

### F6 — certificate used in 2026 expires in 2028

Expiry must not automatically erase the fact that a signature was valid when produced. Long-term verification depends on preserved validation/timestamp material and, for long horizons, renewal/anchoring before old cryptographic assurances become insufficient. Conversely, an expired credential must never authorize new actuation.

### F7 — transformation to latest schema loses a field

Immutable original remains the historical source. Transformed representation must retain transform revision and lineage and cannot overwrite the original evidence object.

### F8 — archive is restored offline

Interpretation succeeds only if the declared local closure includes all required representation/validation dependencies. Missing dependency propagates `INCONCLUSIVE`; no implicit Builder/network fetch or authority broadening.

### F9 — AI attempts to explain old evidence from current documentation

AI output is a non-authoritative interpretation proposal. Historical semantic claims require deterministic closure/validator evidence; model plausibility cannot fill missing archived semantics.

## Consequences for existing findings/candidates/hypotheses

### `G2-CAPABILITY-CANDIDATE-CAPABILITY-SUPPORT-LAYERING-PRESERVE-INTERPRET-VALIDATE-REALIZE-ACTUATE`

**Recommendation: KEEP + HARDEN.**

This deep research independently strengthens the separation. `Preserve` must mean more than keeping bytes; `Interpret` requires representation closure; `Validate` requires historical rule/trust evidence; `Realize` and `Actuate` may legitimately disappear while interpretation remains.

### Evidence-compatibility composite proof joins

**Recommendation: GENERALIZE.**

Evidence compatibility needs a new precondition: the exact interpretation/validation dependencies referenced by evidence must still be available and integrity-qualified. Two evidence items cannot form a conclusive proof merely because their revision IDs syntactically match if one side's semantics can no longer be reconstructed.

### Multi-axis revision vectors

**Recommendation: KEEP.**

Revision vectors become retention roots. Each axis referenced by durable evidence needs either retained exact semantic material or explicit proven interpretability by a compatible successor.

### Workflow & Durable Execution

**Recommendation: SPECIALIZE.**

Workflow history retention and workflow-definition/interpreter retention are distinct. Workflow owns run/history/replay requirements; Lifecycle/Artifact/Standards should own general preservation/retention/interpreter-substitution mechanics.

### Artifact / Release / SBOM / Provenance

**Recommendation: GENERALIZE.**

Content-addressed semantic/validator packages and provenance closure become a likely realization mechanism, but Artifact must not become owner of business semantics. It preserves exact bytes/attestations; semantic owners define what those artifacts mean.

### Governance / Compliance / Audit

**Recommendation: KEEP.**

Retention schedules and legal/audit horizons may determine how long closure is required, but Governance should not own workflow/schema/policy semantics. It declares retention obligation; semantic owners declare dependency closure.

### Provider/Binding

**Recommendation: HARDEN.**

Provider retirement needs a closure-extraction/admission rule. A provider is not safely removable from an in-flight/historical dependency graph until all required semantic evidence has portable replacements or an explicit residual `INCONCLUSIVE`/manual-dependency disposition exists.

### New top-level capability?

**Recommendation: DO_NOT_BUILD / DEFER promotion.**

No independent `Historical Interpretation` capability is justified yet. The concern appears cross-cutting across Lifecycle, Artifact/Provenance, Standards/Interop, Governance/Audit and semantic capability owners. Synthesis should first test whether a universal **retention/interpretation closure primitive** plus owner-specific dependencies is sufficient.

## Candidate dispositions

- `KEEP/HARDEN` — preserve/interpret/validate/realize/actuate support layering.
- `GENERALIZE` — revision-qualified evidence into explicit interpretation-dependency closure.
- `GENERALIZE` — artifact references into semantic identity + immutable content digest + media/profile identity + non-canonical retrieval hints.
- `KEEP` — immutable original evidence plus transformation lineage; never rewrite canonical history in place.
- `SPECIALIZE` — executable/environment retention only for evidence classes that cannot be interpreted from portable declarative closure.
- `PROVIDERIZE` — registry/archive/timestamp/workflow-history/policy-store implementations.
- `DO_NOT_BUILD` — forever retention of every old provider/runtime as the general solution.
- `DO_NOT_BUILD` — revision ID or mutable URL as sufficient long-term interpretation.
- `DO_NOT_BUILD` — archive/replay mechanisms that restore historical actuation authority.
- `DEFER` — exact final `HistoricalInterpretationClosure` IR shape to Capability Synthesis.

## Proof obligations

### DR-HIC-01 — deleted-schema negative proof
Retain an evidence payload and delete/unavailable its required historical schema. Historical semantic validation must become `INCONCLUSIVE`; current schema must not be silently substituted.

### DR-HIC-02 — content-address relocation proof
Move retained workflow/schema/policy artifacts between two materially different repositories/registries while preserving content digest and semantic identity. Historical evidence interpretation must remain unchanged.

### DR-HIC-03 — mutable-tag adversarial proof
Reuse a tag/alias for newer content. Historical evidence pinned to old digest must reject the new bytes even if human-readable tag matches.

### DR-HIC-04 — provider-retirement proof
Retire an external provider after capturing all declared provider-native evidence plus normalization profile. Historical business-effect evidence remains interpretable without provider availability; new actuation against that provider remains impossible.

### DR-HIC-05 — missing-provider-state negative proof
Provider disappears while one required historical postcondition was never captured and can only be queried from provider state. Result must remain `INCONCLUSIVE`; system must not infer success from transport ACK/history.

### DR-HIC-06 — policy-decision reconstruction proof
Historical authorization evidence names exact immutable policy-model/bundle revision and required relationship snapshot/freshness evidence. Reconstruct historical decision semantics while current authority has changed; reconstruction must not grant current authority.

### DR-HIC-07 — interpreter substitution proof
Replace retired validator/interpreter V3 with V9 using a conformance corpus/proof that V9 correctly interprets V3 artifacts for the declared profile. Retire V3 executable while preserving historical results and explicit compatibility evidence.

### DR-HIC-08 — incompatible interpreter negative proof
Introduce a successor interpreter that parses V3 syntax but changes one semantic rule. Compatibility admission must fail; syntax compatibility cannot authorize retirement of V3 closure.

### DR-HIC-09 — transform lineage proof
Upcast historical evidence from schema S3 to S8 for current querying. Preserve immutable S3 original, exact transform identity, transformed artifact digest and validation evidence. S8 projection cannot replace the canonical historical source.

### DR-HIC-10 — long-term crypto degradation proof
Simulate certificate expiry/revocation or deprecation of a digest/signature algorithm. Historical evidence remains verifiable only when required timestamp/validation/renewal material exists; otherwise its cryptographic assurance explicitly degrades.

### DR-HIC-11 — offline archive closure proof
Restore an autonomous client archive with Builder unavailable. Historical interpretation succeeds using declared local semantic/validation closure. Remove one required representation dependency and require `INCONCLUSIVE`, never hidden network fallback.

### DR-HIC-12 — retention-GC dependency proof
Attempt to garbage-collect an old workflow/schema/policy artifact still referenced by an active run, rollback window or retained evidence obligation. GC must refuse or require an explicitly proven substitute closure.

### DR-HIC-13 — closure-substitution proof
Before deleting old artifact A, prove retained artifact/interpreter B provides the exact required interpretation profile for all dependent evidence. Preserve substitution proof and lineage. Later audit must show why A's bytes/executor were no longer required.

### DR-HIC-14 — historical/current authority separation proof
Load a historically valid signed approval with complete old trust/policy closure after the actor's current authority has been revoked. Historical audit says the approval occurred/qualified at T1; privileged actuation at T2 is denied unless current Gate requirements independently qualify it.

### DR-HIC-15 — provider adapter evidence proof
Historical provider receipt is opaque without adapter profile AP4. Retain AP4's declarative normalization semantics or a proven compatible interpreter. Deleting AP4 without replacement makes the provider-derived semantic claim `INCONCLUSIVE`.

### DR-HIC-16 — malicious historical executable proof
A retained old executable is later classified vulnerable/untrusted. Audit/interpretation must not require unconstrained execution. Sandbox/emulation/declarative replacement or explicit inability to re-execute is acceptable; retention cannot create new actuation/tool authority.

## Falsification paths for the main recommendations

The interpretation-closure recommendation should be weakened or rejected if evidence demonstrates that:

1. durable business evidence can remain unambiguously interpretable after semantic/schema/policy definitions disappear, across materially different domains, without relying on undocumented external knowledge;
2. content identity + representation dependency closure cannot practically survive repository/provider substitution;
3. a universal exact-runtime snapshot is demonstrably cheaper/safer/more portable than semantic closure across both simple and mature systems;
4. interpreter-substitution conformance cannot provide a useful bounded proof and historic executables must always be retained for correctness.

Current evidence points in the opposite direction, but these remain explicit falsification paths.

## Unresolved questions

1. Which semantic artifacts should be embedded directly in release/evidence packages versus referenced through a content-addressed archive?
2. What is the minimal portable conformance proof for interpreter/validator substitution across years?
3. Which evidence classes require historical mutable-data snapshots versus independently materialized decision/effect evidence?
4. How should privacy/right-to-erasure obligations interact with provenance/retention dependency closure?
5. How are encryption-key retirement and cryptographic erasure represented when retained evidence still needs semantic interpretation?
6. Should retention roots be calculated from active runs, legal/audit policies, rollback eligibility and release lineage by one generic dependency-closure service or by capability owners?
7. How should very long-lived workflow histories be compacted without destroying evidence necessary for semantic replay/migration?
8. What standardized packaging profile, if any, best expresses SB semantic artifacts, validators and evidence dependencies without coupling to OCI?
9. At what assurance level does retaining declarative semantics cease to be enough and require virtualized/emulated execution environment preservation?
10. Which historical evidence should be human-readable decades later versus only machine-verifiable through retained specifications/interpreters?

## Confidence

**High** confidence in these conclusions:

- bytes/event history/revision IDs alone are insufficient for long-term semantic interpretability;
- historical interpretation and current actuation authority must remain separate;
- immutable/content-verifiable semantic artifacts plus dependency/provenance closure are more portable than retaining original live providers;
- cryptographic evidence has its own long-term validation/renewal lifecycle;
- original evidence should not be destructively rewritten into latest semantics.

**Medium** confidence in:

- a general cross-capability `HistoricalInterpretationClosure`/interpretation-dependency graph as the right universal primitive shape;
- interpreter substitution under conformance proof as sufficient for most retired executable dependencies.

**Low / intentionally unresolved** confidence in:

- exact packaging/storage format;
- default retention horizons;
- when full executable environment preservation becomes mandatory;
- exact ownership split among Lifecycle, Artifact/Provenance, Standards/Interop and Governance/Audit.

## Research recommendation

Generation 2 synthesis should treat **historical interpretability as a closure property**, not a storage property.

Candidate constitutional statement:

> **Every durable semantic evidence object must remain connected to an integrity-verifiable interpretation and validation closure sufficient for its declared retention horizon. The closure may outlive and replace its original provider/runtime realization, but it must not recreate historical actuation authority or silently reinterpret history under current semantics.**

This strengthens the System Builder's autonomous-runtime and provider-leverage goals: the SB owns semantic meaning, revision/closure requirements and evidence; mature storage, workflow, policy, archive and timestamp mechanics can remain delegated to providers.

## Recommended next deep question

**Privacy/Erasure vs Immutable Provenance & Historical Interpretation Closure**: when regulations or business policy require deletion/anonymization of personal or confidential data, how can the SB preserve audit/provenance/semantic closure without retaining forbidden subject data indefinitely or destroying evidence needed to prove past authorized actions? This is likely to stress-test the new closure model across Governance/Audit, Identity, Data, Storage, cryptographic erasure, AGWS/Station authority and runtime autonomy.