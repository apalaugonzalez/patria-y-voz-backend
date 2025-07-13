// path: ./config/middlewares.js

module.exports = [
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
            // The S3-Compatible URL
            'https://patria-y-voz.s3.us-east-005.backblazeb2.com',
            // The Native Backblaze URL (the fix)
            'https://f005.backblazeb2.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            // The S3-Compatible URL
            'https://patria-y-voz.s3.us-east-005.backblazeb2.com',
            // The Native Backblaze URL (the fix)
            'https://f005.backblazeb2.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
