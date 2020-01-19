const stripeRoutes = require('./api/stripe/stripe.route');

module.exports = function routes(app) {
  app.use('/', [stripeRoutes]);
};
