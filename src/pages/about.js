// Only import the compile function from handlebars instead of the entire library
/* eslint-disable */
import {
  compile,
} from 'handlebars';
import update from '../helpers/update';
import {
  addGenerallisteners,
} from '../helpers/globalListeners.js';

// Import the template to use
const aboutTemplate = require('../templates/about.handlebars');

export default () => {
  localStorage.removeItem("dorm")
  // Data to be passed to the template
  const name = 'Test inc.';
  // Return the compiled template to the router

  update(compile(aboutTemplate)({
    name,
  }));
  addGenerallisteners();
};
