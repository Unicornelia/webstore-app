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

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:id', getEditProduct);

// /admin/edit-product/:id&editing=true => POST
router.post('/edit-product', postEditProduct);

// /admin/delete-product POST
// router.post('/delete-product', postDeleteProduct);

module.exports = router;
