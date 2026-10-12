import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AccessibleTooltip, AccessibleTooltipTrigger, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, Dialog, DialogTrigger, DropdownMenu, DropdownMenuTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "../../packages/ui-core/index.js";

const render = (node: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(node);
test("closed dialog trigger has semantic state and disabled behavior without popup", () => {
  const html = render(h(Dialog, { children: h(DialogTrigger, { disabled: true, children: "Open <script>" }) }));
  assert.match(html, /data-slot="dialog-trigger"/);
  assert.match(html, /disabled/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /data-slot="dialog-content"/);
});
test("closed menu exposes accessible trigger without hidden commands", () => {
  const html = render(h(DropdownMenu, { children: h(DropdownMenuTrigger, { children: "Actions" }) }));
  assert.match(html, /aria-haspopup="menu"/);
  assert.match(html, /aria-expanded="false"/);
});
test("tabs expose role/state and hide unselected content; disabled remains disabled", () => {
  const html = render(h(Tabs, { defaultValue: "one", children: [h(TabsList, { key: "list", "aria-label": "Sections", children: [h(TabsTrigger, { key: "one", value: "one", children: "One" }), h(TabsTrigger, { key: "two", value: "two", disabled: true, children: "Two" })] }), h(TabsContent, { key: "panel", value: "one", children: "Selected content" })] }));
  assert.match(html, /role="tablist"/); assert.match(html, /aria-selected="true"/); assert.match(html, /role="tabpanel"/); assert.match(html, /disabled/);
});
test("accordion controlled expansion names its content and escapes text", () => {
  const html = render(h(Accordion, { value: ["one"], children: h(AccordionItem, { value: "one", children: [h(AccordionTrigger, { key: "trigger", children: "Section" }), h(AccordionContent, { key: "content", children: "<script>safe</script>" })] }) }));
  assert.match(html, /aria-expanded="true"/); assert.match(html, /&lt;script&gt;safe&lt;\/script&gt;/);
});
test("breadcrumb distinguishes navigation link and current page", () => {
  const html = render(h(Breadcrumb, { children: [h(BreadcrumbItem, { key: "link", children: h(BreadcrumbLink, { href: "/", children: "Station" }) }), h(BreadcrumbItem, { key: "page", children: h(BreadcrumbPage, { children: "Lab" }) })] }));
  assert.match(html, /aria-label="Breadcrumb"/); assert.match(html, /aria-current="page"/); assert.match(html, /href="\/"/);
});

test("tooltip trigger preserves caller description and allocates independent stable associations", () => {
  const html = render(h("div", { children: [h(AccessibleTooltip, { key: "one", children: h(AccessibleTooltipTrigger, { "aria-describedby": "existing-help", children: "One" }) }), h(AccessibleTooltip, { key: "two", children: h(AccessibleTooltipTrigger, { children: "Two" }) })] }));
  const associations = [...html.matchAll(/aria-describedby="([^"]+)"/g)].map(match => match[1]);
  assert.equal(associations.length, 2);
  assert.match(associations[0]!, /^existing-help sb-tooltip-/);
  assert.match(associations[1]!, /^sb-tooltip-/);
  assert.notEqual(associations[0]!.split(" ").at(-1), associations[1]);
});
