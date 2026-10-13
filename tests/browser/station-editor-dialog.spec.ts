import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
const editor = (p: Page) => p.getByRole("region", { name: "Composition editor", exact: true });
async function addDialog(p: Page) { await p.getByRole("searchbox", { name: "Search insertable components", exact: true }).fill("Overlays"); await p.getByLabel("Component to add", { exact: true }).selectOption("component:dialog"); await p.getByRole("button", { name: "Add component", exact: true }).click(); }
async function download(p: Page) { const pending = p.waitForEvent("download"); await p.getByRole("button", { name: "Save As file", exact: true }).click(); return readFile((await (await pending).path())!); }
test("Dialog actual slot keyboard modal history and fresh payload8 reopen", async ({ page, browser }, info) => {
  await page.goto("/component-editor"); await addDialog(page);
  await page.getByLabel("Dialog trigger label", { exact: true }).fill("Details"); await page.getByRole("button", { name: "Apply text", exact: true }).click();
  await page.getByLabel("Dialog title", { exact: true }).fill("a".repeat(257));
  const before = await editor(page).getAttribute("data-draft-revision");
  await page.getByRole("button", { name: "Apply properties", exact: true }).click(); await expect(editor(page)).toHaveAttribute("data-draft-revision", before!);
  await expect(editor(page).locator("#editor-feedback")).toContainText("invalid");
  await page.getByRole("button", { name: "Restore fields", exact: true }).click();
  await page.getByLabel("Dialog title", { exact: true }).fill("<Review>"); await page.getByLabel("Dialog description", { exact: true }).fill("Plain description");
  const undo = page.getByRole("button", { name: "Undo", exact: true }); await expect(undo).toBeDisabled(); await undo.focus(); await undo.press("Enter");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", before!);
  await page.getByRole("button", { name: "Apply properties", exact: true }).click();
  await page.getByRole("button", { name: "Undo", exact: true }).click(); await expect(page.getByLabel("Dialog title", { exact: true })).toHaveValue("Dialog");
  await page.getByRole("button", { name: "Redo", exact: true }).click(); await expect(page.getByLabel("Dialog title", { exact: true })).toHaveValue("<Review>");
  await page.getByLabel("Columns", { exact: true }).fill("7"); await page.getByRole("button", { name: "Apply size", exact: true }).click();
  await page.getByLabel("Container", { exact: true }).selectOption("node:added-3");
  await page.getByRole("searchbox", { name: "Search insertable components", exact: true }).fill("Actions"); await page.getByRole("button", { name: "Add component", exact: true }).click();
  await page.getByRole("treeitem", { name: "Details", exact: true }).click();
  const trigger = page.getByRole("button", { name: "Open Details", exact: true });
  const revision = await editor(page).getAttribute("data-draft-revision"); await trigger.focus(); await trigger.press("Enter");
  const modal = page.getByRole("dialog", { name: "<Review>", exact: true }); await expect(modal).toBeVisible(); await expect(modal).toContainText("Plain description");
  await expect(modal.getByRole("img", { name: "Button 4 preview", exact: true })).toHaveAttribute("data-slot-ref", "content");
  await modal.getByRole("button", { name: "Close dialog preview", exact: true }).focus(); await page.keyboard.press("Tab");
  expect(await modal.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape"); await expect(modal).not.toBeVisible(); await expect(trigger).toBeFocused();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", revision!);
  await page.getByLabel("Disabled preview", { exact: true }).check(); await page.getByRole("button", { name: "Apply properties", exact: true }).click(); await expect(trigger).toBeDisabled();
  await page.getByLabel("Disabled preview", { exact: true }).uncheck(); await page.getByRole("button", { name: "Apply properties", exact: true }).click();
  await page.getByRole("button", { name: "Save locally", exact: true }).click(); await page.getByRole("button", { name: "Open saved", exact: true }).click();
  const bytes = await download(page); const doc = JSON.parse(bytes.toString()); expect(doc.schema.version).toBe("8.0.0");
  const node = doc.payload.graph.nodes.find((n: { componentRef: string }) => n.componentRef === "component:dialog");
  expect(node.text).toBe("Details"); expect(node.placement.columnSpan).toBe(7); expect(node.properties).toEqual({ kind: "dialog", title: "<Review>", description: "Plain description", disabled: false }); expect(node.properties).not.toHaveProperty("open");
  const context = await browser.newContext();
  try {
    const fresh = await context.newPage(); await fresh.goto("/component-editor"); expect(await fresh.evaluate(() => localStorage.length)).toBe(0);
    await fresh.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "dialog.json", mimeType: "application/json", buffer: bytes });
    await fresh.getByRole("treeitem", { name: "Details", exact: true }).click(); await expect(fresh.getByLabel("Dialog title", { exact: true })).toHaveValue("<Review>");
    await expect(fresh.getByRole("group", { name: "Details preview", exact: true })).toHaveAttribute("data-column-span", "7");
    await fresh.setViewportSize({ width: 390, height: 860 }); await fresh.getByRole("button", { name: "Open Details", exact: true }).press("Enter");
    const reopened = fresh.getByRole("dialog", { name: "<Review>", exact: true }); await expect(reopened.getByRole("img", { name: "Button 4 preview", exact: true })).toBeVisible();
    await info.attach("dialog-fresh-v8-open", { body: await fresh.screenshot({ fullPage: true }), contentType: "image/png" });
    await reopened.getByRole("button", { name: "Close dialog preview", exact: true }).click();
    await fresh.getByRole("button", { name: "Reset properties", exact: true }).click(); await expect(fresh.getByLabel("Dialog title", { exact: true })).toHaveValue("Dialog");
  } finally { await context.close(); }
});
test("Dialog nested in Card rejects wrong-kind current-state and downgraded imports atomically", async ({ page }) => {
  await page.goto("/component-editor"); await page.getByLabel("Composition", { exact: true }).selectOption("composition:action-panel");
  await page.getByRole("searchbox", { name: "Search insertable components", exact: true }).fill("Display"); await page.getByRole("button", { name: "Add component", exact: true }).click();
  await page.getByLabel("Container", { exact: true }).selectOption("node:added-3"); await addDialog(page);
  const card = page.getByRole("group", { name: "Card 3 preview", exact: true }); await expect(card.getByRole("button", { name: "Open Dialog 4", exact: true })).toBeVisible();
  await page.getByLabel("Dialog title", { exact: true }).fill("Nested"); await page.getByRole("button", { name: "Apply properties", exact: true }).click();
  const original = JSON.parse((await download(page)).toString()); const revision = await editor(page).getAttribute("data-draft-revision");
  for (const mutation of ["downgrade", "open", "defaultOpen", "wrong-kind", "blank"]) {
    const doc = structuredClone(original); const node = doc.payload.graph.nodes.find((n: { componentRef: string }) => n.componentRef === "component:dialog");
    if (mutation === "downgrade") doc.schema.version = "7.0.0";
    else if (mutation === "wrong-kind") node.properties = { kind: "checkbox", defaultChecked: false, disabled: false };
    else if (mutation === "blank") node.properties.title = "";
    else node.properties[mutation] = true;
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(doc)) });
    await expect(editor(page)).toHaveAttribute("data-draft-revision", revision!); await expect(card.getByRole("button", { name: "Open Dialog 4", exact: true })).toBeVisible(); await expect(editor(page).locator("#editor-feedback")).toContainText("unchanged");
  }
});
