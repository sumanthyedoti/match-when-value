import match from "../match"
import { FAIL_VALUE, PATTERNS } from "../config"
const { SKIP_ELEMENT, PICK_ELEMENT, SKIP_REMAINING, PICK_REMAINING } = PATTERNS

describe("variable Match with primitive values", () => {
  test("should return then Value when variables matches", () => {
    expect(match(10).by(10).then(100)).toEqual(100)
    expect(match(10.34).by(10.34).then(100)).toEqual(100)
    expect(match("Hello").by("Hello").then(100)).toEqual(100)
    expect(
      match("my name is Mai Nam").by("my name is Mai Nam").then(100),
    ).toEqual(100)
    expect(match(true).by(true).then(100)).toEqual(100)
    expect(match(false).by(false).then(100)).toEqual(100)
    expect(match(null).by(null).then(100)).toEqual(100)
    expect(match(undefined).by(undefined).then(100)).toEqual(100)
  })

  test("should return false when variables does not matche", () => {
    expect(match(1).by(10).then(100)).toEqual(FAIL_VALUE)
    expect(match(10.23).by(10.32).then(100)).toEqual(FAIL_VALUE)
    expect(match("Hello").by("hello").then(100)).toEqual(FAIL_VALUE)
    expect(match(true).by(false).then(100)).toEqual(FAIL_VALUE)
    expect(match(false).by(true).then(100)).toEqual(FAIL_VALUE)
    expect(match(null).by(undefined).then(100)).toEqual(FAIL_VALUE)
    expect(match(undefined).by(null).then(100)).toEqual(FAIL_VALUE)
  })
})

describe("Mismatching types", () => {
  test("should fail with mismatching types", () => {
    expect(match(null).by(2).then(100)).toEqual(FAIL_VALUE)
    expect(match([10]).by(2).then(100)).toEqual(FAIL_VALUE)
    expect(match("100").by(2).then(100)).toEqual(FAIL_VALUE)
    expect(match(10.23).by().then("10.23")).toEqual(FAIL_VALUE)
    expect(match("hi").by(2).then(100)).toEqual(FAIL_VALUE)
  })
})

describe("Use functions for expression", () => {
  function trueIf10(x) {
    return match(x).by(10).then(true)
  }
  test("match with function", () => {
    expect(trueIf10(10)).toEqual(true)
    expect(trueIf10(100)).toEqual(FAIL_VALUE)
  })
})

describe("boolean match", () => {
  test("match with function", () => {
    expect(match(10 !== 10).then(100)).toEqual(FAIL_VALUE)
    expect(match(10 < 20).then(100)).toEqual(100)
  })
})

