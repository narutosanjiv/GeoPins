
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
        default:
            return state
    }
}