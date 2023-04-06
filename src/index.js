import { default as matchBy } from "./match"

function match(x) {
  if (Array.isArray(x)) return
  if (typeof x === "object") return
  return matchBy(x)
}

export default match
export const FAIL_VALUE = [null]
