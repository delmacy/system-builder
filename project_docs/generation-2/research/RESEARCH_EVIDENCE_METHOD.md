# Generation 2 Research Evidence Method

## Purpose

Generation 2 research must not infer the target architecture only from consolidated products. Evidence is intentionally triangulated across production systems, standards/specifications, scientific literature, and engineering material so the System Builder can identify both battle-tested primitives and state-of-the-art concepts that are not yet fully commoditized.

## Evidence classes

1. **Consolidated systems and official product documentation** — primary evidence for deployed primitives, lifecycle, source of truth, identity, versioning, failure semantics, extensibility, provider boundaries, governance, observability, portability, lock-in, and operational trade-offs.
2. **Standards and specifications** — primary evidence for interoperable contracts, provider-neutral semantics, shared vocabularies, compatibility requirements, and primitives that should not belong to one vendor.
3. **Scientific and peer-reviewed literature** — explicit research source for algorithms, architectures, formal models, empirical findings, unresolved limitations, and concepts that may be ahead of mainstream products. Prefer peer-reviewed papers, reputable conference/journal proceedings, systematic reviews, and well-established preprints when peer-reviewed evidence is unavailable.
4. **Industrial/engineering publications** — architecture papers, engineering blogs, incident reports, design documents, and technical talks from organizations operating relevant systems at meaningful scale. These are particularly useful for real failure modes and trade-offs absent from product documentation.

## Triangulation rule

A paper, product, standard, or engineering article may independently create a `G2-FINDING-*` or `G2-CAPABILITY-CANDIDATE-*`, but promotion to a universal primitive or active capability should normally require multi-source corroboration or a structurally unavoidable need.

Strong evidence patterns include:

- paper proposes or formalizes a primitive + standard/specification expresses compatible semantics + multiple independent systems implement variants;
- multiple production systems converge independently + literature explains the underlying invariant;
- literature identifies a systemic limitation or negative space + production evidence demonstrates the same operational failure class;
- a standard creates a provider-neutral boundary that multiple systems can satisfy.

A single elegant paper is not, by itself, sufficient reason to make a concept mandatory in the SB target architecture.

## Paper-specific extraction

When literature is relevant to the selected capability, researchers should extract, as applicable:

- research question and assumptions;
- formal or conceptual primitives;
- invariants and correctness properties;
- failure model and recovery assumptions;
- scalability/complexity model;
- empirical evidence and evaluation environment;
- portability/provider assumptions;
- limitations, threats to validity, and unresolved questions;
- whether the contribution is universal, domain-specific, provider-specific, experimental, or obsolete;
- correspondence or conflict with production representatives and standards.

## Negative-space research

Scientific literature is explicitly required as one evidence channel for the post-cycle-7 **Enterprise Completeness / Negative-Space Review**. That review must ask not only which capabilities strong products expose, but also which fundamental problems the literature identifies that mainstream products still solve incompletely, indirectly, or not at all.

The negative-space pass should search for systematic reviews, surveys, reference architectures, formal models, empirical studies, reliability/security research, HCI/work-surface research, distributed-systems research, software evolution research, and relevant domain literature for any material ownerless concern.

## Evidence weighting

Evidence is evaluated by fitness for the claim rather than by a single global ranking:

- production evidence is strongest for operational reality;
- standards are strongest for interoperability and provider-neutral contracts;
- peer-reviewed literature is strongest for formalization, frontier concepts, and known research gaps;
- industrial engineering evidence is strong for scale, incidents, and implementation trade-offs.

Conflicts must be preserved rather than averaged away. A production convention that contradicts stronger portability or correctness evidence should be recorded as a divergence, not silently generalized.

## Saturation interaction

Adding literature does **not** increase `minimum_full_cycles`, `target_full_cycles`, or otherwise create an unbounded research loop. Saturation remains governed by the existing state-machine rule. Literature is another evidence dimension inside eligible revisits and the negative-space review.

A capability should not remain perpetually unsaturated merely because additional papers exist. Once principal representatives and material literature/standards questions are sufficiently covered and two consecutive revisits yield no material architectural finding, or remaining questions require repository validation, the existing saturation rule applies.

## Researcher operating rule

For each selected capability, prefer 3–8 strong production/standards representatives as already required, and add literature selectively where it can test assumptions, expose unresolved negative space, formalize a primitive, or challenge apparent product convergence. Do not perform broad paper collection for its own sake.

All material paper-derived evidence must be added to the capability evidence/source ledger and reflected in findings/candidates exactly like other evidence classes.
