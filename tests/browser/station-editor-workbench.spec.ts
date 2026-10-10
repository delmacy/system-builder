import { test, expect, type Page, type Locator } from "@playwright/test";
import { readFile } from "node:fs/promises";

const editor = (page: Page) => page.getByRole("region", { name: "Composition editor", exact: true });
const preview = (page: Page, name = "Button 1") => page.getByRole("img", { name: name + " preview", exact: true });
async function span(page: Page, columns: string, rows = "1") {
  await page.getByLabel("Columns", { exact: true }).fill(columns);
  await page.getByLabel("Rows", { exact: true }).fill(rows);
  await page.getByRole("button", { name: "Apply size", exact: true }).click();
}
async function tabTo(page: Page, target: Locator) {
  for (let count = 0; count < 20; count++) {
    if (await target.evaluate(element => element === element.ownerDocument.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  await expect(target).toBeFocused();
}
test.beforeEach(async ({ page }) => {
  await page.goto("/component-editor");
  await expect(page.getByRole("heading", { name: "Composition Editor", exact: true })).toBeVisible();
});

test("real projections converge through edit, save, another edit and discard", async ({ page }, testInfo) => {
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("2");
  await expect(preview(page)).toHaveAttribute("data-selected", "true");
  const before = await preview(page).boundingBox();
  await span(page, "3");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  const after = await preview(page).boundingBox();
  expect(after!.width).toBeGreaterThan(before!.width);
  await expect(page.getByTestId("draft-state")).toHaveText("Unsaved changes");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "9");
  await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
  await span(page, "4", "2");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "10");
  await expect(preview(page)).toHaveAttribute("data-row-span", "2");
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "11");
  await expect(editor(page)).toHaveAttribute("data-base-revision", "7");
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await expect(preview(page)).toHaveAttribute("data-row-span", "1");
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("3");
  await expect(page.getByLabel("Rows", { exact: true })).toHaveValue("1");
  await expect(page.getByRole("treeitem", { name: "Button 1", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.screenshot({ path: testInfo.outputPath("editor-after-save-discard.png"), fullPage: true });
});

test("malformed and incompatible sizes preserve the draft and permit recovery", async ({ page }) => {
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  for (const value of ["1.5", "999", "", "abc"]) {
    await span(page, value);
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
    await expect(preview(page)).toHaveAttribute("data-column-span", "2");
    await expect(page.getByRole("status")).toContainText("unchanged");
    await expect(page.getByLabel("Columns", { exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
  }
  await span(page, "3", "0");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
  await span(page, "3");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
  await expect(page.getByLabel("Columns", { exact: true })).toHaveAttribute("aria-invalid", "false");
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
});

test("keyboard focus is distinct from selection and survives edit/save/discard", async ({ page }) => {
  const root = page.getByRole("treeitem", { name: "Grid", exact: true });
  const first = page.getByRole("treeitem", { name: "Button 1", exact: true });
  const second = page.getByRole("treeitem", { name: "Button 2", exact: true });
  aw…1685 tokens truncated…pect(editor(page)).toHaveAttribute("data-draft-revision", "9");
  await first.click();
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("3");
  await expect(page.getByLabel("Rows", { exact: true })).toHaveValue("1");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "10");
  await span(page, "1");
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await expect(preview(page, "Button 2")).toHaveAttribute("data-column-span", "4");
  await expect(preview(page, "Button 2")).toHaveAttribute("data-row-span", "2");
  await expect(page.getByText("Save changes accepts this session. Save locally retains a separate copy in this browser; use Open saved after reload.", { exact: true })).toBeVisible();
  await page.reload();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
  await expect(preview(page)).toHaveAttribute("data-column-span", "2");
  await expect(preview(page, "Button 2")).toHaveAttribute("data-column-span", "2");
  await expect(page.getByLabel("Columns", { exact: true })).toBeDisabled();
  await expect(first).toHaveAttribute("aria-selected", "false");
});

test("source-owned button group uses its own hierarchy, bounds, and session projections", async ({ page }, testInfo) => {
  const catalog = page.getByLabel("Composition", { exact: true });
  await catalog.selectOption("composition:button-group");
  await expect(catalog).toHaveValue("composition:button-group");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
  const root = page.getByRole("treeitem", { name: "Button Group", exact: true });
  const child = page.getByRole("treeitem", { name: "Group Button 1", exact: true });
  await expect(root).toHaveAttribute("aria-level", "1");
  await expect(child).toHaveAttribute("aria-level", "2");
  await child.click();
  await expect(page.locator("#span-help")).toContainText("1–4 columns and 1–1 row");
  const item = preview(page, "Group Button 1");
  await expect(item).toHaveAttribute("data-parent-ref", "layer:button-group");
  await expect(item).toHaveAttribute("data-slot-ref", "button-1");
  await span(page, "4", "1");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
  await expect(item).toHaveAttribute("data-column-span", "4");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "9");
  for (const [columns, rows] of [["5", "1"], ["4", "2"], ["1.5", "1"]]) {
    await span(page, columns!, rows!);
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "9");
    await expect(item).toHaveAttribute("data-column-span", "4");
    await expect(page.getByRole("status")).toContainText("unchanged");
  }
  await span(page, "3", "1");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "10");
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "11");
  await expect(item).toHaveAttribute("data-column-span", "4");
  await page.screenshot({ path: testInfo.outputPath("button-group-save-discard.png"), fullPage: true });
});

test("dirty switch cancellation preserves input, selection and draft; explicit discard starts clean", async ({ page }) => {
  const catalog = page.getByLabel("Composition", { exact: true });
  const first = page.getByRole("treeitem", { name: "Button 1", exact: true });
  await first.click();
  await span(page, "3", "1");
  await page.getByLabel("Columns", { exact: true }).fill("999");
  await catalog.selectOption("composition:button-group");
  await expect(page.getByRole("group", { name: "Unsaved composition switch" })).toBeVisible();
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await page.getByRole("button", { name: "Cancel switch" }).click();
  await expect(catalog).toBeFocused();
  await expect(catalog).toHaveValue("composition:example");
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("999");
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
  await catalog.selectOption("composition:button-group");
  await expect(page.getByRole("group", { name: "Unsaved composition switch" })).toBeVisible();
  await page.getByRole("button", { name: "Discard changes and open" }).click();
  await expect(catalog).toHaveValue("composition:button-group");
  await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
  await expect(page.getByRole("treeitem", { name: "Group Button 1" })).toHaveAttribute("aria-selected", "false");
  await expect(page.getByLabel("Columns", { exact: true })).toBeDisabled();
  await expect(page.getByRole("group", { name: "Unsaved composition switch" })).toHaveCount(0);
});

test("clean catalog switching resets sessions and retains accessible keyboard tree", async ({ page }) => {
  const catalog = page.getByLabel("Composition", { exact: true });
  await catalog.selectOption("composition:button-group");
  const root = page.getByRole("treeitem", { name: "Button Group", exact: true });
  await tabTo(page, root);
  await page.keyboard.press("ArrowRight");
  const first = page.getByRole("treeitem", { name: "Group Button 1", exact: true });
  await expect(first).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-selected", "true");
  await catalog.selectOption("composition:example");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
  await expect(page.getByRole("treeitem", { name: "Grid" })).toHaveAttribute("aria-selected", "false");
  await catalog.selectOption("composition:button-group");
  await expect(first).toHaveAttribute("aria-selected", "false");
  await expect(preview(page, "Group Button 1")).toHaveAttribute("data-column-span", "2");
});

test.describe("Station launcher and window lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open applications" }).click();
    await page.locator('[data-app-ref="app:composition-editor"]').click();
  });

  test("editor draft survives minimize and restore, then close/reopen starts fresh", async ({ page }, testInfo) => {
    const window = page.getByRole("dialog", { name: "Composition Editor", exact: true });
    await expect(window).toBeVisible();
    const workbench = window.getByRole("region", { name: "Composition editor", exact: true });
    await workbench.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await workbench.getByLabel("Columns", { exact: true }).fill("3");
    await workbench.getByRole("button", { name: "Apply size" }).click();
    await expect(workbench).toHaveAttribute("data-draft-revision", "8");
    await workbench.getByLabel("Columns", { exact: true }).fill("999");
    await window.getByRole("button", { name: "Minimize window" }).click();
    await expect(window).toHaveCount(0);
    const taskbar = page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor" });
    await expect(taskbar).toHaveAttribute("data-window-lifecycle", "MINIMIZED");
    await taskbar.click();
    await expect(window).toBeVisible();
    await expect(workbench).toHaveAttribute("data-draft-revision", "8");
    await expect(workbench.getByLabel("Columns", { exact: true })).toHaveValue("999");
    await expect(workbench.getByRole("treeitem", { name: "Button 1" })).toHaveAttribute("aria-selected", "true");
    await expect(workbench.getByRole("img", { name: "Button 1 preview" })).toHaveAttribute("data-column-span", "3");
    await page.screenshot({ path: testInfo.outputPath("station-editor-restored.png"), fullPage: true });
    await window.getByRole("button", { name: "Close window" }).click();
    await expect(window).toHaveCount(0);
    await expect(taskbar).toHaveCount(0);
    await page.getByRole("button", { name: "Open applications" }).click();
    await page.locator('[data-app-ref="app:composition-editor"]').click();
    await expect(window).toBeVisible();
    await expect(workbench).toHaveAttribute("data-draft-revision", "7");
    await expect(workbench.getByLabel("Columns", { exact: true })).toBeDisabled();
    await expect(workbench.getByRole("img", { name: "Button 1 preview" })).toHaveAttribute("data-column-span", "2");
  });

  test("catalog switching and window layout store never become durable editor data", async ({ page }) => {
    const window = page.getByRole("dialog", { name: "Composition Editor", exact: true });
    const workbench = window.getByRole("region", { name: "Composition editor", exact: true });
    await workbench.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
    await workbench.getByRole("treeitem", { name: "Group Button 1" }).click();
    await workbench.getByLabel("Rows", { exact: true }).fill("2");
    await workbench.getByRole("button", { name: "Apply size" }).click();
    await expect(workbench).toHaveAttribute("data-draft-revision", "7");
    await expect(workbench.getByRole("status")).toContainText("unchanged");
    await workbench.getByLabel("Rows", { exact: true }).fill("1");
    await workbench.getByLabel("Columns", { exact: true }).fill("3");
    await workbench.getByRole("button", { name: "Apply size" }).click();
    await expect(workbench).toHaveAttribute("data-draft-revision", "8");
    await workbench.getByLabel("Composition", { exact: true }).selectOption("composition:example");
    await expect(workbench.getByRole("group", { name: "Unsaved composition switch" })).toBeVisible();
    await workbench.getByRole("button", { name: "Cancel switch" }).click();
    await expect(workbench.getByLabel("Composition", { exact: true })).toHaveValue("composition:button-group");
    const stored = await page.evaluate(() => localStorage.getItem("system-builder.station.layout.v1"));
    expect(stored).toBeTruthy();
    expect(stored).not.toContain("composition:button-group");
    expect(stored).not.toContain("layer:button-1");
    expect(stored).not.toContain("draft");
    await page.reload();
    const restored = page.getByRole("dialog", { name: "Composition Editor", exact: true });
    await expect(restored).toBeVisible();
    await expect(restored.getByLabel("Composition", { exact: true })).toHaveValue("composition:example");
    await expect(restored.getByRole("region", { name: "Composition editor", exact: true })).toHaveAttribute("data-draft-revision", "7");
  });
});

