import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
const editor = (p: Page) => p.getByRole("region", { name: "Composition editor", exact: true });
const image = (p: Page, label = "Work email") => p.getByRole("img", { name: label + " preview", exact: true });
const input = (p: Page, label = "Work email") => image(p, label).locator('input[data-slot="input"]');
async function download(p: Page) { const event = p.waitForEvent("download"); await p.getByRole("button", { name: "Save As file", exact: true }).click(); return readFile((await (await event).path())!); }
async function addInput(p: Page) {
  await p.getByRole("searchbox", { name: "Search insertable components", exact: true }).fill("Forms");
  await expect(p.getByLabel("Component to add", { exact: true })).toHaveValue("component:input");
  await p.getByRole("button", { name: "Add component", exact: true }).click();
}
test("Input actual Forms insertion, label/span/properties/history/local save and fresh v6 reopen preserve icon predecessor", async ({ page, browser }, info) => {
  await page.goto("/component-editor");
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await page.getByLabel("Search icons", { exact: true }).fill("save"); await expect(page.getByLabel("Button icon", { exact: true })).toBeEnabled();
  await page.getByLabel("Button icon", { exact: true }).selectOption("glyph:save"); await page.getByLabel("Button display", { exact: true }).selectOption("icon");
  await page.getByRole("button", { name: "Apply properties", exact: true }).click();
  await addInput(page); await expect(input(page, "Input 3")).toHaveAttribute("type", "text");
  await page.getByLabel("Input label", { exact: true }).fill("Work email"); await page.getByRole("button", { name: "Apply text", exact: true }).click();
  await page.getByLabel("Columns", { exact: true }).fill("6"); await page.getByLabel("Rows", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Apply size", exact: true }).click();
  const revision = await editor(page).getAttribute("data-draft-revision");
  await page.getByLabel("Placeholder", { exact: true }).fill("x".repeat(257)); await page.getByRole("button", { name: "Apply properties", exact: true }).click();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", revision!); await expect(editor(page).locator("#editor-feedback")).toContainText("input properties are invalid");
  await page.getByLabel("Input type", { exact: true }).selectOption("email"); await page.getByLabel("Placeholder", { exact: true }).fill("name@example.test");
  await page.getByLabel("Read only", { exact: true }).check();
  const save = page.getByRole("button", { name: "Save locally", exact: true }); await expect(save).toBeDisabled();
  await save.focus(); await save.press("Enter"); await expect(editor(page).locator("#editor-feedback")).toContainText("Apply or restore");
  await page.getByRole("button", { name: "Apply properties", exact: true }).click();
  await expect(input(page)).toHaveAttribute("type", "email"); await expect(input(page)).toHaveAttribute("placeholder", "name@example.test");
  await expect(input(page)).toHaveAttribute("readonly", ""); await expect(input(page)).toHaveValue("");
  await page.getByRole("button", { name: "Undo", exact: true }).click(); await expect(input(page)).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Redo", exact: true }).click(); await expect(input(page)).toHaveAttribute("type", "email");
  await page.getByRole("button", { name: "Save locally", exact: true }).click(); await page.getByRole("button", { name: "Open saved", exact: true }).click();
  await expect(page.getByLabel("Input type", { exact: true })).toHaveValue("email");
  const bytes = await download(page); const doc = JSON.parse(bytes.toString()); expect(doc.schema.version).toBe("6.0.0");
  const node = doc.payload.graph.nodes.find((n: { componentRef: string }) => n.componentRef === "component:input");
  expect(node.text).toBe("Work email"); expect(node.properties).toEqual({ kind: "input", inputType: "email", placeholder: "name@example.test", disabled: false, readOnly: true });
  expect(node.placement.columnSpan).toBe(6); expect(node.placement.rowSpan).toBe(2); expect(node.properties).not.toHaveProperty("value");
  expect(doc.payload.graph.nodes[1].properties.presentation.icon.assetRef).toBe("glyph:save");
  const context = await browser.newContext();
  try {
    const fresh = await context.newPage(); await fresh.goto("/component-editor"); expect(await fresh.evaluate(() => localStorage.length)).toBe(0);
    await fresh.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "input.json", mimeType: "application/json", buffer: bytes });
    await expect(input(fresh)).toHaveAttribute("placeholder", "name@example.test"); await expect(input(fresh)).toHaveAttribute("readonly", ""); await expect(image(fresh)).toHaveAttribute("data-column-span", "6");
    await expect(image(fresh, "Button 1").locator('button[data-slot="button"]')).toHaveAttribute("data-icon-status", "ready");
    await fresh.getByRole("treeitem", { name: "Work email", exact: true }).click(); await expect(fresh.getByLabel("Read only", { exact: true })).toBeChecked();
    await expect(fresh.getByLabel("Input label", { exact: true })).toHaveValue("Work email");
    await fresh.setViewportSize({ width: 390, height: 860 }); expect(await fresh.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await info.attach("input-fresh-v6-reopen", { body: await fresh.screenshot({ fullPage: true }), contentType: "image/png" });
    await fresh.getByLabel("Disabled preview", { exact: true }).check(); await fresh.getByRole("button", { name: "Apply properties", exact: true }).click(); await expect(input(fresh)).toBeDisabled();
    await fresh.getByRole("button", { name: "Reset properties", exact: true }).click(); await expect(input(fresh)).toBeEnabled(); await expect(input(fresh)).toHaveAttribute("type", "text");
  } finally { await context.close(); }
});
test("Input nested Card composition preserves slots; malformed and downgraded imports reject atomically", async ({ page }) => {
  await page.goto("/component-editor"); await page.getByLabel("Composition", { exact: true }).selectOption("composition:action-panel");
  await page.getByRole("searchbox", { name: "Search insertable components", exact: true }).fill("Display"); await page.getByRole("button", { name: "Add component", exact: true }).click();
  await page.getByLabel("Container", { exact: true }).selectOption("node:added-3"); await addInput(page);
  const card = page.getByRole("group", { name: "Card 3 preview", exact: true }); await expect(card.locator('[data-node-ref="node:added-4"]')).toHaveAttribute("data-slot-ref", "content");
  const bytes = await download(page); const original = JSON.parse(bytes.toString()); const revision = await editor(page).getAttribute("data-draft-revision");
  for (const mutation of ["downgrade", "value", "button-shape"]) {
    const doc = structuredClone(original); const node = doc.payload.graph.nodes.find((n: { componentRef: string }) => n.componentRef === "component:input");
    if (mutation === "downgrade") doc.schema.version = "5.0.0";
    else node.properties = mutation === "button-shape" ? { variant: "outline", disabled: false } : { kind: "input", inputType: "text", placeholder: "", disabled: false, readOnly: false, value: "not visual authority" };
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(doc)) });
    await expect(editor(page)).toHaveAttribute("data-draft-revision", revision!); await expect(card.locator('[data-node-ref="node:added-4"]')).toBeVisible();
    await expect(editor(page).locator("#editor-feedback")).toContainText("unchanged");
  }
});
