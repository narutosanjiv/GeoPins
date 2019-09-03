const user = {
    _id: "1",
    name: "Reed",
    email: "narutosanjiv@gmail.com",
    picture: "https://cloudinary.com/asdf"
}

module.exports = {
     Query: {
         me: () => user
     }
}