async function downloadedComposition(page: Page): Promise<Buffer> {
  const ready = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save As file", exact: true }).click();
  const download = await ready;
  expect(download.suggestedFilename()).toMatch(/\.composition\.json$/);
  expect(await download.failure()).toBeNull();
  return readFile((await download.path())!);
}

test("WP3 explicit local retention survives reload and restores a selected projection", async ({ page }, testInfo) => {
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await span(page, "3");
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Composition saved locally in this browser.");
  await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
  await page.reload();
  await expect(preview(page)).toHaveAttribute("data-column-span", "2");
  await page.getByRole("button", { name: "Open saved", exact: true }).click();
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("3");
  await page.screenshot({ path: testInfo.outputPath("wp3-local-reopened.png"), fullPage: true });
});

test("WP3 actual downloaded artifact reopens in a fresh browser origin context", async ({ page, browser }, testInfo) => {
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await span(page, "4", "2");
  const bytes = await downloadedComposition(page);
  await expect(page.getByTestId("draft-state")).toHaveText("Unsaved changes");
  const document = JSON.parse(bytes.toString()) as { artifactId: string; payload: { graph: unknown } };
  expect(document.artifactId).toMatch(/^urn:uuid:/);
  const fresh = await browser.newContext();
  try {
    const other = await fresh.newPage(); await other.goto(page.url());
    await other.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "portable.composition.json", mimeType: "application/json", buffer: bytes });
    await expect(preview(other)).toHaveAttribute("data-column-span", "4");
    await expect(preview(other)).toHaveAttribute("data-row-span", "2");
    await other.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await expect(other.getByLabel("Columns", { exact: true })).toHaveValue("4");
    const retained = await other.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith("station:composition-artifact:v1:")));
    expect(retained).toEqual([]);
    await other.screenshot({ path: testInfo.outputPath("wp3-file-reopened.png"), fullPage: true });
  } finally { await fresh.close(); }
});

