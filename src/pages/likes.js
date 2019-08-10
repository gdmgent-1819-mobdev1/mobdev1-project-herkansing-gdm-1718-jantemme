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
const dormsListTemplate = require('../templates/likes.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let posts = {};
  const title = 'Likes';

  let user = JSON.parse(localStorage.getItem('User'));

  // Return the compiled template to the router
  update(compile(dormsListTemplate)({ title, loading, posts }));

    posts = JSON.parse(localStorage.getItem("likes"));
    loading = false;
    // Run the update helper to update the template
    update(compile(dormsListTemplate)({ title, loading, posts }));

    const btn = document.getElementById("button_filter");
    const modal = document.getElementById("modal_filter");
  
    btn.onclick = function() {
      modal.style.display = "block";
    }
    
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    const dorms = document.querySelectorAll("div.dorm");
    for (var i = 0; i < dorms.length; i++) {
        dorms[i].addEventListener('click',redirect,false);
    }
    function redirect(e){
      const dorm_id = e.currentTarget.getAttribute('id');
      console.log(dorm_id);
      localStorage.setItem('dorm_id', dorm_id);
      window.location.assign('/#/dormDetail')
    }

    if(user && user.status == "Loaner")
    {
      document.getElementById("button-AddDorm").style.display = 'inline-block';
    }

    addGenerallisteners();

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
