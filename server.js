const { ApolloServer } = require('apollo-server')

const typeDefs = require('./typeDefs')

const resolvers = require('./resolvers')

const { findOrCreateUser } = require('./controllers/userController')
 
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        let authToken = null
        debugger
        try {
            authToken = req.headers.authorization
            if (authToken){
                let current_user = await findOrCreateUser(authToken)
                return { current_user }
            }
        } catch (err){
            console.error(`Unable to authenticate user with token ${authToken}`)
        }
    }
})
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})
.then(() => console.log('mongodb connected'))
.catch((err) => {
    console.error(err)
})

server.listen().then(({url}) => {
    console.log(`Server is listening on ${url}`)
})