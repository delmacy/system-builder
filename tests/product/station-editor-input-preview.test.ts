import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorInputPreview } from "../../apps/station/web/app/station-editor-input-preview.js";
import type { ComponentProperties } from "../../packages/station-composition/index.js";
test("Input preview uses actual shared anatomy, escaped label and admitted native states", () => {
  const html = renderToStaticMarkup(createElement(EditorInputPreview, { label: "Email <work>", properties: { kind: "input", inputType: "email", placeholder: "<hint>", disabled: true, readOnly: true } }));
  assert.match(html, /data-slot="input-preview"/); assert.match(html, /data-slot="label"/); assert.match(html, /data-slot="input"/);
  assert.match(html, /Email &lt;work&gt;/); assert.match(html, /placeholder="&lt;hint&gt;"/);
  assert.match(html, /type="email"/); assert.match(html, /disabled=""/); assert.match(html, /readOnly=""/);
  assert.match(html, /tabindex="-1"/); assert.match(html, /aria-hidden="true"/); assert.doesNotMatch(html, /value=|onchange|<hint>/);
});
test("Input defaults have no domain value; wrong component properties reject", () => {
  const html = renderToStaticMarkup(createElement(EditorInputPreview, { label: "Input" }));
  assert.match(html, /type="text"/); assert.doesNotMatch(html, /disabled=""|readOnly=""|value=/);
  for (const properties of [{ variant: "outline", disabled: false }, { kind: "input", inputType: "file", placeholder: "", disabled: false, readOnly: false }])
    assert.throws(() => renderToStaticMarkup(createElement(EditorInputPreview, { label: "Bad", properties: properties as ComponentProperties })), /Invalid admitted Input/);
});
