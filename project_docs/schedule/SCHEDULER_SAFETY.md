# Scheduler Safety Rules

Fail closed on missing blocking dependency data. Never mark work READY because a predecessor is merely planned. Never use sprint order as evidence of readiness. Never let capacity pressure bypass validation gates. Surface ambiguity for planning/review instead of asking the coding executor to decide architecture implicitly.
