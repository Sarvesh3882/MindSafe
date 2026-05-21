import crypto from 'crypto';

/**
 * Verifies Razorpay payment signature using HMAC SHA256
 * 
 * @param orderId - Razorpay order ID
 * @param paymentId - Razorpay payment ID
 * @param signature - Signature received from Razorpay
 * @returns true if signature is valid, false otherwise
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not configured');
      return false;
    }

    // Create the body string as per Razorpay documentation
    const body = `${orderId}|${paymentId}`;

    // Compute expected signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Payment signature verification error:', error);
    return false;
  }
}
