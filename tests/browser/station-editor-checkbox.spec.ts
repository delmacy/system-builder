import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
const editor = (p: Page) => p.getByRole("region", { name: "Composition editor", exact: true });
const image = (p: Page, name = "Remember choice") => p.getByRole("img", { name: name + " preview", exact: true });
const checkbox = (p: Page, name = "Remember choice") => image(p, name).locator('input[data-slot="checkbox"]');
async function download(p: Page) { const event = p.waitForEvent("download"); await p.getByRole("button", { name: "Save As file", exact: true }).click(); return readFile((await (await event).path())!); }
async function add(p: Page) { await p.getByRole("searchbox", { name: "Search insertable components", exact: true }).fill("Forms"); await p.getByLabel("Component to add", { exact: true }).selectOption("component:checkbox"); await p.getByRole("button", { name: "Add component", exact: true }).click(); }
test("Checkbox real Forms keyboard edit/history/save/fresh v7 reopen retains default presentation", async ({ page, browser }, info) => {
  await page.goto("/component-editor"); await add(page); await expect(checkbox(page, "Checkbox 3")).not.toBeChecked();
  await page.getByLabel("Checkbox label", { exact: true }).fill("Remember choice"); await page.getByRole("button", { name: "Apply text", exact: true }).click();
  await page.getByLabel("Columns", { exact: true }).fill("5"); await page.getByRole("button", { name: "Apply size", exact: true }).click();
  const initially = page.getByLabel("Initially checked", { exact: true }); await initially.focus(); await initially.press("Space"); await expect(initially).toBeChecked();
  await expect(checkbox(page)).not.toBeChecked(); const before = await editor(page).getAttribute("data-draft-revision");
  const undo = page.getByRole("button", { name: "Undo", exact: true }); await expect(undo).toBeDisabled(); await undo.focus(); await undo.press("Enter");
  await expect(editor(page).locator("#editor-feedback")).toContainText("Apply or restore"); await expect(editor(page)).toHaveAttribute("data-draft-revision", before!);
  await page.getByRole("button", { name: "Apply properties", exact: true }).click(); await expect(checkbox(page)).toBeChecked();
  await page.getByRole("button", { name: "Undo", exact: true }).click(); await expect(checkbox(page)).not.toBeChecked();
  await page.getByRole("button", { name: "Redo", exact: true }).click(); await expect(checkbox(page)).toBeChecked();
  await page.getByLabel("Disabled preview", { exact: true }).check(); await page.getByRole("button", { name: "Apply properties", exact: true }).click(); await expect(checkbox(page)).toBeDisabled();
  await page.getByRole("button", { name: "Save locally", exact: true }).click(); await page.getByRole("button", { name: "Open saved", exact: true }).click();
  const bytes = await download(page); const doc = JSON.parse(bytes.toString()); expect(doc.schema.version).toBe("7.0.0");
  const node = doc.payload.graph.nodes.find((n: { componentRef: string }) => n.componentRef === "component:checkbox");
  expect(node.text).toBe("Remember choice"); expect(node.placement.columnSpan).toBe(5);
  expect(node.properties).toEqual({ kind: "checkbox", defaultChecked: true, disabled: true }); expect(node.properties).not.toHaveProperty("checked"); expect(node.properties).not.toHaveProperty("value");
  const context = await browser.newContext();
  try {
    const fresh = await context.newPage(); await fresh.goto("/component-editor"); expect(await fresh.evaluate(() => localStorage.length)).toBe(0);
    await fresh.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "checkbox.json", mimeType: "application/json", buffer: bytes });
    await expect(checkbox(fresh)).toBeChecked(); await expect(checkbox(fresh)).toBeDisabled(); await expect(image(fresh)).toHaveAttribute("data-column-span", "5");
    await fresh.getByRole("treeitem", { name: "Remember choice", exact: true }).click(); await expect(fresh.getByLabel("Initially checked", { exact: true })).toBeChecked();
    await fresh.setViewportSize({ width: 390, height: 860 }); expect(await fresh.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await info.attach("checkbox-fresh-v7-reopen", { body: await fresh.screenshot({ fullPage: true }), contentType: "image/png" });
    await fresh.getByRole("button", { name: "Reset properties", exact: true }).click(); await expect(checkbox(fresh)).toBeEnabled(); await expect(checkbox(fresh)).not.toBeChecked();
  } finally { await context.close(); }
});
test("Checkbox nests in Card; malformed/current-state/wrong-kind/downgraded imports preserve draft", async ({ page }) => {
  await page.goto("/component-editor"); await page.getByLabel("Composition", { exact: true }).selectOption("composition:action-panel");
  await page.getByRole("searchbox", { name: "Search insertable components", exact: true }).fill("Display"); await page.getByRole("button", { name: "Add component", exact: true }).click();
  await page.getByLabel("Container", { exact: true }).selectOption("node:added-3"); await add(page);
  const card = page.getByRole("group", { name: "Card 3 preview", exact: true }); await expect(card.locator('[data-node-ref="node:added-4"]')).toHaveAttribute("data-slot-ref", "content");
  const original = JSON.parse((await download(page)).toString()); const revision = await editor(page).getAttribute("data-draft-revision");
  for (const mutation of ["downgrade", "checked", "wrong-kind", "coercion"]) {
    const doc = structuredClone(original); const node = doc.payload.graph.nodes.find((n: { componentRef: string }) => n.componentRef === "component:checkbox");
    if (mutation === "downgrade") doc.schema.version = "6.0.0";
    else if (mutation === "wrong-kind") node.properties = { kind: "input", inputType: "text", placeholder: "", disabled: false, readOnly: false };
    else node.properties = { kind: "checkbox", defaultChecked: mutation === "coercion" ? "true" : true, disabled: false, ...(mutation === "checked" ? { checked: true } : {}) };
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(doc)) });
    await expect(editor(page)).toHaveAttribute("data-draft-revision", revision!); await expect(card.locator('[data-node-ref="node:added-4"]')).toBeVisible(); await expect(editor(page).locator("#editor-feedback")).toContainText("unchanged");
  }
});
