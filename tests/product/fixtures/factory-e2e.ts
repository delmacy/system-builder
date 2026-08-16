export const factoryRecipe = {
  modules: [{ requirementIds: ["REQ-1", "REQ-2"] }],
  rules: [],
  responsibilities: [],
  exceptions: [],
};

export const factoryAnalysis = {
  findings: [
    { recipeRequirementRefs: ["REQ-1"] },
    { recipeRequirementRefs: ["REQ-2"] },
  ],
};

export const factorySystemDefinition = {
  definition: "SystemDefinition" as const,
  analysisRef: "analysis:e2e:1",
  recipeRef: "recipe:e2e:1",
  entities: [{ id: "user", name: "User", requirementRefs: ["REQ-1"], fields: [] }],
  processes: [{ id: "approval", name: "Approval", requirementRefs: ["REQ-2"], states: ["open", "done"] }],
  actions: [],
  capabilities: [
    { id: "cap-auth", capability: "auth.basic", requirementRefs: ["REQ-1"] },
    { id: "cap-workflow", capability: "workflow.engine", requirementRefs: ["REQ-2"] },
  ],
  views: [],
  permissions: [],
  policies: [],
  integrations: [],
  environmentRequirements: [
    { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
    { name: "LOG_LEVEL", kind: "config" as const, required: false },
  ],
};

export const factoryCatalogRecords = [
  { capability: "auth.basic", provider: "provider-auth", version: "1.0.0" },
  { capability: "workflow.engine", provider: "provider-workflow", version: "1.0.0" },
] as const;

export const factoryEnvironmentSchema = [
  { name: "DATABASE_URL", kind: "secret-reference" as const, required: true },
  { name: "LOG_LEVEL", kind: "config" as const, required: false },
] as const;
