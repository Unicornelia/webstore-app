const Product = require('../models/product');

getAddProduct = (req, res) => {
  try {
    res.status(200).json({ isAuthenticated: req.session.isAuthenticated, editing: false });
  } catch (e) {
    console.error(`Error in getAddProduct: ${e}`);
  }
};

getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in fetching all products: ${e}`);
  }
};

postAddProduct = async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
      userId: req.user._id,
    });
    const result = await product.save();
    res.status(201).json({ result, isAuthenticated: req.session.isAuthenticated });
    console.info(`Added new product: ${result}`);
  } catch (e) {
    console.error(`Error in postAddProduct: ${e.message}`);
  }
};

getEditProduct = async (req, res) => {
  try {
    const editMode = req.query.editing;
    if (!editMode) {
      return res.redirect('/');
    }
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.redirect('/');
    }
    res.status(200).json({ product, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getEditProduct: ${e}`);
  }
};

postEditProduct = async (req, res) => {
  try {
    const {
      id,
      title,
      imageUrl,
      price,
      description,
    } = req.body;

    const product = await Product.findById(id);

    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;

    const result = await product.save();
    res.status(201).json({ result, isAuthenticated: req.session.isAuthenticated });
    console.info(`Updated product: ${result}`);
  } catch (e) {
    console.error(`Error in updating product: ${e}`);
  }
};

deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    console.log(`Product ${id} has been deleted`);
    res.status(201).json({ message: 'Product deleted successfully' });
  } catch (e) {
    console.error(`Error deleting product: ${e}`);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = { getAddProduct, getProducts, postAddProduct, getEditProduct, postEditProduct, deleteProduct };