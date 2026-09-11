export async function fetchAvailablePlaces() {
     const response=await fetch('http://localhost:3000/places');
     
       console.log('Response:', response);
       console.log('Status:', response.status);
        if(!response.ok){
          throw new Error('places fetch nahi hua')
        }
         const resData=await response.json();
        return resData.places;
}
export async function fetchUserPlaces() {
  const response = await fetch('http://localhost:3000/user-places');

  const resData = await response.json();

  if (!response.ok) {
    throw new Error('Failed to fetch user places.');
  }

  return resData.places;
}

export async function updateUserPlaces(places) {
const response= await fetch('http://localhost:3000/user-places',{
    method:'PUT',
    body:JSON.stringify({places}),
    headers:{
      'Content-type':'application/json'
    }
  });

  const resData=await response.json();
  if(!response.ok){
    throw new Error('Failed to update user data.');
  }
  return resData.message
}