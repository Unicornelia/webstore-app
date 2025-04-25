import { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cart.css';
import { Item, ID, Token } from '../types';

const Cart = ({ csrfToken }: Token) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/cart', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setCartItems(data.cartItems))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (productId: ID) => {
    try {
      const response = await fetch('http://localhost:3001/cart-delete-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product: ${productId}`);
      }
      // Fetch updated cart items
      const updatedCartItems = await fetch('http://localhost:3001/cart', {
        credentials: 'include',
      });
      const updatedCart = await updatedCartItems.json();
      setCartItems(updatedCart.cartItems);
    } catch (err) {
      console.error(`Error deleting from cart: ${err}`);
    }
  };

  const handleOrder = async () => {
    navigate('/checkout');
  };

  return (
    <main className="centered">
      {cartItems?.length > 0 ? (
        <>
          <h1>Your Shopping Cart</h1>
          <ul className="cart__item-list">
            {cartItems.map((item: Item) => (
              <li key={item.product._id} className="cart__item">
                <h1>{item.product.title}</h1>
                <img
                  style={{ width: '15%' }}
                  src={item.product.imageUrl}
                  alt={item.product.title}
                />
                <p>Quantity: {item.quantity}</p>
                <h4>{item.product.price * item.quantity} €</h4>
                <button
                  className="btn danger"
                  onClick={() => handleDelete(item.product._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <hr style={{ width: '100%' }} />
          <button className="btn" onClick={handleOrder}>
            Order
          </button>
        </>
      ) : (
        <h1>Your Cart is Empty</h1>
      )}
    </main>
  );
};

export default Cart;
