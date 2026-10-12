import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorButtonPreview } from "../../apps/station/web/app/station-editor-button-preview.js";
import type { ButtonProperties } from "../../packages/station-composition/index.js";

test("admitted preview renders actual shared Button recipes, escaped text and inert state", () => {
  const html = renderToStaticMarkup(createElement(EditorButtonPreview, { label: "<Confirmar>", properties: { variant: "outline", disabled: true } }));
  assert.match(html, /^<button/);
  assert.match(html, /data-slot="button"/);
  assert.match(html, /data-preview-variant="outline"/);
  assert.match(html, /border-input/);
  assert.match(html, /disabled=""/);
  assert.match(html, /tabindex="-1"/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /&lt;Confirmar&gt;/);
  assert.match(html, /title="&lt;Confirmar&gt;"/);
  assert.match(html, /<span class="min-w-0 truncate" title="&lt;Confirmar&gt;">&lt;Confirmar&gt;<\/span>/);
  assert.doesNotMatch(html, /onclick|<Confirmar>/);
});
test("absent properties render legacy default and unsupported property shapes reject", () => {
  const html = renderToStaticMarkup(createElement(EditorButtonPreview, { label: "Legacy" }));
  assert.match(html, /data-preview-variant="default"/);
  assert.match(html, /bg-primary/);
  assert.doesNotMatch(html, /disabled=""/);
  assert.throws(() => renderToStaticMarkup(createElement(EditorButtonPreview, { label: "Bad", properties: { variant: "destructive", disabled: false } as unknown as ButtonProperties })), /Invalid admitted/);
});

test("portable compact preview keeps label while owner asset is pending", () => {
  const html = renderToStaticMarkup(createElement(EditorButtonPreview, { label: "Save", properties: { variant: "outline", disabled: false,
    presentation: { mode: "icon", placement: "end", icon: { assetRef: "glyph:save", catalogVersion: "1.0.0" } } } }));
  assert.match(html, /data-display-mode="icon"/); assert.match(html, /data-icon-status="loading"/);
  assert.match(html, />Save</); assert.match(html, /tabindex="-1"/); assert.doesNotMatch(html, /<svg/);
});
