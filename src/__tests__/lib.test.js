import match from '../match'

describe('variable Match from lib', () => {
  test('should return then Value when variables matches', () => {
    expect(match(10).by(10).then(100)).toEqual(100)
  })
  test('should return false when variables does not matche', () => {
    expect(match(1).by(10).then(100)).toEqual(false)
  })
});
