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
            // The Native Backblaze URL
            'https://f005.backblazeb2.com',
            // The S3-Compatible URL (The Final Fix)
            'https://patria-y-voz.s3.us-east-005.backblazeb2.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            // The Native Backblaze URL
            'https://f005.backblazeb2.com',
            // The S3-Compatible URL (The Final Fix)
            'https://patria-y-voz.s3.us-east-005.backblazeb2.com',
          ],
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
