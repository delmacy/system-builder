# Generation 2 — Deep Research: Derived-Data Deletion & Machine-Unlearning Closure 01

Status: COMPLETE — RESEARCH RECOMMENDATION / NOT TARGET-ARCHITECTURE AUTHORITY

ID: `DR-DDMU-01`

## Research question

When personal/confidential source data has already influenced derived artifacts — aggregates, caches, search/vector indexes, embeddings, recommendation state, agent memory, features, checkpoints or trained model parameters — what portable semantics and evidence are sufficient for System Builder to claim that the required influence has been removed, and when must the result remain `INCONCLUSIVE`, without imposing universal full retraining for every disposition request?

This deep research asks exactly one architectural question: **what constitutes disposition closure over derived/influenced state?** It does not design a generic ML platform or promote Machine Unlearning as a capability by itself.

## Why this is architecturally material

`DEEP_RESEARCH_PRIVACY_ERASURE_PROVENANCE_01.md` established that immutable provenance must not mean immutable personal payload and that erasure is a multi-sink composite-effect problem. That result is incomplete if the source payload can be deleted while information derived from it remains searchable, recoverable or influential.

The residual uncertainty crosses several Generation-2 owners at once:

- Data / Schema / Migrations owns derived-data lifecycle/convergence concerns;
- Storage / Documents / Media already distinguishes `RenditionProjection / IndexProjection` from canonical content and warns that delete markers are not physical purge;
- AI-native Engineering / Agents / Approvals requires provenance, deterministic validation and provider-independent semantic authority;
- Governance / Compliance / Audit needs evidence that a disposition obligation was actually satisfied;
- Historical Interpretation Closure must preserve enough non-subject-bearing lineage to explain what happened without retaining forbidden payload;
- provider substitution and autonomous/offline runtime require the same claim to survive different realization mechanics.

A boolean `deleted=true` or `unlearned=true` would collapse fundamentally different correctness properties.

## Mandatory SB input corpus consumed

This research consumed the authoritative state/method corpus before source selection and re-read the state/head immediately before persistence:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — `phase=RESEARCH_ELICITATION`, five full cycles complete, cycle 6 active; deep research must not advance the breadth rotation.
- `RESEARCH_EVIDENCE_METHOD.md` and `ARCHITECTURE_PROOF_QUALITY_METHOD.md`.
- `CAPABILITY_DISCOVERY_REGISTER.md`, `FINDING_INDEX.md`, `REPRESENTATIVE_COVERAGE.md`, `CAPABILITY_PROOF_MATRIX.md`.
- `AI_NATIVE_ENGINEERING_AGENTS_APPROVALS_REVISIT_04.md` — exact candidate/approval provenance, independently enforced authority, replay/effect reconciliation and provider-substitution requalification.
- `DATA_SCHEMA_MIGRATIONS_REVISIT_05.md` — staged realization/convergence, typed identities, checkpoint/coverage evidence and `PARTIAL/INCONCLUSIVE` when mandatory axes are missing.
- `STORAGE_DOCUMENTS_MEDIA_REVISIT_05.md` — rendition/index derivative lineage, logical deletion versus physical purge, provider-local realization identity and governance-equivalent provider cutover.
- `EXECUTABLE_CAPABILITY_COMPOSITION_AND_CUMULATIVE_CONTEXT.md` — typed cumulative context, provenance, projections, PII visibility and non-provider semantic ownership.
- prior Deep Research artifacts, especially `DR-HIC-01` and `DR-PEIP-01`.

Breadth findings are treated here as hypotheses/input evidence, not as independent confirmation.

## External evidence ledger

### E1 — Ginart et al., NeurIPS 2019, *Making AI Forget You: Data Deletion in Machine Learning*

Primary conference evidence: https://neurips.cc/virtual/2019/poster/14514 and paper https://arxiv.org/abs/1907.05012

The paper defines data deletion relative to retraining without the deleted data and observes that for many standard learning algorithms complete removal otherwise requires retraining. It also demonstrates that algorithm design can make exact/efficient deletion practical for restricted model families such as k-means.

**Architectural extraction:** removal strength is a property of the learning algorithm and declared equivalence criterion, not a generic storage-delete operation. Efficient exact deletion can exist, so universal full retraining is too strong; universal cheap unlearning is equally unsupported.

