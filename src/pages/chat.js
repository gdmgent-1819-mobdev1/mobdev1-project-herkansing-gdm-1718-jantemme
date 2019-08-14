// Only import the compile function from handlebars instead of the entire library
/* eslint-disable */
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';
import {
  logout,
  getUser,
  addGenerallisteners,
} from '../helpers/globalListeners';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const chatTemplate = require('../templates/chat.handlebars');

export default () => {
  localStorage.removeItem("dorm")
  // Data to be passed to the template
  let loading = true;

  let user = JSON.parse(localStorage.getItem('User'))
  let owner_id = localStorage.getItem("owner_id")
  let message = ""
  var person = ""
  console.log(person)
  // Return the compiled template to the router
  update(compile(chatTemplate)({ person, message }));
  addGenerallisteners();
  readDb()
  .then((messages) => {
    getUser(owner_id)
    .then((person) => {
      message = messages
      update(compile(chatTemplate)({ person, message }));
      document.getElementById("button-send").addEventListener("click", sendMessage)
      addGenerallisteners();
    })
  })

  document.getElementById("button-send").addEventListener("click", sendMessage)

  /*const database = firebase.database().ref('/dorms');
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
  });*/

}

const sendMessage = () => {
  let user = JSON.parse(localStorage.getItem('User'))
  let message = document.getElementById("input-message").value
  let owner_id = localStorage.getItem("owner_id")

  if(message != "") {
    const senderRef = firebase.database().ref('users/' + user.user_id + '/convos/' + owner_id).push();
    senderRef.set({
      message_id: senderRef.key,
      status: "sent",
      content: message,
    });

    const recieverRef = firebase.database().ref('users/' + owner_id + '/convos/' + user.user_id).push();
    recieverRef.set({
      message_id: recieverRef.key,
      status: "recieved",
      content: message,
    });

    readDb()
    .then((messages) => {
      getUser(owner_id)
      .then((person) => {
        message = messages
        update(compile(chatTemplate)({ person, message }));
        document.getElementById("button-send").addEventListener("click", sendMessage)
        addGenerallisteners();
      })
    })
  }
}

const readDb = () => {
  let user = JSON.parse(localStorage.getItem('User'))
  let owner_id = localStorage.getItem("owner_id")

  return new Promise((resolve, reject) => {
    const database = firebase.database().ref('users/' + user.user_id+ '/convos/' + owner_id);
    database.on('value', (snapshot) => {
      //let objectKey = Object.keys(snapshot.val())[0]
      resolve(snapshot.val())
    })
  });
}
