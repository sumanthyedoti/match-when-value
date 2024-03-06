class MatchError extends Error {
  constructor(message) {
    super(message)
    this.name = "MatchError"
  }
}

module.exports = {
  MatchError,
}
