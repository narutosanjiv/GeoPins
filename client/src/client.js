import React, { useEffect, useState } from 'react'
import { GraphQLClient } from 'graphql-request'

export const useClient = () => {
    const BASE_URL = 'http://localhost:4000/graphql'
    const [idToken, setidToken] = useState("")
    useEffect(() => {
        const id_token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
        setidToken(id_token)
    }, [])
    const client = new GraphQLClient(BASE_URL,
        {
          headers: {
            authorization: idToken
          }
        }
    )
    return client
}