### E2 — Guo et al., ICML 2020, *Certified Data Removal from Machine Learning Models*

Primary proceedings: https://proceedings.mlr.press/v119/guo20c.html

The authors define certified removal so that a post-removal model cannot be distinguished, under the stated guarantee, from a model that never observed the removed data, and construct such mechanisms for bounded model classes.

**Architectural extraction:** a strong portable target is **counterfactual/retrain equivalence under an explicit assurance definition**. The mechanism remains model/provider specific.

### E3 — Bourtoule et al., IEEE Symposium on Security & Privacy 2021, *Machine Unlearning*

Conference program / publication identity: https://www.ieee-security.org/TC/SP2021/program-papers.html ; DOI `10.1109/SP40001.2021.00019`.

SISA (Sharded, Isolated, Sliced, Aggregated) constrains influence during training so a deletion can retrain only affected partitions/slices rather than the whole model.

**Architectural extraction:** deletion cost can be designed into realization topology. A future SB profile may require deletion-aware training lineage, but SISA objects must not become universal primitives.

### E4 — Pawelczyk et al., ICLR 2025, *Machine Unlearning Fails to Remove Data Poisoning Attacks*

Primary conference page: https://proceedings.iclr.cc/paper_files/paper/2025/hash/7e810b2c75d69be186cadd2fe3febeab-Abstract-Conference.html

The study finds that several practical approximate-unlearning methods that look successful under some common evaluations fail to remove poisoning effects across models/attacks. It explicitly argues for broader evaluation to avoid false confidence.

**Architectural extraction:** passing one empirical audit — especially one membership-inference-style criterion — is not proof of general removal. Approximate unlearning must be named by its assurance/evaluation profile; otherwise closure is overstated.

### E5 — Google Research, 2026, *New framework for auditing machine unlearning*

Official research summary: https://research.google/blog/new-framework-for-auditing-machine-unlearning/

The work treats safe retraining as a reference distribution and highlights that different statistical tests detect different residual differences; no single empirical test dominates all cases.

**Architectural extraction:** empirical unlearning evidence is multi-test and threat-model scoped. Failure to detect residual influence is weaker than formal/certified equivalence.

### E6 — W3C PROV family

Normative vocabulary: https://www.w3.org/ns/prov and PROV-DM/PROV-O specifications.

`wasDerivedFrom` represents derivation from a pre-existing entity and invalidation represents cessation/destruction/expiry of an entity's availability.

**Architectural extraction:** a portable disposition model needs explicit derivation/influence lineage and invalidation/disposition events. W3C PROV is evidence for the semantic distinction, not a required SB wire format.

### E7 — Elasticsearch/Lucene deletion behavior

Current Elasticsearch force-merge documentation: https://www.elastic.co/docs/api/doc/elasticsearch/v9/operation/operation-indices-forcemerge-1 . Historical Lucene engineering explanation: https://www.elastic.co/blog/lucenes-handling-of-deleted-documents

Deleted/updated documents may first become tombstoned/soft-deleted; physical bytes are reclaimed later during segment merging. Terms/statistics can also remain until merge.

**Architectural extraction:** a provider `DELETE` can prove logical non-serving while not proving physical disappearance of derived index material. Required erasure semantics therefore need provider-specific residual-state evidence.

## Competing models

### Model A — Source-only deletion

`delete source → disposition complete`

**For:** simple, inexpensive and adequate when no derivative exists.

**Against:** falsified by indexes, embeddings, caches, aggregates and learned model state. It cannot prove disposition closure once derivation occurred.

**Disposition:** `DO_NOT_BUILD` as a universal claim.

### Model B — Uniform recursive delete of every derivative

`source → enumerate all descendants → DELETE each → complete`

**For:** intuitive for materialized data products.

**Against:** trained parameters are not ordinary descendant records; some derived aggregates may remain lawful after true anonymisation; provider deletes have different physical semantics; unknown lineage makes completeness unknowable.

**Disposition:** `SPECIALIZE` for materialized/recomputable descendants, not universalize.

### Model C — Always retrain/recompute from scratch

