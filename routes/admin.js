const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('../util/path');
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
} = require('../controllers/admin');

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:id', getEditProduct);

router.post('/edit-product', postEditProduct);

module.exports = router;
