import { test, expect } from "@playwright/test";

test("Station M1 remains presentation-only through the primary browser journey", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('main[data-station-core="disconnected"]')).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Welcome" })).toBeVisible();

  await page.keyboard.press("Control+Space");
  await expect(page.getByRole("region", { name: "Launcher" })).toBeVisible();
  await page.getByRole("button", { name: /Component Lab/ }).click();
  await expect(page.getByRole("dialog", { name: "Component Lab" })).toBeVisible();

  await page.keyboard.press("Control+,");
  const settings = page.getByRole("dialog", { name: "Settings" });
  await expect(settings).toBeVisible();
  await expect(settings.getByText(/never mutate Core truth/i)).toBeVisible();

  await page.keyboard.press("Alt+Tab");
  await expect(page.locator('[data-slot="window-frame"][data-window-focused="true"]')).toHaveCount(1);

  await settings.getByRole("button", { name: "Theme: system" }).click();
  await expect(settings.getByRole("button", { name: "Theme: light" })).toBeVisible();

  await settings.getByRole("button", { name: "Minimize window" }).click();
  const settingsTask = page.locator('[data-slot="taskbar-windows"] button').filter({ hasText: "Settings" });
  await expect(settingsTask).toHaveAttribute("data-window-lifecycle", "MINIMIZED");
  await settingsTask.click();
  await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();

  await page.reload();
  const restoredSettings = page.getByRole("dialog", { name: "Settings" });
  await expect(restoredSettings).toBeVisible();
  await expect(restoredSettings.getByRole("button", { name: "Theme: light" })).toBeVisible();

  await restoredSettings.getByRole("button", { name: "Reset presentation & layout" }).click();
  await expect(page.getByRole("dialog", { name: "Welcome" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Settings" })).toHaveCount(0);

  await page.keyboard.press("Control+k");
  await expect(page.locator('main[data-station-core="disconnected"]')).toBeVisible();
});
