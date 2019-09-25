import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";

import Context from '../../context'
import { CREATE_COMMENT_MUTATION } from "../../graphql/mutations";
import { useClient } from '../../client'

const CreateComment = ({ classes }) => {
  const [ comment, setComment ] = useState('')
  const { state, dispatch } = useContext(Context)
  const currentPin = state.currentPin
  const client = useClient()
  const handleSubmit = async (e) => {
    
    const variables = { 
      text: comment,
      PinId: currentPin._id
    }
    const res = await client.request(CREATE_COMMENT_MUTATION, variables)
    dispatch({ type: "CREATE_COMMENT", payload: res.createComment })
    setComment("")
  }

  return <>
    <form className={classes.form} >
      <IconButton disabled={!comment.trim()} onClick={() => setComment("") } className={classes.clearButton}>
        <ClearIcon />
      </IconButton>
      <InputBase className={classes.input} placeholder="Add Comment"  value={comment} multiline={true} onChange={(e) => setComment(e.target.value)}/>
      <IconButton disabled={!comment.trim()} className={classes.sendButton} onClick={handleSubmit}>
        <SendIcon />
      </IconButton>
    </form>
    <Divider />
  </>;
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
