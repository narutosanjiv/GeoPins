import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker } from 'react-map-gl'
import PinIcon from './PinIcon'
import Blog from './Blog'
import Context from '../context'
import { GET_PINS_QUERY } from '../graphql/queries'
import { useClient } from '../client'
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_STATE={
  longitude: 78.3351861,
  latitude: 17.5103503,
  zoom: 13
}

const Map = ({ classes }) => {
  const token = "pk.eyJ1IjoibmFydXRvc2Fuaml2IiwiYSI6ImNrMGN0YmxkaTAwdHUzbG96ZjEzcW03ZWgifQ.lMKC5IEdLbiJyrKMyjCwpw"
  const [viewPortstate, setViewPortState] = useState(INITIAL_STATE)
  const [userPosition, setUserPosition] = useState(null)
  const { state, dispatch } = useContext(Context)
  const client = useClient()
  const get_pins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY)
    console.log("getPins")
    dispatch({ type: 'GET_PINS', payload: getPins })
    console.log(getPins)
  }

  useEffect(() => {
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((pos) => {
        const { longitude, latitude } = pos.coords
        setUserPosition({latitude, longitude})
        setViewPortState({
          ...viewPortstate, 
          latitude, 
          longitude
        })
      })
    }
  }, [])
  
  useEffect(() => {
    get_pins()
  }, [])

  const handlerClick = ({ lngLat, leftButton }) => {
    console.log(leftButton)
    if(!leftButton) return 
    if(!state.draftPins){
      dispatch({type: 'CREATE_PIN'})
    }
    const [ longitude, latitude ] = lngLat
    dispatch({
      type: 'UPDATE_PIN',
      payload: {
        longitude,
        latitude
      }
    })
  }

  return (
      <div className={classes.root}>
        <ReactMapGL 
          width="100vw"
          height="calc(100vh - 64px)"
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          mapboxApiAccessToken={token}
          {...viewPortstate}
          onViewportChange={(newViewPort) => {
            setViewPortState(newViewPort)
          }}
          onClick={handlerClick}
        >
          <div className={classes.navigationControl}>
            <NavigationControl onViewportChange={(newViewPort) => {
              setViewPortState(newViewPort)
            }}/>
          </div>

          { userPosition && <Marker latitude={userPosition.latitude} longitude={userPosition.longitude} offsetLeft={-19} offsetTop={-37}>
            <PinIcon size="38" color="red"/>
          </Marker> }

          { state.draftPins && <Marker latitude={state.draftPins.latitude} longitude={state.draftPins.longitude} offsetLeft={-19} offsetTop={-37}>
              <PinIcon size="38" color="hotpink"/>
            </Marker>
          }
        </ReactMapGL>
        <Blog />
      </div>

    );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
