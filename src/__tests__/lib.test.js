import match from "../index"
import { FAIL_VALUE, PATTERNS } from "../config"
const { PICK_ELEMENT } = PATTERNS

describe("variable Match from lib", () => {
  test("should be able to use match with primitives, array, object", () => {
    expect(match(10).by(10).then(100)).toEqual(100)
    expect(match(1).by(10).then(100)).toEqual(FAIL_VALUE)
    expect(match([10, 20]).by([10, 20]).then(100)).toEqual(100)
    expect(match({ x: 10 }).by({x: 100}).then(100)).toEqual(FAIL_VALUE)
    expect(match({ x: 10 }).by({x: 10}).then(100)).toEqual(100)
    expect(
      match({ w: 5, x: 10, y: 20, z: "~" })
        .by({ x: "~", z: PICK_ELEMENT })
        .then((obj) => obj),
    ).toEqual({ x: 10, z: "~" })
  })
})



