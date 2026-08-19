<#
.SYNOPSIS
  Local Sprint orchestrator for System Builder (Windows/native PowerShell).

.DESCRIPTION
  Executes every committed TASK of a Sprint in dependency order, one OpenCode
  session per TASK, using the repository as the single source of truth.
  Afterwards it runs Sprint closure: repository-wide final verification, the
  Sprint Report, one closure commit, and (optionally) opens the Sprint Review PR.

.PARAMETER SprintId
  Required. Sprint ID, e.g. P10-TLS-SERVER-IDENTITY-01.

.PARAMETER Model
  OpenCode provider/model. Default: opencode/deepseek-v4-flash-free

.PARAMETER Branch
  Sprint branch. Default: sprint/<SprintId>

.PARAMETER Package
  Parent Work Package ID (optional).

.PARAMETER SkipTasks
  Skip TASK execution; run closure only.

.PARAMETER OpenPr
  Open the Sprint Review PR at the end.

.PARAMETER VerifyRemote
  Require GitHub Deterministic CI to pass before leaving the PR open.

.EXAMPLE
  .\scripts\sprint-run-local.ps1 P10-TLS-SERVER-IDENTITY-01 -Package P10-PACKAGE-01 -OpenPr
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$SprintId,
  [string]$Model = "opencode/deepseek-v4-flash-free",
  [string]$Branch = "",
  [string]$Package = "",
  [switch]$SkipTasks,
  [switch]$OpenPr,
  [switch]$VerifyRemote
)

$ErrorActionPreference = "Stop"

if (-not $Branch) { $Branch = "sprint/$SprintId" }

$RepoRoot = git rev-parse --show-toplevel
$Manifest = Join-Path $RepoRoot "project_docs/execution_planning/$SprintId.md"
$Report = Join-Path $RepoRoot "project_docs/execution_planning/$SprintId.report.md"

if (-not (Test-Path $Manifest)) {
  Write-Error "Sprint manifest not found: $Manifest"
}

function Assert-CleanTree {
  $status = git status --porcelain
  if ($status) {
    Write-Error "Working tree is not clean. Commit or stash before running.`n$status"
  }
}

function Set-GitIdentity {
  git config user.name "System Builder Local Sprint Runner"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
}

function Get-TaskIds {
  # Read the manifest's "Committed TASK set" section; collect TASK-<n> ids.
  $content = Get-Content $Manifest -Raw
  $section = [regex]::Match($content, "(?s)## Committed TASK set.*?(?=^## )").Value
  if (-not $section) { $section = $content }
  $ids = [regex]::Matches($section, 'TASK-\d+') | ForEach-Object { $_.Value } | Sort-Object -Unique
  return @($ids)
}

