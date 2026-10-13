import { test, expect, type Page } from "@playwright/test";

async function openPrimitives(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Open applications", exact: true }).click();
  await page.locator('[data-app-ref="app:component-lab"]').click();
  const win = page.getByRole("dialog", { name: "Component Lab", exact: true });
  if (await win.getAttribute("data-window-mode") !== "MAXIMIZED") await win.getByRole("button", { name: "Maximize window", exact: true }).click();
  await win.getByRole("tab", { name: "Primitives" }).click();
  const lab = page.getByRole("region", { name: "Primitive foundation reference", exact: true });
  await expect(lab).toBeVisible();
  return lab;
}

test("actual form controls support native keyboard/state and independent radio relationships", async ({ page }) => {
  const lab = await openPrimitives(page);
  const checkbox = lab.getByLabel("Checkbox reference", { exact: true });
  await expect(checkbox).toBeChecked();
  await checkbox.focus(); await page.keyboard.press("Space"); await expect(checkbox).not.toBeChecked();
  const toggle = lab.getByRole("switch", { name: "Switch reference", exact: true });
  await toggle.focus(); await page.keyboard.press("Space"); await expect(toggle).toBeChecked();
  await expect(lab.getByLabel("Disabled checkbox reference", { exact: true })).toBeDisabled();
  await expect(lab.getByRole("switch", { name: "Disabled switch reference", exact: true })).toBeDisabled();
  await lab.getByRole("radio", { name: "Left reference", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(lab.getByRole("radio", { name: "Center reference", exact: true })).toBeChecked();
  await expect(lab.getByRole("radio", { name: "Option A reference", exact: true })).toBeChecked();
  await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight");
  await expect(lab.getByRole("radio", { name: "Left reference", exact: true })).toBeChecked();
  await expect(lab.getByRole("radio", { name: "Disabled radio reference", exact: true })).toBeDisabled();
  await lab.getByRole("radio", { name: "Option B reference", exact: true }).click();
  await expect(lab.getByRole("radio", { name: "Left reference", exact: true })).toBeChecked();
});

test("native number limits/required text fail without accepting the form; range projects progress", async ({ page }) => {
  const lab = await openPrimitives(page);
  const accepted = lab.getByLabel("Reference submissions", { exact: true });
  const submit = lab.getByRole("button", { name: "Validate reference form", exact: true });
  await submit.click(); await expect(accepted).toHaveText("Accepted submissions: 1");
  const quantity = lab.getByLabel("Quantity reference", { exact: true });
  await quantity.fill("11"); await expect(quantity).toHaveValue("11");
  expect(await quantity.evaluate(element => (element as HTMLInputElement).validity.rangeOverflow)).toBe(true);
  await expect(quantity).toHaveAttribute("aria-invalid", "true");
  await expect(lab.getByText("Quantity must be between 0 and 10.", { exact: true })).toBeVisible();
  await submit.click(); await expect(accepted).toHaveText("Accepted submissions: 1");
  await quantity.fill(""); await submit.click(); await expect(accepted).toHaveText("Accepted submissions: 1");
  await quantity.fill("3");
  const notes = lab.getByLabel("Notes reference", { exact: true });
  await notes.fill(""); await submit.click(); await expect(accepted).toHaveText("Accepted submissions: 1");
  await notes.fill("<script>plain notes</script>"); await submit.click(); await expect(accepted).toHaveText("Accepted submissions: 2");
  const slider = lab.getByRole("slider", { name: "Progress reference slider", exact: true });
  await slider.focus(); await page.keyboard.press("ArrowRight");
  await expect(lab.getByLabel("Progress reference value", { exact: true })).toHaveText("45%");
  await expect(lab.getByRole("progressbar", { name: "Determinate reference", exact: true })).toHaveJSProperty("value", 45);
  await expect(lab.getByRole("progressbar", { name: "Indeterminate reference", exact: true })).not.toHaveAttribute("value", /./);
});

test("primitive gallery is usable in dark compact narrow layout and preserves live control state", async ({ page }, info) => {
  const lab = await openPrimitives(page);
  await page.getByRole("dialog", { name: "Component Lab", exact: true }).getByRole("tab", { name: "Foundations" }).click();
  const foundation = page.getByRole("region", { name: "Visual foundation reference", exact: true });
  await foundation.getByLabel("Reference theme", { exact: true }).selectOption("dark");
  await foundation.getByLabel("Reference density", { exact: true }).selectOption("compact");
  await page.getByRole("dialog", { name: "Component Lab", exact: true }).getByRole("tab", { name: "Primitives" }).click();
  await lab.getByLabel("Notes reference", { exact: true }).fill("Retained while changing presentation");
  await page.setViewportSize({ width: 480, height: 860 });
  await expect(lab.getByLabel("Notes reference", { exact: true })).toHaveValue("Retained while changing presentation");
  expect(await lab.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await info.attach("native-primitives-dark-compact", { body: await lab.screenshot({ animations: "disabled" }), contentType: "image/png" });
});


test("Construction B native date and local file controls preserve state without implicit uploads", async ({ page }) => {
  const lab = await openPrimitives(page);
  const date = lab.getByLabel("Appointment date", { exact: true });
  await date.fill("2026-11-18");
  await expect(date).toHaveValue("2026-11-18");
  const file = lab.getByLabel("Local files", { exact: true });
  await file.setInputFiles({ name: "local-note.txt", mimeType: "text/plain", buffer: Buffer.from("local only") });
  await expect(lab.getByLabel("Selected local files")).toContainText("local-note.txt");
  await page.getByRole("dialog", { name: "Component Lab", exact: true }).getByRole("tab", { name: "Foundations" }).click();
  await page.getByRole("dialog", { name: "Component Lab", exact: true }).getByRole("tab", { name: "Primitives" }).click();
  await expect(date).toHaveValue("2026-11-18");
  await expect(lab.getByLabel("Selected local files")).toContainText("local-note.txt");
});


test("Construction B InputGroup keeps semantic search and enables icon-only clear action", async ({ page }) => {
  const lab = await openPrimitives(page);
  const search = lab.getByRole("searchbox", { name: "Primitive grouped search" });
  const clear = lab.getByRole("button", { name: "Clear primitive search" });
  await expect(clear).toBeDisabled();
  await search.fill("Button");
  await expect(search).toHaveValue("Button");
  await expect(clear).toBeEnabled();
  await clear.click();
  await expect(search).toHaveValue("");
  await expect(clear).toBeDisabled();
});
