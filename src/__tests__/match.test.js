const match = require("../match.js")
const { FAIL_VALUE, PATTERNS } = require("../config.js")
const { SKIP_ELEMENT, PICK_ELEMENT, SKIP_REMAINING, PICK_REMAINING } = PATTERNS

describe("variable Match with primitive values", () => {
  test("should return then Value when variables matches", () => {
    expect(match(10).when(10, 100).value).toEqual(100)
    expect(match(10.34).when(10.34, 100).value).toEqual(100)
    expect(match("Hello").when("Hello", 100).value).toEqual(100)
    expect(
      match("my name is Mai Nam").when("my name is Mai Nam", 100).value,
    ).toEqual(100)
    expect(match(true).when(true, 100).value).toEqual(100)
    expect(match(false).when(false, 100).value).toEqual(100)
    expect(match(null).when(null, 100).value).toEqual(100)
    expect(match(undefined).when(undefined, 100).value).toEqual(100)
  })

  test("should return false when variables does not matche", () => {
    expect(match(1).when(10, 100).value).toEqual(FAIL_VALUE)
    expect(match(10.23).when(10.32, 100).value).toEqual(FAIL_VALUE)
    expect(match("Hello").when("hello", 100).value).toEqual(FAIL_VALUE)
    expect(match(true).when(false, 100).value).toEqual(FAIL_VALUE)
    expect(match(false).when(true, 100).value).toEqual(FAIL_VALUE)
    expect(match(null).when(undefined, 100).value).toEqual(FAIL_VALUE)
    expect(match(undefined).when(null, 100).value).toEqual(FAIL_VALUE)
  })
})

describe('Any match with "_"', () => {
  test("Should return value at 'any' pattern (\"_\") when previous patterns did not match)", () => {
    expect(match(null).when("_", 100).value).toEqual(100)
    expect(match(null).when("_", () => 100).value).toEqual(100)
    expect(match(2).when(1, 10).when("_", 100).value).toEqual(100)
  })
  test("Should value of matched pattern)", () => {
    expect(match(2).when(2, 10).when("_", 100).value).toEqual(10)
  })
})

describe("Basic functions", () => {
  function factorial(n) {
    return match(n)
      .when(0, 1)
      .when("_", (n) => {
        return n * factorial(n - 1)
      }).value
  }
  function length(li) {
    return match(li)
      .when([], 0)
      .when("_", (li) => {
        return 1 + length(li.slice(1))
      }).value
  }
  test("length", () => {
    expect(length([3, 2, 4, 5])).toEqual(4)
  })
  test("factorial", () => {
    expect(factorial(10)).toEqual(3628800)
    expect(factorial(0)).toEqual(1)
  })
})

describe("Mismatching types", () => {
  test("should fail with mismatching types", () => {
    expect(match(null).when(2, 100).value).toEqual(FAIL_VALUE)
    expect(match([10]).when(2, 100).value).toEqual(FAIL_VALUE)
    expect(match("100").when(2, 100).value).toEqual(FAIL_VALUE)
    expect(match("hi").when(2, 100).value).toEqual(FAIL_VALUE)
  })
})

describe("Use functions for expression", () => {
  function trueIf10(x) {
    return match(x).when(10, true).value
  }
  test("match with function", () => {
    expect(trueIf10(10)).toEqual(true)
    expect(trueIf10(100)).toEqual(FAIL_VALUE)
  })
})

