import assert from "node:assert/strict";
import test from "node:test";
import { canonicalJson, sha256Canonical, sha256Text } from "@system-builder/deterministic";

test("canonical JSON sorts object keys recursively and preserves array order", () => {
  const value = {
    z: [{ b: 2, a: 1 }, { y: ["second", "first"], x: true }],
    a: { d: 4, c: 3 },
  };
  assert.equal(
    canonicalJson(value),
    '{"a":{"c":3,"d":4},"z":[{"a":1,"b":2},{"x":true,"y":["second","first"]}]}',
  );
});

test("equivalent object-key order produces identical canonical hashes", () => {
  const left = { nested: { beta: 2, alpha: 1 }, list: [3, 2, 1] };
  const right = { list: [3, 2, 1], nested: { alpha: 1, beta: 2 } };
  assert.equal(sha256Canonical(left), sha256Canonical(right));
  assert.match(sha256Canonical(left), /^sha256:[a-f0-9]{64}$/);
});

test("text hashing remains byte-oriented and distinct from canonical object hashing", () => {
  const text = '{"b":2,"a":1}';
  assert.equal(sha256Text(text), sha256Text(text));
  assert.notEqual(sha256Text(text), sha256Canonical({ b: 2, a: 1 }));
});
