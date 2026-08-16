# Next Work — Review P4-MIGRATION-STATE-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Review PR #168 for `P4-MIGRATION-STATE-01 — Deterministic State and Migration Materialization`.

## Review checklist

1. require final Deterministic CI `npm run verify` PASS on the closure head;
2. verify TASK-073..075 remain in dependency order with one distinct commit per TASK;
3. verify Runtime state/migration metadata remains bounded and carries no resolved secret/reference;
4. verify Compiler migration assets use existing ReleaseArtifact integrity rather than a canonical schema expansion;
5. verify Deploy preflight runs after verified ArtifactPayload retrieval and before secret resolution/materialization;
6. verify malformed/missing/hash-mismatched migration evidence fails before activation;
7. verify migration content is never executed and no PostgreSQL connection is opened;
8. verify ADR-0002/ADR-0007 and canonical contracts remain unchanged.

## After PR #168 merges

Do not automatically execute the successor. Await a new explicit instruction, then re-read `AGENTS.md`, current repository authority and actual merged Sprint outputs before deciding whether `P4-POSTGRES-STATE-01` / TASK-076..078 are still the next ready unit and materializing them.
