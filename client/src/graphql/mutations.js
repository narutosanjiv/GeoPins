export const CREATE_PIN_MUTATION=`
    mutation($title: String!, $image: String!, $content: String!, $latitude: Float!, $longitude: Float!){
        createPin(input: {
            title: $title,
            image: $image,
            content: $content,
            latitude: $latitude,
            longitude: $longitude
        }){
            _id
            createdAt
            title
            image
            content
            latitude
            longitude
            author {
                _id
                name
                email
                picture
            }
        }
    }
`
export const DELETE_PIN_MUTATION=`
    mutation($PinId: ID!){
        deletePin(input: {
            PinId: $PinId
        }){
            _id
        }
    }
`
export const CREATE_COMMENT_MUTATION=`
    mutation($PinId: ID!, $text: String!){
        createComment(input: {
            PinId: $PinId,
            text: $text 
        }){
            _id
            createdAt
            title
            image
            content
            latitude
            longitude
            author {
                _id
                name
                email
                picture
            }
            comments {
                text
                author {
                    _id
                    name
                    email
                    picture
                }
                createdAt
            }
        }
    }
`
