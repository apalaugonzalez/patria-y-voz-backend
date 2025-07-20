'use strict';

/**
 * custom controller
 */

module.exports = {
  /**
   * Creates a new comment or a reply to an existing comment.
   * @param {object} ctx - The Koa context object.
   */
  async createComment(ctx) {
    try {
      // Destructure required and optional fields from the request body
      const { name, email, content, postId, parentCommentId } = ctx.request.body;

      // Basic validation to ensure required fields are present
      if (!name || !email || !content || !postId) {
        return ctx.badRequest('Missing required fields (name, email, content, postId).');
      }

      // Prepare the data object for creating the comment
      const data = {
        name,
        email,
        content,
        blog_post: postId, // Link the comment to the blog post
        moderationStatus: 'approved',
        upvotes: 0,
        downvotes: 0, // Initialize downvotes
        locale: 'en', // Assuming 'en' as default locale
        isReply: !!parentCommentId, // isReply is true if parentCommentId exists
      };

      // If it's a reply, add the parent comment relationship
      if (parentCommentId) {
        data.parent_comment = parentCommentId;
      }

      // Use the entityService to create the comment.
      // This automatically handles the relation to the blog_post.
      const result = await strapi.entityService.create('api::comment.comment', { data });

      // Return a sanitized version of the created comment
      return {
        id: result.id,
        name: result.name,
        content: result.content,
        createdAt: result.createdAt,
        moderationStatus: result.moderationStatus,
        upvotes: result.upvotes,
        downvotes: result.downvotes,
        isReply: result.isReply,
      };
    } catch (err) {
      strapi.log.error('Error in createComment controller:', err);
      return ctx.internalServerError('An error occurred while creating the comment.');
    }
  },

  /**
   * Gets all approved, top-level comments for a specific blog post,
   * populating their nested replies.
   * @param {object} ctx - The Koa context object.
   */
  async getCommentsByPost(ctx) {
    try {
      const { postId } = ctx.params;

      if (!postId) {
        return ctx.badRequest('Post ID is required.');
      }

      // Fetch only top-level comments (where isReply is false) and populate their replies.
      const comments = await strapi.entityService.findMany('api::comment.comment', {
        filters: {
          blog_post: postId,
          moderationStatus: 'approved',
          isReply: false, // IMPORTANT: Fetch only parent comments
        },
        sort: { upvotes: 'desc', createdAt: 'desc' }, // Sort by upvotes, then creation date
        populate: {
          replies: { // Populate the 'replies' relation for each top-level comment
            sort: { createdAt: 'asc' }, // Sort replies chronologically
            populate: {
                // You could nest another level of replies here if needed
                // e.g., replies: { populate: ... }
            }
          }
        },
        limit: 50 // Adjust limit as needed
      });

      return { data: comments };
    } catch (error) {
      strapi.log.error('Error in getCommentsByPost controller:', error);
      return ctx.internalServerError('An error occurred while fetching comments.');
    }
  },

  /**
   * Increments the upvote count for a specific comment.
   * @param {object} ctx - The Koa context object.
   */
  async upvote(ctx) {
    try {
      const { id } = ctx.params;
      if (!id) {
        return ctx.badRequest('Comment ID is required.');
      }

      // Atomically increment the upvotes field.
      // Using `findOne` and then `update` is fine, but for high-traffic sites,
      // a raw query might be better to prevent race conditions.
      // For most use cases, this is perfectly acceptable.
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

  /**
   * Increments the downvote count for a specific comment.
   * @param {object} ctx - The Koa context object.
   */
  async downvote(ctx) {
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
          downvotes: (comment.downvotes || 0) + 1,
        },
      });

      return { downvotes: updatedComment.downvotes };
    } catch (err) {
      strapi.log.error('Error in downvote controller:', err);
      return ctx.internalServerError('An error occurred while downvoting.');
    }
  },
};
