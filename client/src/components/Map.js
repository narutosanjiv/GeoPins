import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker, Popup } from 'react-map-gl'
import PinIcon from './PinIcon'
import Blog from './Blog'
import Context from '../context'
import { GET_PINS_QUERY } from '../graphql/queries'
import { DELETE_PIN_MUTATION  } from '../graphql/mutations'
import { PIN_ADDED_SUBSCRIPTION, PIN_UPDATED_SUBSCRIPTION, PIN_DELETED_SUBSCRIPTION } from '../graphql/subscriptions'
import { useClient } from '../client'
import differenceInMinutes from 'date-fns/difference_in_minutes'
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { Subscription } from "react-apollo"

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
    dispatch({ type: 'GET_PINS', payload: getPins })
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
      dispatch({type: 'CREATE_DRAFT_PIN'})
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

  const highlightNewPin = pin => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
    return isNewPin ? "limegreen" : "darkblue"
  }

  const { pins } = state
  const [ popup, setPopUp] = useState(null)

  const isAuthUser = (pop) => (state.currentUser._id === pop.author._id)

  const handleSelectPin = pin => {
    setPopUp(pin)
    dispatch({ type: 'SET_PIN', payload: pin})
  }

  const handleDeletePin = async pin => {
    alert('deleted Pin')
    const variables = {PinId: pin._id}
    await client.request(DELETE_PIN_MUTATION, variables)    
    
    setPopUp(null)
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
           {/*  Mapbox navigation control  */}
          <div className={classes.navigationControl}>
            <NavigationControl onViewportChange={(newViewPort) => {
              setViewPortState(newViewPort)
            }}/>
          </div>
           {/*  User current location  */}
          { userPosition && <Marker latitude={userPosition.latitude} longitude={userPosition.longitude} offsetLeft={-19} offsetTop={-37}>
            <PinIcon size="38" color="red"/>
          </Marker> }

           {/*  drafted Pin  */}

          { state.draftPins && <Marker latitude={state.draftPins.latitude} longitude={state.draftPins.longitude} offsetLeft={-19} offsetTop={-37}>
              <PinIcon size="38" color="hotpink"/>
            </Marker>
          }
           {/*  User Created Pins  */}
          {
            pins.map((pin) => (
              <Marker 
                key={pin._id} 
                latitude={pin.latitude} 
                longitude={pin.longitude} 
                offsetLeft={-19} 
                offsetTop={-37}
              >
                  <PinIcon size="38" color={highlightNewPin(pin)} onClick={(event) => handleSelectPin(pin)}/>
              </Marker>
            ))
          }
          {/*  show popup based on pin click  */}
          {
            popup && <Popup
              latitude={popup.latitude}
              longitude={popup.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopUp(null)}
              anchor="top"
            >
              <img src={popup.image} className={classes.popupImage} alt={popup.title} />

              <div className={classes.popupTab}>
                <Typography>
                  {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
                </Typography>
               {
                  isAuthUser(popup) && <Button onClick={(event) => handleDeletePin(popup)}>
                    < DeleteIcon className={classes.DeleteIcon}/> 
                  </Button>
               } 
              </div>
            </Popup>
          }
        </ReactMapGL>
        <Subscription 
          subscription={PIN_ADDED_SUBSCRIPTION}
          
          onSubscriptionData={({ subscriptionData}) => {
            console.log("subscriptionData", subscriptionData)
            const { pinAdded } = subscriptionData.data
            dispatch({ type: 'CREATE_PIN', payload: pinAdded })

          }}
        />
        <Subscription 
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData}) => {
          console.log("subscriptionData", subscriptionData)
          const { pinUpdated } = subscriptionData.data
          dispatch({ type: 'CREATE_COMMENT', payload: pinUpdated })

        }}
      />
      <Subscription 
      subscription={PIN_DELETED_SUBSCRIPTION}
      onSubscriptionData={({ subscriptionData}) => {
        console.log("subscriptionData", subscriptionData)
        const { pinDeleted } = subscriptionData.data
        dispatch( { type: 'DELETE_PIN', payload: pinDeleted })
      }}
    />
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
