# Standards & Rule-Driven Design

Status: future capability guidance for `43 — Policy, Standards & Compliance Plane`.

## 1. Purpose

System Builder should be able to understand and apply standards, regulations, contractual obligations, organizational policies and voluntary frameworks as versioned design knowledge without coupling the platform core to one jurisdiction, certification scheme or provider.

The objective is not to create a universal legal oracle. The objective is to make normative influence explicit, reviewable, contextual, versioned and traceable through the software lifecycle.

Canonical separation:

`NormativeSource -> Interpretation -> ApplicabilityDecision -> Requirement -> ControlIntent -> RulePack -> Template/Recipe Overlay -> Design/Implementation -> Validation -> Evidence -> ConformanceClaim`

None of these stages may silently collapse into another.

## 2. Core concepts

### NormativeSource / NormativeEdition
Identity and metadata for a law, regulation, standard, framework, contract, policy or internal rule source. Record issuer, stable identifier, edition/version, publication/effective/withdrawal status, jurisdiction/sector, authoritative source locator and usage/licensing constraints.

A source being present in the catalog does not make it applicable.

### NormativeRequirementRef
Stable reference into a source edition. For protected standards, prefer clause/section identity plus project-owned normalized interpretation rather than unauthorized reproduction of source text.

### Interpretation
A reviewed project/client interpretation of what a referenced source means for the relevant context. Interpretation is versioned, attributed and challengeable; it is not the source itself.

### ApplicabilityDecision
Explains why a requirement is applicable, not applicable, conditional, unresolved or deferred for a specific organization/system/context and effective period.

Useful predicates may include jurisdiction, sector, organization type/size, data categories, actor types, regulated activity, deployment geography/topology, provider role, criticality, contractual obligations and certification target.

### ControlIntent
Technology-neutral outcome or safeguard intended to satisfy one or more normalized requirements. A control may satisfy multiple sources; one source may require multiple controls. Crosswalk is many-to-many and never proves semantic equivalence by itself.

### RulePack
Versioned executable/design-time package derived from qualified requirements and control intents. A RulePack may constrain or require capabilities, data semantics, workflow steps, approvals, segregation, retention, logging, security, accessibility, deployment topology, evidence or validation.

A RulePack does not become legal authority. It remains a governed implementation artifact linked to its source, interpretation and applicability decision.

### TemplateOverlay / RecipeOverlay
A reusable overlay that applies one or more RulePacks to a BusinessRecipe/SystemDefinition/template while keeping the base template generic.

Example composition:

`Base service template`
`+ Brazil jurisdiction profile`
`+ personal-data processing RulePack`
`+ organization policy pack`
`+ customer contractual pack`
`+ accessibility pack`
`= context-qualified design candidate`

The generated candidate still requires validation and, where required, human/legal/security review.

## 3. Rule-driven design behavior

Rules should operate as declarative constraints and transformations rather than ad-hoc code branches. Depending on semantic ownership, a RulePack may:

- require a capability, field, relationship, workflow step, approval or evidence route;
- forbid a capability/configuration/provider pattern;
- constrain retention, locality, access, cryptography, observability, logging or deployment;
- introduce validation/test obligations;
- qualify UI/content/accessibility behavior;
- require human review or prevent publication when evidence is missing;
- require migration/reassessment when an edition, interpretation or applicability context changes.

Rule-driven design must preserve the distinction between design-time rules and runtime enforcement. Some obligations can be compiled into runtime controls; others remain process, governance, evidence or organizational obligations and must not be falsely represented as executable software controls.

## 4. Conflict and precedence

Do not hardcode a universal rule such as `law > regulation > contract > policy`. Actual precedence, competence, scope and conflict resolution depend on jurisdiction and context.

Represent conflicts explicitly with source identities, interpretations, affected scope, authority/owner, resolution status, effective period and evidence. Unresolved material conflicts must block any false conformance claim.

## 5. Change and drift

A source amendment, new edition, regulator interpretation, contract change or jurisdiction shift must not silently mutate an existing design.

The capability should compute an impact graph across:

`source/edition -> interpretations -> applicability decisions -> requirements -> controls -> RulePacks -> templates/recipes -> SystemDefinitions -> tests -> releases/deployments -> evidence`

Then classify each affected object as unchanged, revalidation required, migration required, exception required or nonconforming.

## 6. Starter knowledge families

The catalog should support families without assuming automatic applicability:

- architecture/process/evaluation: ISO/IEC/IEEE 42010, 42020, 42030;
- software lifecycle and requirements: ISO/IEC/IEEE 12207, 29148;
- product/data quality and evaluation: ISO/IEC 25010, 25012, 25040 and related SQuaRE standards;
- information security/privacy/risk: ISO/IEC 27001, 27005, 27017, 27018, 27035, 27701; ISO 31000;
- business continuity/service/compliance/IT governance: ISO 22301, ISO/IEC 20000-1, ISO 37301, ISO/IEC 38500;
- secure development/application assurance: NIST SSDF, NIST CSF, OWASP ASVS, OWASP SAMM;
- supply-chain evidence/SBOM: SLSA/SPDX and compatible profiles where appropriate;
- AI governance/risk: ISO/IEC 42001, ISO/IEC 23894, NIST AI RMF and applicable AI regulation;
- accessibility: WCAG plus jurisdiction-specific accessibility rules;
- privacy/regulatory examples: LGPD and ANPD regulations, and equivalent jurisdiction-specific privacy regimes;
- sector examples: PCI DSS for applicable card-data environments and regulator-specific packs only when the regulated activity/context is established.

The catalog is extensible. The correct abstraction is `NormativeSource` and `RulePack`, not a hardcoded enumeration of standards.

## 7. Conformance semantics

Use qualified states such as:

`NOT_ASSESSED | APPLICABILITY_UNRESOLVED | NOT_APPLICABLE | PARTIAL | NONCONFORMING | CONFORMING_BY_EVIDENCE | EXCEPTION_ACTIVE | STALE_EVIDENCE`

Conformance must be edition-, scope-, population-, time- and evidence-qualified where applicable.

`CONFORMING_BY_EVIDENCE` is an internal assessment claim. It is not equivalent to an external certification/accreditation.

## 8. Relationship to other System Builder capabilities

- `BusinessRecipe`: receives technology-independent normative business/process constraints.
- `SystemDefinition`: receives software/design constraints after analysis.
- `52 Localization & Jurisdiction`: resolves jurisdiction/context and binds applicable RulePacks.
- security/trust, auth, data, workflow, document, deploy, observe and other semantic owners implement their own controls; capability 43 does not become a god-object.
- post-WP13 Architecture Assurance may use capability-43 concepts for standards traceability, but does not require capability 43 to be fully implemented before the assurance program can begin.

## 9. Acceptance direction

A future integrated proof should show at least:

1. one base template/BusinessRecipe;
2. two different jurisdiction/organization contexts;
3. different RulePack resolutions from the same base template;
4. full traceability from source reference to generated requirement/control/design/test/evidence;
5. explicit conflict/unresolved applicability handling;
6. edition change producing an impact/revalidation plan rather than silent mutation;
7. removal/replacement of one standards provider/catalog implementation without breaking public contracts.
