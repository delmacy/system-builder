# WBS — 43 Policy, Standards & Compliance Plane

## 43.0 Policy, Standards & Compliance Plane

### 43.1 Normative source, policy/control and applicability model
- **43.1.1** Definir `NormativeSource`, `NormativeEdition`, `NormativeRequirementRef`, policy, control, requirement e applicability model.
- **43.1.2** Definir jurisdiction/organization/sector/effective-period/data-category/deployment-context para aplicabilidade.
- **43.1.3** Versionar fontes, políticas, interpretações e mappings para requirements/controls, com supersession e effective dates explícitos.
- **43.1.4** Registrar source URI/issuer/status/licensing-rights/citation/provenance sem copiar conteúdo protegido além do autorizado.
- **43.1.5** Classificar obrigação como legal/regulatória, contratual, certificável, voluntary framework/best-practice ou política interna sem transformar uma classe na outra.

### 43.2 Enforcement e evidence
- **43.2.1** Integrar hooks em authorization, data, document, workflow, release/deploy e generated experience conforme owner boundaries.
- **43.2.2** Capturar evidence/control status sem duplicar source data nem converter ausência de evidência em conformidade.
- **43.2.3** Detectar nonconformance, missing/stale evidence e applicability drift.
- **43.2.4** Preservar requirement/control/evidence revision, population, locality e currentness quando relevantes.

### 43.3 Governance
- **43.3.1** Gerenciar exception/waiver/compensating control com authority, scope, rationale, expiry e reassessment.
- **43.3.2** Produzir compliance reports/packages e conformance evidence sem autoatribuir certificação externa.
- **43.3.3** Reavaliar aplicabilidade quando source/version, policy, jurisdiction, sector, organization, contract ou system context mudar.
- **43.3.4** Manter crosswalks entre fontes sem declarar equivalência semântica total por simples mapeamento de cláusulas/controles.

### 43.4 Standards & Regulatory Knowledge Catalog
- **43.4.1** Catalogar leis, regulamentos, normas, standards, frameworks, contractual obligations e políticas internas por issuer/version/status/effective period.
- **43.4.2** Vincular referências normativas a interpretations/normalized requirements separadas e revisáveis.
- **43.4.3** Registrar applicability predicates e negative applicability evidence por jurisdiction/sector/data/criticality/provider/contract/context.
- **43.4.4** Representar amendment, corrigendum, supersession, withdrawal, draft/final status e migration impact.
- **43.4.5** Produzir impact graph quando uma fonte ou interpretação mudar, identificando recipes, definitions, controls, tests, deployments e evidence afetados.

### 43.5 Rule-Driven Design & Template Packs
- **43.5.1** Definir `RulePack` versionado, composto por requirements/constraints/control intents e applicability conditions derivados de fontes qualificadas.
- **43.5.2** Definir `TemplateOverlay`/`RecipeOverlay` para aplicar RulePacks sobre templates e BusinessRecipe/SystemDefinition sem embutir a fonte normativa no template-base.
- **43.5.3** Permitir que RulePacks exijam/proíbam/qualifiquem capabilities, fields, retention, approvals, logging, segregation, accessibility, security, deployment e evidence obligations.
- **43.5.4** Resolver conflitos por precedence policy explícita e contextual; não assumir uma hierarquia normativa universal.
- **43.5.5** Gerar traceability `source -> applicability -> requirement -> control -> design decision -> test/measure -> evidence`.
- **43.5.6** Revalidar templates/recipes/releases quando RulePack, source edition ou applicability context mudar e produzir migration/review obligations em vez de mutação silenciosa.

### 43.6 Starter normative families (planning catalog, not automatic applicability)
- **43.6.1** Architecture/software lifecycle/requirements/quality: ISO/IEC/IEEE 42010/42020/42030, 12207, 29148; ISO/IEC 25010/25012/25040 family.
- **43.6.2** Security/privacy/risk/service/continuity/compliance governance: ISO/IEC 27001/27005/27017/27018/27035, ISO/IEC 27701, ISO 22301, ISO 31000, ISO 37301, ISO/IEC 38500.
- **43.6.3** Secure development/application assurance/supply chain: NIST SSDF, NIST CSF, OWASP ASVS/SAMM, SLSA/SPDX/SBOM-related profiles where applicable.
- **43.6.4** AI governance/risk: ISO/IEC 42001, ISO/IEC 23894, NIST AI RMF and jurisdiction-specific AI regulation where applicable.
- **43.6.5** Accessibility: WCAG and applicable jurisdictional accessibility obligations.
- **43.6.6** Jurisdiction/sector examples: LGPD/ANPD, payment-card PCI DSS and other sector regulators only when the organization/system context proves applicability.
