# Risk Register — Planning Baseline

| ID | Risk | Probability | Impact | Response |
|---|---|---|---|---|
| R-01 | Overdesign antes da prova vertical | High | High | architectural hooks + rolling-wave |
| R-02 | Contratos instáveis causarem retrabalho multiagente | High | High | contract-first + compatibility gates |
| R-03 | Agente barato inventar arquitetura | High | High | WP Dictionary + allowed paths + acceptance |
| R-04 | Dependências circulares entre módulos | Medium | High | dependency graph + interface extraction |
| R-05 | Builder acoplar runtime | Medium | Critical | architecture fitness + autonomy certification |
| R-06 | IA entrar no caminho determinístico | Medium | Critical | boundary classification + deterministic compiler |
| R-07 | Conhecimento proprietário contaminar catálogo | Medium | High | knowledge boundary/provenance |
| R-08 | Dívida técnica acumular entre incrementos | High | High | recurring integration/debt review cadence |
| R-09 | Branches/documentos divergirem | Medium | High | short-lived branches + PR/merge + main as integration truth |
| R-10 | Escopo de longo prazo virar compromisso prematuro | High | Medium | NOW/HOOK/PLANNED/RESEARCH |
| R-11 | Dependência de provider/modelo | Medium | High | provider abstraction + replaceability |
| R-12 | Falta de dados tornar intelligence especulativa | High | Medium | maturity gates; no premature implementation |

## G2-WP-06 closure review — 2026-09-11
No new critical/high blocker was introduced by G2-WP-06. Provider/Brownfield/Physical-Peripheral semantics reduce the architectural portion of R-11 by making qualification multidimensional, preserving provider-local identity as non-canonical, requiring explicit coexistence/cutover/residual drainage and keeping authority/currentness/locality fail-closed.

R-11 remains open as an implementation/operations risk because concrete provider adapters, credentials, operational enforcement and Production Readiness are explicitly outside G2-WP-06. R-08 also remains open; the package review identified only low-priority repeated parsing/normalization helpers, classified as non-blocking maintainability debt rather than semantic-owner duplication.

No closure evidence justifies lowering global risk ratings mechanically; future packages must re-evaluate them against concrete realization evidence.

## Processo
Riscos são revisados em cada milestone e nas revisões sistêmicas. Novo risco crítico pode bloquear promoção de Work Package para READY.
