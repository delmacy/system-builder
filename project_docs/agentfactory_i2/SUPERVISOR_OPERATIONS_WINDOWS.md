# AgentFactory Supervisor — Windows Operations

## Operating boundary

The Supervisor is a finite local command runner. Each invocation reconstructs state from repository, GitHub and `.agent/runtime/supervisor`, acquires an expiring per-pipeline lease, performs at most one coordinator/orchestrator action, durably appends its event and exits. Local callbacks start a new finite invocation only after the current stack releases its lease. Heartbeat performs one recovery scan; it is not the primary scheduler and never loops.

Callback fields are untrusted wake hints. A callback causes a complete re-observation and cannot assert CI, approval, evidence, ledger, readiness or completion. Missing or divergent AFEV/ledger/readiness remains blocked rather than being inferred from a task status.

## Prerequisites

Run from a synchronized, clean `C:\Users\admin\Documents\system-builder` checkout with Node 24, npm 11, Git, authenticated `gh`, configured OpenCode and the external approval store:

```powershell
$repo = 'C:\Users\admin\Documents\system-builder'
$plan = 'C:\secure\system-builder-i2-task-010.plan.json'
$pipeline = 'system-builder-i2-task-010'
$correlation = "i2-task-010-$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
$env:SYSTEM_BUILDER_HUMAN_APPROVAL_DIR = 'C:\secure\approvals'
$env:OPENCODE_EXECUTABLE = 'opencode'
Set-Location -LiteralPath $repo
npm ci
npm run verify
```

`OPENCODE_MODEL` may be set when the authorized plan route names the same model. OpenCode remains the only automatic implementation executor. Architecture/high-risk tasks retain their human/strong-model gate.

## Explicit plan

The Supervisor never selects the global READY queue. It requires a strict external JSON plan whose ordered membership, work package and route were separately authorized. Do not create or use the following TASK-010 plan until the supplemental readiness gate records GO:

```powershell
$model = $env:OPENCODE_MODEL
if ([string]::IsNullOrWhiteSpace($model)) { throw 'Set OPENCODE_MODEL to the authorized OpenCode model first.' }
$planDocument = [ordered]@{
  schema_version = 1
  pipeline = [ordered]@{
    schema_version = 1
    focus = 'M1 ArtifactEnvelope prerequisite'
    milestones = @('M1')
    ordered_task_ids = @('TASK-010')
  }
  execution = [ordered]@{
    'TASK-010' = [ordered]@{
      work_package_id = 'WP-FH-01'
      route = [ordered]@{
        risk = 'MEDIUM'
        model_tier = 'T2'
        executor = 'opencode'
        model = $model
        architecture_impact = $false
        decision = 'SELECTED'
        rationale_code = 'BOUNDED_MODERATE_RISK'
      }
    }
  }
}
[IO.File]::WriteAllText($plan, ($planDocument | ConvertTo-Json -Depth 8), [Text.UTF8Encoding]::new($false))
```

The later I2 proof plan is `TASK-004 -> TASK-005 -> TASK-006`, only after TASK-010 is integrated and accepted. Architecture tasks are not silently routed to OpenCode.

## Finite commands

Start performs one safe iteration and returns immediately after durable event/callback handling:

```powershell
npm run pipeline:start -- --plan $plan --pipeline $pipeline --correlation $correlation
```

Status is read-only and returns the replayed projection plus the last durable event:

```powershell
npm run pipeline:status -- --plan $plan --pipeline $pipeline
```

After an external fact changes, obtain the durable wake identity and invoke one callback:

```powershell
$status = npm run --silent pipeline:status -- --plan $plan --pipeline $pipeline | ConvertFrom-Json
npm run pipeline:callback -- --plan $plan --pipeline $pipeline --event $status.last_event.event_id --correlation $status.projection.correlation_id --reason 'external-state-changed'
```

Heartbeat performs one recovery scan across locally known pipelines:

```powershell
npm run pipeline:heartbeat -- --plan $plan
```

Resume performs one due/recoverable iteration for the named pipeline:

```powershell
npm run pipeline:resume -- --plan $plan --pipeline $pipeline
```

## Windows Task Scheduler heartbeat

Register a five-minute recovery heartbeat under the current Windows identity. This is a finite trigger, not a resident process:

```powershell
$heartbeatCommand = "& { `$env:SYSTEM_BUILDER_HUMAN_APPROVAL_DIR='C:\secure\approvals'; npm.cmd run pipeline:heartbeat -- --plan 'C:\secure\system-builder-i2-task-010.plan.json' }"
$action = New-ScheduledTaskAction -Execute "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" -Argument "-NoProfile -NonInteractive -ExecutionPolicy Bypass -Command `"$heartbeatCommand`"" -WorkingDirectory 'C:\Users\admin\Documents\system-builder'
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5)
Register-ScheduledTask -TaskName 'SystemBuilder-AgentFactory-Heartbeat' -Action $action -Trigger $trigger -Description 'Finite AgentFactory callback/retry recovery heartbeat' -Force
```

Inspect or remove it with `Get-ScheduledTask -TaskName 'SystemBuilder-AgentFactory-Heartbeat'` and `Unregister-ScheduledTask -TaskName 'SystemBuilder-AgentFactory-Heartbeat' -Confirm:$false`.

## Recovery

- Re-run `pipeline:status` after restart; the projection is replayed exclusively from event files.
- Use `pipeline:callback` only after an external fact changes; its payload does not authorize that fact.
- Use `pipeline:resume` for an explicitly due retry or manual continuation.
- Use `pipeline:heartbeat` for lost callback, stale-operation and retry recovery. A healthy pipeline returns `NO_OP`.
- A terminal `BLOCKED`, `FAILED`, `NEEDS_DECISION`, `RETRY_EXHAUSTED` or `COMPLETE` state is not bypassed. Resolve governance/evidence and start a separately authorized recovery pipeline when required.
