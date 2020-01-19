const { Router } = require('express');

const StripeController = require('./stripe.controllers');

const stripeController = new StripeController();
module.exports = Router().post(
  '/stripe/charge-secret',
  stripeController.createPaymentIntent.bind(stripeController)
);
