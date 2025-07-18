// src/api/blog-post/content-types/blog-post/lifecycles.js
'use strict';

const readingTime = require('reading-time');

/**
 * A set of lifecycle hooks for the blog-post content type.
 */
module.exports = {
  /**
   * Runs before a new entry is created.
   * @param {object} event The event object.
   */
  beforeCreate(event) {
    const { data } = event.params;

    // Check if the content field is present
    if (data.content) {
      // The 'reading-time' library expects a single string.
      // We convert the Strapi blocks to plain text.
      const textContent = data.content.map(block => 
        block.children.map(child => child.text).join(' ')
      ).join(' ');
      
      // Calculate the reading time and round up to the nearest minute.
      data.readTime = Math.ceil(readingTime(textContent).minutes);
    }
  },

  /**
   * Runs before an existing entry is updated.
   * @param {object} event The event object.
   */
  async beforeUpdate(event) {
    const { data } = event.params;

    // Database cleanup for comment relations (safety net)
    try {
      await strapi.db.connection.raw(`
        DELETE FROM comments_blog_post_lnk 
        WHERE comment_ord IS NULL OR comment_ord = ''
      `).catch(() => {
        // Table doesn't exist anymore, which is perfect
      });
    } catch (error) {
      // Safe to ignore - junction table is gone
      console.log('Lifecycle cleanup (safe to ignore):', error.message);
    }

    // Check if the content field is being updated
    if (data.content) {
      const textContent = data.content.map(block => 
        block.children.map(child => child.text).join(' ')
      ).join(' ');
      
      data.readTime = Math.ceil(readingTime(textContent).minutes);
    }
  },
};
