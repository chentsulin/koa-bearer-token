
module.exports = function(opts = {}) {
  const queryKey = opts.queryKey || 'access_token'
  const bodyKey = opts.bodyKey || 'access_token'
  const headerKey = opts.headerKey || 'Bearer'
  const reqKey = opts.reqKey || 'token'

  return function (ctx, next) {
    const {body, header, query} = ctx.request

    let count = 0
    let token

    if (query && query[queryKey]) {
      token = query[queryKey]
      count += 1
    }

    if (body && body[bodyKey]) {
      token = body[bodyKey]
      count += 1
    }

    if (header && header.authorization) {
      const parts = header.authorization.split(' ')
      if (parts.length === 2 && parts[0] === headerKey) {
        token = parts[1]
        count += 1
      }
    }

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (count > 1) {
      ctx.throw(400, 'token_invalid', {
        message: `${queryKey} MUST NOT be provided in more than one place`
      })
      return
    }

    ctx.request[reqKey] = token
    return next()
  }
}
