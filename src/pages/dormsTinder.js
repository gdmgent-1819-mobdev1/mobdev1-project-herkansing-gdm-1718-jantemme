/* eslint-disable */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';
import {
  sendNotification,
  addGenerallisteners
  } from '../helpers/globalListeners.js';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const dormsTinderTemplate = require('../templates/dormsTinder.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let dormArr = [];
  let likes = [];
  const title = 'Dorms';
  let counter = 0;
  let dorm;
  let user = JSON.parse(localStorage.getItem('User'));

  // Return the compiled template to the router
  update(compile(dormsTinderTemplate)({ title, loading, dorm }));

  const database = firebase.database().ref('/dorms');
  database.on('value', (snapshot) => {
    snapshot.forEach(function (data) {
    dormArr.push(data.val());
    loading = false;
  });
  // Run the update helper to update the template
  dorm = dormArr[counter];
  localStorage.setItem('dorm_id', dorm.dorm_id);

  update(compile(dormsTinderTemplate)({ title, loading, dorm }));

    tinder(title, loading, dorm, likes, counter, dormArr, user);

    addGenerallisteners();
  });
}

const tinder = (title, loading, dorm, likes, counter, dormArr,user) => {
  let double = false;

  update(compile(dormsTinderTemplate)({ title, loading, dorm }));

  if(user && user.status == "Loaner")
  {
    document.getElementById("button-AddDorm").style.display = 'inline-block';
  }

  document.getElementById('card-dorm').addEventListener('click',redirect,false);
  function redirect(){
    window.location.assign('#/dormDetail')
  }

  document.getElementById('button-like').addEventListener('click', function() {
    counter++;
    if(counter < (dormArr.length + 1))
    {
      if(localStorage.getItem("likes"))
      {
        likes = JSON.parse(localStorage.getItem("likes"));
        for(let i = 0; i < likes.length; i++)
        {
          if(JSON.stringify(dorm) == JSON.stringify(likes[i]))
          {
            double = true;
          }
        }
      }
      if(!double)
      {
        likes.push(dorm);
        localStorage.setItem("likes", JSON.stringify(likes));
      }
    }
    if(counter < dormArr.length)
    {
      dorm = dormArr[counter];
    }
    else
      sendNotification("You've seen all dorms.")
      
    localStorage.setItem('dorm_id', dorm.dorm_id);
    tinder(title, loading, dorm, likes, counter, dormArr, user);
  });

  document.getElementById('button-skip').addEventListener('click', function() {
    counter++;
    if(counter < dormArr.length)
      dorm = dormArr[counter];
    else
      sendNotification("You've seen all dorms.")
    localStorage.setItem('dorm_id', dorm.dorm_id);
    tinder(title, loading, dorm, likes, counter, dormArr, user);
  });



}