function Build-TaskPrompt {
  param([string]$TaskId)
  $wp = if ($Package) { "Parent Work Package: $Package." } else { "Standalone Sprint mode." }
  return @"
Execute exactly ONE bounded unit of Sprint $SprintId on branch $Branch.
$wp

The repository is the sole technical source of truth. Start with AGENTS.md and follow its required authority chain. Read project_docs/schedule/SPRINT_MODE.md, the parent Work Package when present, the committed Sprint manifest, the selected TASK specification, every context_paths entry, and all applicable contracts/ADRs before editing.

This is a disposable OpenCode session. Never rely on previous OpenCode session history. Work Package authorization never overrides repository scope, forbidden paths, L3/L4 escalation, ADR acceptance requirements, security gates, destructive-migration gates or conflicting authorities.

Control rule:
1. If an eligible committed TASK remains in Sprint dependency order, execute exactly the NEXT ONE TASK only. Confirm depends_on, allowed_paths, forbidden_paths, max_files and validation commands before editing. Implement only that TASK, run its declared validations, update its authorized durable evidence/status when required, and create exactly one authoritative commit for that TASK. Then STOP. Do not begin the following TASK.
2. If all committed TASKs are already implemented/evidenced and the Sprint has not been closed, perform Sprint closure only: run the Sprint final verification, update required repository evidence/docs, create project_docs/execution_planning/$SprintId.report.md, and commit the closure. Do not create or start the next Sprint. Then STOP.
3. If an explicit Sprint Mode escalation condition is reached, do not widen scope or invent policy. Leave the repository in a safe state, report the blocker, and STOP.

Do not modify .github/** or tooling/** unless the active TASK explicitly authorizes those paths. Do not write directly to main. Do not merge anything. Do not create a PR; the orchestrator owns the Sprint PR boundary.

Before returning, ensure there are no uncommitted repository changes. A TASK execution must have one distinct TASK commit; Sprint closure may have one closure/report commit.
"@
}

function Invoke-OneSession {
  param([string]$TaskId, [int]$Cycle)
  $prompt = Build-TaskPrompt -TaskId $TaskId
  Write-Host ">>> [$TaskId] starting OpenCode session (cycle $Cycle, model $Model)..."
  git add -A
  git commit -m "chore: local sprint baseline" --allow-empty
  $baseSha = git rev-parse HEAD
  & opencode run --auto --model $Model --title "$SprintId`:local-$TaskId" $prompt
  if ($LASTEXITCODE -ne 0) {
    Write-Error "[$TaskId] OpenCode session failed with exit code $LASTEXITCODE"
  }
  $headSha = git rev-parse HEAD
  if ($headSha -eq $baseSha) {
    Write-Host "Warning: [$TaskId] produced no commit. Continuing."
    return
  }
  $count = (git rev-list --count "$baseSha..$headSha").Trim()
  if ($count -ne "1") {
    Write-Error "Expected exactly one authoritative commit for $TaskId; found $count.`n$(git log --oneline "$baseSha..$headSha")"
  }
  git log --oneline "$baseSha..$headSha"
}

# ---------------------------------------------------------------------------
Assert-CleanTree
Set-GitIdentity
git fetch origin main --tags

$branchExists = git ls-remote --exit-code --heads origin $Branch 2>$null
if ($LASTEXITCODE -eq 0) {
  git fetch origin $Branch
  git switch $Branch
  git merge --ff-only "origin/$Branch"
} else {
  git switch -c $Branch origin/main
  git push --set-upstream origin $Branch
}

$BaseSha = git rev-parse HEAD
Write-Host "Sprint branch: $Branch (base $BaseSha)"

if (-not $SkipTasks) {
  $TaskIds = Get-TaskIds
  if ($TaskIds.Count -eq 0) {
    Write-Error "No committed TASK set found in $Manifest"
  }
  Write-Host "Committed TASK order: $($TaskIds -join ' ')"
  $cycle = 1
  foreach ($TaskId in $TaskIds) {
    Invoke-OneSession -TaskId $TaskId -Cycle $cycle
    git push origin $Branch
    $BaseSha = git rev-parse HEAD
    $cycle++
  }
}

# ---------------------------------------------------------------------------
# Closure
# ---------------------------------------------------------------------------
if (-not (Test-Path $Report)) {
  Write-Host "No Sprint Report found; running closure session."
  Invoke-OneSession -TaskId "CLOSURE" -Cycle $cycle
}

if (-not (Test-Path $Report)) {
  Write-Error "Closure session did not create $Report"
}

Write-Host "Sprint Report present; running repository-wide final verification."
npm run verify
if ($LASTEXITCODE -ne 0) {
  Write-Error "npm run verify failed."
}

git push origin $Branch
Write-Host "Sprint branch pushed: $Branch"

if ($OpenPr) {
  Write-Host "Opening Sprint Review PR."
  $pr = gh pr list --head $Branch --base main --state open --json number --jq '.[0].number // empty' 2>$null
  if (-not $pr) {
    $body = if ($Package) {
      "Intermediate Sprint of explicitly authorized Work Package $Package. Sprint closure verification passed. This PR may be automatically integrated only after required GitHub checks pass; repository escalation gates still override package authorization."
    } else {
      "Automated Sprint execution reached its repository-defined closure report and passed repository-wide verification. Human Sprint Review and merge remain required."
    }
    gh pr create --base main --head $Branch --title "$SprintId`: Sprint Review" --body $body
    $pr = gh pr list --head $Branch --base main --state open --json number --jq '.[0].number // empty' 2>$null
  }
  Write-Host "Sprint Review PR: #$pr"
  if ($VerifyRemote -and $pr) {
    Write-Host "Waiting for GitHub Deterministic CI on PR #$pr."
    gh pr checks $pr --watch --interval 10
  }
}

Write-Host "Sprint $SprintId complete on branch $Branch."