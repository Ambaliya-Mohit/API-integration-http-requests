import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { updateUserPlaces, fetchUserPlaces } from './http.js';
import Error from './components/Error.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // ================================
  // FETCH USER PLACES FROM BACKEND
  // ================================

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchUserPlaces();

        setUserPlaces(places);
      } catch (error) {
        setError({
          message: error.message || 'Failed to fetch user places.',
        });
      }

      setIsFetching(false);
    }

    fetchPlaces();
  }, []);

  // ================================
  // OPEN DELETE CONFIRMATION MODAL
  // ================================

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);

    selectedPlace.current = place;
  }

  // ================================
  // CLOSE DELETE MODAL
  // ================================

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  // ================================
  // SELECT / ADD NEW PLACE
  // ================================

  async function handleSelectPlace(selectedPlace) {
    // Prevent duplicate places
    if (userPlaces.some((place) => place.id === selectedPlace.id)) {
      return;
    }

    // Create updated array
    const updatedPlaces = [selectedPlace, ...userPlaces];

    // Update React state
    setUserPlaces(updatedPlaces);

    try {
      // Save updated places to backend
      await updateUserPlaces(updatedPlaces);
    } catch (error) {
      // If backend update fails,
      // restore previous state
      setUserPlaces(userPlaces);

      setErrorUpdatingPlaces({
        message: error.message || 'Failed to update places.',
      });
    }
  }

  // ================================
  // REMOVE PLACE
  // ================================

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      const deletedPlace = selectedPlace.current;

      console.log('The Deleted Place is:', deletedPlace);

      // Create new array without deleted place
      const updatedPlaces = userPlaces.filter( 
        (place) => place.id !== deletedPlace.id
      );

      // Update React state
      setUserPlaces(updatedPlaces);

      try {
        // Save updated array to backend
        await updateUserPlaces(updatedPlaces);
      } catch (error) {
        // If backend update fails,
        // restore previous state
        setUserPlaces(userPlaces);

        setErrorUpdatingPlaces({
          message: error.message || 'Failed to delete place.',
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );

  // ================================
  // CLOSE ERROR MODAL
  // ================================

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  // ================================
  // UI
  // ================================

  return (
    <>
      {/* Update Error Modal */}
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      {/* Header */}
      <header>
        <img src={logoImg} alt="Stylized globe" />

        <h1>PlacePicker</h1>

        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>

      {/* Main */}
      <main>
        {/* Fetch Error */}
        {error && (
          <Error
            title="An error occurred!"
            message={error.message}
          />
        )}

        {/* User Selected Places */}
        {!error && (
          <Places
            title="Recently your selected places..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        {/* Available Places */}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;

