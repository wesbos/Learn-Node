function autocomplete(input, latInput, lngInput) {
  if(!input) return;

  // const googleApi = import('https://maps.googleapis.com/maps/api/js?key=AIzaSyD9ycobB5RiavbXpJBo0Muz2komaqqvGv0&libraries=places')

  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  })

  input.on('keydown', (e) => {
    if (e.keyCode === 13) e.preventDefault();
  })
}

export default autocomplete;