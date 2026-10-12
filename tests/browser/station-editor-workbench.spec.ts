import { test, expect, type Page, type Locator } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { startDesignOwnerHarness, type DesignOwnerHarness } from "./design-owner-harness";
import type { DesignCandidateDocument } from "../../packages/contracts/design-candidate/index.js";

const editor = (page: Page) => page.getByRole("region", { name: "Composition editor", exact: true });
const preview = (page: Page, name = "Button 1") => page.getByRole("img", { name: name + " preview", exact: true });
async function span(page: Page, columns: string, rows = "1") {
  await page.getByLabel("Columns", { exact: true }).fill(columns);
  await page.getByLabel("Rows", { exact: true }).fill(rows);
  await page.getByRole("button", { name: "Apply size", exact: true }).click();
}
async function tabTo(page: Page, target: Locator) {
  const candidates = await page.locator("button, input, select, textarea, a[href], [tabindex]").count();
  for (let count = 0; count <= candidates; count++) {
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
    await page.getByLabel("Container", { exact: true }).selectOption(parent);
    await page.getByLabel("Slot", { exact: true }).selectOption(slot);
    await page.getByLabel("Component to add", { exact: true }).selectOption(component);
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
    await page.getByLabel("Slot", { exact: true }).selectOption("button-1");
    await expect(page.getByLabel("Component to add").locator("option")).toHaveCount(0);
    await expect(button(page, "Add component")).toBeDisabled();
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
    await page.getByLabel("Slot", { exact: true }).selectOption("button-3");
    await expect(page.getByLabel("Component to add").locator('option[value="component:button-group"]')).toHaveCount(0);
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

test.describe("WP7 bounded button text", () => {
  const input = (page: Page) => page.getByLabel("Button text", { exact: true });
  const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
  async function applyText(page: Page, text: string) {
    await input(page).fill(text); await button(page, "Apply text").click();
  }
  test("literal Unicode/markup text converges projections, undo/redo/reset and discard", async ({ page }, testInfo) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    const label = '<img src=x> Confirmar 🧭';
    await applyText(page, label);
    await expect(page.getByRole("treeitem", { name: label, exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(preview(page, label)).toBeVisible();
    await expect(preview(page, label).locator("img")).toHaveCount(0);
    await button(page, "Undo").click(); await expect(preview(page)).toBeVisible();
    await button(page, "Redo").click(); await expect(input(page)).toHaveValue(label);
    await button(page, "Reset text").click(); await expect(preview(page)).toBeVisible();
    await expect(input(page)).toHaveValue("");
    await button(page, "Undo").click(); await expect(preview(page, label)).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("wp7-button-text.png"), fullPage: true });
    await button(page, "Discard changes").click(); await expect(preview(page)).toBeVisible();
    await expect(button(page, "Undo")).toHaveAttribute("aria-disabled", "true");
  });
  test("blank and overlimit text preserve draft; restore fields permits root and second catalog", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    for (const value of ["   ", "x".repeat(257)]) {
      await applyText(page, value);
      await expect(editor(page).getByRole("status")).toContainText("1–256");
      await expect(input(page)).toHaveAttribute("aria-invalid", "true");
      await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
      await expect(preview(page)).toBeVisible();
    }
    await button(page, "Restore fields").click(); await expect(input(page)).toHaveValue("");
    const longest = "x".repeat(256);
    await applyText(page, longest);
    await expect(preview(page, longest).getByText(longest, { exact: true })).toHaveAttribute("title", longest);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await button(page, "Reset text").click();
    await page.getByRole("treeitem", { name: "Grid", exact: true }).click(); await expect(input(page)).toHaveCount(0);
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
    await page.getByRole("treeitem", { name: "Group Button 1", exact: true }).click();
    await applyText(page, "Group action"); await expect(preview(page, "Group action")).toBeVisible();
  });
  test("text/span/structure produces downloaded v3 that reopens in a fresh origin", async ({ page, browser }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await applyText(page, "Confirmar"); await span(page, "3");
    await button(page, "Add component").click();
    const bytes = await downloadedComposition(page);
    const doc = JSON.parse(bytes.toString()); expect(doc.schema.version).toBe("3.0.0"); expect(doc.payload.graph.nodes).toHaveLength(4);
    const context = await browser.newContext();
    try {
      const other = await context.newPage(); await other.goto(page.url());
      await other.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "wp7.composition.json", mimeType: "application/json", buffer: bytes });
      await expect(preview(other, "Confirmar")).toHaveAttribute("data-column-span", "3");
      await expect(other.getByRole("treeitem", { name: "Confirmar", exact: true })).toBeVisible();
      await expect(other.getByTestId("draft-state")).toHaveText("All changes saved");
    } finally { await context.close(); }
  });
  test("local reopening retains text; text-only second save updates bytes and checkpoint", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await applyText(page, "First text");
    await button(page, "Save locally").click(); await page.reload(); await button(page, "Open saved").click();
    await page.getByRole("treeitem", { name: "First text", exact: true }).click();
    await applyText(page, "Second text"); await button(page, "Save locally").click();
    await expect(button(page, "Undo")).toHaveAttribute("aria-disabled", "true");
    await page.reload(); await button(page, "Open saved").click(); await expect(preview(page, "Second text")).toBeVisible();
  });
  test("pending text blocks mutation/save/export/selection; switch cancel and discard preserve explicit choice", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await applyText(page, "Applied");
    await input(page).fill("Pending");
    for (const name of ["Undo", "Remove subtree", "Save changes", "Save locally", "Save As file"]) {
      await button(page, name).click({ force: true }); await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
    }
    await page.getByRole("treeitem", { name: "Button 2", exact: true }).click(); await expect(input(page)).toHaveValue("Pending");
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
    await expect(page.getByRole("group", { name: "Unsaved composition switch" })).toBeVisible();
    await button(page, "Cancel switch").click(); await expect(input(page)).toHaveValue("Pending");
    await button(page, "Discard changes").click(); await expect(preview(page)).toBeVisible(); await expect(input(page)).toHaveValue("");
  });
  test("pending-only text warns before file open; cancel keeps input and explicit open replaces it", async ({ page }) => {
    const bytes = await downloadedComposition(page);
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await input(page).fill("Pending only");
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "original.composition.json", mimeType: "application/json", buffer: bytes });
    await expect(button(page, "Discard changes and open file")).toBeVisible();
    await button(page, "Cancel open").click(); await expect(input(page)).toHaveValue("Pending only");
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "original.composition.json", mimeType: "application/json", buffer: bytes });
    await button(page, "Discard changes and open file").click(); await expect(input(page)).toHaveValue("");
    await expect(preview(page)).toBeVisible();
  });
  test("keyboard submit and native input undo remain separate; Station window retains text on restore", async ({ page }) => {
    await page.goto("/"); await button(page, "Open applications").click();
    await page.locator('[data-app-ref="app:composition-editor"]').click();
    const window = page.getByRole("dialog", { name: "Composition Editor", exact: true });
    await window.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await input(page).fill("Keyboard action"); await input(page).press("Enter");
    await expect(preview(page, "Keyboard action")).toBeVisible();
    await input(page).fill("Pending input"); await input(page).press("Control+z");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
    await button(page, "Restore fields").click();
    await window.getByRole("button", { name: "Minimize window" }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor", exact: true }).click();
    await expect(input(page)).toHaveValue("Keyboard action");
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(input(page)).toBeVisible();
  });
});

test.describe("WP8 typed button properties", () => {
  const b = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
  const variant = (page: Page) => page.getByLabel("Button variant", { exact: true });
  const disabled = (page: Page) => page.getByLabel("Disabled preview", { exact: true });
  const layer = (page: Page, name = "Button 1") => page.getByRole("treeitem", { name, exact: true });
  const key = "station:composition-artifact:v1:composition%3Aexample";
  async function apply(page: Page, value = "outline", off = true) {
    await variant(page).selectOption(value); await disabled(page).setChecked(off); await b(page, "Apply properties").click();
  }
  test("enum/boolean preview converges with history, reset, root and second installed family", async ({ page }, testInfo) => {
    await layer(page).click(); await apply(page);
    await expect(preview(page)).toHaveAttribute("data-button-variant", "outline");
    await expect(preview(page)).toHaveAttribute("aria-disabled", "true");
    await b(page, "Undo").click(); await expect(variant(page)).toHaveValue("default"); await expect(disabled(page)).not.toBeChecked();
    await b(page, "Redo").click(); await expect(disabled(page)).toBeChecked();
    await b(page, "Reset properties").click(); await expect(preview(page)).toHaveAttribute("data-button-variant", "default");
    await b(page, "Undo").click(); await page.screenshot({ path: testInfo.outputPath("wp8-button-properties.png"), fullPage: true });
    await b(page, "Discard changes").click(); await layer(page, "Grid").click(); await expect(variant(page)).toHaveCount(0);
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
    await layer(page, "Group Button 1").click(); await apply(page, "ghost", false);
    await expect(preview(page, "Group Button 1")).toHaveAttribute("data-button-variant", "ghost");
  });
  test("properties/text/span/structure download v4 reopens in a real fresh session", async ({ page, browser }, testInfo) => {
    await layer(page).click(); await apply(page, "ghost", true);
    await page.getByLabel("Button text", { exact: true }).fill("Confirmar WP8"); await b(page, "Apply text").click();
    await span(page, "3"); await b(page, "Add component").click();
    const bytes = await downloadedComposition(page); const doc = JSON.parse(bytes.toString());
    expect(doc.schema.version).toBe("4.0.0"); expect(doc.payload.graph.nodes[1].properties).toEqual({ variant: "ghost", disabled: true });
    const context = await browser.newContext();
    try {
      const other = await context.newPage(); await other.goto(page.url());
      await other.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "wp8.json", mimeType: "application/json", buffer: bytes });
      await expect(preview(other, "Confirmar WP8")).toHaveAttribute("data-column-span", "3");
      await expect(preview(other, "Confirmar WP8")).toHaveAttribute("aria-disabled", "true");
      const renderedButton = preview(other, "Confirmar WP8").locator('button[data-slot="button"]');
      await expect(renderedButton).toHaveText("Confirmar WP8");
      await expect(renderedButton).toBeDisabled();
      await expect(renderedButton).toHaveAttribute("data-preview-variant", "ghost");
      await expect(renderedButton).toHaveAttribute("tabindex", "-1");
      await other.screenshot({ path: testInfo.outputPath("foundation-shared-button-fresh-reopen.png"), fullPage: true });
      await layer(other, "Confirmar WP8").click(); await expect(variant(other)).toHaveValue("ghost");
      await expect(b(other, "Undo")).toHaveAttribute("aria-disabled", "true");
    } finally { await context.close(); }
  });
  test("property-only local revisions preserve identity and explicit default presence; reset returns legacy", async ({ page }) => {
    await b(page, "Save locally").click(); const original = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key);
    await layer(page).click(); await apply(page); await b(page, "Save locally").click();
    const retained = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key);
    expect(retained.artifactId).toBe(original.artifactId); expect(retained.artifactVersion).toBe("1.0.1"); expect(retained.schema.version).toBe("4.0.0");
    await page.reload(); await b(page, "Open saved").click(); await layer(page).click(); await expect(disabled(page)).toBeChecked();
    await apply(page, "default", false); await b(page, "Save locally").click();
    const explicit = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key);
    expect(explicit.artifactVersion).toBe("1.0.2"); expect(explicit.schema.version).toBe("4.0.0");
    await b(page, "Reset properties").click(); await b(page, "Save locally").click();
    const cleared = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), key);
    expect(cleared.artifactVersion).toBe("1.0.3"); expect(cleared.schema.version).toBe("1.0.0");
  });
  test("pending properties block retention, history, structure, selection and other fields; restore/discard recover", async ({ page }) => {
    await layer(page).click(); await variant(page).selectOption("outline");
    await expect(page.getByTestId("draft-state")).toHaveText("Unapplied properties");
    for (const name of ["Save changes", "Save locally", "Save As file"]) {
      await expect(b(page, name)).toHaveAttribute("aria-disabled", "true");
      await b(page, name).click({ force: true });
      await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
    }
    expect(await page.evaluate(key => localStorage.getItem(key), key)).toBeNull();
    await layer(page, "Button 2").click(); await expect(layer(page)).toHaveAttribute("aria-selected", "true");
    await b(page, "Apply size").click(); await b(page, "Apply text").click();
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
    await expect(b(page, "Add component")).toBeDisabled(); await expect(b(page, "Undo")).toHaveAttribute("aria-disabled", "true");
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group");
    await b(page, "Cancel switch").click(); await expect(variant(page)).toHaveValue("outline");
    await b(page, "Restore fields").click(); await expect(variant(page)).toHaveValue("default");
    await disabled(page).check(); await b(page, "Discard changes").click(); await expect(disabled(page)).not.toBeChecked();
    await expect(page.getByTestId("draft-state")).toHaveText("All changes saved");
  });
  test("pending file replacement cancels safely; malformed and legacy properties fail before mutation", async ({ page }) => {
    const bytes = await downloadedComposition(page); await layer(page).click(); await variant(page).selectOption("ghost");
    const file = page.getByLabel("Composition file", { exact: true });
    await file.setInputFiles({ name: "original.json", mimeType: "application/json", buffer: bytes });
    await b(page, "Cancel open").click(); await expect(variant(page)).toHaveValue("ghost");
    await file.setInputFiles({ name: "original.json", mimeType: "application/json", buffer: bytes });
    await b(page, "Discard changes and open file").click(); await expect(variant(page)).toHaveValue("default");
    await apply(page); const authored = await downloadedComposition(page); const doc = JSON.parse(authored.toString());
    for (const version of ["3.0.0", "6.0.0"]) {
      await file.setInputFiles({ name: "bad-version.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ ...doc, schema: { ...doc.schema, version } })) });
      await expect(preview(page)).toHaveAttribute("aria-disabled", "true"); await expect(editor(page).getByRole("status")).toContainText("unchanged");
    }
    doc.payload.graph.nodes[1].properties.disabled = "true";
    await file.setInputFiles({ name: "bad-type.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(doc)) });
    await expect(b(page, "Undo")).toHaveAttribute("aria-disabled", "false");
  });
  test("keyboard/narrow controls and Station minimize restore preserve properties; close clears them", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); await layer(page).click();
    await variant(page).focus(); await page.keyboard.press("ArrowDown");
    await expect(variant(page)).toHaveValue("outline"); await disabled(page).focus(); await page.keyboard.press("Space");
    await b(page, "Apply properties").focus(); await page.keyboard.press("Enter");
    await expect(preview(page)).toHaveAttribute("aria-disabled", "true");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto("/"); await b(page, "Open applications").click(); await page.locator('[data-app-ref="app:composition-editor"]').click();
    await layer(page).click(); await apply(page);
    const win = page.getByRole("dialog", { name: "Composition Editor", exact: true });
    await win.getByRole("button", { name: "Minimize window" }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor", exact: true }).click();
    await expect(disabled(page)).toBeChecked(); await expect(b(page, "Undo")).toHaveAttribute("aria-disabled", "false");
    await win.getByRole("button", { name: "Close window" }).click(); await b(page, "Open applications").click();
    await page.locator('[data-app-ref="app:composition-editor"]').click(); await layer(page).click();
    await expect(variant(page)).toHaveValue("default"); await expect(disabled(page)).not.toBeChecked();
  });
});

test.describe("WP9 reusable installed catalog", () => {
  const b = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
  const layer = (page: Page, name: string) => page.getByRole("treeitem", { name, exact: true });
  async function install(page: Page) {
    await page.getByLabel("Search installed compositions", { exact: true }).fill("action panel");
    await expect(page.getByLabel("Composition to install", { exact: true })).toHaveValue("composition:action-panel");
    await b(page, "Install composition").click();
    await expect(page.getByLabel("Composition", { exact: true })).toHaveValue("composition:action-panel");
  }
  async function expand(page: Page) {
    await layer(page, "Action panel").click(); await layer(page, "Action panel").press("ArrowRight");
    await layer(page, "Action row").click(); await layer(page, "Action row").press("ArrowRight");
  }
  test("search/keyboard installation edits real nested source and undo restores it", async ({ page }) => {
    const search = page.getByLabel("Search installed compositions", { exact: true });
    await search.fill("not installed"); await expect(b(page, "Install composition")).toBeDisabled();
    await expect(layer(page, "Button 1")).toBeVisible();
    await search.fill("COMPOSITION:ACTION-PANEL"); await b(page, "Install composition").focus(); await page.keyboard.press("Enter");
    await expect(page.getByLabel("Composition", { exact: true })).toHaveValue("composition:action-panel");
    await expand(page); await layer(page, "Primary action").click();
    await page.getByLabel("Button text", { exact: true }).fill("Confirmar painel"); await b(page, "Apply text").click();
    await page.getByLabel("Button variant", { exact: true }).selectOption("outline"); await b(page, "Apply properties").click();
    await expect(preview(page, "Confirmar painel")).toHaveAttribute("data-button-variant", "outline");
    await b(page, "Undo").click(); await expect(preview(page, "Confirmar painel")).toHaveAttribute("data-button-variant", "default");
    await b(page, "Undo").click(); await expect(preview(page, "Primary action")).toBeVisible();
    await b(page, "Redo").click(); await expect(preview(page, "Confirmar painel")).toBeVisible();
  });
  test("pending text and dirty installation require cancel or explicit replacement", async ({ page }) => {
    await layer(page, "Button 1").click(); await page.getByLabel("Button text", { exact: true }).fill("Pending original");
    await page.getByLabel("Search installed compositions", { exact: true }).fill("action panel"); await b(page, "Install composition").click();
    await b(page, "Cancel switch").click(); await expect(page.getByLabel("Button text", { exact: true })).toHaveValue("Pending original");
    await expect(preview(page)).toBeVisible(); await expect(page.getByLabel("Composition", { exact: true })).toBeFocused();
    await b(page, "Restore fields").click(); await span(page, "3"); await b(page, "Install composition").click();
    await expect(preview(page)).toHaveAttribute("data-column-span", "3"); await b(page, "Discard changes and open").click();
    await expect(page.getByLabel("Composition", { exact: true })).toHaveValue("composition:action-panel");
    await expect(b(page, "Undo")).toHaveAttribute("aria-disabled", "true"); await expect(preview(page, "Primary action")).toBeVisible();
  });
  test("new composition saves locally and actual downloaded file reopens independent session", async ({ page }) => {
    await install(page); await expand(page); await layer(page, "Secondary action").click();
    await page.getByLabel("Button text", { exact: true }).fill("Voltar ao painel"); await b(page, "Apply text").click();
    await page.getByLabel("Button variant", { exact: true }).selectOption("ghost"); await b(page, "Apply properties").click();
    const bytes = await downloadedComposition(page); const doc = JSON.parse(bytes.toString());
    expect(doc.payload.compositionRef).toBe("composition:action-panel"); expect(doc.schema.version).toBe("4.0.0");
    await b(page, "Save locally").click(); await expect(page.getByRole("status")).toContainText("saved locally");
    await page.reload(); await page.getByLabel("Composition", { exact: true }).selectOption("composition:action-panel"); await b(page, "Open saved").click();
    await expect(preview(page, "Voltar ao painel")).toHaveAttribute("data-button-variant", "ghost");
    const other = await page.context().newPage(); try {
      await other.goto("/component-editor"); await other.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "wp9.json", mimeType: "application/json", buffer: bytes });
      await expect(other.getByLabel("Composition", { exact: true })).toHaveValue("composition:action-panel");
      await expect(preview(other, "Voltar ao painel")).toHaveAttribute("data-button-variant", "ghost");
      await expect(b(other, "Undo")).toHaveAttribute("aria-disabled", "true");
    } finally { await other.close(); }
  });
  test("incompatible row placement and corrupt nested import preserve draft, valid add recovers", async ({ page }) => {
    await install(page); await page.getByLabel("Container", { exact: true }).selectOption("panel:actions");
    await expect(page.getByLabel("Component to add").locator('option[value="component:action-panel"]')).toHaveCount(0);
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7");
    await page.getByLabel("Component to add", { exact: true }).selectOption("component:button"); await b(page, "Add component").click();
    await expect(preview(page, "Button 3")).toHaveAttribute("data-slot-ref", "actions");
    const bytes = await downloadedComposition(page); const doc = JSON.parse(bytes.toString());
    doc.payload.graph.nodes.find((n: { ref: string }) => n.ref === "node:added-3").placement.slotRef = "missing";
    await page.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(doc)) });
    await expect(preview(page, "Button 3")).toBeVisible(); await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
    await b(page, "Undo").click(); await expect(preview(page, "Button 3")).toHaveCount(0);
  });
  test("narrow catalog and Station minimize/restore retain installed editable panel", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); await install(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto("/"); await b(page, "Open applications").click(); await page.locator('[data-app-ref="app:composition-editor"]').click();
    await install(page); await expand(page); await layer(page, "Primary action").click(); await span(page, "3");
    const win = page.getByRole("dialog", { name: "Composition Editor", exact: true }); await win.getByRole("button", { name: "Minimize window" }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor", exact: true }).click();
    await expect(preview(page, "Primary action")).toHaveAttribute("data-column-span", "3");
    await expect(b(page, "Undo")).toHaveAttribute("aria-disabled", "false");
    await win.getByRole("button", { name: "Close window" }).click(); await b(page, "Open applications").click(); await page.locator('[data-app-ref="app:composition-editor"]').click();
    await expect(page.getByLabel("Composition", { exact: true })).toHaveValue("composition:example");
  });
});

