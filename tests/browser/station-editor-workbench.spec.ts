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
  await tabTo(page, root);
  await page.keyboard.press("ArrowRight");
  await expect(first).toBeFocused();
  await expect(first).toHaveAttribute("aria-selected", "false");
  await page.keyboard.press("ArrowDown");
  await expect(second).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(preview(page, "Button 2")).toHaveAttribute("data-selected", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Columns", { exact: true })).toBeFocused();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("3");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const apply = page.getByRole("button", { name: "Apply size", exact: true });
  await expect(apply).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(apply).toBeFocused();
  await expect(preview(page, "Button 2")).toHaveAttribute("data-column-span", "3");
  const save = page.getByRole("button", { name: "Save changes", exact: true });
  await tabTo(page, save);
  await page.keyboard.press("Enter");
  await expect(save).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("Changes saved for this session.");
  await tabTo(page, page.getByLabel("Columns", { exact: true }));
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("4");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  const discard = page.getByRole("button", { name: "Discard changes", exact: true });
  await tabTo(page, discard);
  await page.keyboard.press("Enter");
  await expect(discard).toBeFocused();
  await expect(preview(page, "Button 2")).toHaveAttribute("data-column-span", "3");
  await expect(second).toHaveAttribute("aria-selected", "true");
});

test("root is read-only, expansion preserves selection, and narrow layout remains usable", async ({ page }) => {
  const root = page.getByRole("treeitem", { name: "Grid", exact: true });
  await root.click();
  await expect(page.getByLabel("Columns", { exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Apply size", exact: true })).toBeDisabled();
  await page.keyboard.press("ArrowLeft");
  await expect(root).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("treeitem", { name: "Button 1", exact: true })).toHaveCount(0);
  await page.keyboard.press("ArrowRight");
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await page.keyboard.press("ArrowLeft");
  await expect(root).toBeFocused();
  await expect(page.getByRole("treeitem", { name: "Button 1", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("2");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByLabel("Columns", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("minimum and maximum spans accept; immediately outside bounds reject atomically", async ({ page }) => {
  await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
  await span(page, "1", "1");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
  await expect(preview(page)).toHaveAttribute("data-column-span", "1");
  await span(page, "4", "2");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "9");
  await expect(preview(page)).toHaveAttribute("data-column-span", "4");
  await expect(preview(page)).toHaveAttribute("data-row-span", "2");
  for (const [columns, rows] of [["0", "2"], ["5", "2"], ["4", "0"], ["4", "3"]]) {
    await span(page, columns!, rows!);
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "9");
    await expect(preview(page)).toHaveAttribute("data-column-span", "4");
    await expect(preview(page)).toHaveAttribute("data-row-span", "2");
    await expect(preview(page, "Button 2")).toHaveAttribute("data-column-span", "2");
    await expect(page.getByRole("status")).toContainText("unchanged");
  }
  await span(page, "3", "1");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "10");
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await expect(page.getByLabel("Columns", { exact: true })).toHaveAttribute("aria-invalid", "false");
});

test("clean save/discard and equivalent edit preserve revision, selection and focus", async ({ page }) => {
  const first = page.getByRole("treeitem", { name: "Button 1", exact: true });
  await first.click();
  await span(page, "2", "1");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
  await expect(page.getByRole("status")).toHaveText("The size is already applied.");
  for (const [name, message] of [["Save changes", "No changes to save."], ["Discard changes", "No changes to discard."]]) {
    const control = page.getByRole("button", { name, exact: true });
    await expect(control).toHaveAttribute("aria-disabled", "true");
    await tabTo(page, control);
    await page.keyboard.press("Enter");
    await expect(control).toBeFocused();
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
    await expect(first).toHaveAttribute("aria-selected", "true");
    await expect(preview(page)).toHaveAttribute("data-selected", "true");
    await expect(page.getByRole("status")).toHaveText(message);
  }
});

test("switching nodes isolates applied edits and unapplied fields; reload resets session", async ({ page }) => {
  const first = page.getByRole("treeitem", { name: "Button 1", exact: true });
  const second = page.getByRole("treeitem", { name: "Button 2", exact: true });
  await first.click();
  await span(page, "3", "1");
  await page.getByLabel("Columns", { exact: true }).fill("999");
  await second.click();
  await expect(page.getByLabel("Columns", { exact: true })).toHaveValue("2");
  await expect(preview(page)).toHaveAttribute("data-column-span", "3");
  await expect(preview(page)).toHaveAttribute("data-selected", "false");
  await span(page, "4", "2");
  await expect(editor(page)).toHaveAttribute("data-draft-revision", "9");
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
