import { createContext } from 'react'

const Context = createContext({
    currentUser: null,
    isAuth: false,
    draftPins: null,
    pins: []
})

export default Context