describe("with arrays", () => {
  const x = 10
  const arr = [10, 20, null, undefined, "Hello", x, 20, 30]
  test("fails if elements in 2nd array matches but has less elements", () => {
    expect(match(arr).when([10], 100).value).toEqual(FAIL_VALUE)
  })

  test("exact array matches", () => {
    expect(match([10, 20]).when([10, 20], 100).value).toEqual(100)
    const y = 20
    expect(
      match(arr).when([10, y, null, undefined, "Hello", 10, 20, 30], 100).value,
    ).toEqual(100)
  })

  test("wrong elements fails to match", () => {
    expect(match(arr).when([11, 20], 100).value).toEqual(FAIL_VALUE)
    expect(match(arr).when([11], 100).value).toEqual(FAIL_VALUE)
  })

  test("fails if 2nd array has more elements", () => {
    expect(match([10, 20]).when([10, 20, 30], 100).value).toEqual(FAIL_VALUE)
    expect(match([]).when([10, 20, 30], 100).value).toEqual(FAIL_VALUE)
  })

  test("two empty array match", () => {
    expect(match([]).when([], 100).value).toEqual(100)
  })

  test("fails if 2nd array is empty", () => {
    expect(match([10, 20]).when([], 100).value).toEqual(FAIL_VALUE)
  })

  test("skip element if it is " + PATTERNS.SKIP_ELEMENT, () => {
    expect(match([10, 20, 30]).when([10, SKIP_ELEMENT, 30], 100).value).toEqual(
      100,
    )
    expect(
      match([10, "_", 30]).when([10, SKIP_ELEMENT, 30], 100).value,
    ).toEqual(100)
  })

  test("skip remaining element if it is " + PATTERNS.SKIP_REMAINING, () => {
    expect(
      match(arr).when([10, 20, PATTERNS.SKIP_REMAINING], 100).value,
    ).toEqual(100)
    expect(match(arr).when([10, PATTERNS.SKIP_REMAINING], 100).value).toEqual(
      100,
    )
    expect(
      match([10, 20, 30, 40, 50, 60]).when(
        [10, SKIP_ELEMENT, 30, PATTERNS.SKIP_REMAINING],
        100,
      ).value,
    ).toEqual(100)
  })

  test("fails if 2nd array is smaller than 1st array but no skip pattern at the end", () => {
    expect(match([10, 20]).when([10], 100).value).toEqual(FAIL_VALUE)
  })

  test("passes if 2nd array is smaller than 1st array but there is skip pattern at the end", () => {
    expect(match([10, 20]).when([10, SKIP_ELEMENT], 100).value).toEqual(100)
  })

  test("return original array if matches", () => {
    expect(
      match([10, 20, 30]).when([10, SKIP_REMAINING], (arr) => arr[2]).value,
    ).toEqual(30)
  })

  test("return array of matching elements (picked elements) if pick pattern exists in match-by array", () => {
    expect(
      match([10, 20, 30]).when(
        [10, PATTERNS.PICK_ELEMENT, SKIP_ELEMENT],
        ([x] = params) => x,
      ).value,
    ).toEqual(20)
    expect(
      match([10, [10, 20], 30]).when(
        [10, PICK_ELEMENT, 30],
        ([x] = params) => x,
      ).value,
    ).toEqual([10, 20])
    expect(
      match([10, { x: 10, y: 20 }, 30]).when(
        [10, PICK_ELEMENT, PICK_ELEMENT],
        (params) => params,
      ).value,
    ).toEqual([{ x: 10, y: 20 }, 30])
    expect(
      match([10, { x: 10, y: 20 }, 30]).when(
        [10, PICK_ELEMENT, 30],
        ([x] = params) => x,
      ).value,
    ).toEqual({ x: 10, y: 20 })
    expect(
      match([10, { x: 10, y: 20 }, 30]).when(
        [SKIP_ELEMENT, PICK_ELEMENT, SKIP_REMAINING],
        ([x] = params) => x,
      ).value,
    ).toEqual({ x: 10, y: 20 })
    expect(
      match([10, [20, 30], 30, { x: 2, y: 4 }, 50, 60]).when(
        [10, PICK_ELEMENT, SKIP_ELEMENT, PICK_ELEMENT, SKIP_REMAINING],
        (params) => params,
      ).value,
    ).toEqual([[20, 30], { x: 2, y: 4 }])
  })

  test("picks all remianing elements from original array", () => {
    expect(
      match(arr).when(
        [10, PICK_ELEMENT, PICK_ELEMENT, SKIP_ELEMENT, PICK_REMAINING],
        (arr) => arr,
      ).value,
    ).toEqual([20, null, "Hello", x, 20, 30])
    expect(
      match(arr).when(
        [
          SKIP_ELEMENT,
          PICK_ELEMENT,
          PICK_ELEMENT,
          SKIP_ELEMENT,
          PICK_REMAINING,
        ],
        (arr) => arr,
      ).value,
    ).toEqual([20, null, "Hello", x, 20, 30])
  })

  test("if picked deeply, return only elements", () => {
    expect(
      match([20, 30, { x: 40, y: 10, z: [2, [4, 5, 6], 5] }]).when(
        [20, 30, { x: 40, z: ["~", [4, "~", "~"], "_"] }],
        (obj) => obj,
      ).value,
    ).toEqual([{ z: [2, [5, 6]] }])
  })
})

