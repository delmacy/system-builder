# Delivery Profiles

Status: future capability guidance for `60 — Client Delivery & Software Lifecycle Governance`.

## Purpose

System Builder should tailor the engineering lifecycle to project context rather than force one universal process. Profiles establish a minimum baseline and may be qualified by organizational policy, risk, criticality, contract, jurisdiction and standards-derived process RulePacks.

Canonical rule:

`DeliveryProfile != methodology != schedule != execution authority`.

A profile defines expected lifecycle rigor. Scrum/Kanban/other methods may project or implement parts of that profile without becoming the canonical semantic model.

## RAPID

For low-risk, bounded systems or prototypes.

Minimum direction:
- kickoff/context and objectives;
- elicitation/requirements baseline;
- BusinessRecipe/SystemDefinition traceability;
- lightweight WBS/dependency awareness;
- implementation tasks;
- automated verification appropriate to scope;
- release identity/evidence;
- explicit known gaps and deferred work.

May omit formal wave/package ceremony when complexity does not justify it, but may not omit essential authority, safety, security or evidence gates made applicable by context.

## STANDARD

Default commercial delivery profile.

Expected direction:
- kickoff and stakeholder/authority definition;
- requirements baseline;
- WBS and typed dependency DAG;
- milestones/waves;
- Work Packages;
- Sprint/Task materialization;
- estimates/capacity and schedule forecast;
- verification/validation and review gates;
- release/deployment evidence;
- change/replanning lineage.

## ENTERPRISE

For larger, higher-impact or organizationally governed systems.

Adds or strengthens:
- architecture reviews and decision traceability;
- risk register and change control;
- stronger security/privacy/data governance reviews;
- segregation/approval rules;
- formal readiness and acceptance gates;
- resilience/operability requirements;
- broader evidence and delivery dossier;
- supplier/provider/dependency scrutiny where applicable.

## REGULATED

For contexts where laws, regulations, certification targets, contracts or safety/security requirements impose additional lifecycle controls.

Extends Enterprise with applicable process RulePacks, which may require:
- specific requirements provenance and applicability decisions;
- independent or role-separated reviews;
- mandatory verification/validation methods;
- controlled approvals/sign-offs;
- qualified evidence/currentness/retention;
- explicit deviation/waiver/compensating-control handling;
- release blocks for non-waivable conditions;
- audit-ready traceability and conformance findings.

`REGULATED` does not mean certified or legally compliant by declaration. It means the delivery process is tailored to support the applicable controls and evidence.

## Profile resolution

Conceptually:

`Base DeliveryProfile`
`+ project risk/criticality`
`+ organization policy`
`+ contract requirements`
`+ jurisdiction/sector context`
`+ DeliveryProcessRulePacks`
`= Context-qualified DeliveryPlan candidate`

The resulting plan must record why each mandatory gate/artifact exists and which authority introduced it.

## Product rules versus process rules

Keep them distinct:

- `ProductRulePack`: constrains what the generated system must be/do.
- `DeliveryProcessRulePack`: constrains how the system must be engineered, reviewed, verified, approved or evidenced.

A source may legitimately generate both. Example: a privacy obligation may require a product access-control capability and also require a review/evidence step in the delivery lifecycle.

## Scheduling semantics

Schedule is derived:

`requirements + WBS + dependency DAG + estimates + capacity/WIP + calendars/constraints -> schedule forecast`.

A date cannot make an unmet dependency ready, change requirement authority or silently remove a quality/security/compliance gate.

## Acceptance direction

A future integrated proof should demonstrate:

1. the same simple BusinessRecipe resolved under `RAPID` and `STANDARD`, producing proportionate delivery plans;
2. a higher-risk context escalating to `ENTERPRISE` or `REGULATED` through explicit rules/evidence;
3. one standards/process RulePack adding a required review/test/evidence gate;
4. a schedule forecast updating after dependency/capacity change without changing scope authority;
5. full traceability from requirement through WBS/Work Package/Sprint/Task/test/evidence/release;
6. an accepted advisory deviation remaining visible as delivery/normative debt;
7. a non-waivable gate blocking release only because explicit enforcement authority requires it.
