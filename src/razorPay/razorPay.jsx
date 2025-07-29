const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
admin.initializeApp();

const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

exports.createOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be signed in');
  const amount = data.amount; // in paise
  const receipt = `rcpt_${context.auth.uid}_${Date.now()}`;
  const order = await razorpay.orders.create({ amount, currency: 'INR', receipt });
  await admin.firestore().collection('orders').add({
    uid: context.auth.uid,
    orderId: order.id,
    amount,
    receipt,
    status: 'CREATED',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { order_id: order.id, amount: order.amount, currency: order.currency };
});

exports.verifyPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be signed in');
  const { order_id, payment_id, signature, cartItems, addressInfo } = data;
  const body = `${order_id}|${payment_id}`;
  const expected = crypto.createHmac('sha256', functions.config().razorpay.key_secret).update(body).digest('hex');
  if (expected !== signature) throw new functions.https.HttpsError('permission-denied', 'Signature mismatch');
  await admin.firestore().collection('orders').add({
    uid: context.auth.uid,
    order_id,
    payment_id,
    signature,
    cartItems,
    addressInfo,
    status: 'SUCCESS',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { success: true };
});
