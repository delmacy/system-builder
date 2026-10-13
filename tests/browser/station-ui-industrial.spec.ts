import { test, expect, type Page } from "@playwright/test";
async function openIndustrial(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  await win.getByRole("button", { name: "Maximize window", exact: true }).click();
  await win.getByRole("tab", { name: "Industrial" }).click();
  const lab = win.getByRole("region", { name: "Industrial toolbar foundation" });
  await expect(lab).toBeVisible();
  return lab;
}
test("industrial toolbar uses semantic icons, keyboard commands and exclusive modes", async ({ page }) => {
  const lab = await openIndustrial(page);
  const save = lab.getByRole("button", { name: "Save", exact: true });
  await save.focus(); await page.keyboard.press("Enter");
  await expect(lab.getByRole("status", { name: "Industrial component demo status" })).toContainText("Saved locally");
  await expect(save.locator('svg[data-icon-token="file.save"]')).toHaveCount(1);
  const undo = lab.getByRole("button", { name: "Undo", exact: true });
  await undo.focus(); await page.keyboard.press("Enter");
  await expect(lab.getByRole("status", { name: "Industrial component demo status" })).toContainText("Unsaved demo");
  const right = lab.getByRole("button", { name: "Align right", exact: true });
  await right.focus(); await page.keyboard.press("Space");
  await expect(right).toHaveAttribute("aria-pressed", "true");
  await expect(lab.getByRole("button", { name: "Align left", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(lab.getByRole("button", { name: "Align center", exact: true })).toHaveAttribute("aria-pressed", "false");
});
test("workstation controls retain live state in compact dark mode and tab switch", async ({ page }, info) => {
  const lab = await openIndustrial(page);
  await lab.getByRole("button", { name: "Assets", exact: true }).click();
  await expect(lab.getByRole("button", { name: "Assets", exact: true })).toHaveAttribute("aria-current", "page");
  await lab.getByRole("searchbox", { name: "Search workstation controls" }).fill("toolbar");
  await lab.getByRole("combobox", { name: "Workstation density" }).selectOption("comfortable");
  await page.getByRole("dialog", { name: "Component Lab", exact: true }).getByRole("tab", { name: "Foundations" }).click();
  const visual = page.getByRole("region", { name: "Visual foundation reference", exact: true });
  await visual.getByLabel("Reference theme", { exact: true }).selectOption("dark");
  await visual.getByLabel("Reference density", { exact: true }).selectOption("compact");
  await page.getByRole("dialog", { name: "Component Lab", exact: true }).getByRole("tab", { name: "Industrial" }).click();
  await page.setViewportSize({ width: 480, height: 860 });
  await expect(lab.getByRole("searchbox", { name: "Search workstation controls" })).toHaveValue("toolbar");
  await expect(lab.getByRole("combobox", { name: "Workstation density" })).toHaveValue("comfortable");
  await info.attach("industrial-dark-compact", { body: await lab.screenshot({ animations: "disabled" }), contentType: "image/png" });
});

test("Construction D split pane enforces bounds and accessible keyboard divider", async ({ page }) => {
  const lab = await openIndustrial(page);
  const divider = lab.getByRole("separator", { name: "Document panel split divider" });
  await expect(divider).toHaveAttribute("aria-valuenow", "45");
  await divider.focus();
  await divider.press("End");
  await expect(lab.getByLabel("Split ratio")).toContainText("85%");
  await divider.press("ArrowRight");
  await expect(lab.getByLabel("Split ratio")).toContainText("85%");
  await divider.press("Home");
  await expect(lab.getByLabel("Split ratio")).toContainText("15%");
  await divider.press("ArrowRight");
  await expect(lab.getByLabel("Split ratio")).toContainText("17%");
});

test("Construction D dock and filter retain controlled states at narrow viewport", async ({ page }) => {
  const lab = await openIndustrial(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const docks = lab.getByRole("region", { name: "Workspace docks" });
  await docks.getByRole("button", { name: "Layers" }).click();
  await expect(docks.getByRole("region", { name: "Layers panel" })).toContainText("Layer hierarchy");
  const filters = lab.getByRole("toolbar", { name: "Document workspace" });
  await filters.getByRole("searchbox", { name: "Document workspace search" }).fill("layer");
  const active = filters.getByRole("button", { name: "Active items" });
  await active.click();
  await expect(active).toHaveAttribute("aria-pressed", "true");
  await expect(filters.getByRole("searchbox", { name: "Document workspace search" })).toHaveValue("layer");
});

test("Construction D real Studio geometry is adjustable without replacing workbench identity", async ({ page }) => {
  await page.goto("/studios");
  const preview = page.getByRole("region", { name: "Studio workstation layout preview" });
  const divider = preview.getByRole("separator", { name: "Studio context preview split divider" });
  await expect(preview.getByLabel("Studio split ratio")).toContainText("68%");
  await divider.focus();
  await divider.press("Home");
  await expect(preview.getByLabel("Studio split ratio")).toContainText("15%");
  await divider.press("End");
  await expect(preview.getByLabel("Studio split ratio")).toContainText("85%");
  const nav = page.getByRole("tree", { name: "Installed Studio navigation" });
  await nav.getByRole("treeitem", { name: "Workflow" }).click();
  await expect(preview).toContainText("Workflow");
  await expect(preview.getByLabel("Studio split ratio")).toContainText("85%");
});
