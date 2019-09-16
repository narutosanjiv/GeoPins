const { AuthenticatedError } = require('apollo-server')
const Pin = require('./models/Pin')

const authenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser){
        throw new AuthenticatedError('You must be logged in')
    }
    return next(root, args, ctx, info)
}

module.exports = {
     Query: {
         me: authenticated((root, args, ctx, info) => ctx.currentUser),
         getPins: async (root, args, ctx, info) => {
            const pins = await Pin.find({}).populate('author').populate('comments.author')
            return pins
        }
     },
     Mutation: {
        createPin: authenticated(async (root, args, ctx, info) => {
            const newPin = new Pin({
                ...args.input,
                author: ctx.currentUser._id
            }).save()
            return await Pin.populate(newPin, 'author')
        }),
        deletePin: authenticated(async (root, args, ctx, info) => {
            const deletedPin = await Pin.findOneAndDelete({_id: args.input.PinId}).exec()
            return deletedPin
        })
     }
}