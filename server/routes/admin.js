const express = require('express');
const {
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
  getAddProduct,
} = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

const router = express.Router();

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

module.exports = router;
