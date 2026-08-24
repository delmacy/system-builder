# P13-PACKAGE-02 — Post-Construction-A Fresh-Main Revalidation

Date: 2026-08-23
Status: REVALIDATED / CONSTRUCTION B BLOCKED PENDING BOUNDED L3 CHANGE CONTROL
Fresh-main base: `adc739c1370df380a31ad196bf24fcdff4b0bf2d`
Work Package: `P13-PACKAGE-02 — Autonomous Runtime Identity, Authority & Generated Experience`
Primary WBS: 13.2.1-13.2.3

## Purpose
Reconstruct repository truth immediately after integration of `P13-RUNTIME-IDENTITY-SESSION-01`, confirm that later predecessor work on `main` was preserved, evaluate actual Package Goal coverage, and determine whether P13-PACKAGE-02 Construction B is eligible for materialization.

This is revalidation/repository-memory evidence only. It does not implement or authorize new product semantics.

## Integrated predecessor evidence
Construction A was integrated by PR #250 from exact reviewed head `b149f823eddcc3e2589ba42e3794f01879f23629` after:
- Deterministic CI #616 — PASS;
- Heavy Product Tests #39 — PASS.

Merge `adc739c1370df380a31ad196bf24fcdff4b0bf2d` has prior main `169cdfc5ea4df8e5e5e4e30befa0ebd386314227` and reviewed Sprint head `b149f823eddcc3e2589ba42e3794f01879f23629` as parents. Existing P13-PACKAGE-01 Runtime services/bindings work therefore remains predecessor substrate and is not Construction B work to recreate here.

## Actual coverage after Construction A
### WBS 13.2.1 — SATISFIED
Integrated Runtime now has explicit identity/auth-provider/session descriptors, deterministic Compiler/Runtime projection, external auth binding reuse, active-identity authentication, bounded session issuance/validation/expiry, actor context and a representative actor-required action path. Negative paths fail closed. Authentication remains distinct from authorization.

### WBS 13.2.2 — MISSING executable authorization
Canonical `SystemDefinition.permissions` currently declares only:
- `role`;
- `resource`;
- `actions`.

The integrated identity/session model has explicit identities and actor context but no executable identity/member -> role linkage. WBS 27 defines organizations, units, memberships, roles and contextual authorization as domain authority, yet those concepts do not currently have a minimum executable Runtime representation.

Canonical `SystemDefinition.policies` currently declares an `id`, opaque free-text `statement` and requirement references. Free text is not a deterministic executable policy language and must not be interpreted as one by convention or model inference.

Compiler/Runtime currently does not project/evaluate `permissions` or `policies` into an auditable allow/deny result.

### WBS 13.2.3 — MISSING generated interaction
Canonical `SystemDefinition.views` currently declares view `id`, `kind` and requirement references. It does not carry deterministic entity/field/action binding sufficient for a generated Runtime view/form interaction.

No existing generated Runtime renderer was found that can safely derive those bindings from names or ordering. Such inference would violate explicit-contract and fail-closed rules.

## Authority analysis
The package forecast anticipated that Construction B might require minimum additive L3 semantics after fresh-main revalidation. The revalidation now proves that requirement is real.

Current explicit L3 authority was bounded to TASK-231 identity/auth/session descriptors. It does not authorize inventing executable role-membership, policy or generated-view binding semantics.

A bounded Construction B L3 change-control decision is therefore required before materialization. That decision should reuse existing `permissions`, `policies` and `views` and authorize only the minimum additive backward-compatible representation needed for:
1. explicit actor/identity membership or role linkage;
2. deterministic permission evaluation;
3. a bounded structured policy representation only where permission-only semantics cannot satisfy the Package Goal;
4. deterministic view/form binding to existing entities/actions;
5. auditable allow/deny results shared by API/action/generated interaction paths.

The change control must explicitly forbid:
- deriving roles/privileges from identity names, order or successful authentication;
- interpreting existing free-text policy statements as executable code/DSL;
- implicit view/entity/action binding by naming convention;
- mandatory provider-specific IAM/SSO or UI framework;
- Builder lookup during ordinary Runtime authorization/interaction;
- resolved secret/session/provider values in durable artifacts.

## Architecture result
No new L4 boundary is currently required. No new bounded context, Builder/Runtime ownership change, release/environment ownership change or mandatory topology was identified. If detailed Construction B planning later proves any such L4 change necessary, stop for ADR.

## Debt and scope
`TD-P13-01..04` remain carried debt from P13-PACKAGE-01 and are not absorbed.

The already integrated P13-PACKAGE-01 Construction B / TASK-221..230 is Runtime services/bindings predecessor work. It must not be recreated or confused with P13-PACKAGE-02 Construction B.

## Decision
- P13-PACKAGE-02 remains ACTIVE.
- WBS 13.2.1: SATISFIED / INTEGRATED.
- Construction B / WBS 13.2.2-13.2.3: NECESSARY but `FORECAST / BLOCKED PENDING BOUNDED L3 CHANGE CONTROL`.
- Construction B is NOT materialized and NOT executable from current authority.
- Construction C remains FORECAST / CONDITIONAL.
- Package Integration & Review and Documentation & Closure remain FORECAST.
- P13-PACKAGE-03 remains FORECAST / NOT STARTED.

## Next gate
Obtain explicit bounded L3 change-control acceptance for the minimum Construction B semantics. After that authority is integrated, reconstruct fresh `main`, revalidate the accepted boundary, and materialize at most one Construction B Sprint. Do not hide product implementation inside change control or repository-memory reconciliation.