`remove subject from admissible inputs → rebuild every derivative/model`

**For:** strongest practical baseline for many learned models; clean semantic reference.

**Against:** unnecessarily expensive for deterministic derivatives or deletion-efficient algorithms; can be computationally prohibitive; stochastic retraining may produce a different but valid distribution rather than bit-identical state.

**Disposition:** `KEEP` as a gold/reference assurance strategy, `DO_NOT_BUILD` as mandatory universal mechanism.

### Model D — Algorithm/profile-specific exact or certified removal

`remove target influence using an admitted deletion-aware algorithm → prove declared equivalence to no-target training/recomputation`

**For:** supported by Ginart/Guo and deletion-aware training such as SISA for bounded classes/profiles.

**Against:** guarantees are algorithm/assumption specific; cannot be inferred for arbitrary models/providers.

**Disposition:** `SPECIALIZE` + `PROVIDERIZE` realization; preserve portable assurance semantics.

### Model E — Approximate unlearning under empirical audit

`apply efficient forgetting method → evaluate against declared attack/statistical/utility suite`

**For:** potentially necessary for large models where exact retraining is disproportionate; allows explicit risk-qualified operation.

**Against:** ICLR 2025 evidence shows apparently successful methods can retain poisoning influence; no single audit proves absence of all influence.

**Disposition:** `KEEP` only as an explicitly approximate assurance profile. Never relabel as exact erasure.

## Derived-state classes that must not collapse

The research recommends classifying disposition obligations by **derivation semantics**, not by product category.

### 1. Materialized deterministic/recomputable derivative

Examples: normalized projection, materialized view, deterministic aggregate, rendition, search document, cache entry, embedding generated under a pinned embedding-model/config revision.

Potential closure:

`target source removed/restricted + affected derivative lineage known + old derivative invalidated/unserved + recomputation from currently lawful inputs completed + residual provider copies disposed + validation passed`.

An embedding may be deterministic relative to a pinned model revision, but it remains a subject-bearing derived payload when it can be linked to the person/source. Determinism does not make it anonymous.

### 2. Provider-internal indexed/compacted derivative

Examples: inverted-index terms/statistics, ANN structures, segment copies, provider cache/replica state.

Logical delete can be a serving postcondition while physical erasure requires additional provider-specific compaction/retention evidence. SB owns the required disposition, not the segment/optimizer primitive.

### 3. Incremental aggregate/stateful derivative

Examples: counters, cohorts, recommendation features, streaming aggregates.

The effect of deleting one contribution depends on algebra, retained source, windowing, privacy threshold and update history. Some states can be exactly decremented/recomputed; others require window rebuild or cannot prove exact removal without lineage.

### 4. Explicit AI/agent memory

Examples: stored conversation memory, RAG chunk, vector memory, tool-produced summary.

These behave primarily like governed stored derivatives: delete/invalidate/recompute them and reconcile all serving replicas/indexes. This is distinct from changing the base model's learned parameters.

### 5. Learned/statistical model state

Examples: model weights, fine-tuned adapters, learned centroids, recommender parameters.

The subject's contribution is distributed through a learning algorithm. Exact closure requires a declared deletion algorithm/equivalence guarantee or a fresh training lineage excluding the target. Approximate methods require explicit assurance limits.

### 6. Descendants of an affected learned artifact

Examples: distilled model, downstream fine-tune, exported checkpoint, adapter, ensemble member, model-produced embedding/index rebuilt before unlearning.

Unlearning an ancestor does not retroactively change descendants. They are separate derivation-graph nodes with their own disposition obligations or an explicit argument that no subject-bearing influence survives under the required policy.

## Proposed portable semantic model

Exact names remain synthesis-controlled. The research recommends GENERALIZING privacy disposition into a derivation-aware closure rather than adding a product-shaped `MachineUnlearn` primitive.

Conceptually:

```text
DispositionSubject / SourceArtifact
        ↓
DerivationEdge{kind, producerRevision, scope, evidence}
        ↓
DerivedArtifact / LearnedArtifact
        ↓
DispositionObligation{
  required_assurance,
  deadline,
  scope,
  retention_exception,
  evidence_profile
}
        ↓
DispositionAttempt / ProviderRealization
        ↓
DispositionEvidence
        ↓
QualifiedDispositionResult
```

