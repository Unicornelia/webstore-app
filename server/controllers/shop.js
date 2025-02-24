const Product = require('../models/product');

getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.error(`Error in getIndex: ${err}`);
      res.status(500).json({ error: 'Failed to fetch products on index' });
    });
};

getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.error(`Error in getProducts: ${err}`);
      res.status(500).json({ error: 'Failed to fetch products' });
    });
};

getProductDetail = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.error(`Error in getProductDetail: ${err}`));
};

getCart = async (req, res) => {
  try {
    const { cart } = await req.user.populate('cart.items.product');
    res.json(cart.items);
  } catch (err) {
    console.error(`Error in getCart: ${err}`);
  }
};

postCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    }).then(result => {
    console.log(`Result in postCart: ${result}`);
    res.json(result);
  });
};

postCartDeleteItem = (req, res) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then(result => {
      res.json(result);
    })
    .catch((err) => console.error(`Error in postCartDeleteItem: ${err}`));
};

postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then((result) => res.redirect('/orders'))
    .catch((err) => console.error(`Error in postOrder: ${err}`));
};

getOrders = (req, res) => {
  req.user
    .getOrder()
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      console.error(`Error in getOrders: ${err}`);
    });
};

module.exports = { getIndex, getProducts, getProductDetail, getCart, postCart, postCartDeleteItem, postOrder, getOrders };