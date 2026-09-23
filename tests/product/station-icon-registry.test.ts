import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  ICON_TOKENS,
  StationIcon,
  isIconToken,
  resolveIcon,
} from "../../packages/ui-icons/index.js";

test("semantic Station icon vocabulary has complete Lucide provider coverage", () => {
  assert.ok(ICON_TOKENS.length >= 10);

  for (const token of ICON_TOKENS) {
    assert.equal(isIconToken(token), true);
    const definition = resolveIcon(token);
    assert.ok(definition.name.length > 0);
    assert.ok(definition.shapes.length > 0);
  }
});

test("unknown semantic icon tokens fail deterministically", () => {
  assert.equal(isIconToken("lucide.settings"), false);
  assert.throws(
    () => resolveIcon("lucide.settings"),
    /unknown Station icon token: lucide\.settings/,
  );
});

test("StationIcon hides decorative icons and labels meaningful icons accessibly", () => {
  const decorative = renderToStaticMarkup(StationIcon({ token: "settings" }));
  assert.match(decorative, /data-slot="icon"/);
  assert.match(decorative, /data-icon-token="settings"/);
  assert.match(decorative, /data-icon-provider="lucide"/);
  assert.match(decorative, /aria-hidden="true"/);
  assert.doesNotMatch(decorative, /aria-label=/);

  const meaningful = renderToStaticMarkup(
    StationIcon({ token: "status.warning", label: "Warning" }),
  );
  assert.match(meaningful, /role="img"/);
  assert.match(meaningful, /aria-label="Warning"/);
  assert.doesNotMatch(meaningful, /aria-hidden=/);
});

test("consumer semantics remain provider-neutral", () => {
  assert.ok(ICON_TOKENS.includes("window.close"));
  assert.ok(ICON_TOKENS.includes("settings"));
  assert.equal(ICON_TOKENS.some((token) => token.startsWith("lucide.")), false);
});
