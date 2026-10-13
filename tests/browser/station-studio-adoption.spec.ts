import { test, expect } from "@playwright/test";

test("shared compact Studio navigation preserves pending workflow fields and keyboard labels", async ({ page }, info) => {
  await page.goto("/studios");
  const studio = page.getByRole("region", { name: "Studio foundation", exact: true });
  const commands = studio.getByRole("group", { name: "Studio area commands", exact: true });
  const workflow = commands.getByRole("button", { name: "Workflow", exact: true });
  const context = commands.getByRole("button", { name: "Process Context", exact: true });
  await expect(workflow).toHaveText(""); await expect(context).toHaveText("");
  await expect(context).toHaveAttribute("aria-controls", "studio-area-process-context");
  await expect(workflow).toHaveAttribute("aria-controls", "studio-area-workflow");
  await context.hover();
  await expect(studio.getByRole("tooltip", { name: "Process Context", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(studio.getByRole("tooltip")).not.toBeVisible();
  await context.focus(); await page.keyboard.press("Tab"); await expect(workflow).toBeFocused();
  const help = studio.getByRole("tooltip", { name: "Workflow", exact: true });
  await expect(help).toBeVisible();
  await expect(workflow).toHaveAttribute("aria-describedby", (await help.getAttribute("id"))!);
  await page.keyboard.press("Escape"); await expect(help).not.toBeVisible();
  await workflow.press("Enter");
  await expect(studio).toHaveAttribute("data-active-area", "workflow");
  await page.getByText("Create workflow or add process", { exact: true }).click();
  await page.getByLabel("Process name", { exact: true }).fill("Pending Studio command proof");
  const retained = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  await context.press("Space");
  await expect(studio).toHaveAttribute("data-active-area", "process-context");
  await expect(context).toHaveAttribute("aria-pressed", "true");
  await workflow.press("Enter");
  await expect(page.getByLabel("Process name", { exact: true })).toHaveValue("Pending Studio command proof");
  await expect(workflow).toHaveAttribute("aria-pressed", "true");
  await expect(context).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }))).toBe(retained);
  await page.setViewportSize({ width: 390, height: 860 });
  const box = await commands.boundingBox(); expect(box).not.toBeNull(); expect(box!.width).toBeLessThan(100);
  for (const button of [context, workflow]) {
    const bounds = await button.boundingBox(); expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0); expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  }
  await info.attach("studio-g-compact-commands", { body: await commands.screenshot({ animations: "disabled" }), contentType: "image/png" });
});
