'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/comments/create',
      handler: 'custom.createComment',  // Changed from api::comment.comment.createComment
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/comments/post/:postId',
      handler: 'custom.getCommentsByPost',  // Changed from api::comment.comment.getCommentsByPost
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/comments/:id/upvote',
      handler: 'custom.upvote',  // Changed from api::comment.comment.upvote
      config: { auth: false },
    },
  ],
};
