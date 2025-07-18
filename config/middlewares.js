// path: ./config/middlewares.js

module.exports = ({ env }) => ([
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://f005.backblazeb2.com',
            'https://patria-y-voz.s3.us-east-005.backblazeb2.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://f005.backblazeb2.com',
            'https://patria-y-voz.s3.us-east-005.backblazeb2.com',
          ],
          // THIS IS THE FIX: Add the 'frame-src' directive here
          'frame-src': ["'self'", 'youtube.com', 'www.youtube.com', 'youtu.be'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:1337',
        'http://localhost:3000',
        'https://admin.patriayvoz.com',
        'https://www.patriayvoz.com',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]);
