const stripe = require('stripe');

module.exports = class StripeController {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.stripe = stripe(process.env.STRIPE_LIVE_SK_KEY);
    } else {
      this.stripe = stripe(process.env.STRIPE_TEST_SK_KEY);
    }
  }

  async charge(req, res, next) {}

  async createPaymentIntent(req, res, next) {
    const { amount, currency = 'usd' } = req.body;
    if (!amount || amount <= 0 || isNaN(+amount)) {
      return res.status(400).json({ error: 'invalid amount' });
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency
      });
      console.log('paymentIntent', paymentIntent);
      res.json({ client_secret: paymentIntent.client_secret });
    } catch (err) {
      console.log('err', err);
      next(err);
    }
  }
};
