/* eslint-disable */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { userInfo } from 'os';
import {
  addGenerallisteners,
  addAddDormListeners
  } from '../helpers/globalListeners.js';

// Import the template to use
const addDormTemplate = require('../templates/addDorm.handlebars');

export default () => {
  let user = JSON.parse(localStorage.getItem('User'))
  let dorm = JSON.parse(localStorage.getItem('dorm'))
  // Data to be passed to the template
  // Return the compiled template to the router
  if(user && user.status == "Loaner")
    {
      update(compile(addDormTemplate)({dorm}));
      addGenerallisteners();
      addAddDormListeners();
    } else {
      window.location.assign("/#/login")
    }
};