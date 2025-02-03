const express = require("express");
const path = require("path");

const router = express.Router();

const rootDir = require("../util/path");
const { getAddProduct } = require("../controllers/products");

const products = [];

// /admin/add-product => GET
router.get("/add-product", getAddProduct);

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
