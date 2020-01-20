const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config();

module.exports = class StripeController {
  constructor() {
    let key;
    if (process.env.NODE_ENV === 'production') {
      key = process.env.STRIPE_SK_LIVE_KEY;
    } else {
      key = process.env.STRIPE_SK_TEST_KEY;
    }
    this.stripe = Stripe(key);
  }

  async checkoutOnetime(req, res, next) {
    const { line_items } = req.body;

    if (!(line_items && Array.isArray(line_items) && line_items.length > 0)) {
      return res.status(400).json({ message: 'Line items is required' });
    }
    const fullUrl = `${req.protocol}://${req.get('host')}`;
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        //success_url: fullUrl + 'ht/success',
        success_url: 'https://facebook.com',
        //cancel_url: fullUrl + '/cancel'
        cancel_url: 'https://facebook.com'
      });
      res.json({ session });
    } catch (err) {
      next(err);
    }
  }

  async createCustomer(data) {
    return stripe.customers.create({
      ...data
    });
  }

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
      res.json({ client_secret: paymentIntent.client_secret });
    } catch (err) {
      next(err);
    }
  }
};
