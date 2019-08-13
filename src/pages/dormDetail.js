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
  localStorage.removeItem("dorm")
  // Data to be passed to the template
  let loading = true;
  let dorm = {};
  let coordinates;
  let owner = false
  let student = false
  let user = JSON.parse(localStorage.getItem('User'))
  // Return the compiled template to the router

  update(compile(dormDetailTemplate)({ loading, dorm, owner, student }));

  const dorm_id = localStorage.getItem('dorm_id');

  const database = firebase.database().ref('/dorms');
  database.on('value', (snapshot) => {
    snapshot.forEach(function (data) {
      if (dorm_id == data.val().dorm_id) {
        dorm = data.val();
        loading = false;
        if(user) {
          if(user.userId == dorm.user) {
            owner = true
          } else if(user.status == "Student") {
            student = true
          }
        }
      }
    });
    fetch(`http://api.mapbox.com/geocoding/v5/mapbox.places/${dorm.streetAndNumber} ${dorm.place}.json?access_token=${config.mapBoxToken}.json`)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      coordinates = myJson.features[0].center;
      drawMap(coordinates)
    });
    // Run the update helper to update the template
    update(compile(dormDetailTemplate)({ loading, dorm, owner, student }))

    if(document.getElementById("button_message")) {
      document.getElementById("button_message").addEventListener("click", function() {
        if(localStorage.getItem("User"))
          window.location.assign("#/chat");
        else
          window.location.assign("#/login");
      })
    }

    if(document.getElementById("button_remove_dorm")) {
      document.getElementById("button_remove_dorm").addEventListener("click", function() {
        firebase.database().ref('/dorms/' + dorm.dorm_id).remove()
        .then(() => {
          sendNotification("Dorm deleted successfully!")
          window.location.assign('/#/profile')
        })
      })
    }

    if(document.getElementById("button_edit_dorm")) {
      document.getElementById("button_edit_dorm").addEventListener("click", function() {
        localStorage.setItem("dorm", JSON.stringify(dorm))
        window.location.assign("/#/addDorm")
      })
    }

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

}

const checkIfFavorite = (dorm) => {
  let favorites = JSON.parse(localStorage.getItem("likes"))
  let removeFromLikesButton = document.getElementById("button_remove_like")
  let isFavorite = false
  let favoriteIndex 
  if(favorites) {
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
  } else {
    removeFromLikesButton.style.display = "none"
  }
}

const drawMap = (coordinates) => {
  if(document.getElementById("map")) {
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
    }
  }
}