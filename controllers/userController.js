const User = require('../models/User')

const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)

exports.findOrCreateUser = async (token) => {
    const userInfo = await client.verifyIdToken({idToken: token})

    const { payload: { email, name, picture } } = userInfo
    const user = await findUser(email)
    return user ? user : new User({email, name, picture}).save()
}

findUser = async (email) => await User.findOne({email: email}).exec()