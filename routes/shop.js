const express = require('express');

const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProductDetail,
  postCart,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:productId', getProductDetail);
router.get('/cart', getCart);
router.post('/cart', postCart);
router.get('/orders', getOrders);
router.get('/checkout', getCheckout);

module.exports = router;
