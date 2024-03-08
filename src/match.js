import { isObjectEmpty, lastElement, isFalsy } from "./utils.js"
import { FAIL_VALUE, PATTERNS } from "./config.js"

function isArraysMatch(orignal, target) {
  const pickedElements = []
  if (orignal.length < target.length) return [false, FAIL_VALUE]
  if (
    target.length < orignal.length &&
    lastElement(target) !== PATTERNS.SKIP_REMAINING &&
    lastElement(target) !== PATTERNS.PICK_REMAINING
  ) {
    return [false, FAIL_VALUE]
  }
  if (orignal.length > 0 && target.length === 0) return [false, FAIL_VALUE]
  for (let i = 0; i < target.length; i++) {
    if (target[i] === PATTERNS.SKIP_ELEMENT) continue
    if (target[i] === PATTERNS.SKIP_REMAINING) break
    if (target[i] === PATTERNS.PICK_ELEMENT) {
      pickedElements.push(orignal[i])
      continue
    }
    if (target[i] === PATTERNS.PICK_REMAINING) {
      for (let j = i; j < orignal.length; j++) {
        pickedElements.push(orignal[j])
      }
      break
    }
    const [isMatch, returnValue, isPicked] = isValuesMatch(
      orignal[i],
      target[i],
    )
    if (isPicked) {
      pickedElements.push(returnValue)
    }
    if (!isMatch) return [false, FAIL_VALUE]
  }
  const isPicked = !isObjectEmpty(pickedElements)
  return isPicked ? [true, pickedElements, true] : [true, orignal, false]
}

function isObjectsMatch(orignal, target) {
  if (!isObjectEmpty(orignal) && isObjectEmpty(target))
    return [false, FAIL_VALUE]
  const pickedFields = {}
  const keys = Object.keys(target)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const [isMatch, returnValue, isPicked] = isValuesMatch(
      orignal[key],
      target[key],
    )
    if (isPicked) {
      pickedFields[key] = returnValue
    }
    if (!isMatch && target[key] !== PATTERNS.PICK_ELEMENT) {
      return [false, FAIL_VALUE]
    }
    if (target[key] === PATTERNS.PICK_ELEMENT) {
      pickedFields[key] = orignal[key]
      continue
    }
  }
  const isPicked = !isObjectEmpty(pickedFields)
  return isPicked ? [true, pickedFields, true] : [true, orignal, false]
}

function isValuesMatch(original, target) {
  if (target === "_") return [true, original]
  if (typeof original !== typeof target) return [false, FAIL_VALUE]
  if (Array.isArray(original) && Array.isArray(target)) {
    return isArraysMatch(original, target)
  }
  if (typeof original === "object" && original !== null) {
    return isObjectsMatch(original, target)
  }
  return original === target ? [true, target] : [false, FAIL_VALUE]
}

function match(x) {
  const when = (previousValue) => (pattern, valueIfMatch) => {
    if (!isFalsy(previousValue)) {
      return {
        when: when(previousValue),
        value: previousValue,
      }
    }

    const [isMatch, valueFromMatcher] = isValuesMatch(x, pattern)

    if (!isMatch) {
      return {
        when: when(valueFromMatcher),
        value: valueFromMatcher,
      }
    }

    const returnValue =
      typeof valueIfMatch === "function"
        ? valueIfMatch(valueFromMatcher)
        : valueIfMatch

    return {
      when: when(returnValue),
      value: returnValue,
    }
  }

  return {
    when: when(FAIL_VALUE),
  }
}

module.exports = match
