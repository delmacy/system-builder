export type RuntimeWorkflowTransition = Readonly<{ id: string; from: string; to: string; actionRef?: string }>;
export type RuntimeWorkflowProcess = Readonly<{ id: string; states: readonly string[]; initialState?: string; transitions?: readonly RuntimeWorkflowTransition[] }>;

export type RuntimeWorkflowPlanResult = Readonly<
  | { ok: true; processId: string; transitionId: string; from: string; to: string; actionRef?: string }
  | { ok: false; code: string; detail: string }
>;

export function planRuntimeWorkflowTransition(
  processes: readonly RuntimeWorkflowProcess[],
  processId: string,
  transitionId: string,
  currentState: string | undefined,
): RuntimeWorkflowPlanResult {
  const process = processes.find((candidate) => candidate.id === processId);
  if (!process) return Object.freeze({ ok: false, code: "RUNTIME_WORKFLOW_UNKNOWN_PROCESS", detail: processId });
  if (!process.initialState) return Object.freeze({ ok: false, code: "RUNTIME_WORKFLOW_INITIAL_STATE_MISSING", detail: processId });
  const transition = process.transitions?.find((candidate) => candidate.id === transitionId);
  if (!transition) return Object.freeze({ ok: false, code: "RUNTIME_WORKFLOW_UNKNOWN_TRANSITION", detail: `${processId}:${transitionId}` });
  const effectiveState = currentState ?? process.initialState;
  if (effectiveState !== transition.from) {
    return Object.freeze({ ok: false, code: "RUNTIME_WORKFLOW_INVALID_TRANSITION", detail: `${processId}:${effectiveState}:${transitionId}` });
  }
  return Object.freeze({
    ok: true,
    processId,
    transitionId,
    from: effectiveState,
    to: transition.to,
    ...(transition.actionRef === undefined ? {} : { actionRef: transition.actionRef }),
  });
}