test("WP3 dirty saved-open cancel retains fields/selection/focus, confirm replaces atomically", async ({ page }) => {
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await span(page, "3"); await page.getByRole("button", { name: "Save locally", exact: true }).click();
  await span(page, "4"); await page.getByLabel("Columns", { exact: true }).fill("999");
  await page.getByRole("button", { name: "Open saved", exact: true }).click();
  await expect(page.getByRole("group", { name: "Unsaved artifact open" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel open", exact: true }).click();
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("999");
  await expect(preview(page)).toHaveAttribute("data-column-span", "4");
  await expect(page.getByRole("treeitem", { name: "Button 1", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("button", { name: "Open saved", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Open saved", exact: true }).click();
  await page.getByRole("button", { name: "Discard changes and open file", exact: true }).click();
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("3");
});

test("WP3 corrupt/version/script/size inputs preserve current draft and permit recovery", async ({ page }) => {
  const valid = await downloadedComposition(page);
  const document = JSON.parse(valid.toString());
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
  const invalid = [Buffer.from("{"), Buffer.from(JSON.stringify({ ...document, envelopeVersion: "2.0.0" })),
    Buffer.from(JSON.stringify({ ...document, payload: { ...document.payload, baseRevision: 6 } })),
    Buffer.from(JSON.stringify({ ...document, payload: { ...document.payload, script: "window.PWNED=true" } })),
    Buffer.alloc(1_048_577, 32)];
  for (const bytes of invalid) {
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: bytes });
    await expect(page.getByRole("status")).toContainText("Unable to open");
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await expect(page.getByTestId("draft-state")).toHaveText("Unsaved changes");
    await expect(page.getByRole("group", { name: "Unsaved artifact open" })).toHaveCount(0);
  }
  expect(await page.evaluate(() => Object.hasOwn(window, "PWNED"))).toBe(false);
  await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "good.json", mimeType: "application/json", buffer: valid });
  await expect(page.getByRole("group", { name: "Unsaved artifact open" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel open", exact: true }).click();
  await expect(page.getByRole("button", { name: "Open file", exact: true })).toBeFocused();
  await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "good.json", mimeType: "application/json", buffer: valid });
  await page.getByRole("button", { name: "Discard changes and open file", exact: true }).click();
  await expect(preview(page)).toHaveAttribute("data-column-span", "2");
});

test("WP3 quota failure preserves prior bytes and dirty draft; stale local copy cannot be overwritten", async ({ page }) => {
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  const key = "station:composition-artifact:v1:composition%3Aexample";
  const before = await page.evaluate(key => localStorage.getItem(key), key);
  await span(page, "4");
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Object.assign(window, { wp3RestoreStorage: () => { Storage.prototype.setItem = original; } });
    Storage.prototype.setItem = function(key, value) {
      if (key.startsWith("station:composition-artifact:v1:")) throw new DOMException("full", "QuotaExceededError");
      original.call(this, key, value);
    };
  });
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("unavailable or full");
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(before);
  await expect(preview(page)).toHaveAttribute("data-column-span", "4");
  await expect(page.getByTestId("draft-state")).toHaveText("Unsaved changes");
  await page.evaluate(() => { (window as unknown as { wp3RestoreStorage(): void }).wp3RestoreStorage(); });
  await page.evaluate(key => localStorage.setItem(key, "{corrupt"), key);
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("already exists or changed");
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe("{corrupt");
  await page.getByRole("button", { name: "Open saved", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Unable to open");
  await expect(preview(page)).toHaveAttribute("data-column-span", "4");
});

test("WP3 independent composition keys and versioned metadata retention", async ({ page }) => {
  const bytes = await downloadedComposition(page);
  const imported = JSON.parse(bytes.toString()); imported.extensions = { "com.example.qa": { note: "preserve" } };
  await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "metadata.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(imported)) });
  await expect(page.getByRole("status")).toContainText("Composition opened");
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  const key = "station:composition-artifact:v1:composition%3Aexample";
  const first = JSON.parse((await page.evaluate(key => localStorage.getItem(key), key))!);
  expect(first.artifactId).toBe(imported.artifactId); expect(first.artifactVersion).toBe("1.0.1"); expect(first.extensions).toEqual(imported.extensions);
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  expect(JSON.parse((await page.evaluate(key => localStorage.getItem(key), key))!).artifactVersion).toBe("1.0.1");
  await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
  await page.getByRole("treeitem", { name: "Group Button 1", exact: true }).click(); await span(page, "4");
  await page.getByRole("button", { name: "Save locally", exact: true }).click();
  await page.reload(); await page.getByRole("button", { name: "Open saved", exact: true }).click();
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
  await page.getByRole("button", { name: "Open saved", exact: true }).click();
  await expect(preview(page, "Group Button 1")).toHaveAttribute("data-column-span", "4");
});

test("WP3 session-only acceptance still warns before opening a retained file; stale read cannot replace newer edits", async ({ page }) => {
  const bytes = await downloadedComposition(page);
  await page.evaluate(() => {
    const original = File.prototype.text;
    Object.assign(window, { wp3RestoreFileRead: () => { File.prototype.text = original; } });
    File.prototype.text = () => new Promise<string>(resolve => { Object.assign(window, { wp3ResolveFileRead: resolve }); });
  });
  await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "delayed.json", mimeType: "application/json", buffer: bytes });
  await page.waitForFunction(() => Object.hasOwn(window, "wp3ResolveFileRead"));
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
  await page.evaluate(text => {
    (window as unknown as { wp3ResolveFileRead(text: string): void }).wp3ResolveFileRead(text);
  }, bytes.toString());
  await expect(page.getByRole("status")).toContainText("superseded");
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await page.evaluate(() => { (window as unknown as { wp3RestoreFileRead(): void }).wp3RestoreFileRead(); });
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
  await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "retained.json", mimeType: "application/json", buffer: bytes });
  await expect(page.getByRole("group", { name: "Unsaved artifact open" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel open", exact: true }).click();
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
});

test("WP3 download failure preserves the draft and does not claim a filesystem receipt", async ({ page }) => {
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
  await page.evaluate(() => { URL.createObjectURL = () => { throw new Error("download unavailable"); }; });
  await page.getByRole("button", { name: "Save As file", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Unable to request the download");
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await expect(page.getByTestId("draft-state")).toHaveText("Unsaved changes");
});

test("WP3 Station window retention is separate from window preferences", async ({ page }, testInfo) => {
  await page.goto("/"); await page.getByRole("button", { name: "Open applications" }).click();
  await page.locator('[data-app-ref="app:composition-editor"]').click();
  const window = page.getByRole("dialog", { name: "Composition Editor", exact: true });
  await window.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await window.getByLabel("Columns", { exact: true }).fill("3"); await window.getByRole("button", { name: "Apply size", exact: true }).click();
  await window.getByRole("button", { name: "Save locally", exact: true }).click();
  await expect(window.getByRole("status")).toContainText("saved locally");
  const layout = await page.evaluate(() => localStorage.getItem("system-builder.station.layout.v1"));
  expect(layout).not.toContain("node:button-1"); expect(layout).not.toContain("payload");
  await page.reload(); await expect(window).toBeVisible();
  await window.getByRole("button", { name: "Open saved", exact: true }).click();
  await expect(window.getByRole("img", { name: "Button 1 preview", exact: true })).toHaveAttribute("data-column-span", "3");
  await page.screenshot({ path: testInfo.outputPath("wp3-station-retained.png"), fullPage: true });
});

test.describe("WP4 bounded edit history", () => {
  const undo = (page: Page) => page.getByRole("button", { name: "Undo", exact: true });
  const redo = (page: Page) => page.getByRole("button", { name: "Redo", exact: true });
  test("undo/redo converges projections, preserves selection and tracks dirty baseline", async ({ page }, testInfo) => {
    const first = page.getByRole("treeitem", { name: "Button 1", exact: true });
    await first.click(); await span(page, "3"); await span(page, "4");
    await undo(page).click(); await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("3");
    await undo(page).click(); await expect(preview(page)).toHaveAttribute("data-column-span", "2");
    await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
    await expect(first).toHaveAttribute("aria-selected", "true");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "11");
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
    await redo(page).click(); await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "12");
    await expect(page.getByTestId("draft-state")).toHaveText("Unsaved changes");
    await page.screenshot({ path: testInfo.outputPath("editor-undo-redo.png"), fullPage: true });
  });
  test("new changed branch clears redo; invalid and no-op edits preserve it", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await span(page, "3"); await undo(page).click();
    await span(page, "2"); await expect(redo(page)).toHaveAttribute("aria-disabled", "false");
    await span(page, "999"); await expect(redo(page)).toHaveAttribute("aria-disabled", "true");
    await page.getByLabel("Columns", { exact: true }).fill("2");
    await expect(redo(page)).toHaveAttribute("aria-disabled", "false");
    await redo(page).click(); await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await undo(page).click(); await span(page, "4");
    await expect(redo(page)).toHaveAttribute("aria-disabled", "true");
    await expect(preview(page)).toHaveAttribute("data-column-span", "4");
  });
  test("editor shortcuts preserve native text undo and unapplied fields", async ({ page }) => {
    const first = page.getByRole("treeitem", { name: "Button 1", exact: true });
    await first.click(); await span(page, "3");
    const input = page.getByLabel("Columns", { exact: true });
    await input.focus(); await input.press("ControlOrMeta+A"); await input.pressSequentially("4");
    await input.press("ControlOrMeta+Z");
    await expect(input).not.toHaveValue("4");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await input.fill("999"); await first.focus(); await first.press("ControlOrMeta+Z");
    await expect(input).toHaveValue("999"); await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await input.fill("3"); await first.focus(); await first.press("ControlOrMeta+Z");
    await expect(preview(page)).toHaveAttribute("data-column-span", "2"); await expect(first).toBeFocused();
    await first.press("ControlOrMeta+Shift+Z"); await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await first.press("Control+Z"); await first.press("Control+Y");
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await first.press("Alt+Control+Z"); await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await first.evaluate(element => {
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, repeat: true, bubbles: true, cancelable: true }));
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, isComposing: true, bubbles: true, cancelable: true }));
    });
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await editor(page).evaluate(element => {
      const text = document.createElement("div"); text.contentEditable = "true"; text.textContent = "Native text";
      text.setAttribute("data-history-native-proof", "true"); element.append(text); text.focus();
    });
    await page.keyboard.press("ControlOrMeta+Z");
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await page.locator("[data-history-native-proof]").evaluate(element => element.remove());
  });
  test("session save, discard and local save create history checkpoints", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await span(page, "3"); await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
    await span(page, "4"); await undo(page).click();
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
    await redo(page).click(); await page.getByRole("button", { name: "Discard changes", exact: true }).click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true"); await expect(redo(page)).toHaveAttribute("aria-disabled", "true");
    await span(page, "4"); await page.getByRole("button", { name: "Save locally", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("saved locally");
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
    const stored = await page.evaluate(() => localStorage.getItem("station:composition-artifact:v1:composition%3Aexample"));
    expect(stored).toBeTruthy(); expect(stored).not.toContain('"past"'); expect(stored).not.toContain('"future"');
  });
  test("download, failed save/open and canceled replacement preserve history", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await span(page, "3"); const bytes = await downloadedComposition(page);
    await expect(undo(page)).toHaveAttribute("aria-disabled", "false");
    expect(bytes.toString()).not.toContain('"past"'); expect(bytes.toString()).not.toContain('"future"');
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from("{") });
    await expect(page.getByRole("status")).toContainText("Unable to open");
    await expect(undo(page)).toHaveAttribute("aria-disabled", "false");
    await page.evaluate(() => localStorage.setItem("station:composition-artifact:v1:composition%3Aexample", "corrupt"));
    await page.getByRole("button", { name: "Save locally", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("unchanged");
    await expect(undo(page)).toHaveAttribute("aria-disabled", "false");
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "saved.composition.json", mimeType: "application/json", buffer: bytes });
    await expect(page.getByRole("group", { name: "Unsaved artifact open" })).toBeVisible();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
    await page.getByRole("button", { name: "Cancel open", exact: true }).click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "false");
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
    await page.getByRole("button", { name: "Cancel switch", exact: true }).click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "false");
    await undo(page).click(); await expect(preview(page)).toHaveAttribute("data-column-span", "2");
  });
  test("successful file/catalog/local replacement and reload start empty history", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await span(page, "3"); const bytes = await downloadedComposition(page);
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "saved.composition.json", mimeType: "application/json", buffer: bytes });
    await page.getByRole("button", { name: "Discard changes and open file", exact: true }).click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
    await span(page, "4"); await page.getByRole("button", { name: "Save locally", exact: true }).click();
    await span(page, "2"); await page.getByRole("button", { name: "Open saved", exact: true }).click();
    await page.getByRole("button", { name: "Discard changes and open file", exact: true }).click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true"); await expect(preview(page)).toHaveAttribute("data-column-span", "4");
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
    await page.getByRole("treeitem", { name: "Group Button 1", exact: true }).click(); await span(page, "3");
    await undo(page).click(); await expect(preview(page, "Group Button 1")).toHaveAttribute("data-column-span", "2");
    await redo(page).click(); await expect(preview(page, "Group Button 1")).toHaveAttribute("data-slot-ref", "button-1");
    await page.reload(); await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
  });
  test("Station minimize preserves history; close/reopen clears it and preferences exclude it", async ({ page }) => {
    await page.goto("/"); await page.getByRole("button", { name: "Open applications" }).click();
    await page.locator('[data-app-ref="app:composition-editor"]').click();
    const window = page.getByRole("dialog", { name: "Composition Editor", exact: true });
    await window.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
    await window.getByRole("button", { name: "Minimize window" }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor" }).click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "false");
    await undo(page).click(); await expect(preview(page)).toHaveAttribute("data-column-span", "2");
    const stored = await page.evaluate(() => localStorage.getItem("system-builder.station.layout.v1"));
    expect(stored).not.toContain('"past"'); expect(stored).not.toContain('"future"');
    await window.getByRole("button", { name: "Close window" }).click();
    await page.getByRole("button", { name: "Open applications" }).click(); await page.locator('[data-app-ref="app:composition-editor"]').click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true"); await expect(redo(page)).toHaveAttribute("aria-disabled", "true");
  });
  test("real UI retains precisely 50 of 51 changed edits", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    for (let count = 1; count <= 51; count++) await span(page, count % 2 ? "3" : "2");
    for (let count = 0; count < 50; count++) await undo(page).click();
    await expect(undo(page)).toHaveAttribute("aria-disabled", "true");
    await expect(redo(page)).toHaveAttribute("aria-disabled", "false");
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "108");
  });
});

