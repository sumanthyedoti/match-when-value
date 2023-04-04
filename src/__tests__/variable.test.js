import match from "../variable"

describe('variable Match with number', () => {
  test('should return then Value when variables matches', () => {
    expect(match(10).by(10).then(100)).toEqual(100)
    expect(match(10.34).by(10.34).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(match(1).by(10).then(100)).toEqual(false)
    expect(match(10.23).by(10.32).then(100)).toEqual(false)
  })
});

describe('variable Match with string', () => {
  test('should return then Value when variables matches', () => {
    expect(match("Hello").by("Hello").then(100)).toEqual(100)
    expect(match("my name is Mai Nam").by("my name is Mai Nam").then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(match("Hello").by("hello").then(100)).toEqual(false)
  })
});

describe('variable Match with boolean', () => {
  test('should return then Value when variables matches', () => {
    expect(match(true).by(true).then(100)).toEqual(100)
    expect(match(false).by(false).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(match(true).by(false).then(100)).toEqual(false)
    expect(match(false).by(true).then(100)).toEqual(false)
  })
});

describe('variable Match with null/undefined', () => {
  test('should return then \'by\' value variables matches', () => {
    expect(match(null).by(null).then(100)).toEqual(100)
    expect(match(undefined).by(undefined).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(match(null).by(undefined).then(100)).toEqual(false)
    expect(match(undefined).by(null).then(100)).toEqual(false)
  })
});

describe('Use functions for expression', () => {
  function trueIf10(x) {
    return match(x).by(10).then(true)
  }
  test('match with function', () => {
    expect(trueIf10(10)).toEqual(true)
    expect(trueIf10(100)).toEqual(false)
  })
});

describe('use comparision operators', () => {
  test('match with function', () => {
    expect(match(10 > 20).then(100)).toEqual(false)
    expect(match(10 < 20).then(100)).toEqual(100)
  })
});

describe('with arrays', () => {
  const x = 10;
  const arr = [10, 20, null, undefined, "Hello", x, 20, 30]
  test('exact array matches', () => {
    expect(match(arr).by([10, 20]).then(100)).toEqual(100)
    const y = 20;
    expect(match(arr).by([10, y, null, undefined, "Hello", 10]).then(100)).toEqual(100)
  })
  test('matches if elements in 2nd array matches but has less elements', () => {
    expect(match(arr).by([10]).then(100)).toEqual(100)
  })
  test('wrong elements fails to match', () => {
    expect(match(arr).by([11, 20]).then(100)).toEqual(false)
    expect(match(arr).by([11]).then(100)).toEqual(false)
  })
  test('fails if 2nd array has more elements', () => {
    expect(match([10, 20]).by([10, 20, 30]).then(100)).toEqual(false)
  })
});
