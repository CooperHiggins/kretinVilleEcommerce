const dotenv = require('dotenv');
const stripe = require('stripe');

dotenv.config();
module.exports = class StripeController {
  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.stripe = stripe(process.env.STRIPE_LIVE_SK_KEY);
    } else {
      this.stripe = stripe(process.env.STRIPE_TEST_SK_KEY);
    }
  }

  async checkoutOnetime(req, res, next) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: 'cus_123',
        payment_method_types: ['card'],
        line_items: [
          {
            name: 'T-shirt',
            description: 'Comfortable cotton t-shirt',
            images: ['https://example.com/t-shirt.png'],
            amount: 500,
            currency: 'usd',
            quantity: 1
          }
        ],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel'
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
