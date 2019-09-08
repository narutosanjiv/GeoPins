const { AuthenticatedError } = require('apollo-server')

const authenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser){
        throw new AuthenticatedError('You must be logged in')
    }
    return next(root, args, ctx, info)
}

module.exports = {
     Query: {
         me: authenticated((root, args, ctx, info) => ctx.currentUser)
     }
}