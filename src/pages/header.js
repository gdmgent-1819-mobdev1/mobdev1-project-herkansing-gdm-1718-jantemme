/* eslint-disable */
import {
  compile,
} from 'handlebars';
import update from '../helpers/update';
import {
  addGenerallisteners,
} from '../helpers/globalListeners.js';

// Import the template to use
const headerTemplate = require('../partials/header.handlebars');

export default () => {
  // Data to be passed to the template
  // Return the compiled template to the router

  update(compile(headerTemplate));
  addGenerallisteners();
};
