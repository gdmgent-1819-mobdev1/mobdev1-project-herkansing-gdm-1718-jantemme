/* eslint-disable */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { userInfo } from 'os';
import {
  logout,
  addDorm,
  getImage,
  sendNotification,
  requestNotificationPermission,
  checkForUser,
  toggleMobileMenu,
  toggleFurnitureDiscription,
  hideMobileMenu,
  showLogout,
  hideLogout,
  addGenerallisteners,
  addAddDormListeners
  } from '../helpers/globalListeners.js';

// Import the template to use
const addDormTemplate = require('../templates/addDorm.handlebars');

export default () => {
  // Data to be passed to the template
  // Return the compiled template to the router
  update(compile(addDormTemplate)());
  addGenerallisteners();
  addAddDormListeners();
};