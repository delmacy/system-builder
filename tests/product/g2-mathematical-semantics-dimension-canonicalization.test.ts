import assert from "node:assert/strict";
import test from "node:test";
import { assertCompatibleDimensions } from "../../packages/contracts/mathematical-semantics/index.js";

test("TASK-485 treats dimensional signatures as canonical regardless of term order", () => {
  const metersPerSecond = {
    state: "KNOWN",
    unitRef: "unit:meter-per-second",
    unitRevision: "unit:meter-per-second:r1",
    dimension: {
      terms: [
        { axis: "LENGTH", exponent: 1 },
        { axis: "TIME", exponent: -1 },
      ],
    },
  } as const;

  const sameDimensionReordered = {
    state: "KNOWN",
    unitRef: "unit:velocity-portable",
    unitRevision: "unit:velocity-portable:r7",
    dimension: {
      terms: [
        { axis: "TIME", exponent: -1 },
        { axis: "LENGTH", exponent: 1 },
      ],
    },
  } as const;

  assert.doesNotThrow(() => assertCompatibleDimensions(metersPerSecond, sameDimensionReordered));
});

test("TASK-485 compatibility validates malformed direct dimensional input instead of trusting array shape", () => {
  const valid = {
    state: "KNOWN",
    unitRef: "unit:meter",
    unitRevision: "unit:meter:r1",
    dimension: { terms: [{ axis: "LENGTH", exponent: 1 }] },
  } as const;
  const malformed = {
    state: "KNOWN",
    unitRef: "unit:bad-length",
    unitRevision: "unit:bad-length:r1",
    dimension: { terms: [{ axis: "LENGTH", exponent: 0 }] },
  } as const;

  assert.throws(() => assertCompatibleDimensions(valid, malformed), /omit zero exponents/);
});
