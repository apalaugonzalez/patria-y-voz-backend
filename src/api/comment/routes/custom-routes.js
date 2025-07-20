'use strict';

/**
 * Custom comment routes.
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/comments/create',
      handler: 'custom.createComment',
      config: {
        auth: false, // Allow public access to create comments
      },
    },
    {
      method: 'GET',
      path: '/comments/post/:postId',
      handler: 'custom.getCommentsByPost',
      config: {
        auth: false, // Allow public access to view comments
      },
    },
    {
      method: 'PUT',
      path: '/comments/:id/upvote',
      handler: 'custom.upvote',
      config: {
        auth: false, // Allow public access to upvote
      },
    },
    {
      method: 'PUT',
      path: '/comments/:id/downvote', // New route for downvoting
      handler: 'custom.downvote',
      config: {
        auth: false, // Allow public access to downvote
      },
    },
  ],
};
