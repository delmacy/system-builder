import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

export type ArchitectureViolation = {
  file: string;
  rule: string;
  importPath: string;
};

type Rule = {
  name: string;
  sources: string[];
  forbiddenImports: string[];
};

const rules: Rule[] = [
  {
    name: "runtime-does-not-import-builder-authoring",
    sources: ["apps/runtime/", "packages/runtime-core/", "packages/workflow/", "packages/actions/"],
    forbiddenImports: [
      "apps/builder",
      "@system-builder/mirror",
      "@system-builder/business-recipe",
      "@system-builder/analysis",
      "@system-builder/design",
      "@system-builder/compiler",
      "@system-builder/release",
      "@system-builder/deployment",
    ],
  },
  {
    name: "compiler-consumes-downstream-contracts-only",
    sources: ["packages/compiler/"],
    forbiddenImports: [
      "@system-builder/mirror",
      "@system-builder/business-recipe",
      "@system-builder/analysis",
      "@system-builder/design/internal",
    ],
  },
  {
    name: "factory-does-not-import-client-code",
    sources: ["apps/", "packages/"],
    forbiddenImports: ["gestaotecnica", "secao-tecnica", "src/adaptations/"],
  },
  {
    name: "suite-modules-do-not-deep-import-siblings",
    sources: ["packages/"],
    forbiddenImports: ["@system-builder/*/src/", "@system-builder/*/internal/"],
  },
];

const importPattern = /(?:from\s+|import\s*(?:\(\s*)?)["']([^"']+)["']/g;

export function analyzeArchitecture(root = process.cwd()): ArchitectureViolation[] {
  const violations: ArchitectureViolation[] = [];
  const packageGraph = new Map<string, Set<string>>();
  for (const file of sourceFiles(root)) {
    const repositoryPath = relative(root, file).replaceAll("\\", "/");
    const source = readFileSync(file, "utf8");
    const imports = [...source.matchAll(importPattern)].map((match) => match[1]).filter(Boolean) as string[];
    const sourcePackage = packageName(repositoryPath);
    if (sourcePackage) packageGraph.set(sourcePackage, packageGraph.get(sourcePackage) ?? new Set());
    for (const importPath of imports) {
      const targetPackage = importPath.match(/^@system-builder\/([^/]+)/)?.[1];
      if (sourcePackage && targetPackage && sourcePackage !== targetPackage) {
        packageGraph.get(sourcePackage)?.add(targetPackage);
      }
      if (sourcePackage && importPath.startsWith(".")) {
        const target = relative(root, resolve(dirname(file), importPath)).replaceAll("\\", "/");
        const relativeTargetPackage = packageName(target);
        if (relativeTargetPackage && relativeTargetPackage !== sourcePackage) {
          violations.push({ file: repositoryPath, rule: "suite-modules-use-public-package-imports", importPath });
        }
      }
    }
    for (const rule of rules) {
      if (!rule.sources.some((prefix) => repositoryPath.startsWith(prefix))) continue;
      for (const importPath of imports) {
        if (rule.forbiddenImports.some((pattern) => importMatches(importPath, pattern))) {
          violations.push({ file: repositoryPath, rule: rule.name, importPath });
        }
      }
    }
  }
  for (const cycle of packageCycles(packageGraph)) {
    violations.push({ file: `packages/${cycle[0]}`, rule: "no-circular-package-dependencies", importPath: cycle.join(" -> ") });
  }
  return violations;
}

function sourceFiles(root: string): string[] {
  return ["apps", "packages"].flatMap((directory) => walk(resolve(root, directory)));
}

function walk(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.[cm]?[jt]sx?$/.test(name) ? [path] : [];
  });
}

function importMatches(importPath: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("*", "[^/]+");
  return new RegExp(`(?:^|/)${escaped}`).test(importPath);
}

function packageName(repositoryPath: string): string | undefined {
  return repositoryPath.match(/^packages\/([^/]+)\//)?.[1];
}

function packageCycles(graph: Map<string, Set<string>>): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const active: string[] = [];
  const visit = (node: string): void => {
    const activeIndex = active.indexOf(node);
    if (activeIndex >= 0) {
      cycles.push([...active.slice(activeIndex), node]);
      return;
    }
    if (visited.has(node)) return;
    active.push(node);
    for (const dependency of graph.get(node) ?? []) visit(dependency);
    active.pop();
    visited.add(node);
  };
  for (const node of graph.keys()) visit(node);
  return cycles;
}
