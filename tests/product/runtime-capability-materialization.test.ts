import assert from "node:assert/strict";
import test from "node:test";
import { materializeAssemblyRuntimeCapabilities } from "../../packages/compiler/runtime-capabilities.js";

const stateComponent = {
  capability: "state.counter",
  provider: "system-builder.postgres-counter",
  version: "1.0.0",
} as const;

function plan(components: readonly { capability: string; provider: string; version: string }[]) {
  return { kind: "AssemblyPlan" as const, components };
}

test("selected reference state.counter provider materializes deterministic symbolic PostgreSQL state requirement", () => {
  const first = materializeAssemblyRuntimeCapabilities(plan([
    { capability: "auth.basic", provider: "provider-auth", version: "1.0.0" },
    stateComponent,
  ]));
  const second = materializeAssemblyRuntimeCapabilities(plan([
    stateComponent,
    { capability: "auth.basic", provider: "provider-auth", version: "1.0.0" },
  ]));

  assert.deepEqual(first, second);
  assert.deepEqual(first.stateRequirements, [
    {
      kind: "RuntimeStateRequirement",
      capability: "state.counter",
      storeKind: "sql",
      connectionBinding: { name: "DATABASE_URL", kind: "secret-reference" },
      migrations: [
        {
          id: "state-counter-v1",
          capability: "state.counter",
          order: 10,
          path: "migrations/001-state-counter.sql",
          content: "CREATE TABLE runtime_counter (id INTEGER PRIMARY KEY, value INTEGER NOT NULL);",
        },
      ],
    },
  ]);

  const serialized = JSON.stringify(first);
  assert.equal(serialized.includes("secret://"), false);
  assert.equal(serialized.includes("postgres://"), false);
  assert.equal(serialized.includes('"value"'), false);
});

test("unrelated AssemblyPlan capabilities materialize no Runtime state", () => {
  assert.deepEqual(
    materializeAssemblyRuntimeCapabilities(plan([
      { capability: "auth.basic", provider: "provider-auth", version: "1.0.0" },
      { capability: "workflow.engine", provider: "provider-workflow", version: "1.0.0" },
    ])),
    { stateRequirements: [] },
  );
});

test("selected unsupported state.counter provider or duplicate selection fails explicitly", () => {
  assert.throws(
    () => materializeAssemblyRuntimeCapabilities(plan([
      { capability: "state.counter", provider: "other.postgres-counter", version: "1.0.0" },
    ])),
    /COMPILER_RUNTIME_CAPABILITY_UNSUPPORTED:state\.counter:other\.postgres-counter:1\.0\.0/,
  );

  assert.throws(
    () => materializeAssemblyRuntimeCapabilities(plan([stateComponent, stateComponent])),
    /COMPILER_RUNTIME_CAPABILITY_DUPLICATE:state\.counter/,
  );
});
