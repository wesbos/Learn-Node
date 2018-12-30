// adamProject NOTE: this will be super useful for building google map autocomplete on front end
function autocomplete(input, latInput, lngInput) {
  if(!input) return; // skip function if no input on page
  const dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    console.log(place);
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });

  // if someone hits enter on address field, don't submit the form
  input.on('keydown', (e) => {
    if(e.keyCode === 13) e.preventDefault();
  })
}

export default autocomplete;
