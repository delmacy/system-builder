import assert from "node:assert/strict";
import { test } from "node:test";
import { validFoundationFieldProperties as valid } from "./ui-foundation-properties.js";

const color = { label: "Accent", value: "#A1B2C3", disabled: false };
const picker = { label: "Mode", value: "one", disabled: false, choices: [
  { id: "one", label: "One", disabled: false }, { id: "two", label: "Two", disabled: true },
] };
const document = { label: "Body", value: "Safe plain text", rows: 4, maxLength: 2000, disabled: false, readOnly: false };

test("Construction G foundation property contracts accept bounded source-owned data only", () => {
  assert.equal(valid("ui:color-field", color), true);
  assert.equal(valid("ui:property-picker", picker), true);
  assert.equal(valid("ui:document-text-field", document), true);
  assert.equal(valid("ui:unknown", color), false);
  assert.equal(valid("ui:color-field", { ...color, value: "red" }), false);
  assert.equal(valid("ui:color-field", { ...color, onChange: () => {} }), false);
  assert.equal(valid("ui:property-picker", { ...picker, value: "two" }), false);
  assert.equal(valid("ui:property-picker", { ...picker, choices: [picker.choices[0], picker.choices[0]] }), false);
  assert.equal(valid("ui:document-text-field", { ...document, rows: 25 }), false);
  assert.equal(valid("ui:document-text-field", { ...document, value: "x".repeat(2001) }), false);
  assert.equal(valid("ui:document-text-field", { ...document, readOnly: "false" }), false);
});
test("Construction G rejects accessor properties before invoking them", () => {
  let called = false;
  const hostile = { ...color };
  Object.defineProperty(hostile, "value", { enumerable: true, get() { called = true; throw Error("access"); } });
  assert.equal(valid("ui:color-field", hostile), false);
  assert.equal(called, false);
  assert.equal(valid("ui:color-field", Object.assign(Object.create({ inherited: true }), color)), false);
});
