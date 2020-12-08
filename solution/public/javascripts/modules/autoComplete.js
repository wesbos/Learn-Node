function autocomplete(input, latInput, lngInput) {
    if (!input) {
        return;
    }
    input.on('keydown', e => {
        if (e.keyCde === 13) {
            e.preventDefault();
        }
    });
    const dd = new google.maps.places.Autocomplete(input);

    dd.addListener('place_changed', () => {
        const {geometry} = dd.getPlace();
        const lat = geometry.location.lat();
        const lng = geometry.location.lng();
        console.log(lat, lng);
        lngInput.value = lng;
        latInput.value = lat;
    });


}

export default autocomplete;
