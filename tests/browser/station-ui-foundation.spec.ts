import { test, expect, type Page } from "@playwright/test";

async function openLab(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const lab = page.getByRole("region", { name: "Visual foundation reference", exact: true });
  await expect(lab).toBeVisible();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  if (await win.getAttribute("data-window-mode") !== "MAXIMIZED") await win.getByRole("button", { name: "Maximize window", exact: true }).click();
  return lab;
}

test("real Station reference changes theme/density, persists and preserves control states", async ({ page }, info) => {
  await page.emulateMedia({ colorScheme: "light" });
  let lab = await openLab(page);
  const primary = lab.getByRole("button", { name: "Primary reference", exact: true });
  const comfortable = await primary.boundingBox();
  await lab.getByLabel("Reference density", { exact: true }).selectOption("compact");
  await expect.poll(async () => (await primary.boundingBox())!.height).toBeLessThan(comfortable!.height);
  await lab.getByLabel("Reference theme", { exact: true }).selectOption("dark");
  const tokens = async () => lab.evaluate(element => {
    const css = getComputedStyle(element);
    return ["--background", "--sb-desktop", "--sb-window-titlebar", "--sb-taskbar", "--sb-toolbar", "--sb-selection"].map(token => css.getPropertyValue(token));
  });
  const dark = await tokens();
  await page.emulateMedia({ colorScheme: "dark" });
  await lab.getByLabel("Reference theme", { exact: true }).selectOption("system");
  expect(await tokens()).toEqual(dark);
  await lab.getByLabel("Reference theme", { exact: true }).selectOption("light");
  expect(await tokens()).not.toEqual(dark); // explicit light overrides OS dark
  await lab.getByLabel("Reference theme", { exact: true }).selectOption("dark");
  const selected = lab.getByRole("button", { name: "Selected reference", exact: true });
  await expect(selected).toHaveAttribute("aria-pressed", "true");
  await selected.click();
  await expect(selected).toHaveAttribute("aria-pressed", "false");
  await expect(lab.getByRole("button", { name: "Disabled reference", exact: true })).toBeDisabled();
  const input = lab.getByLabel("Reference input", { exact: true });
  await input.focus();
  await page.keyboard.type("Keyboard state");
  await expect(input).toHaveValue("Keyboard state");
  await expect(input).toBeFocused();
  await expect(lab.getByLabel("Invalid reference", { exact: true })).toHaveAttribute("aria-describedby", "reference-error");
  await info.attach("foundation-dark-compact", { body: await lab.screenshot(), contentType: "image/png" });
  await page.reload();
  lab = page.getByRole("region", { name: "Visual foundation reference", exact: true });
  await expect(lab).toBeVisible();
  await expect(lab.getByLabel("Reference theme", { exact: true })).toHaveValue("dark");
  await expect(lab.getByLabel("Reference density", { exact: true })).toHaveValue("compact");
});

for (const theme of ["light", "dark"] as const) {
  test(`reference ${theme}: readable text, focus, narrow layout and screenshot`, async ({ page }, info) => {
    const lab = await openLab(page);
    await lab.getByLabel("Reference theme", { exact: true }).selectOption(theme);
    // Theme changes animate actual control colors; measure settled colors, not an intermediate frame.
    await lab.evaluate(async element => {
      await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => undefined)));
    });
    for (const label of ["Primary reference", "Secondary reference", "Destructive reference"]) {
      const button = lab.getByRole("button", { name: label, exact: true });
      const contrast = await button.evaluate(element => {
        const style = getComputedStyle(element);
        const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d")!;
        const luminance = (color: string) => {
          context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1);
          const rgb = context.getImageData(0, 0, 1, 1).data;
          return [0.2126, 0.7152, 0.0722].reduce((sum, weight, index) => {
            const s = rgb[index]! / 255;
            return sum + weight * (s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4);
          }, 0);
        };
        const a = luminance(style.color), b = luminance(style.backgroundColor);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      expect(contrast, `${theme} ${label}`).toBeGreaterThanOrEqual(4.5);
    }
    const input = lab.getByLabel("Reference input", { exact: true });
    const invalid = lab.getByLabel("Invalid reference", { exact: true });
    expect(await invalid.evaluate(element => getComputedStyle(element).borderTopColor))
      .not.toEqual(await input.evaluate(element => getComputedStyle(element).borderTopColor));
    await input.focus();
    expect(await input.evaluate(element => parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThanOrEqual(2);
    await page.keyboard.press("Tab");
    await expect(lab.getByLabel("Invalid reference", { exact: true })).toBeFocused();
    await info.attach(`foundation-${theme}-desktop`, { body: await lab.screenshot(), contentType: "image/png" });
    await page.setViewportSize({ width: 480, height: 860 });
    await expect(lab).toBeVisible();
    expect(await lab.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await info.attach(`foundation-${theme}-compact-viewport`, { body: await lab.screenshot(), contentType: "image/png" });
  });
}


test("Component Lab catalog tabs organize families, support keyboard navigation and preserve live inputs", async ({ page }) => {
  await openLab(page);
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  const tabs = win.getByRole("tablist", { name: "Component categories" });
  await expect(tabs.getByRole("tab")).toHaveCount(7);
  const primitives = tabs.getByRole("tab", { name: "Primitives", exact: true });
  await primitives.click();
  const notes = win.getByLabel("Notes reference", { exact: true });
  await notes.fill("Retain component state");
  await tabs.getByRole("tab", { name: "Overlays", exact: true }).click();
  await expect(win.getByRole("region", { name: "Overlay foundation reference" })).toBeVisible();
  await tabs.getByRole("tab", { name: "Primitives", exact: true }).click();
  await expect(notes).toHaveValue("Retain component state");
  await primitives.focus();
  await primitives.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Overlays", exact: true })).toHaveAttribute("aria-selected", "true");
  await tabs.getByRole("tab", { name: "Overlays", exact: true }).press("End");
  await expect(tabs.getByRole("tab", { name: "Icons", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(win.getByRole("tabpanel", { name: "Icons" }).locator('[data-icon-token]').first()).toBeVisible();
  await tabs.getByRole("tab", { name: "Icons", exact: true }).press("Home");
  await expect(tabs.getByRole("tab", { name: "Foundations", exact: true })).toHaveAttribute("aria-selected", "true");
});
