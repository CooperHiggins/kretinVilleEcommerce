const express = require('express');
const stripeRoutes = require('./api/stripe/stripe.route');
const config = require('./config/config');

module.exports = function routes(app) {
  app.use('/stripe', [stripeRoutes]);
};
