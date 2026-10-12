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

test("icon placement preserves label order across compact and expanded modes", () => {
  for (const iconPlacement of ["start", "end"] as const) {
    for (const presentation of [{ mode: "icon-text" as const }, { mode: "icon" as const, expanded: true }]) {
      const markup = render({ label: "Tools", icon: "navigation.expand", iconPlacement, ...presentation });
      assert.equal(markup.indexOf("<svg") < markup.indexOf("<span"), iconPlacement === "start");
      assert.match(markup, /aria-label="Tools"/);
    }
    const compact = render({ label: "Tools", icon: "navigation.expand", mode: "icon", iconPlacement });
    assert.match(compact, /<svg/); assert.doesNotMatch(compact, /<span/);
  }
  assert.throws(() => render({ label: "Invalid", iconPlacement: "middle" } as unknown as PresentationButtonProps), /Unsupported icon placement/);
});
