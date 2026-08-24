# Next Work — P13 Package 02 Integration & Review

Construction C `P13-RUNTIME-GENERATED-EXPERIENCE-RENDERING-01` / TASK-249..253 is integrated by Sprint Review PR #286 from exact reviewed head `bdc459af1d75c35d01bed02f8776e3347147d733`. Deterministic CI #657 and Heavy Product Tests #82 passed on that exact head before merge. Fresh `main` is `7a6b8772b7872ffd0d1382df3a5fe2823127b328`, and reviewed-head -> merge-main has zero file differences.

`P13-PACKAGE-02-INTEGRATION-REVIEW-01` is COMMITTED / MATERIALIZED / NOT EXECUTED.

## Required next action
1. Execute the package-level review against fresh integrated `main`.
2. Regress the complete Package Goal across WBS 13.2.1-13.2.3: identity/session, explicit authority/default-deny policy evaluation, generated view/form documents, bound form validation and authority-gated rendered actions.
3. Revalidate contract/schema compatibility, architecture/bounded-context dependencies, Runtime autonomy, security/trust/evidence redaction, CI health and relevant performance risk.
4. Classify technical debt and duplicated abstractions without absorbing TD-P13-01..04 into product work.
5. Produce `P13-PACKAGE-02-INTEGRATION-REVIEW-01.report.md` with findings and GO/NO-GO for Documentation & Closure.
6. Require exact-head Deterministic CI + Heavy Product Tests and absence of blocking review findings before integration.
7. After successful review integration, reconstruct fresh `main` and promote only Documentation & Closure.

## Boundaries
No fourth Construction Sprint unless package review proves a missing Package Goal capability requiring explicit construction/change control; no unrelated feature work; no new L4 without ADR; no inferred roles/permissions/bindings; authentication != authorization; no executable free-text policy; no Builder/Observe runtime dependency; no TD-P13-01..04 absorption; no P13-PACKAGE-03.