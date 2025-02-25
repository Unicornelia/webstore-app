const Product = require('../models/product');
const Order = require('../models/order');

getIndex = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) {
    console.error(`Error in getIndex: ${e}`);
    res.status(500).json({ error: 'Failed to fetch products on index' });
  }
};

getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) {
    console.error(`Error in getProducts: ${e}`);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

getProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    res.json(product);
  } catch (e) {
    console.error(`Error in getProductDetail: ${e}`);
  }
};

getCart = async (req, res) => {
  try {
    const { cart } = await req.user.populate('cart.items.product');
    console.log(cart.items);
    res.json(cart.items);
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
    res.json(result);
  } catch (e) {
    console.error(`Error in postCart: ${e}`);
  }
};

postCartDeleteItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const result = await req.user.removeFromCart(productId);
    res.json(result);
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
        userId: req.user,
        name: req.user.name,
      },
      products,
    });
    await order.save();
    await req.user.clearCart();
    res.json(order);
  } catch (err) {
    console.error(`Error in postOrder: ${err}`);
  }
};

getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.json(orders);
  } catch (e) {
    console.error(`Error in getOrders: ${e}`);
  }
};

module.exports = { getIndex, getProducts, getProductDetail, getCart, postCart, postCartDeleteItem, postOrder, getOrders };