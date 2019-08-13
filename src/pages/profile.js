// Only import the compile function from handlebars instead of the entire library
/* eslint-disable */
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';
import {
  logout,
  addGenerallisteners,
} from '../helpers/globalListeners';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const profileTemplate = require('../templates/profile.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Profile';

  let user = JSON.parse(localStorage.getItem('User'))
  let loaner = false
  let student = false
  let likes = JSON.parse(localStorage.getItem('likes'))

  if(user.status == "Loaner") {
    loaner = true
  } else if(user.status == "Student") {
    student = true
  }

  // Return the compiled template to the router
  update(compile(profileTemplate)({ title, loading, user, posts, loaner, student, likes }));
  addGenerallisteners();

  const database = firebase.database().ref('/dorms');
  database.on('value', (snapshot) => {
    loading = false;

    // Convert snapshot to array
  let returnArr = []
  snapshot.forEach(function(childSnapshot) {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;
    if(item.user == user.userId) {
      returnArr.push(item)
    }
  })

    posts = returnArr
    // Run the update helper to update the template
    update(compile(profileTemplate)({ title, loading, user, posts, loaner, student, likes }));

    const dorms = document.querySelectorAll("div.profile_dorm");
    for (var i = 0; i < dorms.length; i++) {
        dorms[i].addEventListener('click',redirect,false);
    }
    function redirect(e){
      const dorm_id = e.currentTarget.getAttribute('id');
      console.log(dorm_id);
      localStorage.setItem('dorm_id', dorm_id);
      window.location.assign('#/dormDetail')
    }

    document.getElementById('btn-logout').addEventListener('click', logout);

    addGenerallisteners();
  });

}
