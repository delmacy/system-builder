import { test, expect, type Page } from "@playwright/test";

async function openLab(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  await win.getByRole("button", { name: "Maximize window", exact: true }).click();
  const lab = page.getByRole("region", { name: "Overlay foundation reference", exact: true });
  await expect(lab).toBeVisible();
  return lab;
}

test("modal traps focus, nested Escape preserves parent and returns both trigger focuses", async ({ page }) => {
  const lab = await openLab(page);
  const trigger = lab.getByRole("button", { name: "Open reference dialog", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Reference dialog", exact: true });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close reference dialog", exact: true }).focus();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  const nestedTrigger = dialog.getByRole("button", { name: "Open nested dialog", exact: true });
  await nestedTrigger.click();
  await expect(page.getByRole("dialog", { name: "Nested reference dialog", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Nested reference dialog", exact: true })).not.toBeVisible();
  await expect(dialog).toBeVisible(); await expect(nestedTrigger).toBeFocused();
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
  await expect(lab.getByLabel("Overlay reference state")).toContainText("Dialog: closed");
});

test("alert requires explicit action; popover dismisses outside and tooltip works on focus", async ({ page }) => {
  const lab = await openLab(page);
  await lab.getByRole("button", { name: "Open confirmation reference" }).click();
  const alert = page.getByRole("alertdialog", { name: "Confirm reference action", exact: true });
  await expect(alert).toBeVisible();
  await page.locator('[data-slot="alert-dialog-backdrop"]').click({ position: { x: 5, y: 5 } });
  await expect(alert).toBeVisible();
  await alert.getByRole("button", { name: "Cancel reference action" }).click();
  await expect(lab.getByLabel("Overlay reference state")).toContainText("Confirmations: 0");
  await lab.getByRole("button", { name: "Open confirmation reference" }).click();
  await alert.getByRole("button", { name: "Confirm reference action", exact: true }).click();
  await expect(lab.getByLabel("Overlay reference state")).toContainText("Confirmations: 1");
  await lab.getByRole("button", { name: "Open reference popover" }).click();
  await expect(page.getByText("Nonmodal local presentation", { exact: true })).toBeVisible();
  await lab.getByRole("heading", { name: "Overlays and navigation" }).click();
  await expect(page.getByText("Nonmodal local presentation", { exact: true })).not.toBeVisible();
  await lab.getByRole("button", { name: "Open reference popover" }).focus();
  await page.keyboard.press("Tab");
  await expect(lab.getByRole("button", { name: "Tooltip reference target" })).toBeFocused();
  await expect(page.getByRole("tooltip")).toContainText("Reference keyboard help");
  await page.keyboard.press("Escape"); await expect(page.getByRole("tooltip")).not.toBeVisible();
});

test("menus reject disabled commands, handle submenu/context/menubar and restore focus", async ({ page }) => {
  const lab = await openLab(page);
  const trigger = lab.getByRole("button", { name: "Reference actions", exact: true });
  await trigger.focus(); await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Save reference", exact: true })).toBeFocused();
  await expect(page.getByRole("menuitem", { name: "Unavailable reference", exact: true })).toHaveAttribute("aria-disabled", "true");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Unavailable reference", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(lab.getByLabel("Overlay reference state")).toContainText("Command: None");
  await expect(page.getByRole("menuitem", { name: "Save reference", exact: true })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "More reference actions", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menuitem", { name: "Duplicate reference", exact: true })).toBeVisible();
  await page.getByRole("menuitem", { name: "Duplicate reference", exact: true }).click();
  await expect(lab.getByLabel("Overlay reference state")).toContainText("Command: Duplicate");
  await expect(trigger).toBeFocused();
  await lab.getByText("Reference context area", { exact: true }).click({ button: "right" });
  await page.getByRole("menuitem", { name: "Inspect reference", exact: true }).click();
  await expect(lab.getByLabel("Overlay reference state")).toContainText("Command: Inspect");
  await lab.getByRole("menubar", { name: "Reference menubar" }).getByRole("menuitem", { name: "Reference File", exact: true }).click();
  await page.getByRole("menuitem", { name: "New reference", exact: true }).click();
  await expect(lab.getByLabel("Overlay reference state")).toContainText("Command: New");
});

test("navigation keyboard and disclosure states survive theme/density and compact viewport", async ({ page }, info) => {
  const lab = await openLab(page);
  const overview = lab.getByRole("tab", { name: "Reference overview", exact: true });
  await overview.focus(); await page.keyboard.press("ArrowRight");
  await expect(lab.getByRole("tab", { name: "Reference details", exact: true })).toBeFocused();
  await expect(overview).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(lab.getByRole("tab", { name: "Reference details", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(lab.getByText("Details reference content", { exact: true })).toBeVisible();
  await expect(lab.getByRole("tab", { name: "Disabled reference tab", exact: true })).toBeDisabled();
  const section = lab.getByRole("button", { name: "Reference keyboard section", exact: true });
  await section.focus(); await page.keyboard.press("Enter"); await expect(section).toHaveAttribute("aria-expanded", "true");
  await expect(lab.getByRole("button", { name: "Disabled reference section", exact: true })).toBeDisabled();
  await lab.getByRole("button", { name: "Reference additional information", exact: true }).click();
  await expect(lab.getByText("Additional reference content", { exact: true })).toBeVisible();
  const foundation = page.getByRole("region", { name: "Visual foundation reference", exact: true });
  await foundation.getByLabel("Reference theme", { exact: true }).selectOption("dark");
  await foundation.getByLabel("Reference density", { exact: true }).selectOption("compact");
  await page.setViewportSize({ width: 480, height: 860 });
  expect(await lab.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await expect(lab.getByRole("tab", { name: "Reference details", exact: true })).toHaveAttribute("aria-selected", "true");
  await info.attach("overlay-navigation-dark-compact", { body: await lab.screenshot(), contentType: "image/png" });
});