describe("with arrays", () => {
  const x = 10
  const arr = [10, 20, null, undefined, "Hello", x, 20, 30]
  test("fails if elements in 2nd array matches but has less elements", () => {
    expect(match(arr).by([10]).then(100)).toEqual(FAIL_VALUE)
  })

  test("exact array matches", () => {
    expect(match([10, 20]).by([10, 20]).then(100)).toEqual(100)
    const y = 20
    expect(
      match(arr).by([10, y, null, undefined, "Hello", 10, 20, 30]).then(100),
    ).toEqual(100)
  })

  test("wrong elements fails to match", () => {
    expect(match(arr).by([11, 20]).then(100)).toEqual(FAIL_VALUE)
    expect(match(arr).by([11]).then(100)).toEqual(FAIL_VALUE)
  })

  test("fails if 2nd array has more elements", () => {
    expect(match([10, 20]).by([10, 20, 30]).then(100)).toEqual(FAIL_VALUE)
    expect(match([]).by([10, 20, 30]).then(100)).toEqual(FAIL_VALUE)
  })

  test("two empty array match", () => {
    expect(match([]).by([]).then(100)).toEqual(100)
  })

  test("fails if 2nd array is empty", () => {
    expect(match([10, 20]).by([]).then(100)).toEqual(FAIL_VALUE)
  })

  test("skip element if it is " + PATTERNS.SKIP_ELEMENT, () => {
    expect(match([10, 20, 30]).by([10, SKIP_ELEMENT, 30]).then(100)).toEqual(
      100,
    )
    expect(match([10, "_", 30]).by([10, SKIP_ELEMENT, 30]).then(100)).toEqual(
      100,
    )
  })

  test("skip remaining element if it is " + PATTERNS.SKIP_REMAINING, () => {
    expect(match(arr).by([10, 20, PATTERNS.SKIP_REMAINING]).then(100)).toEqual(
      100,
    )
    expect(match(arr).by([10, PATTERNS.SKIP_REMAINING]).then(100)).toEqual(100)
    expect(
      match([10, 20, 30, 40, 50, 60])
        .by([10, SKIP_ELEMENT, 30, PATTERNS.SKIP_REMAINING])
        .then(100),
    ).toEqual(100)
  })

  test("fails if 2nd array is smaller than 1st array but no skip pattern at the end", () => {
    expect(match([10, 20]).by([10]).then(100)).toEqual(FAIL_VALUE)
  })

  test("passes if 2nd array is smaller than 1st array but there is skip pattern at the end", () => {
    expect(match([10, 20]).by([10, SKIP_ELEMENT]).then(100)).toEqual(100)
  })

  test("return original array if matches", () => {
    expect(
      match([10, 20, 30])
        .by([10, SKIP_REMAINING])
        .then((arr) => arr[2]),
    ).toEqual(30)
  })

  test("return array of matching elements (picked elements) if pick pattern exists in match-by array", () => {
    expect(
      match([10, 20, 30])
        .by([10, PATTERNS.PICK_ELEMENT, SKIP_ELEMENT])
        .then(([x] = params) => x),
    ).toEqual(20)
    expect(
      match([10, [10, 20], 30])
        .by([10, PICK_ELEMENT, 30])
        .then(([x] = params) => x),
    ).toEqual([10, 20])
    expect(
      match([10, { x: 10, y: 20 }, 30])
        .by([10, PICK_ELEMENT, PICK_ELEMENT])
        .then((params) => params),
    ).toEqual([{ x: 10, y: 20 }, 30])
    expect(
      match([10, { x: 10, y: 20 }, 30])
        .by([10, PICK_ELEMENT, 30])
        .then(([x] = params) => x),
    ).toEqual({ x: 10, y: 20 })
    expect(
      match([10, { x: 10, y: 20 }, 30])
        .by([SKIP_ELEMENT, PICK_ELEMENT, SKIP_REMAINING])
        .then(([x] = params) => x),
    ).toEqual({ x: 10, y: 20 })
    expect(
      match([10, [20, 30], 30, { x: 2, y: 4 }, 50, 60])
        .by([10, PICK_ELEMENT, SKIP_ELEMENT, PICK_ELEMENT, SKIP_REMAINING])
        .then((params) => params),
    ).toEqual([[20, 30], { x: 2, y: 4 }])
  })

  test("picks all remianing elements from original array", () => {
    expect(
      match(arr)
        .by([10, PICK_ELEMENT, PICK_ELEMENT, SKIP_ELEMENT, PICK_REMAINING])
        .then((arr) => arr),
    ).toEqual([20, null, "Hello", x, 20, 30])
    expect(
      match(arr)
        .by([
          SKIP_ELEMENT,
          PICK_ELEMENT,
          PICK_ELEMENT,
          SKIP_ELEMENT,
          PICK_REMAINING,
        ])
        .then((arr) => arr),
    ).toEqual([20, null, "Hello", x, 20, 30])
  })

  test("if picked deeply, return only elements", () => {
    expect(
      match([20, 30, { x: 40, y: 10, z: [2, [4, 5, 6], 5] }])
        .by([20, 30, { x: 40, z: ["~", [4, "~", "~"], "_"] }])
        .then((obj) => obj),
    ).toEqual([{ z: [2, [5, 6]] }])
  })
})

