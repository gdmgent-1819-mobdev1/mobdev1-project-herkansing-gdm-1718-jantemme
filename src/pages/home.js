/* eslint-disable */

// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { userInfo } from 'os';
import {
  logout,
  sendEmailVerification,
  sendNotification,
  requestNotificationPermission,
  toggleMobileMenu,
  hideMobileMenu,
  showLogout,
  hideLogout,
  addGenerallisteners
  } from '../helpers/globalListeners.js';

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

export default () => {
  // Data to be passed to the template
  const user = 'Test user';
  // Return the compiled template to the router
  update(compile(homeTemplate)({ user }));
/*
  var userObject;

  function signup(e) {
    e.preventDefault();
    document.getElementById('signup_error').innerHTML = '';

    const email = document.getElementById('signup_email').value;
    const password = document.getElementById('signup_password').value;
    const tel = document.getElementById('signup_tel').value;
    const name = document.getElementById('signup_name').value;
    const surname = document.getElementById('signup_surname').value;
    const adress = document.getElementById('signup_adress').value;
    const place = document.getElementById('signup_place').value;
    const school = document.getElementById('signup_school').value;
    var status = null;

    if(document.getElementById('signup_radio_student').checked)
      status = 'Student';
    else if(document.getElementById('signup_radio_loaner').checked)
      status = 'Loaner';

    if(email != '' && password != '' && name != '' && surname != '' && adress != '' && place != '' && status != null)
    {
      function writeUserData(email, name, surname, tel, adress, place, school, status) {
        firebase.database().ref('users/').push({
          name: name,
          surname: surname,
          email: email,
          tel: tel,
          adress: adress,
          place: place,
          school: school,
          status: status
        });
      }

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (response) {

        writeUserData(email, name, surname, tel, adress, place, school, status);
        
        sendNotification('Thanks for signing up to Dromy! Check your e-mail for account verification!');
        sendVerificationEmail(response.user);
      })
        .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    
        console.log(errorCode, errorMessage);
        document.getElementById('signup_error').innerHTML = errorCode + " - " + errorMessage;
      });
    }
    else
    {
      document.getElementById('signup_error').innerHTML = 'Inofrmation not complete!';
    }
  }

  function login(e) {
    e.preventDefault();
    document.getElementById('login_error').innerHTML = '';

    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (response) {
      sendNotification('You are now logged in successfully!');
      storeUser(response.user);
      setTimeout(function () {
        showUserInfo(userObject);
      }, 500);
      hideLoginSignUp();
      showLogout();
      document.getElementById('btn-login').style.display = 'none';
      document.getElementById('btn-signup').style.display = 'none';
      document.getElementById('btn-login-2').style.display = 'none';
      document.getElementById('btn-signup-2').style.display = 'none';
    })
      .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
  
      console.log(errorCode, errorMessage);
      document.getElementById('login_error').innerHTML = errorCode + " - " + errorMessage;
    });
  }

  function logout() {
    firebase.auth().signOut()
    .then(function() {
      hideLogout();
      hideMobileMenu();
      document.getElementById('btn-login').style.display = 'inline-block';
      document.getElementById('btn-signup').style.display = 'inline-block';
      document.getElementById('btn-login-2').style.display = 'inline-block';
      document.getElementById('btn-signup-2').style.display = 'inline-block';
    }).catch(function(error) {
    });
  }

  function sendVerificationEmail(user) {
    user.sendEmailVerification()
      .then(function () {
      // Email sent.
    }).catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode, errorMessage);
    });
  }

  function sendNotification(msg) {
    let notif = new Notification(msg);
  }

  function requestNotificationPermission() {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission(function (permission) {
        if (!('permission' in Notification)) {
          Notification.permission = permission;
        }
      });
    }
  }

  function storeUser(user) {
    let blogpostRef = firebase.database().ref('users/');
    blogpostRef.on('value', function (snapshot) {
      snapshot.forEach(function (data) {
        if(user.email == data.val().email) {
          switch(data.val().status) {
            case 'Student':
              userObject = new Student(data.val().name, data.val().surname, data.val().email, data.val().adress, data.val().tel, data.val().school, data.val().place, data.val().status);
              console.log(userObject);
              break;
            case 'Loaner':
              userObject = new Kotbaas(data.val().name, data.val().surname, data.val().email, data.val().adress, data.val().tel, data.val().place, data.val().status);
              console.log(userObject);
              break;
          }
        }
      });
    });
  }

  function showUserInfo(user) {
    document.getElementById('user_info').innerHTML = '<h1> Welcome ' + user.name + ', you are a '+ user.status +' ! </h1>';
  }

  function showSignUp() {
    hideMobileMenu();
    document.getElementById('form_sign').style.display = 'inline-block';
    document.getElementById('signUp').style.display = 'inline-block';
    document.getElementById('login').style.display = 'none';
    document.getElementById("form_login").reset();
  }

  function showLogin() {
    hideMobileMenu();
    document.getElementById('form_sign').style.display = 'inline-block';
    document.getElementById('login').style.display = 'inline-block';
    document.getElementById('signUp').style.display = 'none';
    document.getElementById("form_signup").reset();
  }

  function toggleMobileMenu() {

    //document.getElementById('navbar-mobile').classList.toggle('hidden');
    hideLoginSignUp();

    if(document.getElementById('navbar-mobile').style.display === 'none')
    {
      document.getElementById('navbar-mobile').style.display = 'flex';
      mobileNavStatus = true;
    }
    else
    {
      document.getElementById('navbar-mobile').style.display = 'none';
      mobileNavStatus = false;
    }
    console.log(mobileNavStatus);
  }

  function hideMobileMenu() {
    document.getElementById('navbar-mobile').style.display = 'none';
  }

  function hideSchoolField() {
    document.getElementById('signup_school_label').style.display = 'none';
    document.getElementById('signup_school').style.display = 'none';
}

  function showSchoolField() {
      document.getElementById('signup_school_label').style.display = 'inline-block';
      document.getElementById('signup_school').style.display = 'inline-block';
  }

  function showLogout() {
    document.getElementById('btn-logout').style.display = 'inline-block';
    document.getElementById('btn-logout-2').style.display = 'inline-block';
  }

  function hideLogout() {
    document.getElementById('btn-logout').style.display = 'none';
    document.getElementById('btn-logout-2').style.display = 'none';
  }

  function hideLoginSignUp() {
    document.getElementById('form_sign').style.display = 'none';
    document.getElementById('form_sign').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('signUp').style.display = 'none';
    document.getElementById("form_login").reset();
    document.getElementById("form_signup").reset();
  }

  document.getElementById('btn_signup').addEventListener('click', signup, false);
  document.getElementById('btn_login').addEventListener('click', login, false);

  document.getElementById('menu-icon').addEventListener('click', toggleMobileMenu);

  document.getElementById('btn-signup-2').addEventListener('click', showSignUp);
  document.getElementById('btn-login-2').addEventListener('click', showLogin);
  document.getElementById('btn-signup').addEventListener('click', showSignUp);
  document.getElementById('btn-login').addEventListener('click', showLogin);
  document.getElementById('btn-home').addEventListener('click', hideLoginSignUp);
  document.getElementById('btn-home-2').addEventListener('click', (hideLoginSignUp, hideMobileMenu));

  document.getElementById('btn-logout-2').addEventListener('click', logout);
  document.getElementById('btn-logout').addEventListener('click', logout);

  document.getElementById('signup_radio_student').addEventListener('change', showSchoolField);
  document.getElementById('signup_radio_loaner').addEventListener('change', hideSchoolField);
*/
  addGenerallisteners();
  //addFormlisteners();
  requestNotificationPermission();
};
