/* eslint-disable */

// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { userInfo } from 'os';
import { 
  addGenerallisteners,
  addSignUpListeners
  } from '../helpers/globalListeners.js';

// Import the template to use
const signUpTemplate = require('../templates/signUp.handlebars');

export default () => {
  localStorage.removeItem("dorm")
  // Data to be passed to the template
  // Return the compiled template to the router
  update(compile(signUpTemplate)());
  addGenerallisteners();
  addSignUpListeners();
};
