import matchIf from '../index'

describe('variable Match from lib', () => {
  test('should return then Value when variables matches', () => {
    expect(matchIf(10).is(10).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(matchIf(1).is(10).then(100)).toEqual(false)
  })
});