describe("with object", () => {
  const obj = { x: 10, y: 10.23, z: "hello", u: null, v: undefined, w: 20 }
  test("passes if values of 2nd object matches with 1st object", () => {
    expect(
      match(obj)
        .by({ x: 10 })
        .then((val) => val),
    ).toEqual(obj)
    expect(match(obj).by({ u: null, v: undefined }).then(100)).toEqual(100)
  })

  test("wrong elements fails to match", () => {
    expect(match(obj).by({ x: 10, y: 10.23, w: 30 }).then(100)).toEqual(
      FAIL_VALUE,
    )
    expect(match(obj).by([11]).then(100)).toEqual(FAIL_VALUE)
  })

  test("two empty objects match", () => {
    expect(match({}).by({}).then(100)).toEqual(100)
  })

  test("fails if 2nd object is empty", () => {
    expect(match({ x: 10 }).by({}).then(100)).toEqual(FAIL_VALUE)
  })

  test("returns picked object fields", () => {
    expect(
      match({ x: 10, y: 20, z: PICK_ELEMENT }).by({ x: 10 }).then(100),
    ).toEqual(100)
  })

  test("returns picked object fields", () => {
    expect(
      match({ w: 5, x: 10, y: 20, z: "~" })
        .by({ x: "~", z: PICK_ELEMENT })
        .then((obj) => obj),
    ).toEqual({ x: 10, z: "~" })
  })

  test("if picked deeply, return those fields", () => {
    expect(
      match({ x: 20, y: { x: 10, y: 20, z: 30 } })
        .by({ x: 20, y: { x: 10, y: "~" } })
        .then((obj) => obj),
    ).toEqual({ y: { y: 20 } })
  })
})

describe("'then' can take any primitive, composite values and functions", () => {
  function log2(val) {
    return Math.log(val) / Math.log(2)
  }
  test("primitive values", () => {
    expect(match(10).by(10).then(null)).toEqual(null)
    expect(match(10).by(10).then(undefined)).toEqual(undefined)
    expect(match(10).by(10).then(10.23)).toEqual(10.23)
    expect(match(10).by(10).then("hello")).toEqual("hello")
  })

  test("composite values", () => {
    const arr = [10, 20]
    expect(match(10).by(10).then(arr)).toBe(arr)
    const obj = { x: 10, y: 20 }
    expect(match(10).by(10).then(obj)).toBe(obj)
  })

  test("functions", () => {
    expect(
      match(10)
        .by(10)
        .then((x) => x === 10),
    ).toEqual(true)
    expect(match(8).by(8).then(log2)).toEqual(3)
    const arraySum = (arr) => {
      return arr.reduce((acc, x) => acc + x, 0)
    }
    expect(
      match([10, 20, 30, 40])
        .by([10, SKIP_ELEMENT, 30, SKIP_ELEMENT])
        .then(arraySum),
    ).toEqual(100)
  })

  describe("function with boolean match", () => {
    expect(match(log2(8) === 3).then((isTrue) => isTrue)).toEqual(true)
  })
})

describe("Composite values", () => {
  test("array", () => {
    const arr = [
      10,
      20,
      { x: 3, y: 200, z: "hello", w: [1, { x: 20, y: 40, z: 60 }] },
    ]
    expect(
      match(arr)
        .by([10, 20, { x: 3, w: [1, { x: 20, y: 40 }] }])
        .then((val) => val),
    ).toEqual(arr)
  })

  test("array - fail", () => {
    const arr = [
      10,
      20,
      {
        x: 3,
        y: 200,
        z: "hello",
        w: [1, { x: 20, y: 40, z: { x: 20, y: 40 } }],
      },
    ]
    expect(
      match(arr)
        .by([10, 20, { x: 3, w: [1, { x: 20, y: 40, z: { x: 20, y: 30 } }] }])
        .then((val) => val),
    ).toEqual(FAIL_VALUE)
  })

  test("object - fails when deep array fails", () => {
    const obj = {
      x: 10,
      y: { x: 20, z: [10, 20, { d: 3, k: "hello" }] },
      z: [3, 4, [1, 2], { x: 20, y: 30 }],
    }
    expect(
      match(obj)
        .by({ y: { x: 20, z: [10] } })
        .then((val) => val),
    ).toEqual(FAIL_VALUE)
  })

  test("object - passes", () => {
    const obj = {
      x: 10,
      y: { x: 20, z: [10, 20, { d: 3, k: "hello" }] },
      z: [3, 4, [1, 2], { x: 20, y: 30 }],
    }
    expect(
      match(obj)
        .by({ y: { x: 20, z: [10, SKIP_REMAINING] } })
        .then((val) => val),
    ).toEqual(obj)
    expect(
      match(obj)
        .by({ y: { x: 20, z: [10, SKIP_REMAINING] }, z: "~" })
        .then((val) => val),
    ).toEqual({ z: [3, 4, [1, 2], { x: 20, y: 30 }] })
  })
})
