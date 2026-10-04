export type ProviderCandidate = Readonly<{
  ref: string;
  capability: string;
  revisionRef: string;
}>;

export type ProviderBindingInput = Readonly<{
  id: string;
  capability: string;
  providerRef: string;
  providerRevisionRef: string;
  portability: "portable" | "exit-requested";
}>;

export type ProviderBinding = Readonly<ProviderBindingInput>;

const token = (value: string, field: string): string => {
  const normalized = value.trim();
  if (!normalized || /\s/.test(normalized)) throw new Error(`Invalid ${field}`);
  return normalized;
};

const candidateKey = (candidate: ProviderCandidate): string => `${candidate.ref}@${candidate.revisionRef}`;

const indexCandidates = (candidates: readonly ProviderCandidate[]): Map<string, ProviderCandidate> => {
  const byKey = new Map<string, ProviderCandidate>();
  const seenRefs = new Set<string>();
  for (const candidate of candidates) {
    const canonical = Object.freeze({
      ref: token(candidate.ref, "provider ref"),
      capability: token(candidate.capability, "provider capability"),
      revisionRef: token(candidate.revisionRef, "provider revision"),
    });
    if (seenRefs.has(canonical.ref) || byKey.has(candidateKey(canonical))) throw new Error("Duplicate or ambiguous provider ref");
    seenRefs.add(canonical.ref);
    byKey.set(candidateKey(canonical), canonical);
  }
  return byKey;
};

export const createProviderBinding = (
  input: ProviderBindingInput,
  candidates: readonly ProviderCandidate[],
): ProviderBinding => {
  const id = token(input.id, "binding identity");
  const capability = token(input.capability, "binding capability");
  const providerRef = token(input.providerRef, "provider ref");
  const providerRevisionRef = token(input.providerRevisionRef, "provider revision");
  if (input.portability !== "portable" && input.portability !== "exit-requested") throw new Error("Invalid portability intent");
  const indexed = indexCandidates(candidates);
  const candidate = indexed.get(`${providerRef}@${providerRevisionRef}`);
  if (!candidate || candidate.capability !== capability) throw new Error("Unknown, stale, or incompatible provider ref");
  return Object.freeze({ id, capability, providerRef, providerRevisionRef, portability: input.portability });
};

export const substituteProvider = (
  binding: ProviderBinding,
  next: Readonly<{ providerRef: string; providerRevisionRef: string }>,
  candidates: readonly ProviderCandidate[],
): ProviderBinding => {
  const providerRef = token(next.providerRef, "provider ref");
  const providerRevisionRef = token(next.providerRevisionRef, "provider revision");
  const indexed = indexCandidates(candidates);
  const candidate = indexed.get(`${providerRef}@${providerRevisionRef}`);
  if (!candidate || candidate.capability !== binding.capability) throw new Error("Unknown, stale, or incompatible provider ref");
  if (binding.providerRef === providerRef && binding.providerRevisionRef === providerRevisionRef) return binding;
  return Object.freeze({ ...binding, providerRef, providerRevisionRef });
};

export const requestProviderExit = (binding: ProviderBinding): ProviderBinding =>
  binding.portability === "exit-requested" ? binding : Object.freeze({ ...binding, portability: "exit-requested" as const });
