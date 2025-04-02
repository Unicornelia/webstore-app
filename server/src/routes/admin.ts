import { Router } from 'express';
import { body } from 'express-validator';

import {
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
  getAddProduct,
} from '../controllers/admin';
import { isAuth } from '../middleware/is-auth';

const router = Router();

router.get('/products', isAuth, getProducts);
router.get('/add-product', isAuth, getAddProduct);
router.post(
  '/add-product',
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 4, max: 400 }).trim(),
  ],
  isAuth,
  postAddProduct
);
router.get('/edit-product/:id', isAuth, getEditProduct);
router.post(
  '/edit-product',
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('price').isFloat(),
    body('description').isLength({ min: 4, max: 400 }).trim(),
  ],
  isAuth,
  postEditProduct
);
router.delete('/delete-product/:id', isAuth, deleteProduct);

export default router;
