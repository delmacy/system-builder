import {
  EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM,
  normalizeEvidenceProvenanceExtension,
} from "./index.js";
import { computeEvidenceProvenanceIntegrity } from "./integrity-digest.js";

export type EvidenceProvenanceIntegrityVerification =
  | Readonly<{ status: "absent" }>
  | Readonly<{ status: "invalid"; reason: "INVALID_PROVENANCE_INTEGRITY" }>
  | Readonly<{
      status: "verified" | "mismatch";
      algorithm: typeof EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM;
      suppliedDigest: string;
      computedDigest: string;
    }>;

export function verifyEvidenceProvenanceIntegrity(input: unknown): EvidenceProvenanceIntegrityVerification {
  try {
    const normalized = normalizeEvidenceProvenanceExtension(input);
    if (normalized.integrity === undefined) return Object.freeze({ status: "absent" });
    const computed = computeEvidenceProvenanceIntegrity(normalized, normalized.integrity.algorithm);
    return Object.freeze({
      status: computed.digest === normalized.integrity.digest ? "verified" : "mismatch",
      algorithm: EVIDENCE_PROVENANCE_INTEGRITY_ALGORITHM,
      suppliedDigest: normalized.integrity.digest,
      computedDigest: computed.digest,
    });
  } catch {
    return Object.freeze({ status: "invalid", reason: "INVALID_PROVENANCE_INTEGRITY" });
  }
}
