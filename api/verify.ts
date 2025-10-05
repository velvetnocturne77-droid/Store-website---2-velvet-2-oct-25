// api/verify.ts
// This serverless function verifies a Razorpay payment signature.
// It should be deployed to a path like `/api/verify`.
// Required backend dependencies: none (uses built-in crypto).
// Required environment variables: `RAZORPAY_SECRET_KEY`.

import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment details for verification.' });
    }

    const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;
    
    if (!RAZORPAY_SECRET_KEY) {
      console.error("Razorpay secret key is not set.");
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // The payment is authentic. You can now save the payment details to your database.
      return res.status(200).json({ success: true, message: "Payment verified successfully." });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature." });
    }

  } catch (error) {
    console.error('Razorpay verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: 'Payment verification failed.', details: errorMessage });
  }
}
