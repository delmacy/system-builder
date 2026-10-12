import { test, expect } from "@playwright/test";

test("collection table filters, selects with keyboard, and handles empty results", async ({ page }, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  await win.getByRole("button", { name: "Maximize window", exact: true }).click();
  const lab = page.getByRole("region", { name: "Collection foundation reference" });
  await expect(lab).toBeVisible();
  await expect(lab.getByRole("table", { name: "Reference assets" }).getByRole("row")).toHaveCount(4);
  const search = lab.getByRole("searchbox", { name: "Search collection assets" });
  await search.fill("Workspace");
  await expect(lab.getByRole("table").getByRole("row")).toHaveCount(2);
  const select = lab.getByRole("button", { name: "Select asset-002" });
  await select.focus(); await page.keyboard.press("Enter");
  await expect(lab.getByRole("status", { name: "Collection selection state" })).toContainText("asset-002");
  await lab.getByRole("combobox", { name: "Filter collection kind" }).selectOption("Document");
  await expect(lab.getByRole("table")).toContainText("No results");
  await expect(lab.getByRole("status", { name: "Collection selection state" })).toContainText("none");
  await info.attach("collection-empty", { body: await lab.screenshot({ animations: "disabled" }), contentType: "image/png" });
});
