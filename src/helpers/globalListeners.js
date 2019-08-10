/* eslint-disable */
import {
  Student,
  Kotbaas
} from '../helpers/classes';

var userObject;
const {
  getInstance
} = require('../firebase/firebase');

const firebase = getInstance();


// Sign up
const signup = (e) => {
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

  if (document.getElementById('signup_radio_student').checked)
    status = 'Student';
  else if (document.getElementById('signup_radio_loaner').checked)
    status = 'Loaner';

  if (email != '' && password != '' && name != '' && surname != '' && adress != '' && place != '' && status != null) {
    const writeUserData = (email, name, surname, tel, adress, place, school, status) => {
      const databaseRef = firebase.database().ref('users/').push();
      databaseRef.set({
        user_id: databaseRef.key,
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

        sendNotification('Thanks for signing up to Dormy! Check your e-mail for account verification!');
        sendVerificationEmail(response.user);
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
        document.getElementById('signup_error').innerHTML = errorCode + " - " + errorMessage;
      });
  } else {
    document.getElementById('signup_error').innerHTML = 'Inofrmation not complete!';
  }
}

const sendVerificationEmail = (user) => {
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

const requestNotificationPermission = () => {
  if (Notification && Notification.permission === 'default') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
    });
  }
}

const sendNotification = (msg) => {
  let notif = new Notification(msg);
}


// Login
const login = (e) => {
  e.preventDefault();
  document.getElementById('login_error').innerHTML = '';

  const email = document.getElementById('login_email').value;
  const password = document.getElementById('login_password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (response) {
      sendNotification('You are now logged in successfully!');
      storeUser(response.user);
      setTimeout(function () {
        //showUserInfo(userObject);
        checkForUser();
      }, 500);
      setTimeout(function () {
        window.location.assign("/");
      }, 2000);
    })
    .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode, errorMessage);
      document.getElementById('login_error').innerHTML = errorCode + " - " + errorMessage;
    });
}

const showUserInfo = (user) => {
  document.getElementById('user_info').innerHTML = '<h1> Welcome ' + user.name + ', you are a ' + user.status + ' ! </h1>';
}

const storeUser = (user) => {
  let blogpostRef = firebase.database().ref('users/');
  blogpostRef.on('value', function (snapshot) {
    snapshot.forEach(function (data) {
      if (user.email == data.val().email) {
        switch (data.val().status) {
          case 'Student':
            userObject = new Student(data.val().user_id, data.val().name, data.val().surname, data.val().email, data.val().adress, data.val().tel, data.val().school, data.val().place, data.val().status);
            console.log(userObject);
            break;
          case 'Loaner':
            userObject = new Kotbaas(data.val().user_id, data.val().name, data.val().surname, data.val().email, data.val().adress, data.val().tel, data.val().place, data.val().status);
            console.log(userObject);
            break;
        }
        window.localStorage.setItem('User', JSON.stringify(userObject));
      }
    });
  });
}

const getUser = (userId) => {
  let blogpostRef = firebase.database().ref('users/');
  blogpostRef.on('value', function (snapshot) {
    snapshot.forEach(function (data) {
      if (userId == (data.val().user_id)) {
        console.log( data.val().name + " gevonden!");
        }
      });
    });
}


// Logout
const logout = () => {
  firebase.auth().signOut()
    .then(function () {
      window.localStorage.removeItem('User');
      hideLogout();
      hideMobileMenu();
      document.getElementById('btn-login').style.display = 'inline-block';
      document.getElementById('btn-signup').style.display = 'inline-block';
      document.getElementById('btn-login-2').style.display = 'inline-block';
      document.getElementById('btn-signup-2').style.display = 'inline-block';
      window.location.reload();
    }).catch(function (error) {});
}


// Add a dorm
const addDorm = () => {
  const price = document.getElementById("dorm_price").value;
  const pledge = document.getElementById("dorm_pledge").value;
  const type = getType();
  const surface = document.getElementById("dorm_surface").value;
  const floor = document.getElementById("dorm_floor").value;
  const peoplePerDorm = document.getElementById("dorm_people").value;
  const toilet_status = getToiletStatus();
  const shower_status = getShowerStatus();
  const bath_status = getBathStatus();
  const kitchen_status = getKitchenStatus();
  const furniture = getFurnitureStatus();
  const furniture_discription = document.getElementById('dorm_furniture_discription').value;
  const image = localStorage.getItem('imageLink');
  const streetAndNumber = document.getElementById("dorm_streetAndNumber").value;
  const place = document.getElementById("dorm_place").value;
  const postal = document.getElementById("dorm_postal").value;
  const dormAmount = document.getElementById("dorm_dormAmount").value;
  const user = JSON.parse(localStorage.getItem('User'))['userId'];

  if (price != '' && pledge != '' && type != '' && surface != '' && floor != '' && peoplePerDorm != '' && toilet_status != '' && shower_status != '' && 
  bath_status != '' && kitchen_status != '' && furniture != '' && streetAndNumber != '' && place != '' && postal != '' && dormAmount != '') {
    const databaseRef = firebase.database().ref('dorms/').push();
    databaseRef.set({
        dorm_id: databaseRef.key,
        price: price, 
        pledge: pledge, 
        type: type, 
        surface: surface, 
        floor: floor, 
        peoplePerDorm: peoplePerDorm, 
        toilet_status: toilet_status, 
        shower_status: shower_status, 
        bath_status: bath_status, 
        kitchen_status: kitchen_status, 
        furniture: furniture, 
        furniture_discription: furniture_discription,
        image: image,
        streetAndNumber: streetAndNumber, 
        place: place, 
        postal: postal, 
        dormAmount: dormAmount,
        user: user
      });

    sendNotification("Dorm was added!");
    localStorage.removeItem('imageLink');
  }
  else
    sendNotification("Information not complete!");
}

