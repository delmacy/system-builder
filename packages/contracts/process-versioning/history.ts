import {
  PROCESS_SYSTEM_LINEAGE_VERSION,
  normalizeProcessSystemLineageEndpoint,
  normalizeProcessSystemLineageHop,
  type ProcessRevisionLineageEndpoint,
  type ProcessSystemLineageEndpoint,
  type ProcessSystemLineageHop,
  type ProcessSystemLineageHopKind,
  type ReferencedLineageEndpoint,
} from "./lineage.js";
import { normalizeProcessRevisionIdentity } from "./index.js";

export type CompleteProcessSystemHistory = Readonly<{
  contractVersion: typeof PROCESS_SYSTEM_LINEAGE_VERSION;
  processRevision: ProcessRevisionLineageEndpoint;
  analysis: ReferencedLineageEndpoint & { readonly kind: "analysis" };
  systemDefinition: ReferencedLineageEndpoint & { readonly kind: "system-definition" };
  release: ReferencedLineageEndpoint & { readonly kind: "release" };
  deployment: ReferencedLineageEndpoint & { readonly kind: "deployment" };
  hops: readonly [ProcessSystemLineageHop, ProcessSystemLineageHop, ProcessSystemLineageHop, ProcessSystemLineageHop];
}>;

const ORDER: readonly ProcessSystemLineageHopKind[] = [
  "process-revision-to-analysis",
  "analysis-to-system-definition",
  "system-definition-to-release",
  "release-to-deployment",
];

function fingerprint(endpoint: ProcessSystemLineageEndpoint): string {
  return endpoint.kind === "process-revision"
    ? `${endpoint.kind}:${endpoint.processRevision.artifactRef}:${endpoint.processRevision.revisionRef}`
    : `${endpoint.kind}:${endpoint.identityRef}`;
}

export function queryCompleteProcessSystemHistory(
  processRevision: unknown,
  evidence: readonly unknown[],
): CompleteProcessSystemHistory {
  const revision = normalizeProcessRevisionIdentity(processRevision);
  const anchor = normalizeProcessSystemLineageEndpoint({
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    kind: "process-revision",
    processRevision: revision,
  });
  if (anchor.kind !== "process-revision") throw new Error("history anchor must be process-revision");
  if (!Array.isArray(evidence) || evidence.length === 0) throw new Error("process-system history evidence must be non-empty");

  const hops = evidence.map((candidate) => normalizeProcessSystemLineageHop(candidate));
  const selected: ProcessSystemLineageHop[] = [];
  let current: ProcessSystemLineageEndpoint = anchor;

  for (const kind of ORDER) {
    const matches = hops.filter((hop) => hop.kind === kind && fingerprint(hop.from) === fingerprint(current));
    if (matches.length === 0) throw new Error(`process-system history is incomplete at ${kind}`);
    if (matches.length > 1) throw new Error(`process-system history is ambiguous at ${kind}`);
    const hop = matches[0]!;
    selected.push(hop);
    current = hop.to;
  }

  const [first, second, third, fourth] = selected;
  if (!first || !second || !third || !fourth) throw new Error("process-system history is incomplete");
  if (first.to.kind !== "analysis") throw new Error("process-system history analysis endpoint is invalid");
  if (second.to.kind !== "system-definition") throw new Error("process-system history definition endpoint is invalid");
  if (third.to.kind !== "release") throw new Error("process-system history release endpoint is invalid");
  if (fourth.to.kind !== "deployment") throw new Error("process-system history deployment endpoint is invalid");

  const analysis = first.to;
  const systemDefinition = second.to;
  const release = third.to;
  const deployment = fourth.to;
  const ordered: readonly [ProcessSystemLineageHop, ProcessSystemLineageHop, ProcessSystemLineageHop, ProcessSystemLineageHop] = Object.freeze([first, second, third, fourth]);

  return Object.freeze({
    contractVersion: PROCESS_SYSTEM_LINEAGE_VERSION,
    processRevision: anchor,
    analysis: Object.freeze({ contractVersion: analysis.contractVersion, kind: "analysis", identityRef: analysis.identityRef }),
    systemDefinition: Object.freeze({ contractVersion: systemDefinition.contractVersion, kind: "system-definition", identityRef: systemDefinition.identityRef }),
    release: Object.freeze({ contractVersion: release.contractVersion, kind: "release", identityRef: release.identityRef }),
    deployment: Object.freeze({ contractVersion: deployment.contractVersion, kind: "deployment", identityRef: deployment.identityRef }),
    hops: ordered,
  });
}
