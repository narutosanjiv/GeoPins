import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker } from 'react-map-gl'
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
  const [state, setViewPortState] = useState(INITIAL_STATE)
  const [userPosition, setUserPosition] = useState(null)
  useEffect(() => {
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((pos) => {
        const { longitude, latitude } = pos.coords
        setUserPosition({latitude, longitude})
        setViewPortState({
          ...state, 
          latitude, 
          longitude
        })
      })
    }
  }, [])
  
  return (
      <div className={classes.root}>
        <ReactMapGL 
          width="100vw"
          height="calc(100vh - 64px)"
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          mapboxApiAccessToken={token}
          {...state}
          onViewportChange={(newViewPort) => {
            setViewPortState(newViewPort)
          }}
        >
          <div className={classes.navigationControl}>
            <NavigationControl onViewportChange={(newViewPort) => {
              setViewPortState(newViewPort)
            }}/>
          </div>

          { userPosition && <Marker latitude={userPosition.latitude} longitude={userPosition.longitude} offsetLeft={37} offsetTop={20}>
            <div>You are here</div>
          </Marker> }
        </ReactMapGL>
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
