import { test, expect } from "@playwright/test";

test("File Manager shared fields and compact view commands preserve local state", async ({ page }, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:file-manager"]').click();
  const win = page.getByRole("dialog", { name: "File Manager", exact: true });
  await win.getByRole("button", { name: "Maximize window", exact: true }).click();
  const ws = win.getByRole("region", { name: "Artifact workspace", exact: true });
  await expect(ws.getByRole("status")).toHaveText("Workspace refreshed.");
  const up = ws.getByRole("button", { name: "Up one folder", exact: true });
  await expect(up).toBeDisabled();
  const name = ws.getByLabel("New folder name", { exact: true });
  await expect(name).toHaveAttribute("data-slot", "input");
  await name.fill("Design");
  await ws.getByRole("button", { name: "Create folder", exact: true }).click();
  await expect(ws.getByRole("button", { name: "Folder: Design", exact: true })).toBeVisible();
  await name.fill("Pending folder");
  const stored = await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"));
  const group = ws.getByRole("group", { name: "Folder view", exact: true });
  const icons = group.getByRole("button", { name: "Icon view", exact: true });
  const list = group.getByRole("button", { name: "List view", exact: true });
  await expect(icons).toHaveText(""); await expect(list).toHaveText("");
  await expect(icons.locator('svg[data-icon-token="view.grid"]')).toHaveAttribute("aria-hidden", "true");
  await icons.hover();
  const tooltip = ws.getByRole("tooltip", { name: "Icon view", exact: true });
  await expect(tooltip).toBeVisible();
  await page.keyboard.press("Escape"); await expect(tooltip).not.toBeVisible();
  await icons.focus(); await page.keyboard.press("Tab");
  await expect(list).toBeFocused();
  const help = ws.getByRole("tooltip", { name: "List view", exact: true });
  await expect(help).toBeVisible();
  const id = await help.getAttribute("id");
  expect(id).toBeTruthy(); await expect(list).toHaveAttribute("aria-describedby", id!);
  await page.keyboard.press("Escape"); await expect(help).not.toBeVisible();
  await list.press("Enter");
  await expect(ws).toHaveAttribute("data-content-view", "list");
  await expect(list).toHaveAttribute("aria-pressed", "true");
  await expect(icons).toHaveAttribute("aria-pressed", "false");
  await expect(name).toHaveValue("Pending folder");
  expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBe(stored);
  await icons.press("Space"); await expect(ws).toHaveAttribute("data-content-view", "grid");
  await info.attach("file-manager-g-wide", { body: await ws.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await page.setViewportSize({ width: 390, height: 860 });
  await expect(name).toHaveValue("Pending folder");
  const workspaceBox = await ws.boundingBox(); expect(workspaceBox).not.toBeNull();
  for (const label of ["Refresh workspace", "Import composition"]) {
    const command = ws.getByRole("button", { name: label, exact: true });
    const commandBox = await command.boundingBox(); expect(commandBox).not.toBeNull();
    expect(commandBox!.x).toBeGreaterThanOrEqual(workspaceBox!.x);
    expect(commandBox!.x + commandBox!.width).toBeLessThanOrEqual(workspaceBox!.x + workspaceBox!.width);
  }
  const box = await group.boundingBox(); expect(box).not.toBeNull(); expect(box!.width).toBeLessThan(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await info.attach("file-manager-g-narrow", { body: await ws.screenshot({ animations: "disabled" }), contentType: "image/png" });
  await ws.getByRole("button", { name: "Folder: Design", exact: true }).press("Enter");
  await expect(ws.getByLabel("Current workspace folder", { exact: true })).toHaveText("Workspace / Design");
  await expect(up).toBeEnabled(); await up.press("Enter");
  await expect(ws.getByLabel("Current workspace folder", { exact: true })).toHaveText("Workspace");
});


test("long actual workspace filenames fit grid and list with full-name access", async ({ page }, info) => {
  const filename = "report-" + "a".repeat(56) + ".composition.json";
  await page.goto("/component-editor");
  const editor = page.getByRole("region", { name: "Composition editor", exact: true });
  const before = await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"));
  await editor.getByLabel("Workspace copy name", { exact: true }).fill("report-" + "a".repeat(57) + ".composition.json");
  await editor.getByRole("button", { name: "Save to workspace", exact: true }).click();
  await expect(editor.getByRole("status")).toContainText("Unable to save the copy");
  expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBe(before);
  await editor.getByLabel("Workspace copy name", { exact: true }).fill(filename);
  await editor.getByRole("button", { name: "Save to workspace", exact: true }).click();
  await expect(editor.getByRole("status")).toContainText("Workspace copy saved");
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:file-manager"]').click();
  const win = page.getByRole("dialog", { name: "File Manager", exact: true });
  await win.getByRole("button", { name: "Maximize window", exact: true }).click();
  const ws = win.getByRole("region", { name: "Artifact workspace", exact: true });
  const file = ws.getByRole("button", { name: filename, exact: true });
  await expect(file).toHaveAttribute("title", filename);
  const retained = await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 860 });
    for (const mode of ["Icon view", "List view"]) {
      await ws.getByRole("button", { name: mode, exact: true }).press("Enter");
      await file.press("Enter");
      await expect(file).toHaveAttribute("aria-pressed", "true");
      await expect(ws.getByRole("complementary", { name: "File Inspector", exact: true })).toContainText(filename);
      const button = await file.boundingBox(), label = await file.locator('[data-slot="workspace-item-label"]').boundingBox();
      expect(button).not.toBeNull(); expect(label).not.toBeNull();
      expect(label!.x).toBeGreaterThanOrEqual(button!.x);
      expect(label!.x + label!.width).toBeLessThanOrEqual(button!.x + button!.width);
      expect(await page.evaluate(() => localStorage.getItem("station:artifact-workspace:v1"))).toBe(retained);
    }
    await info.attach(`file-manager-long-name-${width}`, { body: await ws.screenshot({ animations: "disabled" }), contentType: "image/png" });
  }
});
