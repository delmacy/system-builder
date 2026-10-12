import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Toolbar, ToolbarGroup, ToolbarButton, ToolbarSeparator, PaneHeader, StatusBar, PropertySection, PropertyField, ToolbarToggleGroup, SearchField, SelectField, SplitButton, TabStrip } from "../../packages/ui-core/index.js";

const render = (node: ReturnType<typeof createElement>) => renderToStaticMarkup(node);

test("industrial toolbar exports labelled, themed and composable anatomy", () => {
  const html = render(createElement(Toolbar, { label: "Document tools" },
    createElement(ToolbarGroup, { label: "Alignment" },
      createElement(ToolbarButton, { label: "Align left", pressed: true }, "Left"),
      createElement(ToolbarSeparator, {}),
      createElement(ToolbarButton, { label: "Save", disabled: true }, "Save"))));
  for (const slot of ["toolbar", "toolbar-group", "toolbar-button", "toolbar-separator"]) assert.ok(html.includes(`data-slot="${slot}"`));
  assert.match(html, /role="toolbar"/);
  assert.match(html, /aria-label="Document tools"/);
  assert.match(html, /aria-label="Alignment"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /disabled=""/);
});

test("toolbar action vs toggle semantics stay distinct and labels are required", () => {
  const action = render(createElement(ToolbarButton, { label: "Save", type: "submit" }));
  assert.match(action, /type="submit"/);
  assert.doesNotMatch(action, /aria-pressed/);
  const toggle = render(createElement(ToolbarButton, { label: "Show rulers", pressed: false }));
  assert.match(toggle, /aria-pressed="false"/);
  for (const invalid of [
    createElement(Toolbar, { label: " " }),
    createElement(ToolbarGroup, { label: "" }),
    createElement(ToolbarButton, { label: " " }),
  ]) assert.throws(() => render(invalid), /nonempty accessible label/);
});

test("escaped names cannot inject toolbar markup", () => {
  const html = render(createElement(ToolbarButton, { label: '<img src=x onerror=alert(1)>' }, '<b>Save</b>'));
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img/);
  assert.match(html, /&lt;b&gt;Save&lt;\/b&gt;/);
});

test("workstation panes and inspector compounds expose accessible source-owned slots", () => {
  const html = render(createElement("div", {},
    createElement(PaneHeader, { title: "Explorer", subtitle: "Projects", actions: createElement("button", { type: "button" }, "Refresh") }),
    createElement(PropertySection, { title: "Geometry", description: "Canvas dimensions" },
      createElement(PropertyField, { label: "Width", hint: "Pixels", control: createElement("input", { type: "number", "aria-label": "Width" }) })),
    createElement(StatusBar, { label: "File manager status", trailing: "2 selected" }, "Ready")));
  for (const slot of ["pane-header", "pane-title", "pane-actions", "property-section", "property-field", "status-bar"]) {
    assert.ok(html.includes(`data-slot="${slot}"`));
  }
  assert.match(html, /role="status"/);
  assert.match(html, /aria-label="Geometry"/);
  assert.match(html, /aria-label="Width"/);
  assert.match(html, /2 selected/);
});
test("industrial compound labels reject blank names and escape external text", () => {
  for (const element of [
    createElement(StatusBar, { label: "" }, "Ready"),
    createElement(PropertySection, { title: " " }),
    createElement(PropertyField, { label: " ", control: createElement("input") }),
  ]) assert.throws(() => render(element), /nonempty/);
  const html = render(createElement(PaneHeader, { title: "<script>bad</script>" }));
  assert.match(html, /&lt;script&gt;bad&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test("toolbar toggle group retains exclusive selection and rejects malformed choices", () => {
  const options = [{ value: "left", label: "Align left" }, { value: "right", label: "Align right", disabled: true }];
  const html = render(createElement(ToolbarToggleGroup, { label: "Alignment", options, value: "left" }));
  assert.match(html, /data-slot="toolbar-toggle-group"/);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 1);
  assert.match(html, /disabled=""/);
  assert.throws(() => render(createElement(ToolbarToggleGroup, { label: "Alignment", options, value: "missing" })), /known selected value/);
  assert.throws(() => render(createElement(ToolbarToggleGroup, { label: "Alignment", options: [...options, options[0]!], value: "left" })), /unique nonempty/);
});

test("workstation search and native select preserve labels, escaped options and rejection", () => {
  const search = render(createElement(SearchField, { label: "Find controls", defaultValue: "<script>" }));
  assert.match(search, /type="search"/);
  assert.match(search, /aria-label="Find controls"/);
  assert.match(search, /&lt;script&gt;/);
  const select = render(createElement(SelectField, { label: "Density", defaultValue: "compact",
    options: [{ value: "compact", label: "Compact" }, { value: "comfortable", label: "<wide>" }] }));
  assert.match(select, /data-slot="select-field"/);
  assert.match(select, /&lt;wide&gt;/);
  assert.throws(() => render(createElement(SearchField, { label: "" })), /nonempty/);
  assert.throws(() => render(createElement(SelectField, { label: "Density", options: [] })), /unique nonempty/);
});

test("split button keeps primary action semantic and menu trigger independent", () => {
  const html = render(createElement(SplitButton, { label: "Save actions", primaryLabel: "Save", onPrimaryAction: () => {},
    menuTrigger: createElement("button", { type: "button", "aria-label": "More save options" }, "▼") }));
  assert.match(html, /data-slot="split-button-primary"/);
  assert.match(html, /data-slot="split-button-menu"/);
  assert.match(html, /aria-label="More save options"/);
  assert.throws(() => render(createElement(SplitButton, { label: "", primaryLabel: "Save", onPrimaryAction: () => {}, menuTrigger: null })), /nonempty/);
});

test("controlled workstation tab strip renders selection and separate close action", () => {
  const tabs = [{id:"one",label:"Overview",closable:true},{id:"two",label:"Settings",disabled:true}];
  const html = render(createElement(TabStrip,{label:"Document tabs",activeId:"one",tabs,onActiveChange:()=>{},onClose:()=>{}}));
  assert.match(html,/data-slot="tab-strip"/);
  assert.match(html,/aria-current="page"/);
  assert.match(html,/aria-label="Close Overview"/);
  assert.match(html,/disabled=""/);
  assert.throws(()=>render(createElement(TabStrip,{label:"Document tabs",activeId:"missing",tabs,onActiveChange:()=>{}})),/enabled active tab/);
  assert.throws(()=>render(createElement(TabStrip,{label:"Document tabs",activeId:"one",tabs:[tabs[0]!,tabs[0]!],onActiveChange:()=>{}})),/unique nonempty/);
});
