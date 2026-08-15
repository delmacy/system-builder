# Sprint Closure

A Sprint closes when its Goal and Definition of Done are met and the integrated Sprint branch is ready for review.

In Sprint Mode, closure requires:

- all committed TASK acceptance criteria satisfied;
- declared per-TASK validations passing;
- one distinct commit per TASK;
- final repository-wide verification passing;
- required durable documentation/contracts/evidence updated;
- Sprint Report produced;
- one PR from `sprint/<SPRINT-ID>` to `main` ready for Sprint Review.

The human integration decision occurs at the Sprint PR boundary. The next Sprint does not begin automatically.

Later discoveries become explicit successor or corrective backlog items. Bounded adjustment during an active Sprint is reserved for work needed to satisfy its existing Goal and authorized TASK scope.

This preserves execution history while allowing future planning to learn from completed work without requiring per-TASK PR/state-closure cycles.
