// path: ./config/plugins.js

module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        // This nested 'credentials' object is the crucial fix
        credentials: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_ACCESS_SECRET"),
        },
        region: env("AWS_REGION"),
        endpoint: env("AWS_ENDPOINT"),
        params: {
          Bucket: env("AWS_BUCKET"),
        },
      },
    },
  },
});