Candidate assurance outcomes, illustrative rather than frozen enum:

```text
SOURCE_REMOVED
DERIVATIVES_INVALIDATED
EXACTLY_RECOMPUTED_WITHOUT_TARGET
RETRAIN_EQUIVALENT / CERTIFIED_REMOVAL
APPROXIMATELY_UNLEARNED(profile, bounds, tests)
RETAINED_UNDER_EXCEPTION
RESIDUAL_INFLUENCE_UNKNOWN
DISPOSITION_INCONCLUSIVE
```

The key rule is monotonic honesty: a weaker result must never be promoted into a stronger claim because a provider exposes one `delete`/`forget` API.

## Strongest evidence for the recommended model

1. **Exact deletion has a meaningful counterfactual reference.** Ginart and Guo independently formulate deletion against training without the target, demonstrating that strong removal can be stated provider-neutrally while implementations differ.
2. **Efficiency depends on algorithm structure.** SISA and deletion-efficient clustering show that architecture can reduce rebuild scope without weakening the target property.
3. **Approximate evidence is not universal evidence.** ICLR 2025 demonstrates residual poisoning effects despite practical unlearning techniques and common evaluation success.
4. **Derived lifecycle is graph-shaped.** W3C PROV formalizes derivation/invalidation as distinct semantic facts, matching SB's existing provenance/revision direction.
5. **Provider deletion semantics diverge materially.** Lucene/Elasticsearch demonstrate serving deletion and physical reclamation are distinct lifecycle points.

## Strongest evidence against over-universalization

- There is no evidence that one deletion/unlearning algorithm works across relational aggregates, ANN indexes, caches, LLM weights and physical replicas.
- There is no generally adequate single empirical test for learned influence removal.
- Bit-for-bit equality to a retrained model is not a universal criterion for stochastic learning; distributional/certified notions may be more appropriate.
- A derivative can become legitimately non-personal through real anonymisation/aggregation under a policy profile, so indiscriminate recursive purge can destroy lawful evidence/analytics unnecessarily.
- A model provider can make a deletion promise without exposing enough checkpoints/training lineage/evaluation evidence for the SB to independently assert the stronger semantic claim.

## Contradictions resolved

### “Delete source” versus “delete everything forever”

Resolved by derivation-aware obligations. Source erasure is necessary but does not imply descendant closure. Conversely, descendants proven anonymous/non-subject-bearing need not be erased solely because they once arose from a subject-bearing source.

### “Embedding is just an index” versus “embedding is learned model state”

An embedding vector is usually a materialized derivative produced by a model; the embedding **model parameters** are learned state. Their disposition proofs differ. Recomputing/removing a subject vector does not unlearn the embedding model; unlearning the model does not delete already materialized old vectors.

### “Membership inference passed, therefore forgotten”

Rejected. Empirical attacks/tests are evidence under a declared profile, not universal proof. Poisoning-based evaluation demonstrates residual influence can survive other apparently successful tests.

### “Full retraining is the only safe answer”

Too strong. It is a robust reference strategy for arbitrary learned state, but deletion-efficient/certified algorithms show exact removal can be achieved more narrowly when assumptions are explicit and proven.

## Invariants

1. **No closure without dependency coverage.** If a mandatory derivative class/sink can exist but lineage/coverage cannot establish whether it does, the disposition is `INCONCLUSIVE`.
2. **Historical lineage survives subject-payload erasure only in privacy-safe form.** The system may retain that artifact X was derived from a now-disposed subject reference if the retained relation itself does not violate the disposition requirement.
3. **Logical unavailability, physical purge and learned-influence removal are distinct postconditions.**
4. **Exact/certified and approximate unlearning are never interchangeable labels.**
5. **Provider receipt is evidence of an attempt/effect at that provider boundary, not semantic closure across descendants or copies.**
6. **Descendant artifacts do not inherit ancestor unlearning retroactively.** They require their own disposition or a validated independence/non-personal argument.
7. **Restores/reconnects cannot resurrect disposed derivatives into authoritative serving.** Current disposition state must reconcile restored caches/indexes/checkpoints/Stations.
8. **Provider substitution cannot silently lower the required assurance profile.** Unsupported stronger assurance yields degraded/unsupported/`INCONCLUSIVE`, not a weaker claim with the same name.
9. **AI/agent authority cannot mint its own forgetting proof.** It may propose/execute within delegated scope; independent evidence/validation governs the disposition result.

