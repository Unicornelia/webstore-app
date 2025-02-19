const express = require('express');

const router = express.Router();

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require('../controllers/admin');

router.get('/products', getProducts);
router.get('/add-product', getAddProduct);
router.post('/add-product', postAddProduct);
router.get('/edit-product/:id', getEditProduct);
router.post('/edit-product', postEditProduct);
// router.post('/delete-product', postDeleteProduct);

module.exports = router;