const getImage = () => {
  let imagePath;

  if (firebase) {
    const fileUpload = document.getElementById('dorm_image');

    fileUpload.addEventListener('change', (evt) => {
      if (fileUpload.value !== '') {
        const fileName = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
        const storageRef = firebase.storage().ref(`images/${fileName}`);

        storageRef.put(evt.target.files[0]).then(() => {
          imagePath = `images/${fileName}`;
          const storeImage = firebase.storage().ref(imagePath);
          storeImage.getDownloadURL().then((url) => {
            localStorage.setItem('imageLink', url);
          });
        });
      }
    });
  }
};

const getType = () => {
  if(document.getElementById("dorm_type_room").checked)
    return "Room";
  else if(document.getElementById("dorm_type_studio").checked)
    return "Studio";
}

const getToiletStatus = () => {
  if(document.getElementById("dorm_toilet_private").checked)
    return "private";
  else if(document.getElementById("dorm_toilet_shared").checked)
    return "shared";
  else if(document.getElementById("dorm_toilet_none").checked)
    return "non existent";
}

const getShowerStatus = () => {
  if(document.getElementById("dorm_shower_private").checked)
    return "private";
  else if(document.getElementById("dorm_shower_shared").checked)
    return "shared";
  else if(document.getElementById("dorm_shower_none").checked)
    return "non existent";
}

const getBathStatus = () => {
  if(document.getElementById("dorm_bath_private").checked)
    return "private";
  else if(document.getElementById("dorm_bath_shared").checked)
    return "shared";
  else if(document.getElementById("dorm_bath_none").checked)
    return "non existent";
}

const getKitchenStatus = () => {
  if(document.getElementById("dorm_kitchen_private").checked)
    return "private";
  else if(document.getElementById("dorm_kitchen_shared").checked)
    return "shared";
  else if(document.getElementById("dorm_kitchen_none").checked)
    return "non existent";
}

const getFurnitureStatus = () => {
  if(document.getElementById("dorm_furniture_yes").checked)
    return "yes";
  else if(document.getElementById("dorm_furniture_no").checked)
    return "no";
}

// View 
const checkForUser = () => {
  if(localStorage.getItem('User'))
  {
    showLogout();
  }
}

const toggleMobileMenu = () => {
  document.getElementById('navbar-mobile').classList.toggle('show');
}

const hideMobileMenu = () => {
  document.getElementById('navbar-mobile').classList.remove('show');
}

const hideSchoolField = () => {
  document.getElementById('signup_school_label').style.display = 'none';
  document.getElementById('signup_school').style.display = 'none';
}

const showSchoolField = () => {
  document.getElementById('signup_school_label').style.display = 'inline-block';
  document.getElementById('signup_school').style.display = 'inline-block';
}

const showLogout = () => {
  document.getElementById('btn-login').style.display = 'none';
  document.getElementById('btn-signup').style.display = 'none';
  document.getElementById('btn-login-2').style.display = 'none';
  document.getElementById('btn-signup-2').style.display = 'none';
  document.getElementById('btn-logout').style.display = 'inline-block';
  document.getElementById('btn-logout-2').style.display = 'inline-block';
}

const hideLogout = () => {
  document.getElementById('btn-logout').style.display = 'none';
  document.getElementById('btn-logout-2').style.display = 'none';
}

const toggleFurnitureDiscription = () => {
  if(document.getElementById("dorm_furniture_yes").checked)
  {
    document.getElementById('dorm_furniture_discription_label').style.display = 'inline-block';
    document.getElementById('dorm_furniture_discription').style.display = 'inline-block';
  }
  else if(document.getElementById("dorm_furniture_no").checked)
  {
    document.getElementById('dorm_furniture_discription_label').style.display = 'none';
    document.getElementById('dorm_furniture_discription').style.display = 'none';
  }
}


// Eventlisteners
const addGenerallisteners = () => {
  document.getElementById('menu-icon').addEventListener('click', toggleMobileMenu);
  document.getElementById('btn-home-2').addEventListener('click', hideMobileMenu);

  checkForUser();

  document.getElementById('btn-logout-2').addEventListener('click', logout);
  document.getElementById('btn-logout').addEventListener('click', logout);

}

const addSignUpListeners = () => {
  document.getElementById('btn_signup').addEventListener('click', signup, false);

  document.getElementById('signup_radio_student').addEventListener('change', showSchoolField);
  document.getElementById('signup_radio_loaner').addEventListener('change', hideSchoolField);
}

const addLoginListeners = () => {
  document.getElementById('btn_login').addEventListener('click', login, false);
}

const addAddDormListeners = () => {
  getImage();
  document.getElementById('button_add_dorm').addEventListener('click', addDorm);
  document.getElementById('dorm_furniture_yes').addEventListener('change', toggleFurnitureDiscription);
  document.getElementById('dorm_furniture_no').addEventListener('change', toggleFurnitureDiscription);
}

export {
  signup,
  login,
  logout,
  addDorm,
  getImage,
  sendEmailVerification,
  sendNotification,
  requestNotificationPermission,
  storeUser,
  checkForUser,
  showUserInfo,
  toggleMobileMenu,
  toggleFurnitureDiscription,
  hideMobileMenu,
  hideSchoolField,
  showSchoolField,
  showLogout,
  hideLogout,
  addGenerallisteners,
  addSignUpListeners,
  addLoginListeners,
  addAddDormListeners
};