## Failure and adversarial analysis

### Incomplete lineage
A source record is deleted but a vector index built months earlier has no derivation link. Search still retrieves a semantically identifying neighbor. **Required outcome:** source disposition may be complete; overall derived-disposition closure is `INCONCLUSIVE/FAILED` for the broader obligation.

### Tombstone masquerading as purge
Provider search no longer returns a deleted document, but old segment bytes/terms remain pending merge. **Required outcome:** serving-removal proof may pass; physical-erasure proof remains pending until the required provider retention/compaction postcondition is proven.

### Approximate unlearning metric gaming
An algorithm passes membership inference but retains a poisoning/backdoor effect. **Required outcome:** only the exact declared evaluation profile may pass; no upgrade to `RETRAIN_EQUIVALENT` or general “forgotten”.

### Checkpoint/model-copy resurrection
Primary model is retrained without the subject, but an old checkpoint or downstream fine-tune is later promoted. **Required outcome:** serving admission must consult current derivation/disposition state and reject/quarantine the stale affected artifact.

### Offline Station resurrection
A disconnected Station retains old RAG chunks/embeddings after central disposition. On reconnect it attempts to synchronize/serve them. **Required outcome:** stale derivative generation is invalidated; normal serving/actuation remains gated until disposition reconciliation.

### Provider opacity
External AI provider returns “unlearning complete” but cannot identify affected model generation, algorithm/assurance profile, descendants, or independent validation evidence. **Required outcome:** provider-specific receipt can be retained, but stronger portable claim remains `INCONCLUSIVE` unless the admitted profile explicitly accepts that evidence class.

### Derived anonymous aggregate
A legally/policy-qualified aggregate no longer permits reasonable subject linkage and is independent of the person's direct payload. **Required outcome:** do not mechanically delete it merely because it has historical derivation; retain only if the governing anonymisation/retention profile and evidence support that disposition.

## Provider-specific versus portable semantics

### System Builder should own

- typed source/subject and derivative/artifact identities;
- derivation/influence lineage and revision identity;
- disposition obligation and scope;
- required assurance profile (`logical removal`, `physical purge`, `exact recomputation`, `certified/retrain-equivalent`, `approximate profile`, etc.);
- evidence compatibility/coverage requirements;
- qualified result and `INCONCLUSIVE` propagation;
- retention/legal exception linkage;
- restore/reconnect non-resurrection rule;
- provider-substitution conformance requirement.

### Providers/realizations may own

- Lucene segment merges/tombstones;
- vector-store optimizer/compaction internals;
- cache invalidation implementation;
- exact incremental aggregate algorithm;
- model-training framework, checkpoint format and training topology;
- SISA-like sharding/slicing;
- certified-removal algorithm for a supported model family;
- approximate unlearning algorithm and concrete statistical/attack tests;
- cloud model-provider deletion/unlearning APIs.

Provider-specific mechanics must produce evidence mapped into the portable assurance requirement rather than redefining it.

## Consequences for existing findings/candidates/hypotheses

### `KEEP / HARDEN`
- `DR-PEIP-01`: erasure remains a composite effect, but its sink set must include **derived/influenced descendants**, not only direct storage copies.
- Storage finding that rendition/index projections have revision lineage: extend proof debt to disposition/invalidation and residual provider state.
- Data staged convergence and coverage evidence: disposition is another convergence problem where complete population/derivative coverage matters.
- AI-native provenance/provider-substitution rules: learned artifacts and agent memory require revision-qualified lineage and independent validation.

### `GENERALIZE`
- Generalize privacy disposition closure to a **derivation-aware disposition graph** with required coverage and assurance per descendant class.
- Generalize Historical Interpretation Closure so it can retain privacy-safe derivation/disposition provenance even when source/derived payloads are legitimately erased.
- Generalize composite evidence joins with a `derivation coverage` axis: individually valid deletion receipts do not form complete closure when an affected descendant is unknown/missing.

