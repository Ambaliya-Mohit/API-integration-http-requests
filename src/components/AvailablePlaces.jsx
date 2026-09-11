import { useState,useEffect } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';

import {sortPlacesByDistance} from '../loc.js'
import {fetchAvailablePlaces} from '../http.js'


export default function AvailablePlaces({ onSelectPlace }) {
 
  const[awailablePlaces,setAwailablePlaces]=useState([]);
   const[isFetching,setIsFetching]=useState(false  )
   const[error,setError]=useState(null)


 useEffect(()=>{
 async function fetchPlaces(){
  setIsFetching(true);

  try{
    const places=await fetchAvailablePlaces();
  
    navigator.geolocation.getCurrentPosition((position)=>{
      const sortedPlaces=sortPlacesByDistance(places,
        position.coords.latitude,
        position.coords.longitude,
      );
       setAwailablePlaces(sortedPlaces);
    });

   
  }catch (error) {
  setError({ message: error.message || 'Try again later' });
}

    setIsFetching(false);
 }  
 fetchPlaces()
},[]) 

if(error){
  return <Error title='An error occurred' message={error.message}/>
}

  return (
    <Places
      title="Available Places"
      places={awailablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data......"
      fallbackText="sorry brooo."
      onSelectPlace={onSelectPlace}
    />
  );
} 
