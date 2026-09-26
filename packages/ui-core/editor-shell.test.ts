import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EditorShell } from "./editor-shell.js";

test("EditorShell renders accessible named regions with empty slots", () => {
  const html = renderToStaticMarkup(createElement(EditorShell));

  for (const label of ["Editor toolbar", "Editor navigation", "Component palette", "Layers", "Editor work area", "Property inspector", "Editor status"]) {
    assert.match(html, new RegExp(`aria-label="${label}"`));
  }
  assert.match(html, /data-slot="editor-shell"/);
});

test("EditorShell composes partial caller-owned slots without semantic ownership", () => {
  const html = renderToStaticMarkup(
    createElement(EditorShell, {
      toolbar: createElement("button", { type: "button" }, "Run command"),
      workArea: createElement("div", null, "Canvas owned by caller"),
    }),
  );

  assert.match(html, /Run command/);
  assert.match(html, /Canvas owned by caller/);
  assert.doesNotMatch(html, /ComponentRegistry|AppManifest|WindowGeometry/);
});
