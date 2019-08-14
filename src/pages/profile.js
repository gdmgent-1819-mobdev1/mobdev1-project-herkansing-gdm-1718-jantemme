// Only import the compile function from handlebars instead of the entire library
/* eslint-disable */
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';
import {
  sendNotification,
  logout,
  addGenerallisteners,
} from '../helpers/globalListeners';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const profileTemplate = require('../templates/profile.handlebars');

export default () => {
  localStorage.removeItem("dorm")
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
      if(item.user == user.user_id) {
        returnArr.push(item)
      }
    })

    posts = returnArr

    readDb()
    .then((convos) => {
      console.log(convos)
      getUsers()
      .then((users) => {
        update(compile(profileTemplate)({ title, loading, user, posts, loaner, student, likes, convos, users }));

        const dorms = document.querySelectorAll("div.profile_dorm");
        for (var i = 0; i < dorms.length; i++) {
            dorms[i].addEventListener('click',redirectToDorm,false);
        }
        function redirectToDorm(e){
          const dorm_id = e.currentTarget.getAttribute('id');
          localStorage.setItem('dorm_id', dorm_id);
          window.location.assign('#/dormDetail')
        }

        const convosElements = document.querySelectorAll("div.profile_convo");
        for (var i = 0; i < convosElements.length; i++) {
          convosElements[i].addEventListener('click',redirectToConvo,false);
        }
        function redirectToConvo(e){
          const owner_id = e.currentTarget.getAttribute('id');
          localStorage.setItem('owner_id', owner_id);
          window.location.assign('#/chat')
        }

        document.getElementById("btn-removeAccount").addEventListener("click", deleteAccount)

        document.getElementById('btn-logout').addEventListener('click', logout);

        addGenerallisteners();
      })
    })
  });

}

const readDb = () => {
  let user = JSON.parse(localStorage.getItem('User'))
  return new Promise((resolve, reject) => {
    const database = firebase.database().ref('users/' + user.user_id+ '/convos/');
    database.on('value', (snapshot) => {
      resolve(snapshot.val())
    })
  });
}

const getUsers = () => {
  let users = []
  return new Promise((resolve, reject) => {
    const database = firebase.database().ref('users/');
    database.on('value', (snapshot) => {
      snapshot.forEach(function (data) {
          users.push(data.val())
      })
      resolve(users)
    });
  })
}

const deleteAccount = () => {
  let user = JSON.parse(localStorage.getItem('User'))
  firebase.database().ref('/users/' + user.user_id).remove()
  .then(() => {
    var user = firebase.auth().currentUser;

    user.delete().then(function() {
      sendNotification("Account deleted successfully!")
      logout()
      window.location.assign('/')
    }).catch(function(error) {
      sendNotification("Could not delete.")
    });
  })
}