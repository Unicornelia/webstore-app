const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

getIndex = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getIndex: ${e}`);
    res.status(500).json({ error: 'Failed to fetch products on index' });
  }
};

getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getProducts: ${e}`);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

getProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    res.status(200).json({ product, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getProductDetail: ${e}`);
  }
};

getCart = async (req, res) => {
  try {
    const { cart } = await req.user.populate('cart.items.product');
    const cartItems = cart.items;
    res.status(200).json({ cartItems, isAuthenticated: req.session.isAuthenticated });
  } catch (err) {
    console.error(`Error in getCart: ${err}`);
  }
};

postCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    const result = await req.user.addToCart(product);
    console.log(`Result in postCart: ${result}`);
    res.status(201).json({ result, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in postCart: ${e}`);
  }
};

postCartDeleteItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const result = await req.user.removeFromCart(productId);
    res.status(201).json({ result, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in postCartDeleteItem: ${e}`);
  }
};

postOrder = async (req, res) => {
  try {
    const { cart } = await req.user.populate('cart.items.product');
    const products = cart.items.map(item => {
      return {
        quantity: item.quantity,
        product: { ...item.product._doc },
      };
    });
    const order = new Order({
      user: {
        userId: req.user._id,
        name: req.user.name,
      },
      products,
    });
    await order.save();
    await req.user.clearCart();
    res.status(201).json({ order, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in postOrder: ${e}`);
  }
};

getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.status(200).json({ orders, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getOrders: ${e}`);
  }
};

module.exports = { getIndex, getProducts, getProductDetail, getCart, postCart, postCartDeleteItem, postOrder, getOrders };