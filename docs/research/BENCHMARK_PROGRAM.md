# Benchmark Architecture Program

System Builder should learn from mature products without attempting to compete feature-for-feature during early development.

Before designing a major SB app, study relevant reference systems and record patterns, gaps and lock-in tradeoffs. Current benchmark map to verify against current vendor documentation before implementation:

- **Camunda / ProcessOS:** process discovery, re-engineering, orchestration, continuous improvement.
- **Pega / Blueprint:** intent-to-blueprint, process/application design, legacy modernization patterns.
- **Appian:** process intelligence, process-driven applications, lifecycle/deployment governance.
- **ServiceNow:** suite UX, intake, app lifecycle, governance and operations.
- **OutSystems:** AI-assisted application generation and application lifecycle.
- **Mendix:** model-driven assembly/build/deployment and runtime packaging.
- **SAP Signavio + Build/BTP:** process transformation and coexistence with large legacy estates.
- **Frappe:** open/self-hosted metadata-driven enterprise application framework patterns.
- **RustDesk-style open service model:** open self-host option with paid convenience/support as a business-model analogy, not a technical blueprint.

## Research template

For each SB module ask:

1. What mature solutions already do this well?
2. Which concepts/interfaces should we learn from?
3. What creates platform lock-in there?
4. Which requirements do they intentionally not solve?
5. Which gap matters to our actual users?
6. What is our signature rather than a duplicate feature?

Research informs design; it does not override accepted System Builder principles.
