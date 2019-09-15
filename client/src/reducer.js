
export default function reducer(state, {type, payload}){
    switch(type){
        case "LOGIN_COMPLETE":
            return {
                ...state,
                currentUser: payload
                
            }
        
        case "IS_LOGGED_IN":
            return {
                ...state,
                isAuth: payload
            }
        
        case "SIGN_OUT_USER":
            return {
                ...state,
                isAuth: false,
                currentUser: null
            }
        case "CREATE_PIN":
            return {
                ...state,
                draftPins: {
                    latitude: 0.0,
                    longitude: 0.0
                }
            }
        case "GET_PINS":
            return {
                ...state,
                pins: payload
            }
        case "DELETE_DRAFT":
            return {
                ...state,
                draftPins: null
            }
        case "UPDATE_PIN":
            return {
                ...state,
                draftPins: {
                    latitude: payload.latitude,
                    longitude: payload.longitude
                }
            }
        default:
            return state
    }
}