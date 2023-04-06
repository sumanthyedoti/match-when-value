import match from "../match"
import { FAIL_VALUE } from "../config"

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
  test("skip element if it is '_'", () => {
    expect(match(arr).by([10, 20, "_"]).then(100)).toEqual(100)
    expect(match(arr).by([10, "_"]).then(100)).toEqual(100)
    expect(match([10, 20, 30]).by([10, "_", 30]).then(100)).toEqual(100)
    expect(match([10, "_", 30]).by([10, "_", 30]).then(100)).toEqual(100)
    expect(
      match([10, 20, 30, 40, 50, 60]).by([10, "_", 30, "_"]).then(100),
    ).toEqual(100)
  })
  test("fails if 2nd array is empty", () => {
    expect(match([10, 20]).by([]).then(100)).toEqual(FAIL_VALUE)
  })
})

describe("with object", () => {
  const obj = { x: 10, y: 10.23, z: "hello", u: null, v: undefined, w: 20 }
  test("passes if values of 2nd object matches with 1st object", () => {
    expect(match(obj).by({ x: 10 }).then(100)).toEqual(100)
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
    expect(match([10, 20, 30, 40]).by([10, 20, 30, 40]).then(arraySum)).toEqual(
      100,
    )
  })
  describe("function with boolean match", () => {
    expect(match(log2(8) === 3).then((isTrue) => isTrue)).toEqual(true)
  })
})

// describe("Composite values", () => {
//   test("array", () => {
//     expect(
//       match([10, 20, { x: 3, y: 200, z: "hello" }])
//         .by([10, 20, { x: 3 }])
//         .then(true),
//     ).toEqual(true)
//   })
// })