test.describe("WP10 compatible movement", () => {
  const b = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
  const layer = (page: Page, name: string) => page.getByRole("treeitem", { name, exact: true });
  async function panel(page: Page) {
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:action-panel");
    await layer(page, "Action panel").click(); await layer(page, "Action panel").press("ArrowRight");
    await layer(page, "Action row").click(); await layer(page, "Action row").press("ArrowRight");
  }
  async function move(page: Page, parent: string, slot = "content") {
    await page.getByLabel("Destination container", { exact: true }).selectOption(parent);
    await page.getByLabel("Destination slot", { exact: true }).selectOption(slot); await b(page, "Move component").click();
  }
  test("leaf move retains fields/selection; undo/redo and no-op preserve topology", async ({ page }) => {
    await panel(page); await layer(page, "Primary action").click();
    await page.getByLabel("Button text", { exact: true }).fill("Mover confirmar"); await b(page, "Apply text").click();
    await page.getByLabel("Button variant", { exact: true }).selectOption("outline"); await b(page, "Apply properties").click();
    await move(page, "panel:root"); await expect(preview(page, "Mover confirmar")).toHaveAttribute("data-parent-ref", "panel:root");
    await expect(preview(page, "Mover confirmar")).toHaveAttribute("data-button-variant", "outline");
    await expect(layer(page, "Mover confirmar")).toHaveAttribute("aria-selected", "true");
    await b(page, "Undo").click(); await expect(preview(page, "Mover confirmar")).toHaveAttribute("data-parent-ref", "panel:actions");
    await move(page, "panel:actions", "actions"); await expect(b(page, "Redo")).toHaveAttribute("aria-disabled", "false");
    await expect(page.getByRole("status")).toContainText("already in this container");
    await b(page, "Redo").click(); await expect(preview(page, "Mover confirmar")).toHaveAttribute("data-parent-ref", "panel:root");
  });
  test("container move keeps actual subtree and expands destination with visible selection", async ({ page }) => {
    await panel(page); await page.getByLabel("Component to add", { exact: true }).selectOption("component:action-panel");
    await b(page, "Add component").click(); await layer(page, "Action row").click();
    await move(page, "node:added-3");
    await expect(page.getByRole("group", { name: "Action row preview", exact: true })).toHaveAttribute("data-parent-ref", "node:added-3");
    await expect(preview(page, "Primary action")).toHaveAttribute("data-parent-ref", "panel:actions");
    await expect(layer(page, "Action row")).toBeVisible(); await expect(layer(page, "Action row")).toHaveAttribute("aria-selected", "true");
    await expect(layer(page, "Action Panel 3")).toHaveAttribute("aria-expanded", "true");
    await b(page, "Undo").click(); await expect(page.getByRole("group", { name: "Action row preview", exact: true })).toHaveAttribute("data-parent-ref", "panel:container");
    await b(page, "Redo").click(); await expect(preview(page, "Secondary action")).toHaveAttribute("data-parent-ref", "panel:actions");
  });
  test("root/self cycle and occupied slots reject; freed slot movement recovers", async ({ page }) => {
    await page.getByLabel("Component to add", { exact: true }).selectOption("component:grid"); await b(page, "Add component").click();
    await move(page, "node:added-3"); await expect(editor(page)).toHaveAttribute("data-draft-revision", "8");
    await expect(page.getByRole("status")).toContainText("cannot be placed");
    await layer(page, "Grid").click(); await expect(b(page, "Move component")).toBeDisabled();
    await page.getByLabel("Composition", { exact: true }).selectOption("composition:button-group"); await b(page, "Discard changes and open").click();
    await layer(page, "Group Button 1").click(); await move(page, "layer:button-group", "button-2");
    await expect(editor(page)).toHaveAttribute("data-draft-revision", "7"); await expect(preview(page, "Group Button 1")).toHaveAttribute("data-slot-ref", "button-1");
    await layer(page, "Group Button 2").click(); await b(page, "Remove subtree").click(); await layer(page, "Group Button 1").click();
    await move(page, "layer:button-group", "button-2"); await expect(preview(page, "Group Button 1")).toHaveAttribute("data-slot-ref", "button-2");
  });
  test("actual moved file/local roundtrip and corrupt cycle import preserve retained work", async ({ page }) => {
    await panel(page); await layer(page, "Primary action").click(); await move(page, "panel:root");
    const bytes = await downloadedComposition(page); const doc = JSON.parse(bytes.toString()); expect(doc.schema.version).toBe("2.0.0");
    await b(page, "Save locally").click(); await page.reload(); await page.getByLabel("Composition", { exact: true }).selectOption("composition:action-panel");
    await b(page, "Open saved").click(); await expect(preview(page, "Primary action")).toHaveAttribute("data-parent-ref", "panel:root");
    const other = await page.context().newPage(); try {
      await other.goto("/component-editor"); await other.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "moved.json", mimeType: "application/json", buffer: bytes });
      await expect(preview(other, "Primary action")).toHaveAttribute("data-parent-ref", "panel:root");
      doc.payload.graph.nodes.find((n: { ref: string }) => n.ref === "panel:container").placement.parentRef = "panel:actions";
      await other.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "cycle.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(doc)) });
      await expect(preview(other, "Primary action")).toHaveAttribute("data-parent-ref", "panel:root"); await expect(other.getByRole("status")).toContainText("Unable to open");
    } finally { await other.close(); }
  });
  test("pending fields block movement; keyboard/narrow apply restores movable selection", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); await panel(page); await layer(page, "Primary action").click();
    await page.getByLabel("Button text", { exact: true }).fill("Pending move"); await expect(b(page, "Move component")).toBeDisabled();
    await expect(page.getByLabel("Destination container", { exact: true })).toBeDisabled();
    await b(page, "Restore fields").click(); await page.getByLabel("Destination container", { exact: true }).selectOption("panel:root");
    await b(page, "Move component").focus(); await page.keyboard.press("Enter");
    await expect(layer(page, "Primary action")).toHaveAttribute("aria-selected", "true");
    await expect(preview(page, "Primary action")).toHaveAttribute("data-parent-ref", "panel:root");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
  test("Station actual demonstration video: launch, move, history, save/reopen and window lifecycle", async ({ browser }, testInfo) => {
    test.setTimeout(60_000);
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 },
      recordVideo: { dir: testInfo.outputPath("station-demo"), size: { width: 1440, height: 1000 } } });
    const page = await context.newPage(); const recording = page.video()!;
    const caption = async (text: string, hold = 1300) => {
      await page.evaluate(text => {
        let note = document.querySelector<HTMLDivElement>("#station-demo-caption");
        if (!note) { note = document.createElement("div"); note.id = "station-demo-caption";
          Object.assign(note.style, { position: "fixed", bottom: "64px", left: "50%", transform: "translateX(-50%)", padding: "16px 28px", borderRadius: "16px", color: "#fff", background: "rgba(15,23,42,.94)", font: "600 22px system-ui", boxShadow: "0 8px 40px #0005", zIndex: "2147483647", pointerEvents: "none", textAlign: "center", maxWidth: "1000px", width: "max-content" }); document.body.append(note); }
        note.textContent = text;
      }, text); await page.waitForTimeout(hold);
    };
    try {
      await page.goto("http://127.0.0.1:3100/"); await caption("Station • desktop e ferramentas compartilhadas", 1800);
      await b(page, "Open applications").click(); await caption("Abrir o editor pela barra de aplicações");
      await page.locator('[data-app-ref="app:composition-editor"]').click();
      const win = page.getByRole("dialog", { name: "Composition Editor", exact: true });
      await win.getByRole("button", { name: "Maximize window" }).click(); await caption("Um editor: Layers, Inspector e Preview sincronizados");
      await panel(page); await caption("Instalar uma composição reutilizável", 1500);
      await layer(page, "Primary action").click(); await page.getByLabel("Button text", { exact: true }).fill("Confirmar"); await b(page, "Apply text").click();
      await page.getByLabel("Button variant", { exact: true }).selectOption("outline"); await b(page, "Apply properties").click();
      await preview(page, "Confirmar").scrollIntoViewIfNeeded(); await caption("Editar texto e aparência com propriedades tipadas", 1700);
      await page.getByLabel("Destination container", { exact: true }).selectOption("panel:root");
      await page.getByLabel("Destination slot", { exact: true }).selectOption("content"); await b(page, "Move component").scrollIntoViewIfNeeded();
      await caption("WP10 • mover para outro contêiner compatível", 1500); await b(page, "Move component").click();
      await expect(preview(page, "Confirmar")).toHaveAttribute("data-parent-ref", "panel:root");
      await preview(page, "Confirmar").scrollIntoViewIfNeeded(); await caption("Identidade, tamanho e propriedades preservados", 1700);
      await b(page, "Undo").click(); await expect(preview(page, "Confirmar")).toHaveAttribute("data-parent-ref", "panel:actions");
      await preview(page, "Confirmar").scrollIntoViewIfNeeded(); await caption("Desfazer restaura o contêiner anterior", 1700);
      await b(page, "Redo").click(); await expect(preview(page, "Confirmar")).toHaveAttribute("data-parent-ref", "panel:root");
      await preview(page, "Confirmar").scrollIntoViewIfNeeded(); await caption("Refazer recupera a movimentação", 1600);
      await b(page, "Save locally").click(); await expect(page.getByRole("status")).toContainText("saved locally"); await caption("Salvar explicitamente o artefato local", 1500);
      await move(page, "panel:actions", "actions"); await b(page, "Open saved").click();
      await caption("Reabrir a versão salva com confirmação explícita", 1300);
      await b(page, "Discard changes and open file").click();
      await expect(preview(page, "Confirmar")).toHaveAttribute("data-parent-ref", "panel:root"); await preview(page, "Confirmar").scrollIntoViewIfNeeded();
      await caption("Reabrir o artefato validado, com a estrutura preservada", 1700);
      await win.getByRole("button", { name: "Minimize window" }).click(); await caption("Minimizar preserva a sessão da ferramenta", 1500);
      await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor", exact: true }).click();
      await expect(preview(page, "Confirmar")).toHaveAttribute("data-parent-ref", "panel:root"); await preview(page, "Confirmar").scrollIntoViewIfNeeded();
      await caption("Station • WP10 integrado: compor, mover e retomar", 2300);
    } finally { await context.close(); }
    const video = testInfo.outputPath("station-wp10-demo.webm"); await recording.saveAs(video);
    await testInfo.attach("Station WP10 demonstração real", { path: video, contentType: "video/webm" });
  });
});