test.describe("WP5 bounded structural authoring", () => {
  const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
  const layer = (page: Page, name: string) => page.getByRole("treeitem", { name, exact: true });
  async function add(page: Page, component = "component:button", parent = "node:root", slot = "content") {
    await page.getByLabel("Component to add", { exact: true }).selectOption(component);
    await page.getByLabel("Container", { exact: true }).selectOption(parent);
    await page.getByLabel("Slot", { exact: true }).selectOption(slot);
    await button(page, "Add component").click();
  }
  const previewRefs = (page: Page) => page.getByLabel("Composition preview", { exact: true }).locator("[data-node-ref]").evaluateAll(nodes => nodes.map(node => node.getAttribute("data-node-ref")));

  test("actual add/reorder/remove synchronizes projections and mixed undo/redo", async ({ page }, testInfo) => {
    await add(page);
    await expect(layer(page, "Button 3")).toHaveAttribute("aria-selected", "true");
    await expect(preview(page, "Button 3")).toHaveAttribute("data-column-span", "2");
    await button(page, "Move earlier").click();
    expect(await previewRefs(page)).toEqual(["node:button-1", "node:added-3", "node:button-2"]);
    await span(page, "3"); await expect(preview(page, "Button 3")).toHaveAttribute("data-column-span", "3");
    await button(page, "Remove subtree").click();
    await expect(layer(page, "Button 3")).toHaveCount(0); await expect(layer(page, "Grid")).toHaveAttribute("aria-selected", "true");
    await button(page, "Undo").click(); await expect(preview(page, "Button 3")).toHaveAttribute("data-column-span", "3");
    await button(page, "Undo").click(); await expect(preview(page, "Button 3")).toHaveAttribute("data-column-span", "2");
    await button(page, "Undo").click(); expect(await previewRefs(page)).toEqual(["node:button-1", "node:button-2", "node:added-3"]);
    await button(page, "Undo").click(); await expect(layer(page, "Button 3")).toHaveCount(0);
    await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
    await button(page, "Redo").click(); await expect(layer(page, "Button 3")).toBeVisible();
    await layer(page, "Button 3").click();
    await page.screenshot({ path: testInfo.outputPath("wp5-structural-editor.png"), fullPage: true });
  });

  test("nested subtree removal, discard and undo repair selection without losing hierarchy", async ({ page }) => {
    await add(page, "component:grid"); await add(page, "component:button", "node:added-3");
    await expect(layer(page, "Button 4")).toBeVisible();
    await expect(preview(page, "Button 4")).toHaveAttribute("data-parent-ref", "node:added-3");
    await button(page, "Save changes").click(); await layer(page, "Grid 3").click();
    await button(page, "Remove subtree").click(); await expect(layer(page, "Grid 3")).toHaveCount(0);
    await expect(layer(page, "Button 4")).toHaveCount(0); await expect(layer(page, "Grid")).toHaveAttribute("aria-selected", "true");
    await button(page, "Discard changes").click(); await expect(layer(page, "Button 4")).toBeVisible();
    await expect(button(page, "Undo")).toHaveAttribute("aria-disabled", "true");
    await layer(page, "Grid 3").click(); await button(page, "Remove subtree").click(); await button(page, "Undo").click();
    await expect(preview(page, "Button 4")).toBeVisible();
    await add(page, "component:button"); await button(page, "Discard changes").click();
    await expect(layer(page, "Button 5")).toHaveCount(0); await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("");
    await expect(page.getByRole("status")).toHaveText("Changes discarded.");
  });

  test("typed group slots reject occupancy and incompatible components, then recover", async ({ page }) => {
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
    await add(page, "component:lab-button", "layer:button-group", "button-1");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7"); await expect(page.getByRole("status")).toContainText("unchanged");
    await add(page, "component:button-group", "layer:button-group", "button-3");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
    await add(page, "component:lab-button", "layer:button-group", "button-3");
    await expect(layer(page, "Button 3")).toBeVisible(); await expect(preview(page, "Button 3")).toHaveAttribute("data-slot-ref", "button-3");
    await expect(button(page, "Move earlier")).toBeDisabled(); await expect(button(page, "Move later")).toBeDisabled();
    await button(page, "Remove subtree").click(); await button(page, "Undo").click(); await expect(layer(page, "Button 3")).toBeVisible();
  });

  test("root and pending Inspector fields block destructive structural controls; native undo stays native", async ({ page }) => {
    await layer(page, "Grid").click(); await expect(button(page, "Remove subtree")).toBeDisabled();
    await expect(button(page, "Move earlier")).toBeDisabled();
    await layer(page, "Button 1").click(); await page.getByLabel("Columns", { exact: true }).fill("999");
    for (const name of ["Add component", "Remove subtree", "Move later"]) await expect(button(page, name)).toBeDisabled();
    await page.getByLabel("Columns", { exact: true }).press("ControlOrMeta+z");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
    await page.getByLabel("Columns", { exact: true }).fill("2"); await add(page);
    await button(page, "Undo").focus(); await page.keyboard.press("ControlOrMeta+z");
    await expect(layer(page, "Button 3")).toHaveCount(0); await expect(layer(page, "Grid")).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ControlOrMeta+Shift+z"); await expect(layer(page, "Button 3")).toBeVisible();
  });

  test("local v1-to-v2 save preserves identity/version chain and reload restores authored order", async ({ page }) => {
    await button(page, "Save locally").click();
    const key = "station:composition-artifact:v1:composition%3Aexample";
    const first = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key);
    expect(first.schema.version).toBe("1.0.0"); await add(page); await button(page, "Move earlier").click();
    await button(page, "Save locally").click();
    const next = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key);
    expect(next.schema.version).toBe("2.0.0"); expect(next.artifactId).toBe(first.artifactId); expect(next.artifactVersion).toBe("1.0.1");
    expect(JSON.stringify(next)).not.toContain('"past"'); await page.reload(); await expect(layer(page, "Button 3")).toHaveCount(0);
    await button(page, "Open saved").click(); await expect(layer(page, "Button 3")).toBeVisible();
    expect(await previewRefs(page)).toEqual(["node:button-1", "node:added-3", "node:button-2"]);
    await expect(button(page, "Undo")).toHaveAttribute("aria-disabled", "true");
    await layer(page, "Button 3").click(); await button(page, "Remove subtree").click(); await button(page, "Open saved").click();
    await button(page, "Cancel open").click(); await expect(layer(page, "Button 3")).toHaveCount(0);
    await button(page, "Undo").click(); await expect(layer(page, "Button 3")).toBeVisible();
  });

  test("actual structural download reopens in fresh context; failed/canceled file replacement preserves history", async ({ page, browser }) => {
    await add(page); const downloadPromise = page.waitForEvent("download"); await button(page, "Save As file").click();
    const downloaded = await downloadPromise; const bytes = await readFile((await downloaded.path())!);
    expect(JSON.parse(bytes.toString()).schema.version).toBe("2.0.0");
    const context = await browser.newContext(); const fresh = await context.newPage(); await fresh.goto("http://127.0.0.1:3100/component-editor");
    await fresh.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "authored.composition.json", mimeType: "application/json", buffer: bytes });
    await expect(layer(fresh, "Button 3")).toBeVisible(); await expect(button(fresh, "Undo")).toHaveAttribute("aria-disabled", "true"); await context.close();
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from("{") });
    await expect(layer(page, "Button 3")).toBeVisible(); await expect(button(page, "Undo")).toHaveAttribute("aria-disabled", "false");
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "authored.composition.json", mimeType: "application/json", buffer: bytes });
    await expect(button(page, "Add component")).toBeDisabled(); await button(page, "Cancel open").click();
    await button(page, "Undo").click(); await expect(layer(page, "Button 3")).toHaveCount(0);
  });

  test("narrow layout and keyboard tree retain authored sibling order", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); await add(page); await button(page, "Move earlier").click();
    await layer(page, "Grid").focus(); await page.keyboard.press("ArrowRight"); await expect(layer(page, "Button 1")).toBeFocused();
    await page.keyboard.press("ArrowDown"); await expect(layer(page, "Button 3")).toBeFocused();
    await page.keyboard.press("Enter"); await expect(layer(page, "Button 3")).toHaveAttribute("aria-selected", "true");
    await expect(button(page, "Remove subtree")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await button(page, "Move later").click(); expect(await previewRefs(page)).toEqual(["node:button-1", "node:button-2", "node:added-3"]);
  });

  test("Station minimize retains authored graph/history; close starts fresh and preferences exclude it", async ({ page }, testInfo) => {
    await page.goto("/"); await button(page, "Open applications").click(); await page.locator('[data-app-ref="app:composition-editor"]').click();
    await add(page); const window = page.getByRole("dialog", { name: "Composition Editor", exact: true });
    await window.getByRole("button", { name: "Minimize window" }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor", exact: true }).click();
    await expect(layer(page, "Button 3")).toBeVisible(); await expect(button(page, "Undo")).toHaveAttribute("aria-disabled", "false");
    const prefs = await page.evaluate(() => Object.entries(localStorage).filter(([key]) => !key.startsWith("station:composition-artifact:")).map(([, value]) => value).join(""));
    expect(prefs).not.toContain("node:added-3"); expect(prefs).not.toContain('"past"');
    await page.screenshot({ path: testInfo.outputPath("wp5-station-restored.png"), fullPage: true });
    await window.getByRole("button", { name: "Close window" }).click(); await button(page, "Open applications").click();
    await page.locator('[data-app-ref="app:composition-editor"]').click(); await expect(layer(page, "Button 3")).toHaveCount(0);
    await expect(button(page, "Undo")).toHaveAttribute("aria-disabled", "true");
  });
});
