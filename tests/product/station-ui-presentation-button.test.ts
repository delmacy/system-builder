import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PresentationButton, type PresentationButtonProps } from "../../packages/ui-core/index.js";
const render = (props: PresentationButtonProps) => renderToStaticMarkup(createElement(PresentationButton, props));
test("presentation modes preserve accessible label, semantic icon and native disabled", () => {
  const compact = render({ label: "Save", mode: "icon", icon: "file.save", disabled: true });
  assert.match(compact, /aria-label="Save"/); assert.match(compact, /data-label-visible="false"/);
  assert.match(compact, /data-icon-token="file.save"/); assert.match(compact, /disabled=""/);
  assert.doesNotMatch(compact, />Save</);
  const full = render({ label: "<Save>", mode: "icon-text", icon: "file.save" });
  assert.match(full, /&lt;Save&gt;/); assert.match(full, /data-label-visible="true"/);
  assert.doesNotMatch(render({ label: "Text" }), /<svg/);
});
test("controlled expansion reveals label and invalid contracts reject", () => {
  const full = render({ label: "Tools", mode: "icon", icon: "navigation.expand", expanded: true });
  assert.match(full, /aria-expanded="true"/); assert.match(full, />Tools</);
  for (const props of [{label:" "}, {label:"Missing",mode:"icon"}, {label:"Unknown",mode:"arbitrary"}])
    assert.throws(() => render(props as PresentationButtonProps));
});