describe("with object", () => {
  const obj = { x: 10, y: 10.23, z: "hello", u: null, v: undefined, w: 20 }
  test("passes if values of 2nd object matches with 1st object", () => {
    expect(match(obj).when({ x: 10 }, (val) => val).value).toEqual(obj)
    expect(match(obj).when({ u: null, v: undefined }, 100).value).toEqual(100)
  })

  test("wrong elements fails to match", () => {
    expect(match(obj).when({ x: 10, y: 10.23, w: 30 }, 100).value).toEqual(
      FAIL_VALUE,
    )
    expect(match(obj).when([11], 100).value).toEqual(FAIL_VALUE)
  })

  test("two empty objects match", () => {
    expect(match({}).when({}, 100).value).toEqual(100)
  })

  test("fails if 2nd object is empty", () => {
    expect(match({ x: 10 }).when({}, 100).value).toEqual(FAIL_VALUE)
  })

  test("returns picked object fields", () => {
    expect(
      match({ x: 10, y: 20, z: PICK_ELEMENT }).when({ x: 10 }, 100).value,
    ).toEqual(100)
  })

  test("returns picked object fields", () => {
    expect(
      match({ w: 5, x: 10, y: 20, z: "~" }).when(
        { x: "~", z: PICK_ELEMENT },
        (obj) => obj,
      ).value,
    ).toEqual({ x: 10, z: "~" })
  })

  test("if picked deeply, return those fields", () => {
    expect(
      match({ x: 20, y: { x: 10, y: 20, z: 30 } }).when(
        { x: 20, y: { x: 10, y: "~" } },
        (obj) => obj,
      ).value,
    ).toEqual({ y: { y: 20 } })
  })
})

describe("'then' can take any primitive, composite values and functions", () => {
  function log2(val) {
    return Math.log(val) / Math.log(2)
  }
  test("primitive values", () => {
    expect(match(10).when(10, null).value).toEqual(null)
    expect(match(10).when(10, undefined).value).toEqual(undefined)
    expect(match(10).when(10, 10.23).value).toEqual(10.23)
    expect(match(10).when(10, "hello").value).toEqual("hello")
  })

  test("composite values", () => {
    const arr = [10, 20]
    expect(match(10).when(10, arr).value).toBe(arr)
    const obj = { x: 10, y: 20 }
    expect(match(10).when(10, obj).value).toBe(obj)
  })

  test("functions", () => {
    expect(match(10).when(10, (x) => x === 10).value).toEqual(true)
    expect(match(8).when(8, log2).value).toEqual(3)
    const arraySum = (arr) => {
      return arr.reduce((acc, x) => acc + x, 0)
    }
    expect(
      match([10, 20, 30, 40]).when(
        [10, SKIP_ELEMENT, 30, SKIP_ELEMENT],
        arraySum,
      ).value,
    ).toEqual(100)
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
      match(arr).when(
        [10, 20, { x: 3, w: [1, { x: 20, y: 40 }] }],
        (val) => val,
      ).value,
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
      match(arr).when(
        [10, 20, { x: 3, w: [1, { x: 20, y: 40, z: { x: 20, y: 30 } }] }],
        (val) => val,
      ).value,
    ).toEqual(FAIL_VALUE)
  })

  test("object - fails when deep array fails", () => {
    const obj = {
      x: 10,
      y: { x: 20, z: [10, 20, { d: 3, k: "hello" }] },
      z: [3, 4, [1, 2], { x: 20, y: 30 }],
    }
    expect(
      match(obj).when({ y: { x: 20, z: [10] } }, (val) => val).value,
    ).toEqual(FAIL_VALUE)
  })

  test("object - passes", () => {
    const obj = {
      x: 10,
      y: { x: 20, z: [10, 20, { d: 3, k: "hello" }] },
      z: [3, 4, [1, 2], { x: 20, y: 30 }],
    }
    expect(
      match(obj).when({ y: { x: 20, z: [10, SKIP_REMAINING] } }, (val) => val)
        .value,
    ).toEqual(obj)
    expect(
      match(obj).when(
        { y: { x: 20, z: [10, SKIP_REMAINING] }, z: "~" },
        (val) => val,
      ).value,
    ).toEqual({ z: [3, 4, [1, 2], { x: 20, y: 30 }] })
  })
})
