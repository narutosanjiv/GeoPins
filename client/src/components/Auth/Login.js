import React from "react";
import { GoogleLogin } from 'react-google-login';
import { GraphQLClient } from 'graphql-request'

import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY=`
{
  me {
    _id
    name
    email
    picture
  }
}
`

const Login = ({ classes }) => {

  const onSuccess = async googleUser => {
    console.log(googleUser)
    const idToken = googleUser.getAuthResponse().id_token
    const client = new GraphQLClient('http://localhost:4000/', {
      headers: { authorization: idToken }
    })
    const data = await client.request(ME_QUERY)
    console.log(data)
  }

  return <GoogleLogin 
          clientId="778832033685-ugcmktal6pkqs8rnlatoafd18s3jlf7h.apps.googleusercontent.com"
          onSuccess={onSuccess}
          onFailure={(error) => console.error(error)}
          isSignedIn={true}
          />
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