test.describe("WP11 real artifact workspace", () => {
  const workspace = (page: Page) => page.getByRole("region", { name: "Artifact workspace", exact: true });
  const launch = async (page: Page, name: string) => {
    await page.getByRole("button", { name: "Open applications", exact: true }).click();
    await page.locator(name === "File Manager" ? '[data-app-ref="app:file-manager"]' : '[data-app-ref="app:composition-editor"]').click();
  };
  const folder = async (page: Page, name: string) => {
    await workspace(page).getByLabel("New folder name", { exact: true }).fill(name);
    await workspace(page).getByRole("button", { name: "Create folder", exact: true }).click();
    await expect(workspace(page).getByRole("status")).toHaveText("Folder created.");
  };
  const saveCopy = async (page: Page, name: string) => {
    await editor(page).getByLabel("Workspace copy name", { exact: true }).fill(name);
    await editor(page).getByRole("button", { name: "Save to workspace", exact: true }).click();
    await expect(editor(page).getByRole("status")).toContainText("Workspace copy saved");
  };
  const portable = async (page: Page) => {
    const wait = page.waitForEvent("download");
    await page.getByRole("button", { name: "Save As file", exact: true }).click();
    const download = await wait; const path = await download.path(); expect(path).not.toBeNull();
    return readFile(path!);
  };

  test("nested folders + editor-produced copy + Inspector + guarded singleton reopening", async ({ page }, testInfo) => {
    await page.goto("/"); await launch(page, "File Manager");
    await folder(page, "Design"); await workspace(page).getByRole("button", { name: "Folder: Design", exact: true }).click();
    await folder(page, "Screens"); await workspace(page).getByRole("button", { name: "Folder: Screens", exact: true }).click();
    await launch(page, "Composition Editor");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
    await editor(page).getByRole("button", { name: "Refresh workspace folders", exact: true }).click();
    await editor(page).getByRole("combobox", { name: "Workspace folder", exact: true }).selectOption({ label: "Workspace / Design / Screens" });
    await saveCopy(page, "screen.composition.json");
    await expect(editor(page).getByTestId("draft-state")).toHaveText("Unsaved changes");
    await launch(page, "File Manager"); await workspace(page).getByRole("button", { name: "Refresh workspace", exact: true }).click();
    await expect(workspace(page).getByLabel("Current workspace folder", { exact: true })).toHaveText("Workspace / Design / Screens");
    await workspace(page).getByRole("button", { name: "screen.composition.json", exact: true }).click();
    const inspector = workspace(page).getByRole("complementary", { name: "File Inspector", exact: true });
    await expect(inspector).toContainText("composition:example"); await expect(inspector).toContainText("1.0.0");
    await inspector.getByRole("button", { name: "Open in editor", exact: true }).click();
    await expect(editor(page).getByRole("group", { name: "Unsaved artifact open", exact: true })).toBeVisible();
    await editor(page).getByRole("button", { name: "Cancel open", exact: true }).click();
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await launch(page, "File Manager"); await inspector.getByRole("button", { name: "Open in editor", exact: true }).click();
    await editor(page).getByRole("button", { name: "Discard changes and open file", exact: true }).click();
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await expect(editor(page).getByRole("button", { name: "Undo", exact: true })).toHaveAttribute("aria-disabled", "true");
    expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith("station:composition-artifact:v1:")).length)).toBe(0);
    await page.screenshot({ path: testInfo.outputPath("wp11-editor-workspace-reopened.png"), fullPage: true });
  });

  test("independent named copies and actual export/import in a fresh browser context preserve identity", async ({ page }, testInfo) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
    await saveCopy(page, "copy-a.composition.json"); await span(page, "4"); await saveCopy(page, "copy-b.composition.json");
    const retained = await page.evaluate(() => JSON.parse(localStorage.getItem("station:artifact-workspace:v1")!));
    expect(retained.files).toHaveLength(2);
    const first = JSON.parse(retained.files[0].text), second = JSON.parse(retained.files[1].text);
    expect(first.artifactId).not.toBe(second.artifactId); expect(first.payload.graph.nodes[1].placement.columnSpan).toBe(3);
    expect(second.payload.graph.nodes[1].placement.columnSpan).toBe(4);
    await page.goto("/"); await launch(page, "File Manager");
    await workspace(page).getByRole("button", { name: "copy-a.composition.json", exact: true }).click();
    const wait = page.waitForEvent("download"); await workspace(page).getByRole("button", { name: "Export composition", exact: true }).click();
    const download = await wait, path = await download.path(), bytes = await readFile(path!);
    expect(JSON.parse(bytes.toString())).toEqual(first);
    const context = await page.context().browser()!.newContext();
    try {
      const other = await context.newPage(); await other.goto("http://127.0.0.1:3100/"); await launch(other, "File Manager");
      await workspace(other).getByLabel("Import workspace composition", { exact: true }).setInputFiles({ name: "imported.composition.json", mimeType: "application/json", buffer: bytes });
      await expect(workspace(other).getByRole("status")).toHaveText("Composition imported.");
      await workspace(other).getByRole("button", { name: "imported.composition.json", exact: true }).click();
      await expect(workspace(other).getByRole("complementary", { name: "File Inspector", exact: true })).toContainText(first.artifactId);
      await workspace(other).getByRole("button", { name: "Open in editor", exact: true }).click();
      await expect(preview(other)).toHaveAttribute("data-column-span", "3");
      await other.screenshot({ path: testInfo.outputPath("wp11-independent-file-import.png"), fullPage: true });
    } finally { await context.close(); }
  });

  test("unapplied fields block workspace saving; external open cancel preserves input and confirm installs file", async ({ page }) => {
    await page.goto("/"); await launch(page, "Composition Editor");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await saveCopy(page, "original.composition.json");
    await editor(page).getByLabel("Columns", { exact: true }).fill("3");
    await expect(editor(page).getByRole("button", { name: "Save to workspace", exact: true })).toBeDisabled();
    await launch(page, "File Manager"); await workspace(page).getByRole("button", { name: "original.composition.json", exact: true }).click();
    await workspace(page).getByRole("button", { name: "Open in editor", exact: true }).click();
    await editor(page).getByRole("button", { name: "Cancel open", exact: true }).click();
    await expect(editor(page).getByLabel("Columns", { exact: true })).toHaveValue("3");
    await expect(preview(page)).toHaveAttribute("data-column-span", "2");
    await launch(page, "File Manager"); await workspace(page).getByRole("button", { name: "Open in editor", exact: true }).click();
    await editor(page).getByRole("button", { name: "Discard changes and open file", exact: true }).click();
    await expect(editor(page).getByLabel("Columns", { exact: true })).toHaveValue("2");
    await expect(editor(page).getByRole("button", { name: "Save to workspace", exact: true })).toBeEnabled();
  });

  test("actual file preflight, corrupt workspace refresh and quota failure preserve prior files", async ({ page }) => {
    const bytes = await portable(page); await page.goto("/"); await launch(page, "File Manager");
    const input = workspace(page).getByLabel("Import workspace composition", { exact: true });
    await input.setInputFiles({ name: "script.txt", mimeType: "application/json", buffer: bytes });
    await expect(workspace(page).getByRole("status")).toContainText("Unable to import");
    await input.setInputFiles({ name: "broken.composition.json", mimeType: "application/json", buffer: Buffer.from("{}") });
    await expect(workspace(page).getByRole("status")).toContainText("Unable to import");
    expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBeNull();
    await input.setInputFiles({ name: "retained.composition.json", mimeType: "application/json", buffer: bytes });
    await expect(workspace(page).getByRole("status")).toHaveText("Composition imported.");
    const prior = await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"));
    await page.evaluate(() => localStorage.setItem("station:artifact-workspace:v1", "corrupt"));
    await workspace(page).getByRole("button", { name: "Refresh workspace", exact: true }).click();
    await expect(workspace(page).getByRole("button", { name: "retained.composition.json", exact: true })).toBeVisible();
    await expect(workspace(page).getByRole("button", { name: "Create folder", exact: true })).toBeDisabled();
    expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBe("corrupt");
    await page.evaluate(text => localStorage.setItem("station:artifact-workspace:v1", text!), prior);
    await workspace(page).getByRole("button", { name: "Refresh workspace", exact: true }).click();
    await page.evaluate(() => { const set = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) {
      if (key === "station:artifact-workspace:v1") throw new DOMException("quota", "QuotaExceededError"); set.call(this, key, value);
    }; });
    await workspace(page).getByLabel("New folder name", { exact: true }).fill("Denied");
    await workspace(page).getByRole("button", { name: "Create folder", exact: true }).click();
    await expect(workspace(page).getByRole("status")).toContainText("Unable to store");
    expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBe(prior);
  });

  test("stale saved-copy and selected-file snapshots require refresh without overwriting or opening", async ({ page }) => {
    await saveCopy(page, "a.composition.json"); const other = await page.context().newPage();
    try {
      await other.goto("http://127.0.0.1:3100/component-editor"); await saveCopy(other, "b.composition.json");
      await editor(page).getByLabel("Workspace copy name", { exact: true }).fill("c.composition.json");
      await editor(page).getByRole("button", { name: "Save to workspace", exact: true }).click();
      await expect(editor(page).getByRole("status")).toContainText("Workspace changed");
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem("station:artifact-workspace:v1")!).files.length)).toBe(2);
      await editor(page).getByRole("button", { name: "Refresh workspace folders", exact: true }).click(); await saveCopy(page, "c.composition.json");
      await page.goto("/"); await launch(page, "File Manager"); await workspace(page).getByRole("button", { name: "a.composition.json", exact: true }).click();
      await editor(other).getByRole("button", { name: "Refresh workspace folders", exact: true }).click(); await saveCopy(other, "d.composition.json");
      await workspace(page).getByRole("button", { name: "Open in editor", exact: true }).click();
      await expect(workspace(page).getByRole("status")).toContainText("Workspace changed");
      await expect(page.getByRole("dialog", { name: "Composition Editor", exact: true })).toHaveCount(0);
      await workspace(page).getByRole("button", { name: "Refresh workspace", exact: true }).click();
      await workspace(page).getByRole("button", { name: "a.composition.json", exact: true }).click();
      await workspace(page).getByRole("button", { name: "Open in editor", exact: true }).click(); await expect(preview(page)).toBeVisible();
    } finally { await other.close(); }
  });

  test("keyboard narrow workspace/window lifecycle and consumed handoff does not replay after close", async ({ page }) => {
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3"); await saveCopy(page, "keyboard.composition.json");
    await page.goto("/"); await page.setViewportSize({ width: 390, height: 860 }); await launch(page, "File Manager");
    const file = workspace(page).getByRole("button", { name: "keyboard.composition.json", exact: true }); await tabTo(page, file); await file.press("Enter");
    const open = workspace(page).getByRole("button", { name: "Open in editor", exact: true }); await tabTo(page, open); await open.press("Enter");
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    const window = page.getByRole("dialog", { name: "Composition Editor", exact: true });
    await window.getByRole("button", { name: "Minimize window", exact: true }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor", exact: true }).click();
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await window.getByRole("button", { name: "Close window", exact: true }).click(); await launch(page, "Composition Editor");
    await expect(preview(page)).toHaveAttribute("data-column-span", "2");
  });

  test("asynchronous actual import superseded by folder navigation never installs in an obsolete target", async ({ page }) => {
    const bytes = await portable(page); await page.goto("/"); await launch(page, "File Manager"); await folder(page, "Target");
    await page.evaluate(() => {
      const read = File.prototype.text;
      File.prototype.text = function() { return new Promise<string>(resolve => {
        (window as unknown as { finishWorkspaceRead: () => Promise<void> }).finishWorkspaceRead = () => read.call(this).then(resolve);
      }); };
    });
    await workspace(page).getByLabel("Import workspace composition", { exact: true }).setInputFiles({ name: "delayed.composition.json", mimeType: "application/json", buffer: bytes });
    await page.waitForFunction(() => typeof (window as unknown as { finishWorkspaceRead?: unknown }).finishWorkspaceRead === "function");
    await workspace(page).getByRole("button", { name: "Folder: Target", exact: true }).click();
    await page.evaluate(() => (window as unknown as { finishWorkspaceRead: () => Promise<void> }).finishWorkspaceRead());
    await expect(workspace(page).getByRole("region", { name: "Folder contents", exact: true })).toContainText("This folder is empty");
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("station:artifact-workspace:v1")!).files.length)).toBe(0);
  });
});

