import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Alert, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Checkbox, FieldDescription, FieldMessage, Label, NumberField, Progress, RadioGroup,
  Skeleton, Slider, Switch, Textarea } from "../../packages/ui-core/index.js";

const render = (element: ReturnType<typeof createElement>) => renderToStaticMarkup(element);

test("shared native form controls retain safe element/label/state contracts", () => {
  const cases = [
    [createElement(Label, { htmlFor: "notes" }, "Notes"), /for="notes"/],
    [createElement(Textarea, { id: "notes", defaultValue: "<script>literal</script>", disabled: true }), /&lt;script&gt;literal/],
    [createElement(Checkbox, { defaultChecked: true, disabled: true }), /type="checkbox"/],
    [createElement(Switch, { "aria-label": "Enabled", checked: true, readOnly: true }), /role="switch"/],
    [createElement(Slider, { "aria-label": "Amount", min: 0, max: 10, step: 2, defaultValue: 4 }), /type="range"/],
    [createElement(NumberField, { "aria-label": "Count", min: 0, max: 10, step: 1, "aria-invalid": true }), /type="number"/],
  ] as const;
  for (const [element, contract] of cases) {
    const html = render(element);
    assert.match(html, contract);
    assert.match(html, /data-slot="/);
  }
  assert.match(render(createElement(Checkbox, { disabled: true })), /disabled=""/);
  assert.match(render(createElement(NumberField, { "aria-invalid": true })), /aria-invalid="true"/);
});

test("native radio groups isolate names and project controlled or default selection", () => {
  const options = [{ value: "left", label: "Left" }, { value: "right", label: "Right" }, { value: "locked", label: "Locked", disabled: true }];
  const html = render(createElement("div", {},
    createElement(RadioGroup, { label: "Controlled", options, value: "right" }),
    createElement(RadioGroup, { label: "Default", options, defaultValue: "left" })));
  assert.match(html, /role="radiogroup"/);
  assert.equal((html.match(/checked=""/g) ?? []).length, 2);
  const names = [...html.matchAll(/name="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(names).size, 2);
  assert.match(html, /disabled=""/);
});

test("radio identities and selected-value mismatches fail explicitly", () => {
  for (const options of [[], [{ value: "", label: "Blank" }], [{ value: "x", label: "A" }, { value: "x", label: "B" }]]) {
    assert.throws(() => render(createElement(RadioGroup, { label: "Invalid", options })), /unique nonempty/);
  }
  assert.throws(() => render(createElement(RadioGroup, { label: "Unknown", options: [{ value: "a", label: "A" }], defaultValue: "missing" })), /known selected value/);
});

test("progress distinguishes determinate and indeterminate and rejects invalid bounds", () => {
  assert.match(render(createElement(Progress, { "aria-label": "Complete", value: 0, max: 10 })), /value="0"/);
  assert.match(render(createElement(Progress, { value: 10, max: 10 })), /value="10"/);
  assert.doesNotMatch(render(createElement(Progress, { "aria-label": "Loading" })), / value=/);
  for (const props of [{ value: -1 }, { value: 101 }, { value: NaN }, { value: Infinity }, { max: 0 }, { max: -1 }, { max: NaN }]) {
    assert.throws(() => render(createElement(Progress, props)), RangeError);
  }
});

test("feedback/content anatomy preserves semantic roles and escaped display", () => {
  assert.match(render(createElement(Alert, { variant: "error" }, "<b>Error</b>")), /role="alert".*&lt;b&gt;Error/);
  assert.match(render(createElement(Alert, { variant: "success" }, "Done")), /role="status"/);
  assert.match(render(createElement(FieldMessage, { id: "error" }, "Invalid")), /role="alert"/);
  assert.match(render(createElement(FieldDescription, {}, "Help")), /data-slot="field-description"/);
  assert.match(render(createElement(Skeleton, {})), /aria-hidden="true"/);
  const html = render(createElement(Card, {}, createElement(CardHeader, {}, createElement(CardTitle, {}, "Title"),
    createElement(CardDescription, {}, "Description")), createElement(CardContent, {}, "Body"), createElement(CardFooter, {}, "Foot")));
  for (const slot of ["card", "card-header", "card-title", "card-description", "card-content", "card-footer"]) {
    assert.ok(html.includes(`data-slot="${slot}"`));
  }
});
