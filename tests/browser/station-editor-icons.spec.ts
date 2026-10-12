import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
const editor = (page: Page) => page.getByRole("region", { name: "Composition editor", exact: true });
const snapshot = (page: Page) => page.getByRole("img", { name: "Button 1 preview", exact: true });
const native = (page: Page) => snapshot(page).locator('button[data-slot="button"]');
async function download(page: Page) {
  const event = page.waitForEvent("download"); await page.getByRole("button", { name: "Save As file", exact: true }).click();
  const file = await event; return readFile((await file.path())!);
}
test("actual icon configuration guards history and survives local save and fresh file reopen", async ({ page, browser }, info) => {
  await page.goto("/component-editor"); await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await page.getByLabel("Search icons", { exact: true }).fill("save");
  await expect(page.getByLabel("Button icon", { exact: true })).toBeEnabled();
  await page.getByLabel("Button icon", { exact: true }).selectOption("glyph:save");
  await page.getByLabel("Button display", { exact: true }).selectOption("icon");
  await page.getByLabel("Icon position", { exact: true }).selectOption("end");
  const guardedSave = page.getByRole("button", { name: "Save locally", exact: true });
  await expect(guardedSave).toBeDisabled();
  await guardedSave.focus(); await guardedSave.press("Enter");
  await expect(editor(page).locator("#editor-feedback")).toContainText("Apply or restore");
  await expect(native(page)).toHaveAttribute("data-display-mode", "text");
  await page.getByRole("button", { name: "Apply properties", exact: true }).click();
  await expect(native(page)).toHaveAttribute("data-icon-status", "ready");
  await expect(native(page)).toHaveAttribute("data-label-visible", "false");
  await expect(native(page).locator('svg[data-icon-token="glyph:save"]')).toHaveCount(1);
  await expect(native(page)).not.toContainText("Button 1");
  await expect(snapshot(page)).toHaveAttribute("title", "Button 1"); await snapshot(page).focus(); await expect(snapshot(page)).toBeFocused();
  await page.getByRole("button", { name: "Undo", exact: true }).click(); await expect(native(page)).toHaveText("Button 1");
  await page.getByRole("button", { name: "Redo", exact: true }).click(); await expect(native(page)).toHaveAttribute("data-icon-status", "ready");
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  await page.getByRole("button", { name: "Open saved", exact: true }).click();
  await page.getByRole("button", { name: "Discard changes and open file", exact: true }).click();
  await expect(page.getByLabel("Button display", { exact: true })).toHaveValue("icon");
  const bytes = await download(page); const doc = JSON.parse(bytes.toString());
  expect(doc.schema.version).toBe("5.0.0");
  expect(doc.payload.graph.nodes[1].properties.presentation).toEqual({ mode: "icon", placement: "end", icon: { assetRef: "glyph:save", catalogVersion: "1.0.0" } });
  const context = await browser.newContext();
  try {
    const fresh = await context.newPage(); await fresh.goto("/component-editor");
    expect(await fresh.evaluate(() => localStorage.length)).toBe(0);
    await fresh.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "icon.json", mimeType: "application/json", buffer: bytes });
    await expect(native(fresh)).toHaveAttribute("data-icon-status", "ready"); await expect(native(fresh)).toHaveAttribute("data-label-visible", "false");
    await fresh.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await expect(fresh.getByLabel("Button icon", { exact: true })).toHaveValue("glyph:save");
    await expect(fresh.getByLabel("Icon position", { exact: true })).toHaveValue("end");
    await fresh.setViewportSize({ width: 390, height: 860 });
    await info.attach("editor-icon-only-fresh-reopen", { body: await fresh.screenshot({ fullPage: true }), contentType: "image/png" });
    await fresh.getByLabel("Button display", { exact: true }).selectOption("icon-text"); await fresh.getByRole("button", { name: "Apply properties", exact: true }).click();
    await expect(native(fresh).locator("span + svg")).toHaveCount(1);
    await fresh.setViewportSize({ width: 390, height: 860 });
    await info.attach("editor-icon-fresh-reopen", { body: await fresh.screenshot({ fullPage: true }), contentType: "image/png" });
  } finally { await context.close(); }
});
test("missing and unsupported asset references fall back honestly; malformed import is atomic", async ({ page }) => {
  await page.goto("/component-editor"); const bytes = await download(page); const original = JSON.parse(bytes.toString());
  for (const icon of [{ assetRef: "glyph:missing-example", catalogVersion: "1.0.0" }, { assetRef: "glyph:save", catalogVersion: "9.0.0" }]) {
    const doc = structuredClone(original); doc.schema.version = "5.0.0";
    doc.payload.graph.nodes[1].properties = { variant: "default", disabled: false, presentation: { mode: "icon", placement: "start", icon } };
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "missing.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(doc)) });
    await expect(native(page)).toHaveAttribute("data-icon-status", icon.catalogVersion === "9.0.0" ? "unsupported-version" : "missing");
    await expect(native(page)).toContainText("Button 1"); await expect(native(page)).toContainText("Icon unavailable");
    const retained = JSON.parse((await download(page)).toString()); expect(retained.payload.graph.nodes[1].properties.presentation.icon).toEqual(icon);
  }
  const revision = await editor(page).getAttribute("data-draft-revision");
  original.schema.version = "5.0.0"; original.payload.graph.nodes[1].properties = { variant: "default", disabled: false, presentation: { mode: "icon", placement: "start", icon: { assetRef: "javascript:execute", catalogVersion: "1.0.0" } } };
  await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(original)) });
  await expect(editor(page)).toHaveAttribute("data-draft-revision", revision!); await expect(native(page)).toHaveAttribute("data-icon-status", "unsupported-version");
});
