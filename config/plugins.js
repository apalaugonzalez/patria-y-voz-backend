// path: ./config/plugins.js

module.exports = ({ env }) => ({
  // Keep your existing users-permissions config
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  // Replace the local upload config with the Backblaze B2 config
  upload: {
    config: {
      provider: 'strapi-provider-upload-b2',
      providerOptions: {
        endpoint: env('B2_ENDPOINT'),
        bucket: env('B2_BUCKET'),
        url: env('B2_URL'),
        applicationKeyId: env('B2_APPLICATION_KEY_ID'),
        applicationKey: env('B2_APPLICATION_KEY'),
      },
    },
  },
});