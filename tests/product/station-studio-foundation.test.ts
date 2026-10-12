import assert from "node:assert/strict";
import test from "node:test";
import { INSTALLED_STUDIO_AREAS, createStudioFoundation, switchStudioArea, updateStudioSnapshot, validateStudioDescriptors } from "../../apps/station/web/app/station-studio-foundation.js";
const identity = { artifactId: "artifact:one", artifactVersion: "1.0.0" };
const snapshot = { area: "workflow", generation: 1, identity, selection: { ...identity, ref: "state:open" }, contextRef: "technical-process:ticket", dirty: true, pending: false };
test("WP01 installed descriptors are immutable exact presentation declarations, not grants", () => {
  assert.equal(validateStudioDescriptors(INSTALLED_STUDIO_AREAS), true);
  assert.equal(Object.isFrozen(INSTALLED_STUDIO_AREAS[0]), true);
  for (const bad of [[], [...INSTALLED_STUDIO_AREAS, INSTALLED_STUDIO_AREAS[0]], [INSTALLED_STUDIO_AREAS[0], INSTALLED_STUDIO_AREAS[0]], [{ ...INSTALLED_STUDIO_AREAS[0], grant: "write" }, INSTALLED_STUDIO_AREAS[1]], [{ ...INSTALLED_STUDIO_AREAS[0], model: "BusinessRecipe" }, INSTALLED_STUDIO_AREAS[1]]]) assert.equal(validateStudioDescriptors(bad), false);
  let invoked = false;
  const hostile = Object.defineProperty({}, "id", { enumerable: true, get() { invoked = true; return "workflow"; } });
  assert.equal(validateStudioDescriptors([hostile, INSTALLED_STUDIO_AREAS[0]]), false); assert.equal(invoked, false);
});
test("WP01 qualified snapshots survive independent area switching without context aliasing", () => {
  const initial = createStudioFoundation(), workflow = updateStudioSnapshot(initial, "workflow", snapshot);
  assert.equal(workflow.accepted, true);
  const context = updateStudioSnapshot(workflow.state, "process-context", { ...snapshot, area: "process-context", contextRef: "process:independent", identity: { ...identity, artifactId: "context:one" }, selection: null });
  assert.equal(context.accepted, true); assert.equal(context.state.active, "process-context");
  const switched = switchStudioArea(context.state, "workflow"); assert.equal(switched.accepted, true);
  assert.strictEqual(switched.state.snapshots, context.state.snapshots);
  assert.equal(switched.state.snapshots.workflow?.selection?.ref, "state:open");
  assert.equal(switched.state.snapshots["process-context"]?.contextRef, "process:independent");
  assert.equal(initial.snapshots.workflow, null);
  assert.strictEqual(switchStudioArea(switched.state, "recipe").state, switched.state);
});
test("WP01 malformed, foreign, stale and cross-artifact snapshot input never mutates prior state", () => {
  const good = updateStudioSnapshot(createStudioFoundation(), "workflow", snapshot).state;
  for (const bad of [null, { ...snapshot, token: "secret" }, { ...snapshot, area: "process-context" }, { ...snapshot, generation: -1 }, { ...snapshot, generation: NaN }, { ...snapshot, generation: 0 }, { ...snapshot, dirty: false }, { ...snapshot, identity: null }, { ...snapshot, selection: { ...snapshot.selection, artifactId: "foreign" } }, { ...snapshot, selection: { ...snapshot.selection, artifactVersion: "2.0.0" } }, { ...snapshot, contextRef: "x".repeat(513) }]) {
    const r = updateStudioSnapshot(good, "workflow", bad); assert.equal(r.accepted, false); assert.strictEqual(r.state, good);
  }
  const hostile = Object.defineProperty({ ...snapshot }, "identity", { get() { throw Error("must not invoke"); }, enumerable: true });
  assert.equal(updateStudioSnapshot(good, "workflow", hostile).accepted, false);
});
test("WP01 repeated snapshot is idempotent; newer revision clears selection and preserves other model", () => {
  const state = updateStudioSnapshot(createStudioFoundation(), "workflow", snapshot).state;
  assert.strictEqual(updateStudioSnapshot(state, "workflow", snapshot).state, state);
  const next = updateStudioSnapshot(state, "workflow", { ...snapshot, generation: 2, identity: { ...identity, artifactVersion: "1.0.1" }, selection: null });
  assert.equal(next.accepted, true); assert.equal(next.state.snapshots.workflow?.identity?.artifactVersion, "1.0.1");
  assert.equal(next.state.snapshots.workflow?.selection, null);
  assert.strictEqual(next.state.snapshots["process-context"], state.snapshots["process-context"]);
  assert.equal("command" in next.state, false); assert.equal("permission" in next.state, false);
});
