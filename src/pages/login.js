/* eslint-disable */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { userInfo } from 'os';
import {
  addGenerallisteners,
  addLoginListeners
  } from '../helpers/globalListeners.js';

// Import the template to use
const loginTemplate = require('../templates/login.handlebars');

export default () => {
  localStorage.removeItem("dorm")
  update(compile(loginTemplate)());
  addGenerallisteners();
  addLoginListeners();
};
