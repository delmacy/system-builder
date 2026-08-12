# Autonomous Agent Security Model

Autonomous coding adds a control surface beyond ordinary project management.

## Threats
- prompt/instruction injection from repository content, issues, dependency output or external sources;
- context poisoning/stale or conflicting instructions;
- secret exfiltration/log leakage;
- changes outside allowed paths;
- self-modification of evaluator/tests/governance to manufacture success;
- dependency/supply-chain confusion;
- destructive commands or migrations;
- privilege escalation through CI tokens;
- unbounded loops/retries/cost;
- concurrent agents corrupting the same authoritative contract;
- generated code introducing hidden network/process behavior.

## Controls
- least-privilege GitHub/CI tokens and environment permissions;
- explicit allowed/forbidden paths per task;
- immutable or separately approved evaluator/governance paths;
- no production secrets in executor context;
- bounded commands/time/retries/cost;
- dependency installation governed by lockfiles/policy;
- independent CI validation after executor completion;
- protected branches and PR-based integration;
- serialized ownership or contract gates for authoritative shared schemas;
- destructive/security-sensitive actions require elevated approval;
- treat untrusted repository/external text as data, not authority, unless explicitly part of the instruction hierarchy.

## Fail closed
Unexpected privilege requirement, missing gate, ambiguous destructive action, secret exposure risk or instruction conflict yields `BLOCKED/NEEDS_DECISION`, never best-effort autonomous execution.
