import { test, expect } from "@playwright/test";

test("collection table filters, selects with keyboard, and handles empty results", async ({ page }, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  await win.getByRole("button", { name: "Maximize window", exact: true }).click();
  await win.getByRole("tab", { name: "Collections" }).click();
  const lab = page.getByRole("region", { name: "Collection foundation reference" });
  await expect(lab).toBeVisible();
  await expect(lab.getByRole("table", { name: "Reference assets" }).getByRole("row")).toHaveCount(3);
  await expect(lab.getByRole("navigation", { name: "Collection pages" })).toContainText("Page 1 of 2");
  await expect(lab.getByRole("button", { name: "Previous page" })).toBeDisabled();
  await lab.getByRole("button", { name: "Next page" }).click();
  await expect(lab.getByRole("navigation", { name: "Collection pages" })).toContainText("Page 2 of 2");
  await expect(lab.getByRole("button", { name: "Next page" })).toBeDisabled();
  await lab.getByRole("button", { name: "Previous page" }).click();
  const sortName = lab.getByRole("button", { name: "Sort by Name" });
  await sortName.click();
  await expect(lab.getByRole("columnheader", { name: "Name" })).toHaveAttribute("aria-sort", "descending");
  const search = lab.getByRole("searchbox", { name: "Search collection assets" });
  await search.fill("Workspace");
  await expect(lab.getByRole("table").getByRole("row")).toHaveCount(2);
  const select = lab.getByRole("button", { name: "Select asset-002" });
  await select.focus(); await page.keyboard.press("Enter");
  await expect(lab.getByRole("status", { name: "Collection selection state" })).toContainText("asset-002");
  await lab.getByRole("combobox", { name: "Filter collection kind" }).selectOption("Document");
  await expect(lab.getByText("No matching assets", { exact: true })).toBeVisible();
  await expect(lab.getByRole("table")).toHaveCount(0);
  await expect(lab.getByRole("status", { name: "Collection selection state" })).toContainText("none");
  await info.attach("collection-empty", { body: await lab.screenshot({ animations: "disabled" }), contentType: "image/png" });
});

test("avatar identity examples expose names and fallback to initials", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  await win.getByRole("tab", { name: "Collections" }).click();
  const examples = win.getByLabel("Avatar component examples");
  await expect(examples.getByRole("img", { name: "Station Operator" })).toContainText("SO");
  await expect(examples.getByRole("img", { name: "Workspace Editor" })).toContainText("WE");
  await expect(examples.getByRole("img", { name: "Component Designer" })).toContainText("CD");
});
