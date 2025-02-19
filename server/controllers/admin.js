const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imageUrl, description, price);
  product.save().then((result) => {
    res.status(201).json({ message: "Product added!" }).redirect('/admin/products');
  }).catch((err) => {
    console.log(err);
  });

  // req.user
  //   .createProduct({ title, imageUrl, description, price })
  //   .then((r) => {
  //     console.log(`Created product: ${r}`);
  //     res.redirect('/admin/products');
  //   })
  //   .catch((err) => {
  //     console.error(`Error in postAddProduct: ${err}`);
  //   });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.editing;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params.id;
//   req.user
//     .getProducts({ where: { id: prodId } })
//     // Product.findByPk(prodId)
//     .then((products) => {
//       const product = products[0];
//       if (!product) {
//         return res.redirect('/');
//       }
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product,
//       });
//     })
//     .catch((err) => console.error(`Error in getEditProduct: ${err}`));
// };
//
// exports.postEditProduct = (req, res, next) => {
//   // fetch info for the product
//   const productId = req.body.id;
//   const updatedTitle = req.body.title;
//   const updatedImgUrl = req.body.imageUrl;
//   const updatedDescription = req.body.description;
//   const updatedPrice = req.body.price;
//
//   Product.findByPk(productId)
//     .then((product) => {
//       product.title = updatedTitle;
//       product.imageUrl = updatedImgUrl;
//       product.description = updatedDescription;
//       product.price = updatedPrice;
//       return product.save();
//     })
//     .then((result) => {
//       console.info(`Updated product: ${result}`);
//       res.redirect('/admin/products');
//     })
//     .catch((err) => console.error(`Error in postEditProduct: ${err}`));
// };
//
// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts()
//     .then((products) => {
//       res.render('admin/products', {
//         products,
//         pageTitle: 'Admin Products',
//         path: '/admin/products',
//       });
//     })
//     .catch((err) => console.error(`Error in getProducts: ${err}`));
// };
//
// exports.postDeleteProduct = (req, res, next) => {
//   const productId = req.body.id;
//   Product.destroy({ where: { id: productId } })
//     .then((r) => {
//       console.log(`${r} has been deleted`);
//       res.redirect('/admin/products');
//     })
//     .catch((err) => console.error(`Error in postDeleteProduct: ${err}`));
// };
