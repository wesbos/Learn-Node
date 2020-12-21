import { $ } from "./bling";
import axios from "axios";

const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 2,
};

async function loadPlaces(map, lat = 43.2, lng = -79.8) {
  try {
    const { data: stores } = await axios.get(`/api/stores/near`, {
      params: { lat, lng },
    });
    if (!stores.length) {
      alert("No places found");
      return;
    }
    // create bounds
    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();
    const markers = stores.map((store) => {
      const [storeLng, storeLat] = store.location.coordinates;
      const position = { lat: storeLat, lng: storeLng };
      bounds.extend(position);
      const marker = new google.maps.Marker({
        map,
        position,
      });
      marker.place = store;
      // when someone clicks on a marker, show the details of that place
      marker.addListener("click", function (event) {
        const { place } = this;
        const html = `
        <div class="popup">
          <a href="/stores/${place.slug}">
            <img src="/uploads/${place.photo || "store.png"}" alt="${
          place.name
        }"/>
            <p>${place.name} - ${place.location.address}</p>
          </a>
        </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      });
      return marker;
    });

    // zoom map to fit all markers perfectly
    map.fitBounds(bounds);
  } catch (e) {
    console.log(e);
  }
}

function makeMap(mapDiv) {
  console.log(mapDiv);
  if (!mapDiv) {
    return;
  }

  // make a map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);
  const input = $("input[name=geolocate]");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    loadPlaces(
      map,
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
  });
}

export default makeMap;
