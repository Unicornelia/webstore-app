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
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);
  product.save().then(() => {
    console.log(product, '**** product successfully added!**');
    res.redirect('/admin/products');
  }).catch((err) => {
    console.error(`Error in postAddProduct: ${err}`);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.editing;
  if (!editMode) {
    return res.redirect('/');
  }
  const { id } = req.params;
    Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.json(product);
    })
    .catch((err) => console.error(`Error in getEditProduct: ${err}`));
};

exports.postEditProduct = (req, res, next) => {
  // fetch info for the product
  const productId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedImgUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;

  Product.findByPk(productId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImgUrl;
      product.description = updatedDescription;
      product.price = updatedPrice;
      return product.save();
    })
    .then((result) => {
      console.info(`Updated product: ${result}`);
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(`Error in postEditProduct: ${err}`));
};

exports.getProducts = (req, res, next) => {
 Product.fetchAll()
    .then((products) => {
    res.json(products);
    })
    .catch((err) => console.error(`Error in getProducts: ${err}`));
};

// exports.postDeleteProduct = (req, res, next) => {
//   const productId = req.body.id;
//   Product.destroy({ where: { id: productId } })
//     .then((r) => {
//       console.log(`${r} has been deleted`);
//       res.redirect('/admin/products');
//     })
//     .catch((err) => console.error(`Error in postDeleteProduct: ${err}`));
// };
