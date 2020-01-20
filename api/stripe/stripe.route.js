const { Router } = require('express');

const StripeController = require('./stripe.controller');

const stripeController = new StripeController();
module.exports = Router().post(
  '/checkout-onetime',
  stripeController.checkoutOnetime.bind(stripeController)
);
