export const PRIVACY_CLASSIFICATIONS = ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED"] as const;
export type PrivacyClassification = (typeof PRIVACY_CLASSIFICATIONS)[number];
export type PrivacyCoverage = "COMPLETE" | "PARTIAL" | "UNKNOWN";
export type PrivacyDispositionState = "ELIGIBLE" | "BLOCKED" | "INDETERMINATE";

export type PrivacyPopulation = Readonly<{
  populationId: string;
  policyRef: string;
  policyRevisionRef: string;
  classification: PrivacyClassification;
  sourceProviderRef: string;
  currentProviderRef: string;
  sourceRef: string;
  residencyRefs: readonly string[];
  retainedUntil: string;
  legalHoldRefs: readonly string[];
  inventoryCoverage: PrivacyCoverage;
  migrationCoverage: PrivacyCoverage;
  residualPopulationRefs: readonly string[];
}>;

export type PrivacyDispositionAssessment = Readonly<{
  populationId: string;
  policyRef: string;
  policyRevisionRef: string;
  state: PrivacyDispositionState;
  reasons: readonly string[];
  residualPopulationRefs: readonly string[];
}>;

const TOKEN = /^\S+$/;
const UTC = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]+)?Z$/;
function token(value: unknown, path: string): string { if(typeof value!=="string"||!TOKEN.test(value)) throw new TypeError(`Invalid privacy governance contract at ${path}`); return value; }
function time(value: unknown, path: string): string { if(typeof value!=="string"||!UTC.test(value)) throw new TypeError(`Invalid privacy governance contract at ${path}`); return value; }
function refs(value: unknown, path: string): readonly string[] { if(!Array.isArray(value)) throw new TypeError(`Invalid privacy governance contract at ${path}`); const out=value.map((v,i)=>token(v,`${path}[${i}]`)); if(new Set(out).size!==out.length) throw new TypeError(`Invalid privacy governance contract at ${path}: duplicate reference`); return [...out].sort(); }
function coverage(value: unknown, path: string): PrivacyCoverage { if(value!=="COMPLETE"&&value!=="PARTIAL"&&value!=="UNKNOWN") throw new TypeError(`Invalid privacy governance contract at ${path}`); return value; }

export function normalizePrivacyPopulation(input: unknown): PrivacyPopulation {
  if(!input||typeof input!=="object"||Array.isArray(input)) throw new TypeError("Invalid privacy governance contract at $population");
  const v=input as Record<string,unknown>;
  const allowed=new Set(["populationId","policyRef","policyRevisionRef","classification","sourceProviderRef","currentProviderRef","sourceRef","residencyRefs","retainedUntil","legalHoldRefs","inventoryCoverage","migrationCoverage","residualPopulationRefs"]);
  const unexpected=Object.keys(v).filter(k=>!allowed.has(k)); if(unexpected.length) throw new TypeError(`Invalid privacy governance contract at $population.${unexpected.sort()[0]}`);
  if(!PRIVACY_CLASSIFICATIONS.includes(v.classification as PrivacyClassification)) throw new TypeError("Invalid privacy governance contract at $population.classification");
  return {populationId:token(v.populationId,"$population.populationId"),policyRef:token(v.policyRef,"$population.policyRef"),policyRevisionRef:token(v.policyRevisionRef,"$population.policyRevisionRef"),classification:v.classification as PrivacyClassification,sourceProviderRef:token(v.sourceProviderRef,"$population.sourceProviderRef"),currentProviderRef:token(v.currentProviderRef,"$population.currentProviderRef"),sourceRef:token(v.sourceRef,"$population.sourceRef"),residencyRefs:refs(v.residencyRefs,"$population.residencyRefs"),retainedUntil:time(v.retainedUntil,"$population.retainedUntil"),legalHoldRefs:refs(v.legalHoldRefs,"$population.legalHoldRefs"),inventoryCoverage:coverage(v.inventoryCoverage,"$population.inventoryCoverage"),migrationCoverage:coverage(v.migrationCoverage,"$population.migrationCoverage"),residualPopulationRefs:refs(v.residualPopulationRefs,"$population.residualPopulationRefs")};
}

export function assessPrivacyDisposition(population: PrivacyPopulation, at: string, observedResidencyRef?: string): PrivacyDispositionAssessment {
  const instant=Date.parse(time(at,"$at"));
  const result=(state:PrivacyDispositionState,reasons:readonly string[]):PrivacyDispositionAssessment=>({populationId:population.populationId,policyRef:population.policyRef,policyRevisionRef:population.policyRevisionRef,state,reasons,residualPopulationRefs:population.residualPopulationRefs});
  if(population.legalHoldRefs.length>0) return result("BLOCKED",["LEGAL_HOLD"]);
  if(instant<Date.parse(population.retainedUntil)) return result("BLOCKED",["RETENTION_ACTIVE"]);
  if(observedResidencyRef!==undefined&&!population.residencyRefs.includes(observedResidencyRef)) return result("BLOCKED",["RESIDENCY_VIOLATION"]);
  const reasons:string[]=[];
  if(population.inventoryCoverage!=="COMPLETE") reasons.push(`INVENTORY_${population.inventoryCoverage}`);
  if(population.migrationCoverage!=="COMPLETE") reasons.push(`MIGRATION_${population.migrationCoverage}`);
  if(population.residualPopulationRefs.length>0) reasons.push("RESIDUAL_POPULATIONS");
  if(observedResidencyRef===undefined) reasons.push("RESIDENCY_UNKNOWN");
  if(reasons.length>0) return result("INDETERMINATE",reasons);
  return result("ELIGIBLE",[]);
}
