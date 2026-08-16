import businessRecipeSchema from "./business-recipe.schema.json";

export const BUSINESS_RECIPE_ARTIFACT_TYPE = "urn:system-builder:business-recipe" as const;
export const BUSINESS_RECIPE_SCHEMA_ID = "https://system-builder.local/contracts/business-recipe/1.0.0/business-recipe.schema.json" as const;
export const BUSINESS_RECIPE_SCHEMA_VERSION = "1.0.0" as const;

export { businessRecipeSchema };
