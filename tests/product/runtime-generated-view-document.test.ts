import assert from "node:assert/strict";
import test from "node:test";
import { materializeRuntimeGeneratedViewDocument } from "../../packages/runtime-core/generated-view-document.js";

function model() {
  return {
    entities: [{
      id: "entity:ticket",
      fields: [
        { name: "title", type: "string", required: true },
        { name: "priority", type: "number", required: false },
        { name: "internalSecret", type: "string", required: false },
      ],
    }],
    actions: [
      { id: "action:update-ticket", effect: { kind: "entity.update", entityRef: "entity:ticket" } },
      { id: "action:delete-ticket", effect: { kind: "entity.delete", entityRef: "entity:ticket" } },
    ],
    views: [
      { id: "view:ticket-list", kind: "list", binding: { entityRef: "entity:ticket", fieldRefs: ["title"], actionRefs: [] } },
      { id: "view:ticket-detail", kind: "detail", binding: { entityRef: "entity:ticket", fieldRefs: ["title", "priority"], actionRefs: [] } },
      { id: "view:ticket-form", kind: "form", binding: { entityRef: "entity:ticket", fieldRefs: ["title", "priority"], actionRefs: ["action:update-ticket"] } },
    ],
  } as const;
}

test("materializes deterministic renderer-agnostic list detail and form documents", () => {
  const record = { title: "Printer offline", priority: 2, internalSecret: "do-not-render", unbound: "ignore" };

  const list = materializeRuntimeGeneratedViewDocument({ model: model(), viewRef: "view:ticket-list", record });
  const detail = materializeRuntimeGeneratedViewDocument({ model: model(), viewRef: "view:ticket-detail", record });
  const form = materializeRuntimeGeneratedViewDocument({ model: model(), viewRef: "view:ticket-form", record });

  assert.deepEqual(list, {
    kind: "RuntimeGeneratedViewDocument",
    viewRef: "view:ticket-list",
    viewKind: "list",
    entityRef: "entity:ticket",
    fields: [{ fieldRef: "title", type: "string", required: true, value: "Printer offline" }],
    actions: [],
  });
  assert.equal(detail.viewKind, "detail");
  assert.deepEqual(detail.fields.map((field) => field.fieldRef), ["priority", "title"]);
  assert.equal(form.viewKind, "form");
  assert.deepEqual(form.actions, [{ actionRef: "action:update-ticket" }]);

  const serialized = JSON.stringify([list, detail, form]);
  for (const forbidden of ["internalSecret", "do-not-render", "unbound", "component", "framework", "css", "credential", "resolvedValue"]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});

test("declaration order does not affect the generated document", () => {
  const first = model();
  const second = {
    entities: [{ ...first.entities[0], fields: [...first.entities[0].fields].reverse() }],
    actions: [...first.actions].reverse(),
    views: [...first.views].reverse().map((view) => ({
      ...view,
      binding: {
        ...view.binding,
        fieldRefs: [...view.binding.fieldRefs].reverse(),
        actionRefs: [...view.binding.actionRefs].reverse(),
      },
    })),
  };

  assert.deepEqual(
    materializeRuntimeGeneratedViewDocument({ model: first, viewRef: "view:ticket-form", record: { title: "A", priority: 1 } }),
    materializeRuntimeGeneratedViewDocument({ model: second, viewRef: "view:ticket-form", record: { priority: 1, title: "A" } }),
  );
});

test("missing bound record values remain explicitly null without inferred defaults", () => {
  const document = materializeRuntimeGeneratedViewDocument({
    model: model(),
    viewRef: "view:ticket-form",
    record: { title: "No priority" },
  });
  const priority = document.fields.find((field) => field.fieldRef === "priority");
  assert.equal(priority?.value, null);
});

test("unknown unbound invalid-kind and invalid binding inputs fail closed", () => {
  assert.throws(
    () => materializeRuntimeGeneratedViewDocument({ model: model(), viewRef: "view:missing", record: {} }),
    /RUNTIME_GENERATED_RENDER_UNKNOWN_VIEW:view:missing/,
  );
  assert.throws(
    () => materializeRuntimeGeneratedViewDocument({ model: { ...model(), views: [{ id: "view:unbound", kind: "form" }] }, viewRef: "view:unbound", record: {} }),
    /RUNTIME_GENERATED_RENDER_VIEW_NOT_BOUND:view:unbound/,
  );
  assert.throws(
    () => materializeRuntimeGeneratedViewDocument({ model: { ...model(), views: [{ id: "view:bad", kind: undefined, binding: { entityRef: "entity:ticket" } } as never] }, viewRef: "view:bad", record: {} }),
    /RUNTIME_GENERATED_RENDER_INVALID_VIEW_KIND:view:bad/,
  );
  assert.throws(
    () => materializeRuntimeGeneratedViewDocument({ model: { ...model(), views: [{ id: "view:bad", kind: "form", binding: { entityRef: "entity:missing" } }] }, viewRef: "view:bad", record: {} }),
    /RUNTIME_GENERATED_BINDING_UNKNOWN_ENTITY:view:bad:entity:missing/,
  );
});
