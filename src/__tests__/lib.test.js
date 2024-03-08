import match from "../index"
import { describe, test, expect } from "vitest"
import { FAIL_VALUE, PATTERNS } from "../config"

const { PICK_ELEMENT } = PATTERNS

describe("variable Match from lib", () => {
  test("should be able to use match with primitives, array, object", () => {
    expect(match(10).when(10, 100).value).toEqual(100)
    expect(match(1).when(10, 100).value).toEqual(FAIL_VALUE)
    expect(match([10, 20]).when([10, 20], 100).value).toEqual(100)
    expect(match({ x: 10 }).when({ x: 100 }, 100).value).toEqual(FAIL_VALUE)
    expect(
      match({ x: 10 }).when(
        {
          x: 10,
        },
        100,
      ).value,
    ).toEqual(100)
    expect(
      match({ w: 5, x: 10, y: 20, z: "~" }).when(
        { x: "~", z: PICK_ELEMENT },
        (obj) => obj,
      ).value,
    ).toEqual({ x: 10, z: "~" })
  })
})
