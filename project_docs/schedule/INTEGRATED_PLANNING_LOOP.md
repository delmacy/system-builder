# Integrated Planning Loop

The active operating loop is repository-first and rolling-wave:

`fresh main -> reconcile current repository memory -> revalidate Work Package/WBS/contracts/DAG -> materialize at most one eligible Sprint -> execute committed TASKs -> validate -> Sprint Review/PR -> integrate -> reconstruct fresh main -> capture evidence/actuals -> update readiness/risks/forecast -> select the next policy-authorized gate`

For a newly planned Work Package, successor progression follows:

`Planning & Materialization -> Construction A -> Construction B -> [Construction C only if justified] -> Package Integration & Review -> Documentation & Closure`

Only the commitment horizon executes. READY queues, candidates and forecast Sprints support planning but cannot self-promote.

The loop is incremental while approved scope remains governed. Local planning and local Sprint execution are the current normal mechanism. AgentFactory/scheduler automation may implement this same loop in the future or when explicitly reactivated, but it must remain behaviorally subordinate to repository authority and must not become an alternate source of truth.
