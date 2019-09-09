import React, { useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { GoogleLogout } from 'react-google-login'

import Context from '../../context' 

const Signout = ({ classes }) => {
  const { dispatch } = useContext(Context)

  const onLogoutHandler = () => {
    dispatch({ type: "SIGN_OUT_USER" })
    console.log('signing out user')
  }

  return (
    <GoogleLogout 
      render={({onClick}) =>(
          <span onClick={onClick} className={classes.root}>
            <Typography 
              variant="body1"
              className={classes.buttonText}
            >
              Signout
            </Typography>
            <ExitToApp className={classes.buttonIcon} />
          </span>
        
        )
      }
      onLogoutSuccess={onLogoutHandler}
    />
  )
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);
