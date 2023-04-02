import matchIf from "../variable"

describe('variable Match with number', () => {
  test('should return then Value when variables matches', () => {
    expect(matchIf(10).is(10).then(100)).toEqual(100)
    expect(matchIf(10.34).is(10.34).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(matchIf(1).is(10).then(100)).toEqual(false)
    expect(matchIf(10.23).is(10.32).then(100)).toEqual(false)
  })
});

describe('variable Match with string', () => {
  test('should return then Value when variables matches', () => {
    expect(matchIf("Hello").is("Hello").then(100)).toEqual(100)
    expect(matchIf("my name is Mai Nam").is("my name is Mai Nam").then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(matchIf("Hello").is("hello").then(100)).toEqual(false)
  })
});

describe('variable Match with boolean', () => {
  test('should return then Value when variables matches', () => {
    expect(matchIf(true).is(true).then(100)).toEqual(100)
    expect(matchIf(false).is(false).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(matchIf(true).is(false).then(100)).toEqual(false)
    expect(matchIf(false).is(true).then(100)).toEqual(false)
  })
});

describe('variable Match with null/undefined', () => {
  test('should return then Value when variables matches', () => {
    expect(matchIf(null).is(null).then(100)).toEqual(100)
    expect(matchIf(undefined).is(undefined).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(matchIf(null).is(undefined).then(100)).toEqual(false)
    expect(matchIf(undefined).is(null).then(100)).toEqual(false)
  })
});

describe('variable Match with null/undefined', () => {
  function trueIf10(x) {
    return matchIf(x).is(10).then(true)
  }
  test('matchIf with function', () => {
    expect(trueIf10(10)).toEqual(true)
    expect(trueIf10(100)).toEqual(false)
  })
});