test.describe("WP12 immutable revisions and explicit conflict decisions", () => {
  const b = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
  const revision = (page: Page) => editor(page).getByRole("region", { name: "Save workspace revision", exact: true });
  const workspace = (page: Page) => page.getByRole("region", { name: "Artifact workspace", exact: true });
  const launch = async (page: Page, name: string) => {
    await b(page, "Open applications").click();
    await page.locator(name === "File Manager" ? '[data-app-ref="app:file-manager"]' : '[data-app-ref="app:composition-editor"]').click();
  };
  const copy = async (page: Page, name = "first.composition.json") => {
    await editor(page).getByLabel("Workspace copy name", { exact: true }).fill(name);
    await b(page, "Save to workspace").click(); await expect(editor(page).getByRole("status")).toContainText("Workspace copy saved");
  };
  const choose = async (page: Page, label: string) => {
    await revision(page).getByRole("button", { name: "Refresh revision targets", exact: true }).click();
    await revision(page).getByLabel("Revision target", { exact: true }).selectOption({ label });
  };
  const save = async (page: Page, name: string) => {
    await revision(page).getByLabel("Revision file name", { exact: true }).fill(name);
    await revision(page).getByRole("button", { name: "Save workspace revision", exact: true }).click();
    await expect(editor(page).getByRole("status")).toContainText("Workspace revision saved");
  };
  const retained = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("station:artifact-workspace:v1")!));
  async function two(page: Page) {
    await copy(page); await choose(page, "first.composition.json (v1.0.0)");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
    await save(page, "second.composition.json");
  }
  test("real mixed edits append two revisions, compare full metadata and preserve draft/history", async ({ page }) => {
    await copy(page); await choose(page, "first.composition.json (v1.0.0)");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await page.getByLabel("Button text", { exact: true }).fill("Confirmar revisão"); await b(page, "Apply text").click();
    await b(page, "Compare draft with revision").click();
    await expect(revision(page).getByRole("region", { name: "Revision comparison", exact: true })).toContainText("/payload/graph/nodes/1/text");
    await save(page, "second.composition.json"); await expect(b(page, "Undo")).toHaveAttribute("aria-disabled", "false");
    await expect(page.getByTestId("draft-state")).toHaveText("Unsaved changes");
    await expect(b(page, "Save workspace revision")).toBeDisabled();
    await choose(page, "second.composition.json (v1.0.1)");
    await page.getByLabel("Button variant", { exact: true }).selectOption("outline"); await b(page, "Apply properties").click();
    await save(page, "third.composition.json");
    const ws = await retained(page), docs = ws.files.map((f: { text: string }) => JSON.parse(f.text));
    expect(docs.map((d: { artifactVersion: string }) => d.artifactVersion)).toEqual(["1.0.0", "1.0.1", "1.0.2"]);
    expect(new Set(docs.map((d: { artifactId: string }) => d.artifactId)).size).toBe(1);
    expect(docs[0].payload.graph.nodes[1].text).toBeUndefined(); expect(docs[1].payload.graph.nodes[1].properties).toBeUndefined();
    expect(docs[2].payload.graph.nodes[1].properties.variant).toBe("outline");
    expect(docs[2].provenance.inputs.at(-1).artifactVersion).toBe("1.0.1");
    await b(page, "Undo").click(); await expect(preview(page, "Confirmar revisão")).toHaveAttribute("data-button-variant", "default");
    expect(await retained(page)).toEqual(ws);
    expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith("station:composition-artifact:v1:")).length)).toBe(0);
  });
  test("File Manager comparison/export and guarded historical/latest reopen use actual retained revisions", async ({ page }, testInfo) => {
    await two(page); const ws = await retained(page);
    await page.goto("/"); await launch(page, "File Manager");
    await workspace(page).getByRole("button", { name: "second.composition.json", exact: true }).click();
    await workspace(page).getByLabel("Comparison base", { exact: true }).selectOption(ws.files[0].ref);
    const diff = workspace(page).getByRole("region", { name: "Revision comparison", exact: true });
    await expect(diff).toContainText("/artifactVersion"); await expect(diff).toContainText("/payload/graph/nodes/1/placement/columnSpan");
    await expect(diff).toContainText("Before: 2"); await expect(diff).toContainText("After: 3");
    await workspace(page).getByLabel("Retained revision", { exact: true }).selectOption(ws.files[0].ref);
    await expect(diff).toHaveCount(0);
    const wait = page.waitForEvent("download"); await workspace(page).getByRole("button", { name: "Export composition", exact: true }).click();
    const downloaded = await wait; expect(JSON.parse((await readFile((await downloaded.path())!)).toString())).toEqual(JSON.parse(ws.files[0].text));
    await workspace(page).getByRole("button", { name: "Open in editor", exact: true }).click();
    await expect(preview(page)).toHaveAttribute("data-column-span", "2");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "4");
    await launch(page, "File Manager"); await workspace(page).getByLabel("Retained revision", { exact: true }).selectOption(ws.files[1].ref);
    await workspace(page).getByRole("button", { name: "Open in editor", exact: true }).click();
    await b(page, "Cancel open").click(); await expect(preview(page)).toHaveAttribute("data-column-span", "4");
    await launch(page, "File Manager"); await workspace(page).getByRole("button", { name: "Open in editor", exact: true }).click();
    await b(page, "Discard changes and open file").click(); await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await expect(b(page, "Undo")).toHaveAttribute("aria-disabled", "true");
    await page.screenshot({ path: testInfo.outputPath("wp12-revision-reopened.png"), fullPage: true });
  });
  test("two actual views detect stale revision without lost bytes and explicit refresh/retry retains both changes", async ({ page }) => {
    await copy(page); await choose(page, "first.composition.json (v1.0.0)");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
    const other = await page.context().newPage();
    try {
      await other.goto("http://127.0.0.1:3100/component-editor"); await choose(other, "first.composition.json (v1.0.0)");
      await other.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(other, "4");
      await save(other, "other.composition.json"); const prior = await retained(page);
      await revision(page).getByLabel("Revision file name", { exact: true }).fill("mine.composition.json");
      await b(page, "Save workspace revision").click(); await expect(editor(page).getByRole("status")).toContainText("Revision conflict");
      await expect(preview(page)).toHaveAttribute("data-column-span", "3"); await expect(b(page, "Undo")).toHaveAttribute("aria-disabled", "false");
      expect(await retained(page)).toEqual(prior); await expect(b(page, "Save workspace revision")).toBeDisabled();
      await choose(page, "other.composition.json (v1.0.1)"); await b(page, "Compare draft with revision").click();
      await expect(revision(page).getByRole("region", { name: "Revision comparison", exact: true })).toContainText("Before: 4");
      await save(page, "mine.composition.json"); const saved = await retained(page);
      expect(saved.files).toHaveLength(3); expect(saved.files[1].text).toBe(prior.files[1].text);
      expect(JSON.parse(saved.files[2].text).payload.graph.nodes[1].placement.columnSpan).toBe(3);
    } finally { await other.close(); }
  });
  test("pending fields, unchanged draft and invalid filenames reject without retaining; comparison expires on new edit", async ({ page }) => {
    await copy(page); await choose(page, "first.composition.json (v1.0.0)");
    await b(page, "Save workspace revision").click(); await expect(editor(page).getByRole("status")).toContainText("No changed graph");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click();
    await page.getByLabel("Columns", { exact: true }).fill("3"); await expect(b(page, "Save workspace revision")).toBeDisabled();
    await expect(b(page, "Compare draft with revision")).toBeDisabled(); await b(page, "Apply size").click();
    await b(page, "Compare draft with revision").click(); await expect(revision(page).getByRole("region", { name: "Revision comparison", exact: true })).toBeVisible();
    await span(page, "4"); await expect(revision(page).getByRole("region", { name: "Revision comparison", exact: true })).toHaveCount(0);
    const prior = await retained(page); await revision(page).getByLabel("Revision file name", { exact: true }).fill("../bad.composition.json");
    await b(page, "Save workspace revision").click(); await expect(editor(page).getByRole("status")).toContainText("Unable to save revision");
    expect(await retained(page)).toEqual(prior); await expect(preview(page)).toHaveAttribute("data-column-span", "4");
    await save(page, "valid.composition.json");
  });
  test("quota and corrupt refresh preserve old revisions and current draft, restoring storage allows explicit recovery", async ({ page }) => {
    await copy(page); await choose(page, "first.composition.json (v1.0.0)");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page, "3");
    const prior = await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"));
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      (window as unknown as { restoreRevisionStorage: () => void }).restoreRevisionStorage = () => { Storage.prototype.setItem = original; };
      Storage.prototype.setItem = function(key, value) { if (key === "station:artifact-workspace:v1") throw new DOMException("quota", "QuotaExceededError"); original.call(this, key, value); };
    });
    await b(page, "Save workspace revision").click(); await expect(editor(page).getByRole("status")).toContainText("Unable to save revision");
    expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBe(prior);
    await page.evaluate(() => { (window as unknown as { restoreRevisionStorage: () => void }).restoreRevisionStorage(); localStorage.setItem("station:artifact-workspace:v1", "broken"); });
    await b(page, "Refresh revision targets").click(); await expect(editor(page).getByRole("status")).toContainText("unavailable");
    await expect(b(page, "Save workspace revision")).toBeDisabled(); await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBe("broken");
    await page.evaluate(text => localStorage.setItem("station:artifact-workspace:v1", text!), prior);
    await choose(page, "first.composition.json (v1.0.0)"); await save(page, "recovered.composition.json");
  });
  test("keyboard and narrow layout retain revision target through minimize and reset consumed historical open after close", async ({ page }) => {
    await two(page); const ws = await retained(page); await page.goto("/"); await page.setViewportSize({ width: 390, height: 860 });
    await launch(page, "File Manager"); await workspace(page).getByRole("button", { name: "second.composition.json", exact: true }).click();
    const base = workspace(page).getByLabel("Comparison base", { exact: true }); await tabTo(page, base); await base.selectOption(ws.files[0].ref);
    await expect(workspace(page).getByRole("region", { name: "Revision comparison", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const open = workspace(page).getByRole("button", { name: "Open in editor", exact: true }); await tabTo(page, open); await open.press("Enter");
    await expect(preview(page)).toHaveAttribute("data-column-span", "3");
    await choose(page, "second.composition.json (v1.0.1)");
    const win = page.getByRole("dialog", { name: "Composition Editor", exact: true }); await win.getByRole("button", { name: "Minimize window", exact: true }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Composition Editor", exact: true }).click();
    await expect(revision(page).getByLabel("Revision target", { exact: true })).toHaveValue(ws.files[1].ref);
    await win.getByRole("button", { name: "Close window", exact: true }).click(); await launch(page, "Composition Editor");
    await expect(preview(page)).toHaveAttribute("data-column-span", "2");
    await expect(revision(page).getByLabel("Revision target", { exact: true })).toHaveValue("");
  });
  test("imported complete envelopes display literal metadata and explicit truncated comparison", async ({ page }) => {
    const bytes = await downloadedComposition(page), a = JSON.parse(bytes.toString());
    a.extensions = { "org.example.diff": Object.fromEntries(Array.from({ length: 513 }, (_, i) => ["value" + i, "<script>" + i])) };
    const c = { ...a, artifactVersion: "1.0.1", extensions: { "org.example.diff": Object.fromEntries(Array.from({ length: 513 }, (_, i) => ["value" + i, "<button>" + i])) } };
    await page.goto("/"); await launch(page, "File Manager");
    const input = workspace(page).getByLabel("Import workspace composition", { exact: true });
    await input.setInputFiles({ name: "a.composition.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(a)) });
    await expect(workspace(page).getByRole("status")).toHaveText("Composition imported.");
    await input.setInputFiles({ name: "b.composition.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(c)) });
    await expect(workspace(page).getByRole("status")).toHaveText("Composition imported.");
    const ws = await retained(page); await workspace(page).getByRole("button", { name: "b.composition.json", exact: true }).click();
    await workspace(page).getByLabel("Comparison base", { exact: true }).selectOption(ws.files[0].ref);
    const diff = workspace(page).getByRole("region", { name: "Revision comparison", exact: true });
    await expect(diff).toContainText("Comparison truncated at 512 paths"); await expect(diff.getByRole("listitem")).toHaveCount(512);
    await expect(diff).toContainText("<script>"); expect(await diff.locator("script").count()).toBe(0);
    await expect(workspace(page).getByLabel("Retained revision", { exact: true }).locator("option")).toHaveCount(2);
  });
});

test.describe("WP13 portable process context", () => {
  const contextView = (page: Page) => page.getByRole("region", { name: "Process context", exact: true });
  const button = (page: Page, name: string) => contextView(page).getByRole("button", { name, exact: true });
  async function launchContext(page: Page, name = "Process Context") {
    await page.getByRole("button", { name: "Open applications", exact: true }).click();
    await page.locator(name === "Process Context" ? '[data-app-ref="app:process-context"]' : '[data-app-ref="app:composition-editor"]').click();
  }
  async function actualCopies(page: Page) {
    await editor(page).getByLabel("Workspace copy name", { exact: true }).fill("first.composition.json");
    await editor(page).getByRole("button", { name: "Save to workspace", exact: true }).click();
    await expect(editor(page).getByRole("status")).toContainText("Workspace copy saved");
    await page.getByRole("treeitem", { name: "Button 1", exact: true }).click(); await span(page,"3");
    await editor(page).getByRole("button", { name: "Refresh revision targets", exact: true }).click();
    const ws = await page.evaluate(() => JSON.parse(localStorage.getItem("station:artifact-workspace:v1")!));
    await editor(page).getByLabel("Revision target", { exact: true }).selectOption(ws.files[0].ref);
    await editor(page).getByLabel("Revision file name", { exact: true }).fill("second.composition.json");
    await editor(page).getByRole("button", { name: "Save workspace revision", exact: true }).click();
    await expect(editor(page).getByRole("status")).toContainText("revision saved");
  }
  async function form(page: Page,title="Orders") {
    await contextView(page).getByText("Create context from references",{exact:true}).click();
    await contextView(page).getByLabel("Context title",{exact:true}).fill(title);
    await contextView(page).getByLabel("Process identity",{exact:true}).fill("process:orders");
    await contextView(page).getByLabel("Process revision identity",{exact:true}).fill("revision:orders-1");
  }
  async function actualContext(page: Page) {
    await actualCopies(page); await page.goto("/process-context"); await form(page);
    await contextView(page).getByRole("checkbox",{name:"first.composition.json (v1.0.0)",exact:true}).check();
    await contextView(page).getByRole("checkbox",{name:"second.composition.json (v1.0.1)",exact:true}).check();
    await button(page,"Create context").click(); await expect(contextView(page).getByRole("heading",{name:"Orders",exact:true})).toBeVisible();
    const download = page.waitForEvent("download"); await button(page,"Export context").click();
    const file = await (await download).path(); if (!file) throw Error("download"); return readFile(file);
  }
  async function importContext(page: Page, bytes: Buffer) {
    await contextView(page).getByLabel("Import process context file",{exact:true}).setInputFiles({name:"orders.process.json",mimeType:"application/json",buffer:bytes});
  }
  test("actual editor revisions -> context file -> local reload -> pinned composition and untouched semantic anchor", async ({page}) => {
    const bytes=await actualContext(page), doc=JSON.parse(bytes.toString());
    expect(doc.payload.views.map((v:{composition:{artifactVersion:string}})=>v.composition.artifactVersion)).toEqual(["1.0.0","1.0.1"]);
    await expect(contextView(page).getByTestId("process-owner-status")).toContainText("unavailable");
    await button(page,"Save context locally").click(); await page.reload();
    await expect(contextView(page)).toContainText("No process context is open");
    await button(page,"Open retained context").click(); await expect(contextView(page)).toContainText("Context retained locally");
    const prior=await page.evaluate(()=>localStorage.getItem("station:process-context:v1"));
    await contextView(page).getByRole("listitem",{name:"first.composition.json",exact:true}).getByRole("button").click();
    await expect(preview(page)).toHaveAttribute("data-column-span","2");
    await contextView(page).getByRole("listitem",{name:"second.composition.json",exact:true}).getByRole("button").click();
    await expect(preview(page)).toHaveAttribute("data-column-span","3");
    await page.getByRole("treeitem",{name:"Button 1",exact:true}).click();await span(page,"4");
    expect(await page.evaluate(()=>localStorage.getItem("station:process-context:v1"))).toBe(prior);
    expect(JSON.parse(prior!).payload.processRevision).toEqual(doc.payload.processRevision);
  });
  test("shell context requests ordinary editor confirmation and cancellation preserves dirty fields", async ({page}) => {
    const bytes=await actualContext(page);await page.goto("/");await launchContext(page,"Composition Editor");
    await page.getByRole("treeitem",{name:"Button 1",exact:true}).click();await span(page,"4");
    await launchContext(page);await importContext(page,bytes);
    const open=contextView(page).getByRole("listitem",{name:"first.composition.json",exact:true}).getByRole("button");await open.click();
    await expect(editor(page).getByRole("button",{name:"Discard changes and open file",exact:true})).toBeVisible();
    await editor(page).getByRole("button",{name:"Cancel open",exact:true}).click();await expect(preview(page)).toHaveAttribute("data-column-span","4");
    await launchContext(page);await open.click();await editor(page).getByRole("button",{name:"Discard changes and open file",exact:true}).click();
    await expect(preview(page)).toHaveAttribute("data-column-span","2");
  });
  test("absent/stale references and corrupt workspace stay explicit without replacing exact versions", async ({page}) => {
    const bytes=await actualContext(page),doc=JSON.parse(bytes.toString());await page.reload();
    doc.payload.views[0].composition.artifactVersion="1.0.9";doc.payload.views[1].composition.artifactId="urn:uuid:missing";
    await importContext(page,Buffer.from(JSON.stringify(doc)));
    await expect(contextView(page).getByTestId("context-reference-status").nth(0)).toHaveText("stale");
    await expect(contextView(page).getByTestId("context-reference-status").nth(1)).toHaveText("missing");
    for(const b of await contextView(page).getByRole("button",{name:"Open referenced composition",exact:true}).all())await expect(b).toBeDisabled();
    await page.evaluate(()=>localStorage.setItem("station:artifact-workspace:v1","corrupt"));await button(page,"Refresh references").click();
    await expect(contextView(page).getByTestId("context-reference-status").nth(0)).toHaveText("invalid");
    await expect(contextView(page).getByRole("heading",{name:"Orders",exact:true})).toBeVisible();
  });
  test("malformed files preserve open context and valid replacement protects pending form", async ({page}) => {
    const bytes=await actualContext(page);
    await contextView(page).getByLabel("Import process context file",{exact:true}).setInputFiles({name:"bad.process.json",mimeType:"application/json",buffer:Buffer.from('{"__proto__":{}}')});
    await expect(contextView(page).getByRole("status")).toContainText("Unable to import");
    await contextView(page).getByLabel("Context title",{exact:true}).fill("Pending form");await importContext(page,bytes);
    await expect(contextView(page).getByRole("dialog",{name:"Replace process context",exact:true})).toBeVisible();
    await button(page,"Cancel context replacement").click();await expect(contextView(page).getByLabel("Context title",{exact:true})).toHaveValue("Pending form");
    await expect(button(page,"Save context locally")).toBeDisabled();await importContext(page,bytes);await button(page,"Discard context and open").click();
    await expect(contextView(page).getByLabel("Context title",{exact:true})).toHaveValue("");
  });
  test("quota and stale local save preserve bytes, explicit refresh recovers", async ({page}) => {
    const bytes=await actualContext(page);
    await page.evaluate(()=>{const original=Storage.prototype.setItem;(window as unknown as {restoreContextStorage:()=>void}).restoreContextStorage=()=>{Storage.prototype.setItem=original;};Storage.prototype.setItem=function(k,v){if(k==="station:process-context:v1")throw new DOMException("quota","QuotaExceededError");original.call(this,k,v);};});
    await button(page,"Save context locally").click();await expect(contextView(page).getByRole("status")).toContainText("Unable to save");
    expect(await page.evaluate(()=>localStorage.getItem("station:process-context:v1"))).toBeNull();
    await page.evaluate(()=>{(window as unknown as {restoreContextStorage:()=>void}).restoreContextStorage();});await button(page,"Refresh context storage").click();
    const other=await page.context().newPage();await other.goto("/process-context");await form(other,"Other");await button(other,"Create context").click();await button(other,"Save context locally").click();
    const retained=await other.evaluate(()=>localStorage.getItem("station:process-context:v1"));await other.close();
    await button(page,"Save context locally").click();await expect(contextView(page).getByRole("status")).toContainText("Context storage changed");
    expect(await page.evaluate(()=>localStorage.getItem("station:process-context:v1"))).toBe(retained);
    await button(page,"Refresh context storage").click();await button(page,"Save context locally").click();
    expect(JSON.parse((await page.evaluate(()=>localStorage.getItem("station:process-context:v1")))!).payload.title).toBe(JSON.parse(bytes.toString()).payload.title);
  });
  test("keyboard/narrow shell minimize retains context and close does not replay retained opening", async ({page}) => {
    const bytes=await actualContext(page);await page.goto("/");await page.setViewportSize({width:390,height:860});await launchContext(page);await importContext(page,bytes);
    await tabTo(page,button(page,"Save context locally"));await button(page,"Save context locally").press("Enter");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const win=page.getByRole("dialog",{name:"Process Context",exact:true});await win.getByRole("button",{name:"Minimize window",exact:true}).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button",{name:"Process Context",exact:true}).click();
    await expect(contextView(page).getByRole("heading",{name:"Orders",exact:true})).toBeVisible();
    await win.getByRole("button",{name:"Close window",exact:true}).click();await launchContext(page);
    await expect(contextView(page)).toContainText("No process context is open");await button(page,"Open retained context").click();
    await expect(contextView(page).getByRole("heading",{name:"Orders",exact:true})).toBeVisible();
  });
  test("obsolete asynchronous import cannot replace context after form changes", async ({page}) => {
    const bytes=await actualContext(page);
    await page.evaluate(()=>{(window as unknown as {finishContextRead?:()=>void}).finishContextRead=undefined;const original=File.prototype.text;File.prototype.text=function(){return new Promise(resolve=>{(window as unknown as {finishContextRead:()=>void}).finishContextRead=()=>{void original.call(this).then(resolve);};});};});
    await importContext(page,bytes);await contextView(page).getByLabel("Context title",{exact:true}).fill("New form");
    await page.evaluate(()=>{(window as unknown as {finishContextRead:()=>void}).finishContextRead();});
    await expect(contextView(page).getByLabel("Context title",{exact:true})).toHaveValue("New form");
    await expect(contextView(page).getByRole("dialog",{name:"Replace process context",exact:true})).toHaveCount(0);
  });
});

test.describe("WP14 shared context projections",()=>{
 const ctx=(page:Page)=>page.getByRole("region",{name:"Process context",exact:true});
 const shared=(page:Page)=>page.getByRole("region",{name:"Shared context projections",exact:true});
 const explorer=(page:Page)=>shared(page).getByRole("region",{name:"Context Explorer",exact:true});
 const inspect=(page:Page)=>shared(page).getByRole("region",{name:"Context Inspector",exact:true});
 const cb=(page:Page,name:string)=>ctx(page).getByRole("button",{name,exact:true});
 async function actual(page:Page){
  await editor(page).getByLabel("Workspace copy name",{exact:true}).fill("first.composition.json");
  await editor(page).getByRole("button",{name:"Save to workspace",exact:true}).click();
  await expect(editor(page).getByRole("status")).toContainText("Workspace copy saved");
  await page.getByRole("treeitem",{name:"Button 1",exact:true}).click();await span(page,"3");
  await editor(page).getByRole("button",{name:"Refresh revision targets",exact:true}).click();
  const ws=await page.evaluate(()=>JSON.parse(localStorage.getItem("station:artifact-workspace:v1")!));
  await editor(page).getByLabel("Revision target",{exact:true}).selectOption(ws.files[0].ref);
  await editor(page).getByLabel("Revision file name",{exact:true}).fill("second.composition.json");
  await editor(page).getByRole("button",{name:"Save workspace revision",exact:true}).click();
  await expect(editor(page).getByRole("status")).toContainText("revision saved");
  await page.goto("/process-context");await ctx(page).getByText("Create context from references",{exact:true}).click();
  await ctx(page).getByLabel("Context title",{exact:true}).fill("Orders");
  await ctx(page).getByLabel("Process identity",{exact:true}).fill("process:orders");
  await ctx(page).getByLabel("Process revision identity",{exact:true}).fill("revision:orders-1");
  await ctx(page).getByRole("checkbox",{name:"first.composition.json (v1.0.0)",exact:true}).check();
  await ctx(page).getByRole("checkbox",{name:"second.composition.json (v1.0.1)",exact:true}).check();
  await cb(page,"Create context").click();await cb(page,"Save context locally").click();
  const download=page.waitForEvent("download");await cb(page,"Export context").click();
  const file=await (await download).path();if(!file)throw Error("download");return readFile(file);
 }
 async function importDoc(page:Page,bytes:Buffer){
  await ctx(page).getByLabel("Import process context file",{exact:true}).setInputFiles({name:"orders.process.json",mimeType:"application/json",buffer:bytes});
 }
 test("Explorer/outline/table/Inspector share qualified selection and reopen exact historical/latest revisions",async({page},testInfo)=>{
  const bytes=await actual(page),before=await page.evaluate(()=>localStorage.getItem("station:process-context:v1"));
  await explorer(page).getByRole("button",{name:"Select first.composition.json",exact:true}).click();
  const identity=await shared(page).getAttribute("data-selected-ref");
  await cb(page,"Reference table").click();await expect(shared(page)).toHaveAttribute("data-selected-ref",identity!);
  await expect(inspect(page)).toHaveAttribute("data-item-ref",identity!);await expect(inspect(page)).toContainText("1.0.0");
  await inspect(page).getByRole("button",{name:"Open selected composition",exact:true}).click();
  await expect(preview(page)).toHaveAttribute("data-column-span","2");
  await shared(page).getByRole("region",{name:"Reference table",exact:true}).getByRole("button",{name:"Inspect second.composition.json",exact:true}).click();
  await expect(explorer(page).getByRole("button",{name:"Select second.composition.json",exact:true})).toHaveAttribute("aria-pressed","true");
  await inspect(page).getByRole("button",{name:"Open selected composition",exact:true}).click();
  await expect(preview(page)).toHaveAttribute("data-column-span","3");
  expect(await page.evaluate(()=>localStorage.getItem("station:process-context:v1"))).toBe(before);
  expect(JSON.parse(bytes.toString()).payload.processRevision.revisionNumber).toBe(1);
  await page.screenshot({path:testInfo.outputPath("wp14-shared-projections.png"),fullPage:true});
 });
 test("cached available selection re-resolves changed workspace; unresolved refresh keeps identity",async({page})=>{
  await actual(page);await explorer(page).getByRole("button",{name:"Select first.composition.json",exact:true}).click();
  const identity=await shared(page).getAttribute("data-selected-ref");
  await page.evaluate(()=>{const ws=JSON.parse(localStorage.getItem("station:artifact-workspace:v1")!);ws.files=ws.files.slice(1);localStorage.setItem("station:artifact-workspace:v1",JSON.stringify(ws));});
  await inspect(page).getByRole("button",{name:"Open selected composition",exact:true}).click();
  await expect(ctx(page).getByRole("status")).toContainText("stale");await expect(editor(page)).toHaveCount(0);
  await expect(shared(page)).toHaveAttribute("data-selected-ref",identity!);await expect(inspect(page).getByTestId("inspector-reference-status")).toHaveText("stale");
  await expect(inspect(page).getByRole("button",{name:"Open selected composition",exact:true})).toBeDisabled();
  await page.evaluate(()=>localStorage.setItem("station:artifact-workspace:v1","corrupt"));await cb(page,"Refresh references").click();
  await expect(inspect(page).getByTestId("inspector-reference-status")).toHaveText("invalid");
  await expect(shared(page)).toHaveAttribute("data-selected-ref",identity!);
 });
 test("shared Inspector handoff preserves ordinary dirty editor cancellation",async({page})=>{
  const bytes=await actual(page);await page.goto("/");
  await page.getByRole("button",{name:"Open applications",exact:true}).click();await page.locator('[data-app-ref="app:composition-editor"]').click();
  await page.getByRole("treeitem",{name:"Button 1",exact:true}).click();await span(page,"4");
  await page.getByRole("button",{name:"Open applications",exact:true}).click();await page.locator('[data-app-ref="app:process-context"]').click();
  await importDoc(page,bytes);await explorer(page).getByRole("button",{name:"Select first.composition.json",exact:true}).click();
  await inspect(page).getByRole("button",{name:"Open selected composition",exact:true}).click();
  await editor(page).getByRole("button",{name:"Cancel open",exact:true}).click();await expect(preview(page)).toHaveAttribute("data-column-span","4");
  await page.getByRole("button",{name:"Open applications",exact:true}).click();await page.locator('[data-app-ref="app:process-context"]').click();
  await inspect(page).getByRole("button",{name:"Open selected composition",exact:true}).click();
  await editor(page).getByRole("button",{name:"Discard changes and open file",exact:true}).click();await expect(preview(page)).toHaveAttribute("data-column-span","2");
 });
 test("duplicate titles and same composition tuple stay distinct; confirmed context revision replacement resets selection",async({page})=>{
  const bytes=await actual(page),doc=JSON.parse(bytes.toString());await page.reload();
  doc.payload.views=[{...doc.payload.views[0],ref:"view:a",title:"Same"},{...doc.payload.views[0],ref:"view:b",title:"Same"}];
  await importDoc(page,Buffer.from(JSON.stringify(doc)));
  const choices=explorer(page).getByRole("button",{name:"Select Same",exact:true});await choices.nth(1).click();
  await expect(inspect(page)).toContainText("view:b");const identity=await shared(page).getAttribute("data-selected-ref");
  await cb(page,"Reference table").click();await expect(shared(page)).toHaveAttribute("data-selected-ref",identity!);
  doc.artifactVersion="1.0.1";await importDoc(page,Buffer.from(JSON.stringify(doc)));await cb(page,"Cancel context replacement").click();
  await expect(shared(page)).toHaveAttribute("data-selected-ref",identity!);
  await importDoc(page,Buffer.from(JSON.stringify(doc)));await cb(page,"Discard context and open").click();
  await expect(shared(page)).toHaveAttribute("data-selected-ref","");await expect(inspect(page)).toContainText("Select a context reference");
 });
 test("keyboard/narrow layout and shell minimize retain selection; close/reopen starts empty",async({page})=>{
  const bytes=await actual(page);await page.goto("/");await page.setViewportSize({width:390,height:860});
  await page.getByRole("button",{name:"Open applications",exact:true}).click();await page.locator('[data-app-ref="app:process-context"]').click();await importDoc(page,bytes);
  const choose=explorer(page).getByRole("button",{name:"Select second.composition.json",exact:true});await tabTo(page,choose);await choose.press("Enter");
  const identity=await shared(page).getAttribute("data-selected-ref");await cb(page,"Reference table").click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const win=page.getByRole("dialog",{name:"Process Context",exact:true});await win.getByRole("button",{name:"Minimize window",exact:true}).click();
  await page.locator('[data-slot="taskbar-windows"]').getByRole("button",{name:"Process Context",exact:true}).click();
  await expect(shared(page)).toHaveAttribute("data-selected-ref",identity!);
  await cb(page,"Save context locally").click();await win.getByRole("button",{name:"Close window",exact:true}).click();
  await page.getByRole("button",{name:"Open applications",exact:true}).click();await page.locator('[data-app-ref="app:process-context"]').click();await cb(page,"Open retained context").click();
  await expect(shared(page)).toHaveAttribute("data-selected-ref","");await expect(cb(page,"Context outline")).toHaveAttribute("aria-pressed","true");
 });
 test("empty/max contexts stay bounded and process anchor remains read-only and unavailable",async({page})=>{
  const bytes=await actual(page),doc=JSON.parse(bytes.toString());await page.reload();doc.payload.views=[];
  await importDoc(page,Buffer.from(JSON.stringify(doc)));await explorer(page).getByRole("button",{name:"Select Orders",exact:true}).click();
  await expect(inspect(page).getByTestId("inspector-reference-status")).toHaveText("unavailable");
  await expect(inspect(page).getByRole("button",{name:"Open selected composition",exact:true})).toHaveCount(0);
  await cb(page,"Reference table").click();await expect(shared(page).getByRole("row")).toHaveCount(2);
  await page.reload();const original=JSON.parse(bytes.toString());original.payload.views=Array.from({length:16},(_,i)=>({...original.payload.views[0],ref:"view:"+i,title:"Reference "+i}));
  await importDoc(page,Buffer.from(JSON.stringify(original)));await expect(explorer(page).getByRole("button")).toHaveCount(17);
  original.payload.views.push({...original.payload.views[0],ref:"overflow"});await importDoc(page,Buffer.from(JSON.stringify(original)));
  await expect(ctx(page).getByRole("status")).toContainText("Unable to import");await expect(explorer(page).getByRole("button")).toHaveCount(17);
 });
});

test.describe("WP15 technical Workflow Studio", () => {
  const studio = (page: Page) => page.getByRole("region", { name: "Workflow Studio", exact: true });
  const wb = (page: Page, name: string) => studio(page).getByRole("button", { name, exact: true });
  const tools = (page: Page) => studio(page).getByRole("region", { name: "Workflow Tools", exact: true });
  async function createTechnical(page: Page) {
    await page.goto("/workflow-studio");
    await studio(page).getByText("Create workflow or add process", { exact: true }).click();
    for (const [name, value] of [["Process name", "Ticket"], ["Process id", "ticket"], ["Analysis reference", "analysis:1"], ["Recipe reference", "recipe:1"], ["Requirement reference", "req:1"]]) await studio(page).getByLabel(name!, { exact: true }).fill(value!);
    await wb(page, "Create workflow").click(); await expect(studio(page)).toHaveAttribute("data-artifact-version", "1.0.0");
  }
  async function actualCandidate(page: Page) {
    await createTechnical(page);
    await studio(page).getByLabel("New state id", { exact: true }).fill("closed"); await wb(page, "Add state").click();
    await studio(page).getByLabel("New transition id", { exact: true }).fill("close"); await wb(page, "Add transition").click();
    await wb(page, "Select transition close").click();
    await studio(page).getByLabel("Transition target", { exact: true }).selectOption("closed"); await wb(page, "Apply transition").click();
    await wb(page, "Save new workflow revision").click(); await expect(studio(page)).toHaveAttribute("data-artifact-version", "1.0.1");
    const download = page.waitForEvent("download"); await wb(page, "Export workflow").click(); const file = await (await download).path(); if (!file) throw Error("download"); return readFile(file);
  }
  async function importWorkflow(page: Page, bytes: Buffer) { await studio(page).getByLabel("Import workflow file", { exact: true }).setInputFiles({ name: "ticket.workflow.json", mimeType: "application/json", buffer: bytes }); }
  test("actual coordinated Tools author, save, compare, download and reopen immutable revisions", async ({ page }, testInfo) => {
    const bytes = await actualCandidate(page); const d = JSON.parse(bytes.toString()); expect(d.payload.processes[0].transitions[0]).toEqual({ id: "close", from: "open", to: "closed" });
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("station:workflow-candidates:v1")!)); expect(stored.revisions).toHaveLength(2); expect(JSON.parse(stored.revisions[0]).payload.processes[0].states).toEqual(["open"]);
    await expect(studio(page).getByRole("region", { name: "Workflow revision comparison", exact: true })).toContainText("Workflow changed");
    await wb(page, "Select transition close").click(); const identity = await tools(page).getAttribute("data-selected-ref");
    await wb(page, "Workflow table").click(); await expect(tools(page)).toHaveAttribute("data-selected-ref", identity!); await expect(studio(page).getByRole("region", { name: "Workflow Inspector", exact: true })).toHaveAttribute("data-item-ref", identity!);
    await page.reload(); await studio(page).getByLabel("Retained workflow revision", { exact: true }).selectOption("1"); await wb(page, "Open workflow revision").click();
    await expect(wb(page, "Inspect state closed")).toBeVisible(); await expect(tools(page)).toHaveAttribute("data-selected-ref", "");
    await studio(page).getByLabel("Retained workflow revision", { exact: true }).selectOption("0"); await wb(page, "Open workflow revision").click(); await expect(wb(page, "Inspect state closed")).toHaveCount(0);
    await importWorkflow(page, bytes); await expect(wb(page, "Inspect state closed")).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath("wp15-workflow-studio.png"), fullPage: true });
  });
  test("invalid deletion, duplicate state and history stay atomic; self-loop transitions remain valid", async ({ page }) => {
    await createTechnical(page); await wb(page, "Select state open").click(); await wb(page, "Remove state").click(); await expect(studio(page).getByRole("status")).toContainText("rejected"); await expect(studio(page)).toHaveAttribute("data-draft-revision", "0");
    await studio(page).getByLabel("New state id", { exact: true }).fill("open"); await wb(page, "Add state").click(); await expect(studio(page)).toHaveAttribute("data-draft-revision", "0");
    await studio(page).getByLabel("New state id", { exact: true }).fill("closed"); await wb(page, "Add state").click(); await wb(page, "Undo workflow").click(); await expect(wb(page, "Inspect state closed")).toHaveCount(0); await wb(page, "Redo workflow").click(); await expect(wb(page, "Inspect state closed")).toBeVisible();
    await studio(page).getByLabel("New transition id", { exact: true }).fill("loop"); await wb(page, "Add transition").click(); await expect(wb(page, "Inspect transition loop")).toContainText("open → open");
    await wb(page, "Validate workflow").click(); await expect(studio(page).getByRole("status")).toContainText("rules valid"); await expect(studio(page)).toContainText("Upstream references unresolved");
  });
  test("dirty and unapplied fields survive cancelled import; confirmed replacement resets history", async ({ page }) => {
    const bytes = await actualCandidate(page); await studio(page).getByLabel("New state id", { exact: true }).fill("review"); await wb(page, "Add state").click(); await studio(page).getByLabel("New state id", { exact: true }).fill("pending");
    await importWorkflow(page, bytes); await expect(studio(page).getByRole("dialog", { name: "Replace workflow draft", exact: true })).toBeVisible(); await wb(page, "Cancel workflow replacement").click();
    await expect(studio(page).getByLabel("New state id", { exact: true })).toHaveValue("pending"); await expect(wb(page, "Inspect state review")).toBeVisible();
    await importWorkflow(page, bytes); await wb(page, "Discard workflow and open").click(); await expect(wb(page, "Inspect state review")).toHaveCount(0); await expect(wb(page, "Undo workflow")).toBeDisabled();
  });
  test("malformed/incompatible input and obsolete asynchronous import preserve current draft", async ({ page }) => {
    const bytes = await actualCandidate(page); const revision = await studio(page).getAttribute("data-artifact-version");
    for (const bad of ['{"__proto__":{}}', JSON.stringify({ ...JSON.parse(bytes.toString()), requiredExtensions: ["org.example.required"] })]) { await importWorkflow(page, Buffer.from(bad)); await expect(studio(page).getByRole("status")).toContainText("Unable to import"); await expect(studio(page)).toHaveAttribute("data-artifact-version", revision!); }
    await page.evaluate(() => { const original = File.prototype.text; File.prototype.text = function() { return new Promise(resolve => { (window as unknown as { finishWorkflowRead: () => void }).finishWorkflowRead = () => { void original.call(this).then(resolve); }; }); }; });
    await importWorkflow(page, bytes); await studio(page).getByLabel("New state id", { exact: true }).fill("newer input"); await page.evaluate(() => (window as unknown as { finishWorkflowRead: () => void }).finishWorkflowRead());
    await expect(studio(page).getByLabel("New state id", { exact: true })).toHaveValue("newer input"); await expect(studio(page).getByRole("dialog", { name: "Replace workflow draft", exact: true })).toHaveCount(0);
  });
  test("quota failure and stale local snapshot preserve revisions; deliberate refresh permits recovery", async ({ page }) => {
    await createTechnical(page);
    await page.evaluate(() => { const original = Storage.prototype.setItem; (window as unknown as { restoreWorkflowStorage: () => void }).restoreWorkflowStorage = () => { Storage.prototype.setItem = original; }; Storage.prototype.setItem = function(k, v) { if (k === "station:workflow-candidates:v1") throw new DOMException("quota", "QuotaExceededError"); original.call(this, k, v); }; });
    await wb(page, "Save new workflow revision").click(); await expect(studio(page).getByRole("status")).toContainText("Unable to save"); await expect(studio(page)).toHaveAttribute("data-artifact-version", "1.0.0");
    await page.evaluate(() => (window as unknown as { restoreWorkflowStorage: () => void }).restoreWorkflowStorage()); await wb(page, "Refresh workflow storage").click(); await wb(page, "Save new workflow revision").click();
    await expect(studio(page)).toHaveAttribute("data-artifact-version", "1.0.1");
    const other = await page.context().newPage(); await createTechnical(other); await wb(other, "Save new workflow revision").click(); const before = await other.evaluate(() => localStorage.getItem("station:workflow-candidates:v1")); await other.close();
    await studio(page).getByLabel("New state id", { exact: true }).fill("review"); await wb(page, "Add state").click(); await wb(page, "Save new workflow revision").click(); await expect(studio(page).getByRole("status")).toContainText("storage-conflict"); expect(await page.evaluate(() => localStorage.getItem("station:workflow-candidates:v1"))).toBe(before);
    await expect(wb(page, "Inspect state review")).toBeVisible(); await wb(page, "Refresh workflow storage").click(); await wb(page, "Save new workflow revision").click(); await expect(studio(page)).toHaveAttribute("data-artifact-version", "1.0.2");
  });
  test("keyboard/narrow and launcher window minimize/restore retain draft; close requires explicit reopen", async ({ page }) => {
    const bytes = await actualCandidate(page); await page.goto("/"); await page.setViewportSize({ width: 390, height: 860 });
    await page.getByRole("button", { name: "Open applications", exact: true }).click(); await page.locator('[data-app-ref="app:workflow-studio"]').click(); await importWorkflow(page, bytes);
    const choose = wb(page, "Select state closed"); await tabTo(page, choose); await choose.press("Enter"); const identity = await tools(page).getAttribute("data-selected-ref");
    await wb(page, "Workflow table").click(); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const win = page.getByRole("dialog", { name: "Workflow Studio", exact: true }); await win.getByRole("button", { name: "Minimize window", exact: true }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Workflow Studio", exact: true }).click(); await expect(tools(page)).toHaveAttribute("data-selected-ref", identity!);
    await win.getByRole("button", { name: "Close window", exact: true }).click(); await page.getByRole("button", { name: "Open applications", exact: true }).click(); await page.locator('[data-app-ref="app:workflow-studio"]').click();
    await expect(studio(page)).toContainText("No workflow is open"); await studio(page).getByLabel("Retained workflow revision", { exact: true }).selectOption("1"); await wb(page, "Open workflow revision").click(); await expect(tools(page)).toHaveAttribute("data-selected-ref", "");
  });
  test("add process preserves existing workflow and its explicit references", async ({ page }) => {
    await createTechnical(page);
    for (const [name, value] of [["Process name", "Review"], ["Process id", "review"], ["Requirement reference", "req:2"]]) await studio(page).getByLabel(name!, { exact: true }).fill(value!);
    await wb(page, "Add process").click(); await expect(studio(page).getByLabel("Workflow process", { exact: true })).toHaveValue("review"); await expect(wb(page, "Inspect state open")).toBeVisible();
    await studio(page).getByLabel("Workflow process", { exact: true }).selectOption("ticket"); await expect(wb(page, "Inspect state open")).toBeVisible(); await wb(page, "Save new workflow revision").click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("station:workflow-candidates:v1")!)); const d = JSON.parse(saved.revisions[1]); expect(d.payload.processes).toHaveLength(2); expect(d.payload.processes[0].requirementRefs).toEqual(["req:1"]); expect(d.payload.processes[1].requirementRefs).toEqual(["req:2"]);
  });
});


test.describe("WP16 actual owner-connected Workflow Studio",()=>{
  let owner:DesignOwnerHarness;
  const studio=(page:Page)=>page.getByRole("region",{name:"Workflow Studio",exact:true});
  const panel=(page:Page)=>studio(page).getByRole("region",{name:"Workflow owner connection",exact:true});
  const button=(page:Page,name:string)=>studio(page).getByRole("button",{name,exact:true});
  const status=(page:Page)=>panel(page).getByTestId("workflow-owner-status");
  test.beforeAll(async()=>{test.setTimeout(120000);owner=await startDesignOwnerHarness("http://127.0.0.1:3100");});
  test.afterAll(async()=>{if(owner)await owner.stop();});
  async function connect(page:Page,credential=owner.token,actor=owner.fields.actorRef){
    if(!await panel(page).isVisible())await studio(page).getByText("Design owner connection",{exact:true}).click();
    for(const [label,value] of [["Owner endpoint",owner.url],["Owner access token",credential],["Owner Core reference",owner.fields.coreRef],["Owner Station reference",owner.fields.stationRef],["Owner session reference",owner.fields.sessionRef],["Owner workspace reference",owner.fields.scopeRef],["Owner actor reference",actor],["Owner actor revision",owner.fields.actorRevisionRef]] as const)await panel(page).getByLabel(label,{exact:true}).fill(value);
    await button(page,"Connect owner").click();
  }
  async function create(page:Page,metadata=false,escaped=0){
    await page.goto("/workflow-studio");await studio(page).getByText("Create workflow or add process",{exact:true}).click();
    for(const [label,value] of [["Process name","Ticket"],["Process id","ticket"],["Analysis reference","analysis:unresolved"],["Recipe reference","recipe:unresolved"],["Requirement reference","req:1"]] as const)await studio(page).getByLabel(label,{exact:true}).fill(value);
    await button(page,"Create workflow").click();
    if(metadata){
      const downloaded=page.waitForEvent("download");await button(page,"Export workflow").click();const download=await downloaded,path=await download.path();expect(path).not.toBeNull();
      const document=JSON.parse((await readFile(path!)).toString());document.extensions={"org.example.metadata":{opaque:["preserve",42],...(escaped?{escaped:"\\".repeat(escaped)}:{})}};document.provenance.operation={note:"preserve"};document.payload.sessionPolicy={lifetimeSeconds:300};document.payload.processes.push({id:"other",name:"Other",requirementRefs:["req:2"],states:["only"]});
      await studio(page).getByLabel("Import workflow file",{exact:true}).setInputFiles({name:"actual.workflow.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(document))});
      await expect(studio(page).locator("pre")).toContainText('"org.example.metadata"');
    }
    await studio(page).getByLabel("New state id",{exact:true}).fill("closed");await button(page,"Add state").click();await expect(button(page,"Select state closed")).toBeVisible();await button(page,"Save new workflow revision").click();
    await expect(studio(page)).toHaveAttribute("data-artifact-version","1.0.1");
    const text=await page.evaluate(()=>{const value=JSON.parse(localStorage.getItem("station:workflow-candidates:v1")!) as {revisions:string[]};return value.revisions.at(-1)!;});
    return{text,document:JSON.parse(text) as DesignCandidateDocument};
  }
  async function read(page:Page,id:string,version:string){
    await panel(page).getByLabel("Owner artifact ID",{exact:true}).fill(id);await panel(page).getByLabel("Owner artifact version",{exact:true}).fill(version);await button(page,"Read exact owner revision").click();
  }
  async function retain(page:Page){await button(page,"Send candidate to owner").click();await expect(status(page)).toContainText("Owner retained exact technical candidate");}
  async function snapshot(page:Page){
    const detail=studio(page).locator("details").filter({has:page.getByText("Complete definition snapshot",{exact:true})});
    if(!await detail.locator("pre").isVisible())await detail.locator("summary").click();
    return JSON.parse((await detail.locator("pre").textContent())!) as DesignCandidateDocument;
  }
  test("actual authored full candidate is retained, owner restarts, fresh browser with empty local store reopens exact data",async({page,browser})=>{
    const candidate=await create(page,true);expect(candidate.document.extensions).toEqual({"org.example.metadata":{opaque:["preserve",42]}});expect(candidate.document.provenance.operation).toEqual({note:"preserve"});await connect(page);await expect(status(page)).toContainText("Owner connected");await retain(page);
    expect(await page.evaluate(()=>JSON.stringify({...localStorage}))).not.toContain(owner.token);
    await owner.restart();
    const context=await browser.newContext({baseURL:"http://127.0.0.1:3100"});try{
      const fresh=await context.newPage();await fresh.goto("/workflow-studio");await expect(studio(fresh)).toContainText("No workflow is open");
      expect(await fresh.evaluate(()=>localStorage.getItem("station:workflow-candidates:v1"))).toBeNull();
      await connect(fresh);await read(fresh,candidate.document.artifactId,candidate.document.artifactVersion);await expect(status(fresh)).toContainText("Exact owner revision verified");
      await button(fresh,"Open owner revision").click();await expect(studio(fresh)).toHaveAttribute("data-artifact-version","1.0.1");
      expect(await snapshot(fresh)).toEqual(candidate.document);await expect(studio(fresh)).toContainText("Upstream references unresolved");await expect(studio(fresh)).toContainText("Clean local candidate");
      await read(fresh,candidate.document.artifactId,"9.0.0");await expect(status(fresh)).toContainText("Exact owner revision absent");await expect(studio(fresh)).toHaveAttribute("data-artifact-version","1.0.1");
    }finally{await context.close();}
  });
  test("real committed response loss stays unknown until durable result recovery; credentials never enter storage",async({page})=>{
    const candidate=await create(page);await connect(page);const before=await page.evaluate(()=>localStorage.getItem("station:workflow-candidates:v1"));
    await page.route(owner.url+"/station/command",async route=>{const response=await route.fetch();expect((await response.json()).value.status).toBe("ACCEPTED");await route.abort("failed");});
    await button(page,"Send candidate to owner").click();await expect(status(page)).toContainText("Owner result unknown");await expect(button(page,"Send candidate to owner")).toBeDisabled();
    expect(await page.evaluate(()=>localStorage.getItem("station:workflow-candidates:v1"))).toBe(before);expect((await snapshot(page)).artifactId).toBe(candidate.document.artifactId);
    await page.unroute(owner.url+"/station/command");await button(page,"Recover owner result").click();await expect(status(page)).toContainText("Owner retained exact technical candidate");
    expect(await snapshot(page)).toEqual(candidate.document);expect(await page.evaluate(()=>JSON.stringify({...localStorage}))).not.toContain(owner.token);
  });
  test("two browser candidates detect changed owner revision without overwriting the other draft",async({page,browser})=>{
    const candidate=await create(page);await connect(page);await retain(page);
    const context=await browser.newContext({baseURL:"http://127.0.0.1:3100"});try{
      const other=await context.newPage();await other.goto("/workflow-studio");await connect(other);await read(other,candidate.document.artifactId,"1.0.1");await expect(status(other)).toContainText("Exact owner revision verified");await button(other,"Open owner revision").click();
      await studio(other).getByLabel("New state id",{exact:true}).fill("waiting");await button(other,"Add state").click();await studio(other).getByLabel("New workflow version",{exact:true}).fill("1.0.3");await button(other,"Save new workflow revision").click();
      const before=await other.evaluate(()=>localStorage.getItem("station:workflow-candidates:v1"));
      await studio(page).getByLabel("New state id",{exact:true}).fill("review");await button(page,"Add state").click();await button(page,"Save new workflow revision").click();await retain(page);
      await button(other,"Send candidate to owner").click();await expect(status(other)).toContainText("Owner revision changed");await expect(studio(other)).toHaveAttribute("data-artifact-version","1.0.3");
      expect(await other.evaluate(()=>localStorage.getItem("station:workflow-candidates:v1"))).toBe(before);
      await read(other,candidate.document.artifactId,"1.0.3");await expect(status(other)).toContainText("Exact owner revision absent");
    }finally{await context.close();}
  });
  test("owner reopen uses dirty and pending-field Cancel/Discard; local draft remains independent",async({page})=>{
    await create(page);await connect(page);await retain(page);
    await studio(page).getByLabel("New state id",{exact:true}).fill("review");await button(page,"Add state").click();await expect(button(page,"Send candidate to owner")).toBeDisabled();
    await button(page,"Open owner revision").click();await expect(studio(page).getByRole("dialog",{name:"Replace workflow draft",exact:true})).toBeVisible();
    await button(page,"Cancel workflow replacement").click();await expect(button(page,"Select state review")).toBeVisible();
    await button(page,"Open owner revision").click();await button(page,"Discard workflow and open").click();await expect(button(page,"Select state review")).toHaveCount(0);
    await studio(page).getByLabel("New state id",{exact:true}).fill("pending");await button(page,"Open owner revision").click();await button(page,"Cancel workflow replacement").click();
    await expect(studio(page).getByLabel("New state id",{exact:true})).toHaveValue("pending");await button(page,"Reset pending fields").click();await expect(studio(page)).toContainText("Clean local candidate");
  });
  test("denied identity and owner outage preserve candidate; explicit reconnect resumes actual retention",async({page})=>{
    const candidate=await create(page);await connect(page,"wrong-token");await expect(status(page)).toContainText("Cannot connect");await expect(button(page,"Send candidate to owner")).toBeDisabled();
    await connect(page,owner.token,"actor:forged");await expect(status(page)).toContainText("Owner connected");await button(page,"Send candidate to owner").click();await expect(status(page)).toContainText("Owner rejected");
    await button(page,"Disconnect owner").click();await button(page,"Reset owner connection").click();await connect(page);
    const before=await page.evaluate(()=>localStorage.getItem("station:workflow-candidates:v1"));await owner.stopOwner();
    try{await button(page,"Send candidate to owner").click();await expect(status(page)).toContainText("Owner head unavailable");expect(await page.evaluate(()=>localStorage.getItem("station:workflow-candidates:v1"))).toBe(before);}
    finally{await owner.restart();}
    await button(page,"Disconnect owner").click();await button(page,"Connect owner").click();await expect(status(page)).toContainText("Owner connected");await retain(page);expect(await snapshot(page)).toEqual(candidate.document);
  });
  test("late actual owner read is ignored after local draft generation changes",async({page})=>{
    const candidate=await create(page);await connect(page);await retain(page);
    let release!:()=>void,ready!:()=>void;const held=new Promise<void>(resolve=>release=resolve),started=new Promise<void>(resolve=>ready=resolve);
    await page.route(owner.url+"/station/query",async route=>{const input=route.request().postDataJSON() as {parameters:{operation:string}};if(input.parameters.operation!=="exact"){await route.continue();return;}const response=await route.fetch();ready();await held;await route.fulfill({response});});
    await button(page,"Read exact owner revision").click();await started;
    await studio(page).getByLabel("New state id",{exact:true}).fill("late");await button(page,"Add state").click();release();
    await expect(status(page)).toContainText("Response not applied");await expect(button(page,"Select state late")).toBeVisible();await expect(studio(page)).toHaveAttribute("data-artifact-version",candidate.document.artifactVersion);await expect(studio(page)).toContainText("Unsaved workflow changes");
  });
  test("configured connection remains keyboard accessible and fits narrow viewport",async({page})=>{
    await create(page);await page.setViewportSize({width:390,height:860});
    await studio(page).getByText("Design owner connection",{exact:true}).click();
    for(const [label,value] of [["Owner endpoint",owner.url],["Owner access token",owner.token],["Owner Core reference",owner.fields.coreRef],["Owner Station reference",owner.fields.stationRef],["Owner session reference",owner.fields.sessionRef],["Owner workspace reference",owner.fields.scopeRef],["Owner actor reference",owner.fields.actorRef],["Owner actor revision",owner.fields.actorRevisionRef]] as const)await panel(page).getByLabel(label,{exact:true}).fill(value);
    await tabTo(page,button(page,"Connect owner"));await button(page,"Connect owner").press("Enter");await expect(status(page)).toContainText("Owner connected");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await tabTo(page,button(page,"Disconnect owner"));await button(page,"Disconnect owner").press("Enter");await expect(status(page)).toContainText("Owner disconnected");
  });
  test("large escaped metadata uses native SDK default and returns exact complete owner document",async({page} )=>{
    const candidate=await create(page,true,300000);await connect(page);await expect(status(page)).toContainText("Owner connected");await retain(page);
    expect(new TextEncoder().encode(candidate.text).length).toBeLessThan(1048576);
    expect(new TextEncoder().encode(JSON.stringify({record:{text:candidate.text}})).length).toBeGreaterThan(1048576+65536);
    await button(page,"Read exact owner revision").click();await expect(status(page)).toContainText("Exact owner revision verified");await button(page,"Open owner revision").click();
    expect((await snapshot(page)).extensions).toEqual(candidate.document.extensions);await expect(studio(page)).toContainText("Clean local candidate");
  });

});

test.describe("Studios WP01 shared foundation", () => {
  let owner: DesignOwnerHarness;
  const foundation = (page: Page) => page.getByRole("region", { name: "Studio foundation", exact: true });
  const workflow = (page: Page) => page.getByRole("region", { name: "Workflow Studio", exact: true });
  const context = (page: Page) => page.getByRole("region", { name: "Process context", exact: true });
  const inspector = (page: Page) => page.getByRole("complementary", { name: "Shared Studio Inspector", exact: true });
  const nav = (page: Page, name: string) => page.getByRole("navigation", { name: "Studio areas", exact: true }).getByRole("button", { name, exact: true });
  const wb = (page: Page, name: string) => workflow(page).getByRole("button", { name, exact: true });
  test.beforeAll(async () => { test.setTimeout(120000); owner = await startDesignOwnerHarness("http://127.0.0.1:3100"); });
  test.afterAll(async () => { if (owner) await owner.stop(); });
  async function createWorkflowInArea(page: Page) {
    await nav(page, "Workflow").click();
    await workflow(page).getByText("Create workflow or add process", { exact: true }).click();
    for (const [label, value] of [["Process name", "Shared Ticket"], ["Process id", "ticket"], ["Analysis reference", "analysis:unresolved"], ["Recipe reference", "recipe:unresolved"], ["Requirement reference", "req:shared"]] as const) await workflow(page).getByLabel(label, { exact: true }).fill(value);
    await wb(page, "Create workflow").click();
    await expect(workflow(page)).toHaveAttribute("data-artifact-version", "1.0.0");
  }
  async function connectShared(page: Page, token = owner.token) {
    await workflow(page).getByText("Design owner connection", { exact: true }).click();
    const panel = workflow(page).getByRole("region", { name: "Workflow owner connection", exact: true });
    for (const [label, value] of [["Owner endpoint", owner.url], ["Owner access token", token], ["Owner Core reference", owner.fields.coreRef], ["Owner Station reference", owner.fields.stationRef], ["Owner session reference", owner.fields.sessionRef], ["Owner workspace reference", owner.fields.scopeRef], ["Owner actor reference", owner.fields.actorRef], ["Owner actor revision", owner.fields.actorRevisionRef]] as const) await panel.getByLabel(label, { exact: true }).fill(value);
    await wb(page, "Connect owner").click(); return panel;
  }
  test("two actual areas preserve draft, pending fields and qualified selection with independent Inspector", async ({ page }) => {
    await page.goto("/studios");
    await context(page).getByText("Create context from references", { exact: true }).click();
    await context(page).getByLabel("Context title", { exact: true }).fill("Context pending independently");
    await createWorkflowInArea(page);
    await workflow(page).getByLabel("New state id", { exact: true }).fill("review"); await wb(page, "Add state").click();
    await wb(page, "Select state review").click();
    const selected = await workflow(page).getByRole("region", { name: "Workflow Tools", exact: true }).getAttribute("data-selected-ref");
    await expect(inspector(page).locator('[data-property-id="selection"]')).toContainText(selected!);
    await workflow(page).getByLabel("New state id", { exact: true }).fill("pending-state");
    await expect(inspector(page)).toContainText("Unsaved changes or pending fields");
    await nav(page, "Process Context").click();
    await expect(workflow(page)).toHaveCount(0);
    await expect(context(page).getByLabel("Context title", { exact: true })).toHaveValue("Context pending independently");
    await expect(inspector(page)).toContainText("ProcessContext");
    await expect(inspector(page).locator('[data-property-id="selection"]')).toContainText("None");
    await expect(inspector(page)).not.toContainText("technical-process:ticket");
    await nav(page, "Workflow").click();
    await expect(wb(page, "Select state review")).toBeVisible();
    await expect(workflow(page).getByLabel("New state id", { exact: true })).toHaveValue("pending-state");
    await expect(inspector(page).locator('[data-property-id="selection"]')).toContainText(selected!);
    await expect(inspector(page)).toContainText("technical-process:ticket");
    await expect(inspector(page).locator('[data-property-row], [data-slot="property-row"]').first()).toHaveAttribute("data-read-only", "true");
  });
  test("retained reference context stays separate from technical process identity", async ({ page }) => {
    // Actual context creator/codec produces the reference artifact; no hand-authored downstream context.
    await page.goto("/process-context");
    await context(page).getByText("Create context from references", { exact: true }).click();
    for (const [label, value] of [["Context title", "Shared process"], ["Process identity", "process:shared"], ["Process revision identity", "revision:shared:1"]] as const) await context(page).getByLabel(label, { exact: true }).fill(value);
    await context(page).getByRole("button", { name: "Create context", exact: true }).click();
    await expect(context(page)).toContainText("process:shared");
    await context(page).getByRole("button", { name: "Save context locally", exact: true }).click();
    await page.goto("/studios"); await context(page).getByRole("button", { name: "Open retained context", exact: true }).click();
    await expect(inspector(page)).toContainText("process:shared @ revision:shared:1");
    await expect(context(page).getByTestId("process-owner-status")).toContainText("unavailable");
    await createWorkflowInArea(page); await expect(inspector(page)).toContainText("technical-process:ticket");
    await nav(page, "Process Context").click(); await expect(inspector(page)).toContainText("process:shared @ revision:shared:1");
    await expect(inspector(page)).not.toContainText("technical-process:ticket");
  });
  test("actual owner retention, denied credential and outage preserve model across area navigation", async ({ page }) => {
    await page.goto("/studios"); await createWorkflowInArea(page);
    const panel = await connectShared(page, "wrong-token");
    await expect(panel.getByTestId("workflow-owner-status")).toContainText("Cannot connect");
    await expect(wb(page, "Send candidate to owner")).toBeDisabled();
    await panel.getByLabel("Owner access token", { exact: true }).fill(owner.token); await wb(page, "Connect owner").click();
    await expect(panel.getByTestId("workflow-owner-status")).toContainText("Owner connected");
    await wb(page, "Send candidate to owner").click(); await expect(panel.getByTestId("workflow-owner-status")).toContainText("Readback verified");
    const artifact = await panel.getByLabel("Owner artifact ID", { exact: true }).inputValue();
    await nav(page, "Process Context").click(); await expect(inspector(page)).not.toContainText(artifact);
    await nav(page, "Workflow").click(); await expect(panel.getByTestId("workflow-owner-status")).toContainText("Readback verified");
    await owner.stopOwner();
    try { await wb(page, "Read exact owner revision").click(); await expect(panel.getByTestId("workflow-owner-status")).toContainText("unavailable"); await expect(workflow(page)).toHaveAttribute("data-artifact-version", "1.0.0"); }
    finally { await owner.restart(); }
    await wb(page, "Disconnect owner").click(); await wb(page, "Connect owner").click();
    await expect(panel.getByTestId("workflow-owner-status")).toContainText("Owner connected");
    await wb(page, "Read exact owner revision").click(); await expect(panel.getByTestId("workflow-owner-status")).toContainText("Exact owner revision verified");
    await expect(inspector(page)).not.toContainText(owner.token);
    expect(await page.evaluate(() => Object.values(localStorage).join("")).then(text => text.includes(owner.token))).toBe(false);
  });
  test("keyboard narrow navigation and singleton window minimize restore preserve pending draft", async ({ page }) => {
    await page.goto("/"); await page.getByRole("button", { name: "Open applications", exact: true }).click(); await page.locator('[data-app-ref="app:studios"]').click();
    await page.setViewportSize({ width: 390, height: 860 });
    await tabTo(page, nav(page, "Workflow")); await nav(page, "Workflow").press("Enter");
    await workflow(page).getByText("Create workflow or add process", { exact: true }).click();
    await workflow(page).getByLabel("Process name", { exact: true }).fill("Unapplied form");
    await tabTo(page, nav(page, "Process Context")); await nav(page, "Process Context").press("Enter");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await nav(page, "Workflow").click();
    const win = page.getByRole("dialog", { name: "Studios", exact: true });
    await win.getByRole("button", { name: "Minimize window", exact: true }).click();
    await page.locator('[data-slot="taskbar-windows"]').getByRole("button", { name: "Studios", exact: true }).click();
    await expect(workflow(page).getByLabel("Process name", { exact: true })).toHaveValue("Unapplied form");
    await expect(foundation(page)).toHaveAttribute("data-active-area", "workflow");
    await win.getByRole("button", { name: "Close window", exact: true }).click();
    await page.getByRole("button", { name: "Open applications", exact: true }).click(); await page.locator('[data-app-ref="app:studios"]').click();
    await nav(page, "Workflow").click(); await workflow(page).getByText("Create workflow or add process", { exact: true }).click();
    await expect(workflow(page).getByLabel("Process name", { exact: true })).toHaveValue("");
  });
});


test.describe("Studios WP02 shared icons", () => {
  const workspace = (page: Page) => page.getByRole("region", { name: "Artifact workspace", exact: true });
  async function launchFiles(page: Page) {
    await page.goto("/");
    await page.getByRole("button", { name: "Open applications", exact: true }).click();
    const app = page.locator('[data-app-ref="app:file-manager"]');
    await expect(app.locator('[data-icon-token="workspace.folder-open"]')).toHaveAttribute("aria-hidden", "true");
    await app.click();
    await expect(workspace(page).getByRole("status")).toHaveText("Workspace refreshed.");
  }
  test("actual editor-produced file keeps selection, Inspector and pending name across icon/list views", async ({ page }, testInfo) => {
    await editor(page).getByLabel("Workspace copy name", { exact: true }).fill("icons-demo.composition.json");
    await editor(page).getByRole("button", { name: "Save to workspace", exact: true }).click();
    await expect(editor(page).getByRole("status")).toContainText("Workspace copy saved");
    await launchFiles(page);
    const ws = workspace(page), file = ws.getByRole("button", { name: "icons-demo.composition.json", exact: true });
    await expect(ws).toHaveAttribute("data-content-view", "grid");
    await expect(file.locator('[data-icon-token="artifact.composition"]')).toHaveAttribute("aria-hidden", "true");
    await file.click();
    await ws.getByLabel("New folder name", { exact: true }).fill("Pending folder");
    const retained = await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"));
    await ws.getByRole("button", { name: "List view", exact: true }).click();
    await expect(ws).toHaveAttribute("data-content-view", "list");
    await expect(file).toHaveAttribute("aria-pressed", "true");
    await expect(ws.getByRole("complementary", { name: "File Inspector", exact: true })).toContainText("Composition");
    await expect(ws.getByLabel("New folder name", { exact: true })).toHaveValue("Pending folder");
    await ws.getByRole("button", { name: "Icon view", exact: true }).click();
    await expect(ws).toHaveAttribute("data-content-view", "grid");
    await expect(file).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBe(retained);
    await page.screenshot({ path: testInfo.outputPath("wp02-file-manager-shared-icons.png"), fullPage: true });
  });
  test("folder icons preserve keyboard navigation and view mode on a narrow viewport", async ({ page }) => {
    await launchFiles(page);
    const ws = workspace(page);
    await ws.getByLabel("New folder name", { exact: true }).fill("Design");
    await ws.getByRole("button", { name: "Create folder", exact: true }).click();
    const folder = ws.getByRole("button", { name: "Folder: Design", exact: true });
    await expect(folder.locator('[data-icon-token="workspace.folder"]')).toHaveAttribute("aria-hidden", "true");
    await tabTo(page, folder); await folder.press("Enter");
    await expect(ws.getByLabel("Current workspace folder", { exact: true })).toHaveText("Workspace / Design");
    await ws.getByRole("button", { name: "List view", exact: true }).click();
    await ws.getByLabel("New folder name", { exact: true }).fill("Still pending");
    await page.setViewportSize({ width: 390, height: 860 });
    const up = ws.getByRole("button", { name: "Up one folder", exact: true });
    await tabTo(page, up); await up.press("Enter");
    await expect(ws.getByLabel("Current workspace folder", { exact: true })).toHaveText("Workspace");
    await expect(ws).toHaveAttribute("data-content-view", "list");
    await expect(ws.getByLabel("New folder name", { exact: true })).toHaveValue("Still pending");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
  test("shared Studio area icons retain accessible names and pending workflow form", async ({ page }) => {
    await page.goto("/studios");
    const nav = page.getByRole("navigation", { name: "Studio areas", exact: true });
    const workflow = nav.getByRole("button", { name: "Workflow", exact: true });
    const context = nav.getByRole("button", { name: "Process Context", exact: true });
    await expect(workflow.locator('[data-icon-token="studio.workflow"]')).toHaveAttribute("aria-hidden", "true");
    await expect(context.locator('[data-icon-token="studio.process-context"]')).toHaveAttribute("aria-hidden", "true");
    await workflow.click();
    await page.getByText("Create workflow or add process", { exact: true }).click();
    await page.getByLabel("Process name", { exact: true }).fill("Unapplied icon proof");
    await tabTo(page, context); await context.press("Enter");
    await tabTo(page, workflow); await workflow.press("Enter");
    await expect(page.getByLabel("Process name", { exact: true })).toHaveValue("Unapplied icon proof");
    await expect(workflow).toHaveAttribute("aria-pressed", "true");
  });
});

test("insertable palette searches actual registry without claiming source-only components", async ({ page }) => {
  const search = page.getByRole("searchbox", { name: "Search insertable components" });
  await search.fill("button");
  await expect(page.getByLabel("Component to add")).toContainText("Button");
  await search.fill("data-table");
  await expect(page.getByLabel("Component to add").locator("option")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Add component" })).toBeDisabled();
  await search.clear();
  await expect(page.getByLabel("Component to add").locator("option").first()).toBeAttached();
});

 test("filtered palette resolves selection and inserts using the existing editor", async ({ page }) => {
  await page.getByRole("searchbox", { name: "Search insertable components" }).fill("button");
  await expect(page.getByLabel("Component to add")).toHaveValue("component:button");
  const count = await page.getByRole("treeitem").count();
  await page.getByRole("button", { name: "Add component", exact: true }).click();
  await expect(page.getByRole("treeitem")).toHaveCount(count + 1);
  await expect(page.getByTestId("draft-state")).toHaveText("Unsaved changes");
});

 test("shared Card category supports actual insert, span Inspector, nested content and fresh file reopen", async ({ page, browser }, testInfo) => {
  await page.getByLabel("Composition", { exact: true }).selectOption("composition:action-panel");
  const search = page.getByRole("searchbox", { name: "Search insertable components" });
  await search.fill("Display");
  await expect(page.getByLabel("Component to add")).toHaveValue("component:card");
  await page.getByRole("button", { name: "Add component", exact: true }).click();
  await span(page, "8", "4");
  const card = page.getByRole("group", { name: "Card 3 preview", exact: true });
  await expect(card).toHaveAttribute("data-slot", "card");
  await expect(card).toHaveAttribute("data-column-span", "8");
  await expect(card).toHaveAttribute("data-row-span", "4");
  await page.getByLabel("Container", { exact: true }).selectOption("node:added-3");
  await search.fill("Actions");
  await page.getByRole("button", { name: "Add component", exact: true }).click();
  await expect(card.locator('[data-node-ref="node:added-4"]')).toHaveAttribute("data-slot-ref", "content");
  const bytes = await downloadedComposition(page);
  expect(JSON.parse(bytes.toString()).schema.version).toBe("2.0.0");
  const context = await browser.newContext();
  try {
    const other = await context.newPage(); await other.goto("/component-editor");
    await other.getByLabel("Composition file", { exact: true }).setInputFiles({ name: "foundation-card.json", mimeType: "application/json", buffer: bytes });
    const reopened = other.getByRole("group", { name: "Card 3 preview", exact: true });
    await expect(reopened).toHaveAttribute("data-slot", "card");
    await expect(reopened).toHaveAttribute("data-column-span", "8");
    await expect(reopened).toHaveAttribute("data-row-span", "4");
    await expect(reopened.locator('[data-slot="card-content"] button[data-slot="button"]')).toHaveText("Button 4");
    await other.getByRole("treeitem", { name: "Card 3", exact: true }).click();
    await expect(other.getByLabel("Columns", { exact: true })).toHaveValue("8");
    await expect(other.getByLabel("Rows", { exact: true })).toHaveValue("4");
    await other.setViewportSize({ width: 390, height: 860 });
    const action = preview(other, "Primary action").locator('button[data-slot="button"]');
    expect(await action.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(90);
    await expect(action.locator("span")).toHaveText("Primary action");
    await expect(reopened).toHaveAttribute("data-column-span", "8");
    expect(await other.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await other.screenshot({ path: testInfo.outputPath("foundation-card-fresh-reopen.png"), fullPage: true });
  } finally { await context.close(); }
});
