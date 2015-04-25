'use strict'

module.exports = function(opts) {
  opts = opts || {}

  var queryKey = opts.queryKey || 'access_token'
  var bodyKey = opts.bodyKey || 'access_token'
  var headerKey = opts.headerKey || 'Bearer'
  var reqKey = opts.reqKey || 'token'

  return function *(next) {
    var token, err

    var r = this.request

    var query = r.query
    var body = r.body
    var header = r.header

    if (query && query[queryKey]) {

    }

    if (body && body[bodyKey]) {

    }

    if (true) {};

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (err) {
      throw new Error()
    } else {
      r[reqKey] = token
      yield next
    }

  }
}
