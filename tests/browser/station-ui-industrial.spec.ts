import { test, expect, type Page } from "@playwright/test";
async function openIndustrial(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  await win.getByRole("button", { name: "Maximize window", exact: true }).click();
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
  const visual = page.getByRole("region", { name: "Visual foundation reference", exact: true });
  await visual.getByLabel("Reference theme", { exact: true }).selectOption("dark");
  await visual.getByLabel("Reference density", { exact: true }).selectOption("compact");
  await page.setViewportSize({ width: 480, height: 860 });
  await expect(lab.getByRole("searchbox", { name: "Search workstation controls" })).toHaveValue("toolbar");
  await expect(lab.getByRole("combobox", { name: "Workstation density" })).toHaveValue("comfortable");
  await info.attach("industrial-dark-compact", { body: await lab.screenshot({ animations: "disabled" }), contentType: "image/png" });
});

test("compact semantic buttons expose labels on hover and keyboard, and reveal them on expansion", async ({ page }) => {
  const lab = await openIndustrial(page);
  const compact = lab.getByRole("button", { name: "Compact save", exact: true });
  await expect(compact).toHaveAttribute("data-label-visible", "false");
  await expect(compact).not.toContainText("Compact save");
  await compact.hover();
  await expect(page.getByRole("tooltip", { name: "Compact save", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip", { name: "Compact save", exact: true })).toHaveCount(0);
  await page.mouse.move(0, 0); await page.keyboard.press("Tab"); await compact.focus();
  await expect(page.getByRole("tooltip", { name: "Compact save", exact: true })).toBeVisible();
  await compact.press("Enter");
  await expect(lab.getByTestId("presentation-actions")).toHaveText("1 presentation actions");
  const expand = lab.getByRole("button", { name: "Expand tools", exact: true });
  await expand.click(); await expect(expand).toHaveAttribute("aria-expanded", "true");
  await expect(expand).toBeFocused();
  await expect(expand).toContainText("Expand tools");
  await expand.press("Space"); await expect(expand).toHaveAttribute("aria-expanded", "false");
  await expect(expand).toBeFocused();
  await expect(expand).not.toContainText("Expand tools");
  await expect(lab.getByRole("button", { name: "Unavailable action", exact: true })).toBeDisabled();
});
