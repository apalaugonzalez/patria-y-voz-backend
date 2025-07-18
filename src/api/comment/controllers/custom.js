// src/api/comment/controllers/custom.js
'use strict';

module.exports = {
  // Create comment
  async createComment(ctx) {
    try {
      const { name, email, content, postId } = ctx.request.body;
      
      if (!name || !email || !content || !postId) {
        return ctx.badRequest('Missing required fields');
      }

      // Create comment
      const result = await strapi.entityService.create('api::comment.comment', {
        data: {
          name,
          email,
          content,
          moderationStatus: 'approved',
          upvotes: 0,
          isReply: false,
          locale: 'en',
        },
      });

      console.log('Created comment:', result);

      // Manually create the junction table entry
      try {
        await strapi.db.connection.raw(`
          INSERT INTO comments_blog_post_lnk (comment_id, blog_post_id, comment_ord)
          VALUES (?, ?, 0)
        `, [result.id, parseInt(postId)]);
        console.log('Created junction table entry');
      } catch (junctionError) {
        console.error('Error creating junction table entry:', junctionError);
      }

      return {
        id: result.id,
        name: result.name,
        content: result.content,
        createdAt: result.createdAt,
        moderationStatus: result.moderationStatus,
        upvotes: result.upvotes,
      };
    } catch (err) {
      strapi.log.error('Error in createComment controller:', err);
      return ctx.internalServerError('An error occurred while creating the comment.');
    }
  },

  // Get comments by blog post ID
  async getCommentsByPost(ctx) {
    try {
      const { postId } = ctx.params;
      
      if (!postId) {
        return ctx.badRequest('Post ID is required');
      }

      console.log('Fetching comments for postId:', postId);

      // Use direct SQL query to get comments via junction table
      const comments = await strapi.db.connection.raw(`
        SELECT c.* 
        FROM comments c
        JOIN comments_blog_post_lnk j ON c.id = j.comment_id
        WHERE j.blog_post_id = ? AND c.moderation_status = 'approved'
        ORDER BY c.upvotes DESC, c.created_at DESC
        LIMIT 25
      `, [parseInt(postId)]);

      // Format depends on database type (PostgreSQL uses rows)
      const formattedComments = comments.rows || comments[0];
      console.log(`Found ${formattedComments ? formattedComments.length : 0} comments for post ${postId}`);

      return { data: formattedComments || [] };
    } catch (error) {
      strapi.log.error('Error in getCommentsByPost controller:', error);
      return ctx.internalServerError('An error occurred while fetching comments.');
    }
  },

  // Upvote method
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      if (!id) {
        return ctx.badRequest('Comment ID is required.');
      }

      const comment = await strapi.entityService.findOne('api::comment.comment', id);

      if (!comment) {
        return ctx.notFound('Comment not found.');
      }

      const updatedComment = await strapi.entityService.update('api::comment.comment', id, {
        data: {
          upvotes: (comment.upvotes || 0) + 1,
        },
      });

      return { upvotes: updatedComment.upvotes };
    } catch (err) {
      strapi.log.error('Error in upvote controller:', err);
      return ctx.internalServerError('An error occurred while upvoting.');
    }
  },
};
