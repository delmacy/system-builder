import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Component Editor works as a real browser journey", async ({ page }) => {
  await page.goto("/component-editor");

  const editor = page.getByRole("main", { name: "Component Editor" });
  await expect(editor).toBeVisible();
  await expect(page.getByText("validation:valid")).toBeVisible();
  await expect(page.getByText("dirty:no")).toBeVisible();

  await page.getByRole("treeitem", { name: "Button 1" }).click();
  await expect(page.getByText("selection:layer:button-1")).toBeVisible();

  await page.getByRole("button", { name: "Toggle button-1 span" }).click();
  await expect(page.getByText("dirty:yes")).toBeVisible();
  await expect(page.getByText("validation:valid")).toBeVisible();

  await page.getByRole("button", { name: "Discard / reset" }).click();
  await expect(page.getByText("dirty:no")).toBeVisible();

  await page.getByRole("button", { name: "Prove invalid rejection" }).click();
  await expect(page.getByText(/Rejected safely:/)).toBeVisible();
  await expect(page.getByText("validation:valid")).toBeVisible();
  await expect(page.getByText("preview:3")).toBeVisible();

  await page.screenshot({ path: "test-results/component-editor.png", fullPage: true });
});

test("Component Editor has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/component-editor");
  await expect(page.getByRole("main", { name: "Component Editor" })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("Component Editor preserves keyboard focus and layout landmarks", async ({ page }) => {
  await page.goto("/component-editor");
  const editor = page.getByRole("main", { name: "Component Editor" });
  await expect(editor).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).not.toHaveCount(0);

  const box = await editor.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeGreaterThan(600);
  expect(box.height).toBeGreaterThan(300);

  await expect(page.getByText("Palette", { exact: true })).toBeVisible();
  await expect(page.getByRole("tree", { name: "Component Editor layers" })).toBeVisible();
  await expect(page.getByText("Component preview", { exact: true })).toBeVisible();
});
