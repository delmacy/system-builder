import { test, expect } from "@playwright/test";

test("Construction C shared tree switches real Studio views without resetting area identity", async ({ page }) => {
  await page.goto("/studios");
  const tree = page.getByRole("tree", { name: "Installed Studio navigation" });
  const context = tree.getByRole("treeitem", { name: "Process Context" });
  const workflow = tree.getByRole("treeitem", { name: "Workflow" });
  await expect(context).toHaveAttribute("aria-selected", "true");
  await workflow.click();
  await expect(workflow).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("region", { name: "Studio foundation" })).toHaveAttribute("data-active-area", "workflow");
  await workflow.press("ArrowUp");
  await expect(context).toBeFocused();
  await context.press("Enter");
  await expect(context).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("region", { name: "Studio foundation" })).toHaveAttribute("data-active-area", "process-context");
});
