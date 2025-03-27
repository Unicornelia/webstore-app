const express = require('express');

const router = express.Router();

const {
  createPaymentIntent,
  getIndex,
  getProducts,
  getProductDetail,
  getCart,
  postCart,
  postCartDeleteItem,
  getOrders,
  getCheckoutSuccess,
  getCheckout,
} = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:productId', getProductDetail);
router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postCart);
router.post('/cart-delete-item', isAuth, postCartDeleteItem);
router.get('/checkout', isAuth, getCheckout);
router.get('/checkout/success', isAuth, getCheckoutSuccess);
router.get('/checkout/cancel', isAuth, getCheckout);
router.get('/orders', isAuth, getOrders);
router.post('/create-payment-intent', isAuth, createPaymentIntent);
// router.get('/orders/:id', isAuth, getInvoice);

module.exports = router;
