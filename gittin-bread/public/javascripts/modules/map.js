import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: {lat: 31.5562979, lng: -97.1318761},
  zoom: 8
}
function loadPlaces(map, lat = 31.5562979, lng = -97.1318761) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(resp => {
      const places = resp.data;
      if(!places.length) {
        alert('No places found');
        return;
      }

      const bounds = new google.maps.LatLngBounds()
      const infoWindow = new google.maps.InfoWindow();

      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        bounds.extend(position)
        const marker = new google.maps.Marker({ map,position });
        marker.place = place;
        return marker;
      })

      //when marker is clicked, show info window
      markers.forEach(marker => marker.addListener('click', function() {
        const html = `
          <div class="popup">
            <a href="/store/${this.place.slug}">
              <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}" />
              <p>${this.place.name} - ${this.place.location.address}</p>
            </a>
          </div>
        `;
        infoWindow.setContent(html)
        infoWindow.open(map, this)
      }));
      //fit bounds to fit all markers
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds)
  })
}

function makeMap(mapDiv) {
  if(!mapDiv) return;

  //malke map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map)
  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  })
}

export default makeMap;