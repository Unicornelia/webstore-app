import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { CartItem } from '../../types';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

type Product = {
  _id: { toString: () => any };
};

userSchema.methods.addToCart = function (product: Product) {
  const cartProductIndex = this.cart.items.findIndex((item: CartItem) => {
    return item.product.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const isItemAlreadyInCart = cartProductIndex >= 0;
  const updatedCartItems = [...this.cart.items];

  if (isItemAlreadyInCart) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ product: product._id, quantity: newQuantity });
  }

  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.removeFromCart = function (productId: string) {
  this.cart.items = this.cart.items.filter(
    (item: CartItem) => item.product.toString() !== productId.toString()
  );
  return this.save();
};

userSchema.methods.clearCart = function (productId: string) {
  this.cart = { items: [] };
  return this.save();
};

export default mongoose.model('User', userSchema);
