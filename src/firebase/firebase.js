const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: 'AIzaSyC_8xiCMXyIpYKyHJYHF6FMmfNewq8H8WM',
  authDomain: 'kot-app-db4cf.firebaseapp.com',
  databaseURL: 'https://kot-app-db4cf.firebaseio.com/',
  projectId: 'kot-app-db4cf',
  storageBucket: 'kot-app-db4cf.appspot.com',
  messagingSenderId: '52666332181',
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};
