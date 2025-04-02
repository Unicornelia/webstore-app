import Product from '../models/product';
import Order from '../models/order';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecret);

const getIndex = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ products, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getIndex: ${e}`);
    res.status(500).json({ error: 'Failed to fetch products on index' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ products, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getProducts: ${e}`);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    res
      .status(200)
      .json({ product, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getProductDetail: ${e}`);
  }
};

const getCart = async (req, res) => {
  try {
    const { cart } = await req.user.populate('cart.items.product');
    const cartItems = cart.items;
    res
      .status(200)
      .json({ cartItems, isAuthenticated: req.session.isAuthenticated });
  } catch (err) {
    console.error(`Error in getCart: ${err}`);
  }
};

const postCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    const result = await req.user.addToCart(product);
    console.log(`Result in postCart: ${result}`);
    res
      .status(201)
      .json({ result, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in postCart: ${e}`);
  }
};

const postCartDeleteItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const result = await req.user.removeFromCart(productId);
    res
      .status(201)
      .json({ result, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in postCartDeleteItem: ${e}`);
  }
};

const getCheckout = async (req, res) => {
  try {
    const { cart } = await req.user.populate('cart.items.product');
    const checkoutItems = cart.items;
    let total = checkoutItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: checkoutItems.map((item) => ({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(item.product.price * 100),
          product_data: {
            name: item.product.title,
            description: item.product.description,
          },
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
    });
    res.status(200).json({
      checkoutItems,
      isAuthenticated: req.session.isAuthenticated,
      totalSum: total,
      stripeSessionID: stripeSession.id,
    });
  } catch (err) {
    console.error(`Error in getCheckout: ${err}`);
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    console.error(`Error in createPaymentIntent: ${e}`);
    res.status(500).send({ error: e.message });
  }
};

const getCheckoutSuccess = async (req, res) => {
  try {
    const { cart } = await req.user.populate('cart.items.product');
    const products = cart.items.map((item) => {
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
    res
      .status(201)
      .json({ order, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getCheckoutSuccess: ${e}`);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    res
      .status(200)
      .json({ orders, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getOrders: ${e}`);
  }
};

export {
  createPaymentIntent,
  getIndex,
  getProducts,
  getProductDetail,
  getCart,
  postCart,
  postCartDeleteItem,
  getCheckout,
  getCheckoutSuccess,
  getOrders,
};
