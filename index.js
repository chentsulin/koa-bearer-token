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
      token = query[queryKey]
    }

    if (body && body[bodyKey]) {
      if (token) {
        err = true
      }
      token = body[bodyKey]
    }

    if (header && header.authorization) {
      var parts = header.authorization.split(' ')
      if (parts.length === 2 && parts[0] === headerKey) {
        if (token) {
          err = true
        }
        token = parts[1]
      }
    }

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (err) {
      this.throw(400, 'token_invalid', {
        message: 'access_token MUST NOT be provided in more than one place'
      })
    } else {
      r[reqKey] = token
      yield next
    }

  }
}
