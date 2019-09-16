import React, { useState, useContext } from "react";
import { GraphQLClient } from 'graphql-request'
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Context from '../../context'
import axios from 'axios'
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from '../../client'

const CreatePin = ({ classes }) => {
  const [ title, setTitle ] = useState("")
  const [ content, setContent ] = useState("")
  const [ image, setImage ] = useState("")
  const { state, dispatch } = useContext(Context)
  const [ submitting, setSubmitting ] = useState(false)
  const client = useClient()

  const handleFileUpload = async () => {
    const form_data = new FormData()
    form_data.append("cloud_name", "narutosanjiv")
    form_data.append("upload_preset", "geopins")
    form_data.append("file", image)
    const upload_url = "https://api.cloudinary.com/v1_1/narutosanjiv/image/upload"
    const res = await axios.post(upload_url, form_data)
    return res.data.url
  }
  
  const handleSubmit = async (event) => {

    event.preventDefault()
    try{
      setSubmitting(true)
      const url = await handleFileUpload()
      const { latitude, longitude } = state.draftPins
      const variables = {title, image: url, content, latitude, longitude}
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables) 
      dispatch({ type: 'CREATE_PIN', payload: createPin })
      console.log("Pin Created: {}", { createPin })
      handleDiscard(event)
    } catch (err){
      setSubmitting(false)
      console.error("Error in creating", err)
    }
    
  }

  const handleDiscard = (event) => {
    setTitle("")
    setContent("")
    setImage("")
    dispatch({type: "DELETE_DRAFT"})

  }

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"

      >
        <LandscapeIcon className={classes.iconLarge} />
        Pin Location
      </Typography>
      <div>
        <TextField
          name='title'
          label='Title'
          placeholder='Insert pin title'
          onChange={
            (event) => {
              console.log(event.target.value)
              setTitle(event.target.value)
            }
          }
        />

        <input accept="image/" 
          id="image"
          type="file"
          className={classes.input}
          onChange={
            (event) => {
              console.log(event.target.files)
              setImage(event.target.files[0])
            }
          }
        />
        <label htmlFor="image">
          <Button 
            component="span"
            size="small"
            className={classes.button}
            style={{ color: image && "green" }}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="content"
          multiline
          rows="6"
          margin='normal'
          fullWidth
          variant="outlined"
          onChange={
            (event) => {
              console.log(event.target.value)
              setContent(event.target.value)
            }
          }
        />
      </div>
      <div>
        <Button 
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDiscard}
        >
          <ClearIcon className={classes.leftIcon}/>
          Discard
        </Button>

        <Button 
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting }
          onClick={handleSubmit}
        >
          Submit 
          <SaveIcon className={classes.rightIcon}/> 
        </Button>

      </div>

    </form>
  )
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
