export const ME_QUERY=`
{
  me {
    _id
    name
    email
    picture
  }
}
`
export const GET_PINS_QUERY=`
  {
    getPins{
      _id
      createdAt
      title
      image
      content
      author{
        _id
        email
        name
        picture
      }
      comments{
        text
        createdAt
        author{
          _id
          email
          name
          picture
        }
      }
    }
  }
`