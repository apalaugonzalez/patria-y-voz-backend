// src/api/subscriber/controllers/subscriber.js
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
const crypto = require('crypto');

module.exports = createCoreController('api::subscriber.subscriber', ({ strapi }) => ({
  // The action that starts the subscription process
  async subscribe(ctx) {
    try {
      const { email } = ctx.request.body;
      if (!email) return ctx.badRequest('Email is required.');

      const lowercasedEmail = email.toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(lowercasedEmail)) {
        return ctx.badRequest('Invalid email format.');
      }

      // Check if user exists and is already confirmed
      const existingSubscriber = await strapi.db.query('api::subscriber.subscriber').findOne({
        where: { email: lowercasedEmail },
      });

      if (existingSubscriber && existingSubscriber.isConfirmed) {
        return ctx.conflict('This email is already subscribed and confirmed.');
      }

      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const now = new Date();

      if (existingSubscriber) {
        // User exists but is not confirmed, update their token and resend email
        await strapi.entityService.update('api::subscriber.subscriber', existingSubscriber.id, {
          data: { confirmationToken },
        });
      } else {
        // Create a new, unconfirmed subscriber
        await strapi.entityService.create('api::subscriber.subscriber', {
          data: {
            email: lowercasedEmail,
            isConfirmed: false,
            confirmationToken,
            publishedAt: now,
          },
        });
      }

      // Return the token so the Next.js API can use it in the email
      return ctx.send({ confirmationToken });

    } catch (err) {
      strapi.log.error('Error in subscribe controller:', err);
      return ctx.internalServerError('An error occurred during subscription.');
    }
  },

  // The new action to confirm the subscription
  async confirm(ctx) {
    try {
      const { token } = ctx.request.body;
      if (!token) return ctx.badRequest('Confirmation token is required.');

      const subscriber = await strapi.db.query('api::subscriber.subscriber').findOne({
        where: { confirmationToken: token },
      });

      if (!subscriber) {
        return ctx.notFound('Invalid or expired confirmation token.');
      }

      // Update the subscriber to be confirmed
      await strapi.entityService.update('api::subscriber.subscriber', subscriber.id, {
        data: {
          isConfirmed: true,
          confirmedAt: new Date(),
          confirmationToken: null, // Clear the token after use
        },
      });

      return ctx.send({ message: 'Subscription confirmed successfully!' });
    } catch (err) {
      strapi.log.error('Error in confirm controller:', err);
      return ctx.internalServerError('An error occurred during confirmation.');
    }
  },
}));
