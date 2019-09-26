const { AuthenticatedError, PubSub } = require('apollo-server')
const Pin = require('./models/Pin')

const authenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser){
        throw new AuthenticatedError('You must be logged in')
    }
    return next(root, args, ctx, info)
}

const pubSub = new PubSub()
const PIN_ADDED = "PIN_ADDED"
const PIN_DELETED = "PIN_DELETED"
const PIN_UPDATED = "PIN_UPDATED"

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
            const pinAdded =  await Pin.populate(newPin, 'author')
            pubSub.publish(PIN_ADDED, { pinAdded })
            return pinAdded
        }),
        deletePin: authenticated(async (root, args, ctx, info) => {
            const deletedPin = await Pin.findOneAndDelete({_id: args.input.PinId}).exec()
            return deletedPin
        }),
        createComment: authenticated(async (root, args, ctx, info) => {
            const comment = {text: args.input.text, author: ctx.currentUser._id}
            const pin = await Pin.findOneAndUpdate(
                {_id: args.input.PinId},
                {
                    $push: {
                        comments: comment
                    }   
                },
                {
                    new: true
                }
            )
            .populate("author")
            .populate("comments.author")
            return pin
        })
     },
     Subscription: {
         pinAdded: {
             subscribe: () => pubSub.asyncIterator(PIN_ADDED)
         },
         pinDeleted: {
            subscribe: () => pubSub.asyncIterator(PIN_DELETED)
         },
         pinUpdated: {
            subscribe: () => pubSub.asyncIterator(PIN_UPDATED)
         }
     }
}