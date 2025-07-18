// src/api/subscriber/routes/custom-subscriber.js
'use strict';
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/subscribers/subscribe',
      handler: 'subscriber.subscribe',
      config: { auth: false },
    },
    {
      method: 'POST', // Use POST for security, even though it's a confirmation
      path: '/subscribers/confirm',
      handler: 'subscriber.confirm',
      config: { auth: false },
    },
  ],
};
