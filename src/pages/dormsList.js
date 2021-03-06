/* eslint-disable */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';
import {
  addGenerallisteners
  } from '../helpers/globalListeners.js';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const dormsListTemplate = require('../templates/dormsList.handlebars');

export default () => {
  localStorage.removeItem("dorm")
  // Data to be passed to the template
  let loading = true;
  let posts = [];
  const title = 'Dorms';
  let studentOrGuest

  let user = JSON.parse(localStorage.getItem('User'));

  if(user && user.status == "Loaner") {
    studentOrGuest = false
  } else if(!user || user.status == "Student") {
    studentOrGuest = true
  }

  // Return the compiled template to the router
  update(compile(dormsListTemplate)({ title, loading, posts, studentOrGuest }));
  addGenerallisteners();

  const database = firebase.database().ref('/dorms');
  database.on('value', (snapshot) => {
    loading = false;

    // Convert snapshot to array
    let returnArr = []
    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      if(localStorage.getItem("search_query")) {
        const query = localStorage.getItem("search_query")
        if(item.type == query || item.place == query || item.postal == query || item.streetAndNumber.split(/([ ]*[0-9])/)[0] == query) {
          returnArr.push(item)
        }
      } else {
        returnArr.push(item)
      }
    })

    posts = returnArr
    // Run the update helper to update the template
    update(compile(dormsListTemplate)({ title, loading, posts, studentOrGuest }));

    const dorms = document.querySelectorAll("div.dorm");
    for (var i = 0; i < dorms.length; i++) {
        dorms[i].addEventListener('click',redirect,false);
    }
    function redirect(e){
      const dorm_id = e.currentTarget.getAttribute('id');
      console.log(dorm_id);
      localStorage.setItem('dorm_id', dorm_id);
      window.location.assign('#/dormDetail')
    }

    if(user && user.status == "Loaner")
    {
      document.getElementById("button-AddDorm").style.display = 'inline-block';
    }

    addGenerallisteners();
  });

}

  /*fetch('https://datatank.stad.gent/4/wonen/kotatgent.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    posts = myJson;
    loading = false;
    update(compile(dormsListTemplate)({ title, loading, posts }));
    addGenerallisteners();
  });

};*/
