# G3 Capability Synthesis

Status: FROZEN / SATURATED.

These are eight conceptual capability families and semantic-owner boundaries. They are not mandatory packages, deployables, repositories or services; logical composition != physical deployment topology.

## Eight families

1. **Semantic Model & Registry** — canonical identity; Definition/Occurrence/Realization; typed relations; revision/currentness; concepts/terminology.
2. **Knowledge & Evidence** — elicitation; claims; evidence; provenance; information artifacts; lineage; assurance material.
3. **Execution & Resolution** — workflows; actions; durable execution; mediation; compatibility; reconciliation and compensation.
4. **Governance & Authority** — decisions; policies; constraints; authority; security; workspace; exceptions; approvals.
5. **Runtime & Operations** — release/deployment/runtime; infrastructure/host/workload; providers; observation; recovery.
6. **Analysis & Decision Support** — complexity; trade-space; simulation; assurance analysis; impact and fitness.
7. **Retrieval & Projection Experience** — Canvas; graph projections; lenses; search/query; dossiers; semantic navigation.
8. **Evolution & Reuse** — variability; patterns; reference architectures; controlled change; lifecycle and retirement.

A semantic owner may be observed, analyzed, projected, governed or executed by another family without duplicating semantic authority.

## Stable boundaries

Knowledge & Evidence owns what is known/alleged and its provenance. Analysis produces qualified interpretations/findings/recommendations. Governance decides/disposes/authorizes. The canonical flow is:

`Evidence -> AnalysisOccurrence -> AnalyticalResult/Finding -> CandidateAction -> DecisionOccurrence -> AuthorizedChange`.

Metric != Decision; AI finding != canonical mutation. Assurance consumes Evidence rather than owning a second evidence store. Complexity is an Analysis specialization, not another truth graph. Semantic Linguist is cross-family: concept/mapping ownership belongs to Semantic Model; extraction/drift to Knowledge+Analysis; labels/search expansion to Retrieval. Digital Thread is typed lifecycle traversal over relations owned by domains, not a parallel canonical database. Search selects/retrieves; Canvas comprehends/navigates. Simulation is analytical occurrence; controlled experimentation is real/cohort change plus observation. Workspace is an authorized operational lens, not source of truth.

Workflow coordinates approvals; Authority determines action eligibility; Decision/Obligation own disposition/satisfaction. Authority Resolution != Approval Composition != Workflow Routing. OperationalReconciliation != SemanticConflictResolution. Conflict Detection != Conflict Ownership != Resolution Authority != Resolution Execution. Retry != Replay != Reconciliation != Compensation.

## Capability contract minimum

Every G3 capability must declare:

- semantic owner;
- accepted canonical/definition/occurrence/realization identities;
- definitions consumed and produced;
- occurrences consumed and produced;
- relation kinds and their semantics;
- authority boundary;
- evidence/currentness requirements;
- provider boundary where applicable;
- explicit UNKNOWN/PARTIAL/CONFLICTED and failure behavior;
- projection outputs;
- non-goals.

## Composition ladder

`primitive semantic constructs -> qualified relations + traits -> domain concepts -> definitions/behaviors/contracts -> components/services -> capabilities -> bounded contexts/modules -> processes/workflows -> subsystems -> systems -> federations/ecosystems`.

There is no `is-a` relation between these levels. Capability may be REALIZED_BY Component; Component may PARTICIPATE_IN Module; Workflow may USE Capability; DeploymentUnit may REALIZE Component; Organization may OWN/OPERATE System.
