/* eslint-disable */
// Only import the compile function from handlebars instead of the entire library
import {
  compile
} from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import {
  logout,
  sendEmailVerification,
  sendNotification,
  requestNotificationPermission,
  toggleMobileMenu,
  hideMobileMenu,
  hideSchoolField,
  showSchoolField,
  showLogout,
  hideLogout,
  addGenerallisteners
} from '../helpers/globalListeners.js';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

// Import the update helper
import update from '../helpers/update';

// Import the template to use
const mapTemplate = require('../templates/page-with-map.handlebars');

export default () => {
  // Data to be passed to the template
  const title = 'Map';
  update(compile(mapTemplate)({
    title
  }))

  addGenerallisteners()

  let coordinates;

  // Mapbox code
  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;
    // eslint-disable-next-line no-unused-vars
    const map = new mapboxgl.Map({
      container: 'map',
      center: {
        "lng": 3.72667, 
        "lat": 51.05
      },
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 12,
    });

    const database = firebase.database().ref('/dorms');
    database.on('value', (snapshot) => {
      snapshot.forEach(function (data) {
        let dorm = data.val()
        fetch(`http://api.mapbox.com/geocoding/v5/mapbox.places/${dorm.streetAndNumber} ${dorm.place}.json?access_token=${config.mapBoxToken}.json`)
        .then(function(response) {
          return response.json()
        })
        .then(function(myJson) {
          coordinates = {
            "lng": myJson.features[0].center[0],
            "lat": myJson.features[0].center[1]
          }
          new mapboxgl.Marker()
          .setLngLat(coordinates)
          .addTo(map);
        })
      })
    })

  } else {
    console.error('Mapbox will crash the page if no access token is given.')
  }
};