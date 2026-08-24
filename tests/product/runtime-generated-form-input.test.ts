import assert from "node:assert/strict";
import test from "node:test";
import { validateRuntimeGeneratedFormInput } from "../../packages/runtime-core/generated-form-input.js";
import type { RuntimeGeneratedViewDocument } from "../../packages/runtime-core/generated-view-document.js";

function formDocument(): RuntimeGeneratedViewDocument {
  return {
    kind: "RuntimeGeneratedViewDocument",
    viewRef: "view:ticket-form",
    viewKind: "form",
    entityRef: "entity:ticket",
    fields: [
      { fieldRef: "priority", type: "number", required: false, value: null },
      { fieldRef: "title", type: "string", required: true, value: null },
    ],
    actions: [{ actionRef: "action:update-ticket" }],
  };
}

test("accepts only explicitly bound submitted fields deterministically without coercion", () => {
  const first = validateRuntimeGeneratedFormInput({
    document: formDocument(),
    entries: [
      { fieldRef: "title", value: 123 },
      { fieldRef: "priority", value: "high" },
    ],
  });
  const second = validateRuntimeGeneratedFormInput({
    document: formDocument(),
    entries: [
      { fieldRef: "priority", value: "high" },
      { fieldRef: "title", value: 123 },
    ],
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first, {
    kind: "RuntimeGeneratedFormInputAccepted",
    ok: true,
    viewRef: "view:ticket-form",
    entityRef: "entity:ticket",
    values: [
      { fieldRef: "priority", value: "high" },
      { fieldRef: "title", value: 123 },
    ],
  });
});

test("missing required field is rejected deterministically without business defaults", () => {
  assert.deepEqual(
    validateRuntimeGeneratedFormInput({ document: formDocument(), entries: [{ fieldRef: "priority", value: 4 }] }),
    {
      kind: "RuntimeGeneratedFormInputRejected",
      ok: false,
      viewRef: "view:ticket-form",
      entityRef: "entity:ticket",
      reasons: [{ code: "MISSING_REQUIRED_FIELD", fieldRef: "title" }],
    },
  );
});

test("extra or unbound fields fail closed without echoing submitted values", () => {
  const result = validateRuntimeGeneratedFormInput({
    document: formDocument(),
    entries: [
      { fieldRef: "title", value: "Ticket" },
      { fieldRef: "credential", value: "super-secret" },
    ],
  });

  assert.deepEqual(result, {
    kind: "RuntimeGeneratedFormInputRejected",
    ok: false,
    viewRef: "view:ticket-form",
    entityRef: "entity:ticket",
    reasons: [{ code: "UNBOUND_FIELD", fieldRef: "credential" }],
  });
  assert.equal(JSON.stringify(result).includes("super-secret"), false);
});

test("duplicate field input fails closed and never picks a value by order", () => {
  const first = validateRuntimeGeneratedFormInput({
    document: formDocument(),
    entries: [
      { fieldRef: "title", value: "first" },
      { fieldRef: "title", value: "second" },
    ],
  });
  const second = validateRuntimeGeneratedFormInput({
    document: formDocument(),
    entries: [
      { fieldRef: "title", value: "second" },
      { fieldRef: "title", value: "first" },
    ],
  });

  assert.deepEqual(first, second);
  assert.deepEqual(first, {
    kind: "RuntimeGeneratedFormInputRejected",
    ok: false,
    viewRef: "view:ticket-form",
    entityRef: "entity:ticket",
    reasons: [{ code: "DUPLICATE_FIELD", fieldRef: "title" }],
  });
  assert.equal(JSON.stringify(first).includes("first"), false);
  assert.equal(JSON.stringify(first).includes("second"), false);
});