### `SPECIALIZE`
- Exact/certified machine unlearning belongs under AI/Data realization profiles where a learning algorithm supports it.
- Deterministic derivative recomputation belongs under Data/Storage/Search/AI-memory specializations depending on semantic owner.
- Approximate unlearning is a separately named assurance profile with explicit threat model, metrics, thresholds and residual-risk policy.

### `PROVIDERIZE`
- Training/unlearning algorithm, vector-index compaction, segment purge, cache invalidation, checkpoint mechanics and provider-hosted deletion APIs.

### `DEFER`
- Promotion of a top-level `Machine Unlearning` or `Privacy Disposition` capability until Capability Synthesis/enterprise negative-space review establishes semantic ownership and product demand.
- A universal formal verification language for unlearning guarantees.

### `DO_NOT_BUILD`
- universal `MachineUnlearn()` with provider-independent success semantics;
- `delete source == all derivatives erased`;
- `delete ACK == physical purge`;
- `membership inference passed == forgotten`;
- automatic downgrade from exact/certified assurance to approximate assurance;
- preservation/serving of stale checkpoints solely because they are historically archived.

## Proof obligations — `DR-DDMU`

1. **Direct-derivative negative proof:** delete a canonical source while a subject-bearing embedding/vector remains searchable. Overall disposition must not close.
2. **Deterministic recomputation proof:** with complete lineage, remove source S, invalidate all S-derived projection versions, recompute from lawful inputs under pinned producer revision, and prove the new derivative closure excludes S.
3. **Missing-lineage proof:** hide one materialized descendant from the derivation graph. Closure must become `INCONCLUSIVE`, not infer absence.
4. **Logical-vs-physical delete proof:** provider marks an index document deleted but retains tombstoned segment bytes. Serving-removal may pass while physical-erasure remains pending.
5. **Embedding classification proof:** erase source text and vector while retaining the embedding model; separately prove that unlearning the embedding model would not itself remove previously materialized vectors.
6. **Incremental aggregate proof:** remove one subject contribution from an aggregate whose algebra supports exact decrement/recompute; verify the resulting state against full lawful recomputation.
7. **Non-reversible aggregate proof:** use an aggregate/state without sufficient contribution lineage; require rebuild or `INCONCLUSIVE` rather than fabricate exact subtraction.
8. **Retraining reference proof:** retrain an admitted model from data excluding target T and record complete dataset/model/training revision lineage as a gold/reference disposition path.
9. **Certified/exact alternative proof:** use an algorithm with a declared certified/exact deletion guarantee and demonstrate conformance to the same portable no-target assurance without full retraining.
10. **Approximate-adversarial proof:** run an approximate method that passes one membership-style audit but fails a poisoning/influence audit; system must retain only the narrower profile result.
11. **Empirical-evidence ceiling proof:** make all configured empirical tests pass without a formal/certified guarantee; result remains `APPROXIMATELY_UNLEARNED(profile)`, not exact/certified.
12. **Descendant-model proof:** unlearn/retrain parent model while a prior distilled/fine-tuned/checkpoint descendant remains. The descendant must independently remain affected/pending until dispositioned.
13. **Provider-opacity proof:** provider supplies only an opaque `completed` receipt with no assurance/coverage evidence. A stronger SB obligation evaluates unsupported/`INCONCLUSIVE`.
14. **Provider-substitution proof:** replace a provider that supports certified deletion with one supporting only logical deletion/approximate unlearning; required assurance cannot silently weaken.
15. **Agent-memory boundary proof:** delete explicit RAG/agent memory and indexes while leaving base-model weights unchanged; prove stored-memory closure without falsely claiming base-model unlearning.
16. **Offline-Station resurrection proof:** reconnect a Station carrying stale disposed chunks/vectors/model checkpoint. Reconciliation invalidates/quarantines them before serving/actuation.
17. **Backup/restore proof:** restore a snapshot containing a disposed derivative or affected model generation. Current disposition graph blocks resurrection and replays the required invalidation/rebuild/unlearning obligations.
18. **Historical-audit proof:** after payload/derivative erasure, reconstruct privacy-safe evidence that disposition occurred and under which revisions, without reconstructing forbidden subject-bearing content.
19. **Anonymous-derivative proof:** retain a genuinely non-linkable aggregate under an admitted anonymisation/retention profile while erasing subject-bearing descendants; demonstrate why derivation history alone does not mandate deletion.
20. **Cross-generation proof:** change producer/model revision during a pending disposition. Evidence for generation G must not qualify an unexamined descendant produced under G+1 or vice versa.

