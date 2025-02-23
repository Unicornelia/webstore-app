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

  const product = new Product({ title, imageUrl, price, description });
  product.save().then((result) => {
    res.json(result);
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
  const {
    id,
    title,
    imageUrl,
    price,
    description,
  } = req.body;
  const product = new Product(title, imageUrl, price, description, id);
  product.save()
    .then((result) => {
      res.json(result);
      console.info(`Updated product`);
    })
    .catch((err) => console.error(`Error in updating product: ${err}`));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.error(`Error in fetching all products: ${err}`));
};

exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Product.deleteById(id);
    console.log(`Product ${id} has been deleted`);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(`Error deleting product: ${err}`);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
