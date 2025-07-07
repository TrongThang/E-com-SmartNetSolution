module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  env: {
    browser: true,
    es6: true,
    serviceworker: true
  },
  globals: {
    importScripts: 'readonly',
    firebase: 'readonly',
    self: 'readonly',
    clients: 'readonly'
  },
  overrides: [
    {
      files: ['public/firebase-messaging-sw.js'],
      env: {
        serviceworker: true
      },
      globals: {
        importScripts: 'readonly',
        firebase: 'readonly',
        self: 'readonly',
        clients: 'readonly'
      }
    }
  ]
}; 