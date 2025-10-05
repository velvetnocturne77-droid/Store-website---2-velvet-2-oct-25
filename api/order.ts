// api/order.ts
// This serverless function creates a Razorpay order.
// It should be deployed to a path like `/api/order`.
// Required backend dependencies: `razorpay`.
// Required environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET_KEY`.

import Razorpay from 'razorpay';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'A valid positive amount is required.' });
    }

    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET_KEY) {
      console.error("Razorpay environment variables are not set.");
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);
    
    return res.status(200).json(order);

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: 'Failed to create order.', details: errorMessage });
  }
}
