import { sha256Text } from "@system-builder/deterministic";
import {
  EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM,
  type EvidenceProvenanceIntegrity,
} from "./index.js";
import { canonicalEvidenceProvenanceIntegrityInput } from "./integrity-canonicalization.js";

export function computeEvidenceProvenanceIntegrity(
  input: unknown,
  algorithm: string = EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM,
): EvidenceProvenanceIntegrity {
  if (algorithm !== EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM) {
    throw new TypeError(`Unsupported evidence provenance integrity algorithm: ${algorithm}`);
  }
  const digest = sha256Text(canonicalEvidenceProvenanceIntegrityInput(input)).slice("sha256:".length);
  return Object.freeze({
    algorithm: EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM,
    digest,
  });
}
