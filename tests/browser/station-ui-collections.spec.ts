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

test("Construction E cards expose loading, error, empty and keyboard selection", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  await win.getByRole("tab", { name: "Collections" }).click();
  const lab = win.getByRole("region", { name: "Collection foundation reference" });
  await lab.getByRole("combobox", { name: "Collection presentation" }).selectOption("cards");
  const cards = lab.getByRole("region", { name: "Reference asset cards" });
  const item = cards.getByRole("button", { name: "Select asset-001" });
  await item.focus();
  await item.press("Enter");
  await expect(item).toHaveAttribute("aria-pressed", "true");
  await lab.getByRole("combobox", { name: "Collection state" }).selectOption("loading");
  await expect(cards).toHaveAttribute("aria-busy", "true");
  await expect(cards.getByRole("status")).toContainText("Loading collection");
  await lab.getByRole("combobox", { name: "Collection state" }).selectOption("error");
  await expect(cards.getByRole("alert")).toContainText("Collection unavailable");
  await lab.getByRole("combobox", { name: "Collection state" }).selectOption("ready");
  await lab.getByRole("searchbox", { name: "Search collection assets" }).fill("not present");
  await expect(cards.getByRole("status")).toContainText("No items");
});

test("Construction E keeps sorted paged card selection bounded at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  await win.getByRole("tab", { name: "Collections" }).click();
  const lab = win.getByRole("region", { name: "Collection foundation reference" });
  await lab.getByRole("combobox", { name: "Collection presentation" }).selectOption("cards");
  const cards = lab.getByRole("region", { name: "Reference asset cards" });
  await expect(cards.getByRole("button")).toHaveCount(2);
  await lab.getByRole("button", { name: "Next page" }).click();
  await expect(cards.getByRole("button")).toHaveCount(1);
  await cards.getByRole("button", { name: "Select asset-002" }).click();
  await expect(lab.getByRole("status", { name: "Collection selection state" })).toContainText("asset-002");
  await lab.getByRole("button", { name: "Previous page" }).click();
  await expect(lab.getByRole("status", { name: "Collection selection state" })).toContainText("none");
  await expect(cards).toHaveJSProperty("scrollWidth", await cards.evaluate(el => el.clientWidth));
});
