/* eslint-disable */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import { userInfo } from 'os';
import {
  sendNotification,
  addGenerallisteners,
  } from '../helpers/globalListeners.js';

  const { getInstance } = require('../firebase/firebase');

  const firebase = getInstance();

// Import the template to use
const dormDetailTemplate = require('../templates/dormDetail.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let dorm = {};
  let coordinates;
  // Return the compiled template to the router
  update(compile(dormDetailTemplate)({ loading, dorm }));

  const dorm_id = localStorage.getItem('dorm_id');

  const database = firebase.database().ref('/dorms');
  database.on('value', (snapshot) => {
    snapshot.forEach(function (data) {
      if (dorm_id == data.val().dorm_id) {
        dorm = data.val();
        loading = false;
      }
    });
    fetch(`http://api.mapbox.com/geocoding/v5/mapbox.places/${dorm.streetAndNumber} ${dorm.place}.json?access_token=${config.mapBoxToken}.json`)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      coordinates = myJson.features[0].center;
    });
    // Run the update helper to update the template
    update(compile(dormDetailTemplate)({ loading, dorm }));

    document.getElementById("button_message").addEventListener("click", function() {
      if(localStorage.getItem("User"))
        window.location.assign("#/chat");
      else
        window.location.assign("#/login");
    });

    var fbButton = document.getElementById('fb-share-button');
    var url = "google.com";
    
    fbButton.addEventListener('click', function() {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
            'facebook-share-dialog',
            'width=800,height=600'
        );
        return false;
    });

    checkIfFavorite(dorm)

    addGenerallisteners()
  });

    setTimeout(() => {
      if (config.mapBoxToken) {
        mapboxgl.accessToken = config.mapBoxToken;
        // eslint-disable-next-line no-unused-vars
        const map = new mapboxgl.Map({
          container: 'map',
          center: [coordinates[0], coordinates[1]],
          style: 'mapbox://styles/mapbox/streets-v9',
          zoom: 14,
        });
        new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
      } else {
        console.error('Mapbox will crash the page if no access token is given.');
      }}, 1000);
}

const checkIfFavorite = (dorm) => {
  let favorites = JSON.parse(localStorage.getItem("likes"))
  let removeFromLikesButton = document.getElementById("button_remove_like")
  let isFavorite = false
  let favoriteIndex 

  favorites.forEach(function (favorite, index) {
    if(favorite.dorm_id == dorm.dorm_id) {
      isFavorite = true
      favoriteIndex = index
    }
  });

  if(isFavorite) {
    removeFromLikesButton.style.display = "inline_block"

    removeFromLikesButton.addEventListener("click", function(e) {
      favorites.splice(favoriteIndex, 1)
      localStorage.setItem("likes", JSON.stringify(favorites))
      removeFromLikesButton.style.display = "none"
      sendNotification("Deleted from favorites.")
    });
  } else {
    removeFromLikesButton.style.display = "none"
  }
}