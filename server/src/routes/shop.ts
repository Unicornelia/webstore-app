import { Router } from 'express';

import {
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
} from '../controllers/shop';
import { isAuth } from '../middleware/is-auth';

const router = Router();

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

export default router;