Each material conclusion above is falsifiable by one or more obligations. Failure of a mandatory proof must weaken/reject the corresponding synthesis recommendation rather than be papered over by provider metadata.

## Unresolved questions

1. What exact portable vocabulary should distinguish derivation, statistical influence and ordinary lineage without pretending `wasDerivedFrom` proves quantitative influence?
2. For stochastic training, should strongest SB assurance be distributional retrain equivalence, certified indistinguishability, algorithm-specific exact deletion, or a small family of named profiles?
3. Which anonymisation criteria are strong enough to terminate a subject's disposition traversal through aggregate descendants?
4. How should third-party foundation-model providers expose training-set lineage/unlearning assurance when the SB never possessed the training corpus?
5. Can a model artifact with differential-privacy guarantees satisfy a disposition obligation through bounded pre-existing influence rather than post-hoc unlearning, and under what policy?
6. How should retention/cost policy prune derivation graphs without making future disposition coverage unknowable?
7. Which descendant relationships need exact lineage versus conservative class-level coverage when artifact counts are massive?

These remain research/synthesis questions; no architecture is frozen by this artifact.

## Confidence

**HIGH** for:
- source deletion not implying derivative deletion;
- separating logical removal, physical purge, exact/certified removal and approximate unlearning;
- complete derivation/coverage evidence as a prerequisite to claiming closure;
- provider-specific mechanics versus portable disposition/assurance semantics;
- retraining-without-target as a strong reference path rather than a universal mandatory mechanism.

**MEDIUM** for:
- the exact shape/names of assurance profiles;
- where a generalized derivation-disposition graph should be owned in final taxonomy;
- policy criteria for retaining truly anonymous derivatives.

**LOW / DEFERRED** for:
- universal formal certification across arbitrary deep/foundation models;
- one standard empirical audit suite that proves all relevant influence removed.

## Research recommendation / explicit dispositions

- **KEEP/HARDEN** privacy disposition as composite evidence-based closure.
- **GENERALIZE** it to traverse a typed derivation/influence graph and require descendant coverage.
- **GENERALIZE** qualified evidence with assurance-strength and derivation-coverage axes.
- **SPECIALIZE** deterministic recomputation, exact/certified ML deletion and approximate unlearning as different realization/assurance families.
- **PROVIDERIZE** index purge/compaction, model-training/unlearning algorithms, checkpoint mechanics and empirical audit implementations.
- **DEFER** top-level Machine Unlearning capability promotion and a universal influence formalism.
- **DO_NOT_BUILD** generic `forget=true`, source-only closure, one-test certification or silent assurance downgrade.

This preserves the Generation-2 direction: **own semantics, requirements and evidence; delegate mature mechanics to providers**. Mature systems may use specialized unlearning/recompute machinery; simple systems with no learned derivatives should pay only for the much smaller disposition closure they actually require.

## Synthesis consequence

Capability Synthesis should not ask “does SB support machine unlearning?” as a boolean. It should ask:

> **For each disposition obligation, which descendant classes can retain subject influence, what assurance is required for each, and what compatible evidence proves the entire required derivation closure has reached that assurance?**

If the system cannot answer that question for a mandatory descendant class, the correct result is `INCONCLUSIVE/UNSUPPORTED`, not “deleted”.

## Recommended next deep question

Once state/negative-space priority permits, investigate **Commercial Usage Evidence Correction & Rating/Billing Closure**: how late, duplicated, retracted or privacy-dispositioned usage evidence can be corrected without rewriting immutable billing lineage, double-rating consumption or silently changing entitlements. This would exercise the same revision/evidence/effect-closure primitives against the mandatory Commercial Metering / Entitlements / Rating / Billing negative-space rather than continuing to deepen ML-specific mechanisms by habit.
