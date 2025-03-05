const express = require('express');
const {
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct, getAddProduct,
} = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', isAuth, getProducts);
router.get('/add-product', isAuth, getAddProduct);
router.post('/add-product', isAuth, postAddProduct);
router.get('/edit-product/:id', isAuth, getEditProduct);
router.post('/edit-product', isAuth, postEditProduct);
router.delete('/delete-product/:id', isAuth, deleteProduct);

module.exports = router;
