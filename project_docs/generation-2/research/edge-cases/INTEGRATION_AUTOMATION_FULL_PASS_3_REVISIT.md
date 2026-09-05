# Generation 2 — Integration & Automation — Full Pass 3 Revisit

Status: ACTIVE — MATERIAL FINDING
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Integration & Automation
Pass: 3

Research only. No product code, Work Package, TASK, Construction or concrete remediation is authorized. Preserve `ConflictPattern != ConflictInstance` and `Signal != ConfirmedConflict`. Disposition is `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`.

## 1. Method

This revisit used techniques materially different from Full Passes 1 and 2: representation-boundary semantic mutation, round-trip payload differential, omission/null/delete operator substitution, trigger/action revision-product mutation, delayed callback semantic requalification, fan-out population differential, and duplicate-screening against all 116 reusable ConflictPatterns including `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`.

The previously catalogued duplicate/replay, stale admission, provider substitution, residual callback/job, partial/unknown effect, compensation, redrive, quota/starvation, correlation and authority-amplification mechanisms remained duplicates of existing coverage.

## 2. Material local scenario

### `G2-EDGE-INTEGRATION-008` — connector presence/operator translation changes canonical mutation intent

**Activation conditions:** an automation carries a material field across two or more connector/provider/profile boundaries; the source distinguishes at least two of `ABSENT`, `UNSET`, explicit `null`, explicit default/value, `UNKNOWN`, redacted, or delete; an intermediate or target representation collapses or reinterprets those states; the receiving semantic owner validly assigns mutation semantics to the resulting representation.

**Incompatible claims/actions/states:** the automation/source claims “no assertion / preserve existing value” while the translated payload validly means “set default”, “set null”, or “delete”; or the source explicitly asserts null/delete while an intermediary omits the field and the target preserves the old value. Each local adapter can conform to its own contract while the composed automation performs a different business mutation from the originating intent.

**Classification:** data/consistency + integration/provider + semantic ownership + rule/condition + version/profile coexistence + cross-process + AI/low-code composition. This is a local Integration manifestation of `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`, not a new reusable pattern.

**Detection stage/candidate:** design/admission and pre-actuation differential; presence-state compatibility matrix across source/canonical/provider profiles; round-trip semantic diff; omission/null/delete mutation tests; raw→normalized→provider provenance; compare intended semantic operator with target effective operator. A mismatch is a `Signal`, not a `ConfirmedConflict` until the applicable revisions/contracts are qualified.

**Owners:** Integration & Automation owns faithful intent/translation lineage; producing and consuming domain/Data semantic owners own field meaning; Standards/Interoperability and Provider/Binding owners own representation/profile realization; Workflow/Process owner participates when the field controls transition/effect.

**Severity:** HIGH when the field drives destructive/external/financial/authority-sensitive mutation; otherwise MEDIUM.
**Confidence:** HIGH as a reusable edge mechanism; applicability remains contract/revision dependent.
**Detectability:** MEDIUM-HIGH with explicit presence/operator metadata and differential fixtures; LOW when adapters expose only normalized values.
**Blast radius:** one action through fan-out/cross-process population, potentially enterprise-wide for shared automation templates.
**Reversibility:** variable; delete/external mutation can be difficult or irreversible.
**Time-to-harm:** immediate at actuation or delayed until queued/replayed work executes.
**Misuse likelihood:** MEDIUM; elevated for generated mappings, sparse patch payloads and provider substitution.
**Evidence currentness:** requires source schema/profile, canonical mapping and target provider contract revisions to be qualified together.
**False-positive risk:** MEDIUM; do not flag when owners explicitly prove the presence states/operators equivalent for the field and revision set.
**Future remediation disposition:** route later to translation-contract proof, semantic-diff validation and owner-qualified reconciliation/compensation if a concrete instance is confirmed. No implementation is authorized here.
**Preventive invariant candidate:** none newly proposed. The already catalogued information-loss/non-strengthening and presence-semantics family is sufficient; a universal ban on omission/null/default translation would block legitimate APIs.

## 3. Duplicate-screen

No 117th reusable ConflictPattern is justified. `G2-EDGE-INTEGRATION-008` survives as a capability-specific manifestation because earlier Integration findings covered identity, retries, currentness, partial effects, residual subscriptions and automation composition but did not catalogue presence/operator translation itself. Its reusable semantics are already owned by `G2-CONFLICT-PATTERN-PRESENCE-SEMANTICS-001`.

No new mandatory cluster is created and no mandatory-cluster streak is incremented/reset incidentally by this local revisit. Existing cross-capability linkage is deepened across Integration × UCA × Data/Schema × Standards/Interoperability × Provider/Binding × Workflow/Process × AI/low-code.

## 4. Saturation disposition

- new local material edge scenarios: **1** (`G2-EDGE-INTEGRATION-008`);
- new cross-capability scenario IDs: **0**;
- new reusable ConflictPatterns: **0**;
- Integration local no-material streak: **reset 1 → 0**;
- mandatory-cluster streaks: **unchanged**;
- material edge inventory: **281**;
- reusable ConflictPatterns: **116**;
- combined material findings: **397**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Full Pass 3 capability coverage: **15/28**;
- Full Pass 3 mandatory clusters: **12/12**;
- completed full passes: **2/8 minimum**;
- Planning C: **BLOCKED**.

## 5. Next rotation

Continue Full Pass 3 with **Identity / Authentication / Federation**. Use techniques materially different from Full Passes 1 and 2 and duplicate-screen against all 116 ConflictPatterns, explicitly including presence semantics. Challenge merge/split/account-linking ambiguity; federation/session claims crossing assurance, issuer, key, metadata, Role/Station, policy and trust revisions; disable/revoke/login/refresh races; identifier reassignment; recovery/reset; offline tokens; replay/confused deputy; IdP degradation/substitution; residual sessions; cross-tenant/person correlation; resource exhaustion; and AI/low-code use of authentication evidence as authorization. Do not enter Planning C.
